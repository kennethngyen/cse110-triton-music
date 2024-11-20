import "../styles/Timer.css";
import React, { ChangeEventHandler, useState, useEffect } from "react";
import "../App.css";

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  tasks: string[];
  currentMode: string;
  settings: TimerSettings;
  selectedSong: string;
}

export function Timer() {
  const getDefaultState = (): TimerState => ({
    minutes: 25,
    seconds: 0,
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

  // Load initial state from localStorage or use defaults
  const loadInitialState = (): TimerState => {
    const savedState = localStorage.getItem("timerState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          minutes: parsed.minutes || 25,
          seconds: parsed.seconds || 0,
          isActive: false, // Always start paused
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [], // Ensure tasks is always an array
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

  // Initialize state with persisted data
  const [minutes, setMinutes] = useState(loadInitialState().minutes);
  const [seconds, setSeconds] = useState(loadInitialState().seconds);
  const [isActive, setIsActive] = useState(loadInitialState().isActive);
  const [tasks, setTasks] = useState<string[]>(loadInitialState().tasks);
  const [newTask, setNewTask] = useState("");
  const [currentMode, setCurrentMode] = useState(
    loadInitialState().currentMode
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showSongSelect, setShowSongSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState(
    loadInitialState().selectedSong
  );
  const [settings, setSettings] = useState<TimerSettings>(
    loadInitialState().settings
  );

  const songs = [
    { id: 1, name: "Song A" },
    { id: 2, name: "Song B" },
    { id: 3, name: "Song C" },
  ];

  // Save state to localStorage whenever relevant states change
  useEffect(() => {
    try {
      const stateToSave: TimerState = {
        minutes,
        seconds,
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
  }, [minutes, seconds, isActive, tasks, currentMode, settings, selectedSong]);

  const getContainerClassName = () => {
    let baseClass = "timer-container";
    if (currentMode === "Short Break") return `${baseClass} short-break`;
    if (currentMode === "Long Break") return `${baseClass} long-break`;
    return baseClass;
  };

  const selectMode = (mode: string) => {
    setIsActive(false);
    setCurrentMode(mode);
    switch (mode) {
      case "Pomodoro":
        setMinutes(settings.pomodoro);
        break;
      case "Short Break":
        setMinutes(settings.shortBreak);
        break;
      case "Long Break":
        setMinutes(settings.longBreak);
        break;
      default:
        setMinutes(settings.pomodoro);
    }
    setSeconds(0);
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

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
    switch (currentMode) {
      case "Pomodoro":
        setMinutes(newSettings.pomodoro);
        break;
      case "Short Break":
        setMinutes(newSettings.shortBreak);
        break;
      case "Long Break":
        setMinutes(newSettings.longBreak);
        break;
    }
    setSeconds(0);
    setIsActive(false);
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Optional: Play sound when timer completes
            const audio = new Audio("/path-to-your-sound.mp3");
            audio.play().catch((e) => console.log("Audio play failed:", e));
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

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
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for music"
                className="search-input"
              />
            </div>
            <div className="songs-list">
              {songs
                .filter((song) =>
                  song.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((song) => (
                  <button
                    key={song.id}
                    className="song-item"
                    onClick={() => selectSong(song.name)}
                  >
                    <span className="music-note">♪</span>
                    <span className="song-name">{song.name}</span>
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
    </div>
  );
}
