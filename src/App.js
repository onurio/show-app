import React,{useState,useEffect} from 'react';
import './App.css';
import io from 'socket.io-client';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import {AdminContainer} from './containers/AdminContainer';
import {ClientContainer} from './containers/ClientContainer';
import { stringSchema } from './utils/packTypes';
import Tone from 'tone';
import {WakeLock} from './components/WakeLock';



const socketURL = 'http://192.168.1.3:4000';






function App() {
  const [socket,setSocket] = useState(null);
  // const [name,setName]=useState('');
  const [app,setApp] = useState('waitingScreen');
  



  const preventZoom =e=>{
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
    // console.log('connecting')
    const socket = io(socketURL,{secure: true});

    socket.on('connect',()=>{
      console.log('connected');
      socket.binaryType = 'arraybuffer';
    });
    socket.connect();

    

    

    socket.on('app',appName=>setApp(stringSchema.decode(appName)));
    setSocket(socket);
  }


  const resumeAudio =()=>{
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
      if(Tone.context.state === 'interrupted'){
        window.location.reload();
      }
    }
  }

  useEffect(()=>{
    if(Tone.context.state === 'interrupted'){
      window.location.reload();
    }
  });

  

  return(
    <div className="App" id='App' onTouchEnd={resumeAudio}  >
      <WakeLock preventSleep={true} />
      <Router>
        <Switch>
          <Route path="/admin" exact render={(props)=><AdminContainer  {...props}  setApp={setApp} socket={socket} />} />
          <Route path="/" render={(props)=><ClientContainer  {...props} setApp={setApp}  app={app}  socket={socket} />}/>
        </Switch>
      </Router>
    </div>
  );

}

export default App;
