import { Link, useParams } from "react-router-dom";
import "../styles/music-feed-page.css";
import { useState } from "react";

export const MusicFeed = () => {
	const [showSettings, setShowSettings] = useState(false);
  	const [showSongSelect, setShowSongSelect] = useState(false);
  	const [searchQuery, setSearchQuery] = useState("");
  	const [selectedSong, setSelectedSong] = useState("");
	
	const selectSong = (songName: string) => {
		setSelectedSong(songName);
		setShowSongSelect(false);
	  };
	
	
	
	const songs = [
		{ id: 1, name: "Song A" },
		{ id: 2, name: "Song B" },
		{ id: 3, name: "Song C" },
	  ];


	return (
		<div className = "music-feed">
			<div className="feed-section">
				<ul>
					<div className = "share-feature">
						
						<li className = "share-item">
							<div className = "share-info">
								<p className="share-text">
									Share a song
								</p>
									<input type="text" className = "song-comments" placeholder = "Thoughts on a song...."></input> 
										<button 
											className="music-picker-btn" 
											onClick={() => setShowSongSelect(true)}
										>
										Choose music
										</button>
									<button className= "share-button"> Share </button>
							</div>
						</li>
					</div>
					{[
						"Friend A is Listening to...",
						"Friend B is Listening to...",
						"Friend C is Listening to...",
					].map((friend) => (
						<li key={friend} className="friend-item">
							<div className="friend-info">
								<p>{friend}</p>
								<p className="friend-comment">
									This song is fire!{" "}
									<a href="#" className="song-description">
										(Song Title)
									</a>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
										className="spotify-logo"
										alt="Spotify"
									></img>
								</p>
							</div>
						</li>
					))}
				</ul>
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
              			{songs.map((song) => (
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
	</div>
	);
};
