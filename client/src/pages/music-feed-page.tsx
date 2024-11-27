import { Link, useParams, } from "react-router-dom";
import "../styles/music-feed-page.css";
import { useState, useEffect} from "react";


const SPOTIFY_CLIENT_ID = "0ba021f102b14503983e78e2307bcfa4"; //ONLY USING FOR TESTING, WILL REMOVE WHEN COMMIT GOES OUT
const SPOTIFY_CLIENT_SECRET = "b97528d17ddc40beb118159cff63f39d"; //ONLY USING FOR TESTING, WILL REMOVE WHEN COMMIT GOES OUT



//const SPOTIFY_CLIENT_ID = process.env.CLIENT_ID as string;
//const SPOTIFY_CLIENT_SECRET = process.env.CLIENT_SECRET_ID as string;

//^^^^^^^^^^^^^^^^^^^^^^^
// Current bug, spotify client IDS cannot be ripped from .env files for some raeson,
// the following code below only works if spotify client/secret is pasted directly into the file 



export const MusicFeed = () => {

	const [showSettings, setShowSettings] = useState(false);
  	const [showSongSelect, setShowSongSelect] = useState(false);
  	const [searchQuery, setSearchQuery] = useState("");
  	const [selectedSong, setSelectedSong] = useState("");

	const [searchInput, setSearchInput] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const[albums, setAlbums] = useState<any[]>([]);


	useEffect(() => {
		var authParameters = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: "grant_type=client_credentials&client_id=" + SPOTIFY_CLIENT_ID + '&client_secret=' + SPOTIFY_CLIENT_SECRET
		}
		
		fetch('https://accounts.spotify.com/api/token', authParameters)
			.then(result => result.json())
			.then(data => setAccessToken(data.access_token))
			
		

		console.log(SPOTIFY_CLIENT_ID)

		
	}, [])

	//Search function

	async function searchForAlbum() {
		
		//Get request to get artist ID
		var searchParameters = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			}
		}

		var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchQuery + '&type=artist', searchParameters)
			.then(response => response.json())
			.then(data => { return data.artists.items[0].id })

		//Get request with artist ID to grab all albums from artist
		var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=10', searchParameters)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setAlbums(data.items);
			})
		//Display albums
	}



	async function searchForSong() {
		
		//Get request to get artist ID
		var searchParameters = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			}
		}

		var songTrack = await fetch('https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track&limit=7', searchParameters)
			.then(response => response.json())
			.then(data => { return data.tracks.items[0].name })

		console.log(songTrack)

			

	}



	
	const selectSong = (songName: string) => {
		setSelectedSong(songName);
		setShowSongSelect(false);
	  };

	const songs = [
		{ id: 1, name: "Song A" },
		{ id: 2, name: "Song B" },
		{ id: 3, name: "Song C" },
	  ];

	  
	console.log(albums);
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

						onKeyDown = {event => {
							if (event.key == "Enter") {
								searchForSong();
							}
						}}
              		/>
            		</div>
					
					<div className = "search-btn-options">
						<button>Albums</button>
						<button>Playlists</button>
						<button>Songs</button>
					</div>



					<div className="songs-list">
						{albums.map((album, i) => {
							return (
								<button>
									{album.name}
									<img src = {album.images[0].url} width="100" height="100"></img> 
									</button>
							)
						})}
            		</div>
				</div>			
			</>	
			)}
	</div>
	);
};
