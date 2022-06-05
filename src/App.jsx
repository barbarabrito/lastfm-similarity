import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {useState} from 'react';

const apiKey = process.env.REACT_APP_API_KEY

function App() {

  const [showArtists, setShowArtists] = useState(true);
  const [showTracks, setShowTracks] = useState(false);
  const [artist, setArtist] = useState([]);
  const [track, setTrack] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);
  const [similarTracks, setSimilarTracks] = useState([]);

  const handleChangeArtists = e => {
    setShowArtists(true);
    setShowTracks(false);
  }

  const handleChangeTracks = e => {
    setShowTracks(true);
    setShowArtists(false);
  }

  const handleSubmitSearchArtists = (event) => {
    event.preventDefault();
    getSimilarArtists();
  }

  const handleSubmitSearchTracks = (event) => {
    event.preventDefault();
    getSimilarTracks();
  }

  async function getSimilarArtists() {
    try {
      const responseArtists = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${apiKey}&format=json&limit=30`);
      setSimilarArtists(responseArtists.data.similarartists.artist);
    } catch (error) {
      console.error(error);
    }
  }
  async function getSimilarTracks() {
    try {
      const responseTracks = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${apiKey}&format=json&limit=20`);
      setSimilarTracks(responseTracks.data.similartracks.track);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    
    <div className="App">

      <div className="container-options">
         <label htmlFor="select-option-artists">
           <input type="radio" id="select-option-artists" name="option-search" value="artists" defaultChecked={true}
           onChange={handleChangeArtists}/>
           &nbsp;Search for similar artists
        </label>
        <label htmlFor="select-option-tracks">
          <input type="radio" id="select-option-tracks" name="option-search" value="tracks"
            onChange={handleChangeTracks}
          />
           &nbsp;Search for similar tracks
        </label>
      </div>

      { showArtists ? (
      
        <div className="similarArtistsContainer">

          <form onSubmit={handleSubmitSearchArtists} id="similar-artists-form">
            <input type="text" 
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            id="search-input"
            placeholder="artist name"
            />
            <button id="btn-search-similar-artists">Search</button>
          </form>
          {
            similarArtists.map(artist => (
              <div className="similarArtistsBox" key={uuidv4()}>
                  <img src={artist.image[2]['#text']} alt="artist"/>              
                  <p><strong>{artist.name}</strong></p>
                  <p>Match: {(artist.match * 100).toFixed(2)}%</p>
                  <p><a href={artist.url} target="_blank" rel="noreferrer">See on lastfm page</a></p>
              </div>
              ))
          }
        </div>
        ) : null
      }
      {showTracks ? (

        <div className="similarTracksContainer">

          <form onSubmit={handleSubmitSearchTracks} id="similar-tracks-form">      
            <input type="text" 
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            id="search-input-showtracks-artist"
            placeholder="artist name"
            />
            <input type="text" 
            value={track}
            onChange={(e) => setTrack(e.target.value)} 
            id="search-input-showtracks-track"
            placeholder="track name"
            />
            <button id="btn-search-similar-tracks">Search</button>
           
          </form>
          {
            similarTracks.map(track => (
              <div className="similarTracksBox" key={uuidv4()}>        
                  <p><strong>{track.name} - {track.artist.name}</strong></p>
                  <p>Match: {(track.match * 100).toFixed(2)}%</p>
                  <p><a href={track.url} target="_blank" rel="noreferrer">See on lastfm page</a></p>
              </div>
              ))
          }
        </div>
        ) : null
      }
    </div>
    );
}

export default App;