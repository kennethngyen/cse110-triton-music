import "../styles/Timer.css";
import React, { useState, useEffect } from "react";
import "../App.css";
import { SpotifyPlayer } from "./spotifyplayer";
import { makeAuthRequest } from "../misc/auth";

import { API_BASE_URL } from "../constants/constants";

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

interface TimerState {
  targetTime: number | null; // Timestamp when timer should complete
  isActive: boolean;
  tasks: string[];
  currentMode: string;
  settings: TimerSettings;
  selectedSong: string;
}

export function Timer() {
  const getDefaultState = (): TimerState => ({
    targetTime: null,
    isActive: false,
    tasks: [],
    currentMode: "Pomodoro",
    settings: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    },
    selectedSong: "",
  });

  const loadInitialState = (): TimerState => {
    const savedState = localStorage.getItem("timerState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          targetTime: parsed.targetTime,
          isActive: parsed.targetTime ? true : false,
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          currentMode: parsed.currentMode || "Pomodoro",
          settings: parsed.settings || {
            pomodoro: 25,
            shortBreak: 5,
            longBreak: 15,
          },
          selectedSong: parsed.selectedSong || "",
        };
      } catch (e) {
        console.error("Error parsing saved state:", e);
        return getDefaultState();
      }
    }
    return getDefaultState();
  };

  const initialState = loadInitialState();

  const [targetTime, setTargetTime] = useState<number | null>(
    initialState.targetTime
  );
  const [isActive, setIsActive] = useState(initialState.isActive);
  const [tasks, setTasks] = useState<string[]>(initialState.tasks);
  const [newTask, setNewTask] = useState("");
  const [currentMode, setCurrentMode] = useState(initialState.currentMode);
  const [showSettings, setShowSettings] = useState(false);
  const [showSongSelect, setShowSongSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState(initialState.selectedSong);
  const [settings, setSettings] = useState<TimerSettings>(
    initialState.settings
  );

  const [song, setSong] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState("");

  const [displayMinutes, setDisplayMinutes] = useState(() => {
    if (initialState.targetTime) {
      const remaining = initialState.targetTime - Date.now();
      return Math.max(0, Math.floor(remaining / (1000 * 60)));
    }
    return initialState.settings.pomodoro;
  });
  const [displaySeconds, setDisplaySeconds] = useState(() => {
    if (initialState.targetTime) {
      const remaining = initialState.targetTime - Date.now();
      return Math.max(0, Math.floor((remaining % (1000 * 60)) / 1000));
    }
    return 0;
  });

  const songs = [
    { id: 1, name: "Song A" },
    { id: 2, name: "Song B" },
    { id: 3, name: "Song C" },
  ];

  useEffect(() => {
    try {
      const stateToSave: TimerState = {
        targetTime,
        isActive,
        tasks,
        currentMode,
        settings,
        selectedSong,
      };
      localStorage.setItem("timerState", JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving state:", e);
    }

    const getSpotifyAccessToken = async()  => {
			const jsonData = await makeAuthRequest(`${API_BASE_URL}/spotifytoken`);
            if (jsonData) {
				console.log(jsonData);
                setAccessToken(jsonData.access_token);
            }
		};
		getSpotifyAccessToken();

  }, [targetTime, isActive, tasks, currentMode, settings, selectedSong]);


  async function searchForSong() {
		//Get request to get artist ID
		var searchParameters = {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + accessToken,
			},
		};

		var songTrack = await fetch(
			"https://api.spotify.com/v1/search?q=" +
				searchQuery +
				"&type=track&limit=10",
			searchParameters
		)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				console.log(data.tracks.items);
				setSong(data.tracks.items);
				//return data.tracks.items[0].name;
			});
	  }



  const getContainerClassName = () => {
    let baseClass = "timer-container";
    if (currentMode === "Short Break") return `${baseClass} short-break`;
    if (currentMode === "Long Break") return `${baseClass} long-break`;
    return baseClass;
  };

  const selectMode = (mode: string) => {
    setIsActive(false);
    setTargetTime(null);
    setCurrentMode(mode);

    let minutes;
    switch (mode) {
      case "Short Break":
        minutes = settings.shortBreak;
        break;
      case "Long Break":
        minutes = settings.longBreak;
        break;
      default:
        minutes = settings.pomodoro;
    }
    setDisplayMinutes(minutes);
    setDisplaySeconds(0);
  };

  const toggle = () => {
    if (!isActive) {
      const currentTimeInMs = Date.now();
      const durationInMs = (displayMinutes * 60 + displaySeconds) * 1000;
      setTargetTime(currentTimeInMs + durationInMs);
    } else {
      if (targetTime) {
        const remainingTime = targetTime - Date.now();
        const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
        const remainingSeconds = Math.floor(
          (remainingTime % (1000 * 60)) / 1000
        );
        setDisplayMinutes(Math.max(0, remainingMinutes));
        setDisplaySeconds(Math.max(0, remainingSeconds));
        setTargetTime(null);
      }
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && targetTime) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const remaining = targetTime - now;

        if (remaining <= 0) {
          setIsActive(false);
          setTargetTime(null);
          setDisplayMinutes(0);
          setDisplaySeconds(0);

          const audio = new Audio("/path-to-your-sound.mp3");
          audio.play().catch((e) => console.log("Audio play failed:", e));
        } else {
          setDisplayMinutes(Math.floor(remaining / (1000 * 60)));
          setDisplaySeconds(Math.floor((remaining % (1000 * 60)) / 1000));
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, targetTime]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((currentTasks) => [...currentTasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const deleteTask = (index: number) => {
    setTasks((currentTasks) => currentTasks.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const selectSong = (songName: string) => {
    setSelectedSong(songName);
    setShowSongSelect(false);
  };

  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    setIsActive(false);
    setTargetTime(null);

    switch (currentMode) {
      case "Pomodoro":
        setDisplayMinutes(newSettings.pomodoro);
        break;
      case "Short Break":
        setDisplayMinutes(newSettings.shortBreak);
        break;
      case "Long Break":
        setDisplayMinutes(newSettings.longBreak);
        break;
    }
    setDisplaySeconds(0);
  };

  return (
    <div className={getContainerClassName()}>
      <div className="timer-main">
        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
        >
          Setting
        </button>

        <div className="timer-inner">
          <div className="mode-buttons">
            <button
              onClick={() => selectMode("Pomodoro")}
              className={`mode-button ${
                currentMode === "Pomodoro" ? "active" : ""
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => selectMode("Short Break")}
              className={`mode-button ${
                currentMode === "Short Break" ? "active" : ""
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => selectMode("Long Break")}
              className={`mode-button ${
                currentMode === "Long Break" ? "active" : ""
              }`}
            >
              Long Break
            </button>
          </div>

          <div className="timer-display">
            {String(displayMinutes).padStart(2, "0")}:
            {String(displaySeconds).padStart(2, "0")}
          </div>

          <div className="control-buttons">
            <button
              className="control-button"
              onClick={() => setShowSongSelect(true)}
            >
              Choose Song
            </button>
            <button onClick={toggle} className="control-button">
              {isActive ? "PAUSE" : "START"}
            </button>
          </div>
        </div>

        <div className="tasks-section">
          <div>Tasks:</div>
          {Array.isArray(tasks) &&
            tasks.map((task, index) => (
              <div key={index} className="task-item">
                <span>{task}</span>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(index)}
                >
                  ×
                </button>
              </div>
            ))}
          <div className="task-input-container">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              className="task-input"
              placeholder="Enter your task..."
            />
            <button onClick={addTask} className="control-button">
              Add Task
            </button>
          </div>
        </div>
      </div>

      {showSongSelect && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowSongSelect(false)}
          />
          <div className="song-select-modal">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}

                onChange={(e) => {
									
									setSearchQuery(e.target.value)
									if (searchQuery.length > 1 ) {
										searchForSong();
									}
								}}
                placeholder="Search for music"
                className="search-input"

              />
            </div>

            <div className = "music-search-options">
                <button>Playlist</button>
                <button>Songs</button>
              </div>

            <div className="songs-list">
            {song
                .map((track, i) => (
                  <button
                    key={track.id}
                    className="song-item"
                    onClick={() => selectSong(track.name)}
                  >
                    <img src = {track.album.images[0].url} width="100" height="100"></img> 
                    <span className="song-name">{track.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowSettings(false)}
          />
          <div className="settings-modal">
            <h2>Timer Settings</h2>
            <form
              className="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                updateSettings(settings);
              }}
            >
              <label>
                Pomodoro (minutes):
                <input
                  type="number"
                  value={settings.pomodoro}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pomodoro: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Short Break (minutes):
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shortBreak: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Long Break (minutes):
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      longBreak: Number(e.target.value),
                    })
                  }
                />
              </label>
              <button type="submit">Save Settings</button>
              <button type="button" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}
      <SpotifyPlayer />
    </div>
  );
}
