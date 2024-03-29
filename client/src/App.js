import './App.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
import configs from './config';

function App() {
  // Configs Import
  const CLIENT_ID = configs.CLIENT_ID
  const REDIRECT_URI = configs.REDIRECT_URI
  const AUTH_ENDPOINT = configs.AUTH_ENDPOINT
  const RESPONSE_TYPE = configs.RESPONSE_TYPE

  // States
  const [token, setToken] = useState("")
  const [releases, setReleases] = useState([])
  const [userArtists, setUserArtists] = useState([])
  const [usersSongs, setUserSongs] = useState([])

  // UseEffect Function to create a token for the spotify requests storing it in local storage
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token")
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
  }, [])

  // GET Request to the spotifyAPI setting it to the Releases State
  function getLatest() {
    axios.get('https://api.spotify.com/v1/browse/new-releases?limit=50&offset=0', {
      headers: {

        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setReleases(res.data.albums.items);
      setUserArtists([])
      setUserSongs([])
    })
  }

  // GET Request to the SpotifyAPI setting it to the UsersArtists state
  function getUserArtists() {
    axios.get('https://api.spotify.com/v1/me/top/artists?offset=0&limit=50&time_range=short_term', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data)
      setReleases([])
      setUserSongs([])
      setUserArtists(res.data.items)
    })
  }

  // GET Request to the SpotifyAPI setting it to the UsersSongs state
  function getUserSongs() {
    axios.get('https://api.spotify.com/v1/me/top/tracks?offset=0&limit=50&time_range=short_term', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data.items);
      setReleases([]);
      setUserArtists([]);
      setUserSongs(res.data.items)
    })
  }

  // Logout Function clearing the token from localstorage
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Latest</h1>
        {/* If there's no token don't display the buttons */}
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}><button className='login-button'>Login to Spotify</button></a> :
          <>
            <button onClick={logout}>Logout</button>
            <button onClick={getLatest}>Get Latest</button>
            <button onClick={getUserArtists}>Get Top Artists</button>
            <button onClick={getUserSongs}>Get Top Songs</button>
          </>
        }

      </header>

      {/* Titles that display only if the states populated */}
      <div style={{ textAlign: 'center' }}>
        {releases.length !== 0 ? <h3>Spotify Latest Releases</h3> : <></>}
        {userArtists.length !== 0 ? <h3>Your Artists</h3> : <></>}
        {usersSongs.length !== 0 ? <h3>Your Latest Songs</h3> : <></>}
      </div>

      {/* Releases Container */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
        {releases.map((item, key) => {
          return (
            <>
              <div className='item' key={key}
                style={{
                  minWidth: '350px',
                  minHeight: '400px',
                  borderWidth: '1px',
                  borderRadius: '15%',
                  marginLeft: "10px",
                  marginRight: '10px',
                  paddingTop: '10px',
                  marginTop: '10px',
                  marginBottom: '10px  '
                }}>
                <a href={item.external_urls.spotify} >
                  <img src={item.images[1].url} alt="album artwork" style={{ borderRadius: "15%" }} />
                  <p>{item.name} | {item.artists.map((person, key) => {
                    return person.name
                  })}
                  </p>
                  <p>Released: {item.release_date}</p>
                  <p>Tracks: {item.total_tracks}</p>
                </a>
              </div>

            </>
          )
        })
        }
      </div>

      {/* Users Artists Container */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {userArtists.map((item, key) => {
          return (
            <>
              <div className='item' key={key}
                style={{
                  minWidth: '450px',
                  maxWidth: '450px',
                  minHeight: '500px',
                  maxHeight: '500px',
                  borderWidth: '1px',
                  borderRadius: '15%',
                  marginLeft: "10px",
                  marginRight: '10px',
                  paddingTop: '10px',
                  marginTop: '10px',
                  marginBottom: '10px  '
                }}>
                <a href={item.external_urls.spotify} >
                  <img src={item.images[1].url} alt="artist artwork" style={{ borderRadius: "15%", minHeight: "360px", minWidth: "340px", maxWidth: "340px", maxHeight: "360px" }} />
                  <p>{item.name} </p>

                  <div style={{ maxWidth: "80%" }}>
                    <p>Genres: <>{item.genres.map((genreItem, key) => {
                      let character = ""
                      if (key === (item.genres.length - 1)) {
                        character = ""
                      }
                      else {
                        character = ", "
                      }
                      return genreItem + character
                    })}</>
                    </p>
                  </div>

                </a>
              </div>

            </>
          )
        })
        }
      </div>

      {/* Users Songs Container */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {usersSongs.map((item, keyThree) => {
          console.log(item)
          return (
            <>
              <div className='item' key={keyThree}
                style={{
                  minWidth: '450px',
                  maxWidth: '450px',
                  minHeight: '500px',
                  maxHeight: '500px',
                  borderWidth: '1px',
                  borderRadius: '15%',
                  marginLeft: "10px",
                  marginRight: '10px',
                  paddingTop: '10px',
                  marginTop: '10px',
                  marginBottom: '10px  '
                }}>
                <a href={item.external_urls.spotify} >
                  <img src={item.album.images[1].url} alt="album artwork" style={{ borderRadius: "15%", minHeight: "300px", minWidth: "300px", maxWidth: "300px", maxHeight: "300px" }} />
                  <p>{item.name}</p>
                  <p>{item.album.artists.map((albumItem, keyFour) => {
                    return albumItem.name + " ";
                  })}
                  </p>
                  <p>Release Date: {item.album.release_date}</p>
                </a>
              </div>

            </>
          )
        })

        }
      </div>

    </div>
  );
}

export default App;

