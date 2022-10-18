import './App.css';
import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
  const CLIENT_ID = '5e9cc39f4b1648819b2f5ca285f3ce34';
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  
  const [token,setToken] = useState("")
  const [releases,setReleases] = useState([])
  const [userArtists,setUserArtists] = useState([])
  
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

}, [])

  function getLatest(){
    axios.get('https://api.spotify.com/v1/browse/new-releases?limit=50&offset=0',{headers:{
    
      Authorization: `Bearer ${token}`
    }}).then((res)=>{
      setReleases(res.data.albums.items);
    })
  }

  function getUserArtists(){
    axios.get('https://api.spotify.com/v1/me/top/artists?offset=0&limit=50',{headers:{
      Authorization: `Bearer ${token}`
    }}).then((res)=>{
      setReleases([])
      setUserArtists(res.data.items)
    })
  }

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Latest</h1>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}><button className='login-button'>Login to Spotify</button></a>: 
          <>
            <button onClick={logout}>Logout</button>
            <button onClick={getLatest}>Get Latest</button>
            <button onClick={getUserArtists}>Get Top Artists</button>
          </>
        }
        
      </header>
  
        <div  style={{display:'flex',flexWrap:'wrap',alignContent:'center',justifyContent:'center'}}>
          {releases.map((item,key)=>{
            return (
              <>
                  <div className='item' key={key} 
                    style={{
                    minWidth:'350px',
                    minHeight:'400px',
                    borderWidth:'1px',
                    borderRadius:'15%', 
                    marginLeft:"10px", 
                    marginRight:'10px', 
                    paddingTop:'10px',
                    marginTop:'10px',
                    marginBottom:'10px  '}}>
                      <a href={item.external_urls.spotify} >
                      <img src={item.images[1].url} alt="album artwork" style={{borderRadius:"15%"}}/>
                      <p>{item.name} | {item.artists.map((person,key)=>{
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

        <div style={{display:'flex',flexWrap:'wrap',alignContent:'center',justifyContent:'center',textAlign:'center'  }}>
          {userArtists.map((item,key)=>{
            console.log(item.genres.length)
            return (
              <>
                  <div className='item' key={key} 
                    style={{
                    minWidth:'450px',
                    maxWidth:'450px',
                    minHeight:'500px',
                    maxHeight:'500px',
                    borderWidth:'1px',
                    borderRadius:'15%', 
                    marginLeft:"10px", 
                    marginRight:'10px', 
                    paddingTop:'10px',
                    marginTop:'10px',
                    marginBottom:'10px  '}}>
                      <a href={item.external_urls.spotify} >
                      <img src={item.images[1].url} alt="artist artwork" style={{borderRadius:"15%",minHeight:"360px",minWidth:"340px",maxWidth:"340px",maxHeight:"360px"}}/>
                      <p>{item.name} </p>
                      <p>Followers: {item.followers.total}</p>
                      <div style={{display:'flex',flexWrap:'wrap',alignContent:'center',justifyContent:'center',textAlign:'center'}}>
                        <div style={{maxWidth:"80%" }}>
                          <p>Genres: <>{item.genres.map((genreItem,key)=>{
                          let character = ""
                          if(key === (item.genres.length-1)){
                            character = ""
                          }
                          else{
                            character = ", "
                          }
                          return genreItem + character
                        })}</></p>
                        </div>
                      </div>  
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

