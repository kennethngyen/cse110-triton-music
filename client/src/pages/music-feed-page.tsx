import { Link, useParams } from "react-router-dom";
import "../music-feed-page.css";
import { useState } from "react";



export const MusicFeed = () => {


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
										<button className="music-picker-btn" type="button">Choose music</button>
									<button className= "share-button"> Share </button>
							</div>
						</li>
					</div>
					{["Friend A is Listening to...", 
					"Friend B is Listening to...", 
					"Friend C is Listening to..."].map((friend) => (
					<li key={friend} className="friend-item">
						<div className="friend-info">
						<p>{friend}</p>
						<p className = "friend-comment">
							This song is fire! <a href="#" className="song-description">(Song Title)</a>
							<img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className = "spotify-logo" alt="Spotify"></img>
						</p>
						</div>
					</li>
					))}
				</ul>
			</div>
		</div>
	);
}