import React,{useState,useEffect} from 'react';
import './App.css';
import io from 'socket.io-client';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import {AdminContainer} from './containers/AdminContainer';
import {ClientContainer} from './containers/ClientContainer';
import { stringSchema } from './utils/packTypes';
// import {SEND_USER_LIST} from './Events';


const socketURL = 'http://192.168.1.5:4000';

// if (Tone.context.state !== 'running') {
//   Tone.context.resume();
// }

function App() {
  const [socket,setSocket] = useState(null);
  // const [name,setName]=useState('');
  const [app,setApp] = useState('pingPong');


  const preventZoom=(e)=>{
    e.preventDefault();
    document.body.style.zoom = 0.999999;
  }


  useEffect(()=>{
    initSocket();
    // document.addEventListener('visibilitychange',(e)=>{
    //   console.log(e);
    // });
    document.addEventListener('gesturestart', (e)=>preventZoom(e));
    document.addEventListener('gesturechange', (e)=>preventZoom(e));
    document.addEventListener('gestureend', (e)=>preventZoom(e));
    return (()=>{
      document.removeEventListener('gestureend',(e)=>preventZoom(e));
      document.removeEventListener('gesturechange', (e)=>preventZoom(e));
      document.removeEventListener('gestureend', (e)=>preventZoom(e));
    });
  },[])

  

  const initSocket = () =>{
    const socket = io(socketURL,{secure: true});
    socket.on('connect',()=>{
      console.log('connected');
      socket.binaryType = 'arraybuffer';
    });
    socket.on('app',appName=>setApp(stringSchema.decode(appName)));
    setSocket(socket);
  }



  

  return(
    <div className="App">
      <Router>
        <Switch>
          <Route path="/admin" exact render={(props)=><AdminContainer  {...props}  setApp={setApp} socket={socket} />} />
          <Route path="/" render={(props)=><ClientContainer  {...props} setApp={setApp} app={app}  socket={socket} />}/>
        </Switch>
      </Router>
    </div>
  );

}

export default App;
