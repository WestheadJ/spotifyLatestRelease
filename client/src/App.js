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

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Latest</h1>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}><button>Login to Spotify</button></a>: 
          <button onClick={logout}>Logout</button>
        }
        <button onClick={getLatest}>Get latest</button>
      </header>
        <div  style={{display:'flex',flexWrap:'wrap',alignContent:'center',justifyContent:'center'}}>
          {releases.map((item,key)=>{
            console.log(item)
            return (
              <div className='item' key={key} style={{
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
                  <p>{item.name} | {item.artists.map((person)=>{
                    return person.name
                    })}
                  </p>
                  <p>Released: {item.release_date}</p>
                  <p>Tracks: {item.total_tracks}</p>
                </a>
              </div>
            )
          })
        }
      </div>     
    </div>
  ); 
}

export default App;

