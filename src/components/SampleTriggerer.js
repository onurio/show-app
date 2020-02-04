import React,{useState,useEffect,useRef} from 'react';
import Tone from 'tone';
import satie from '../samples/Satie.mp3';
import { noteBgSchema } from '../utils/packTypes';
import {hexToComplimentary} from '../utils/utils';
import text from '../utils/text';



Tone.context.latencyHint = 'interactive';
const waveform = new Tone.Analyser('waveform',1024);

var sampler = new Tone.Sampler({
  "C3" : satie,
}).chain(waveform).toMaster();

sampler.volume.value = -10;






export const SampleTriggerer = (props) =>{
  const [bgColor,setBgColor]=useState('white');
  const [textColor,setTextColor] = useState('white');
  const canvas = useRef(null);
  let canvasCtx;


  const trigger=msg=>{
    msg = noteBgSchema.decode(msg);
    // let note = msg.note;
    
    let bg = msg.bg;
    setBgColor(bg);
    setTextColor(hexToComplimentary(bg))
    sampler.triggerAttack('C3');
  }
  

    useEffect(()=>{
        props.socket.on('noteon',trigger);
        return ()=>{
          props.socket.removeListener('noteon',trigger);
        };
    },[props.socket]);

    useEffect(()=>{
      // eslint-disable-next-line
      canvasCtx = canvas.current.getContext("2d");
      draw();      
    },[]);






    const draw=()=> {
      requestAnimationFrame(draw);
      var waveArray = waveform.getValue();
      canvasCtx.fillStyle = 'rgb(0,0,0,0)';
      canvasCtx.lineWidth = 4;
      canvasCtx.clearRect(0, 0, window.innerWidth*2, window.innerHeight*2);
      canvasCtx.fillRect(0,0,window.innerWidth*2, window.innerHeight*2);
      canvasCtx.beginPath();
      for (var i = 0; i < waveArray.length; i+=4) {
        let x= (i/waveArray.length)*(window.innerWidth*2);
        if (i === 0) {
          canvasCtx.moveTo(0,(window.innerHeight)+ waveArray[i]);
        } else {
          canvasCtx.lineTo(x, (window.innerHeight)+waveArray[i]*(window.innerHeight));
        }
      }
      canvasCtx.strokeStyle = 'black';
      canvasCtx.stroke();
    }


    

    return (
        <div className="App">
          <div style={{backgroundColor:bgColor,color: textColor,zIndex:'1',position:'absolute',top:0,left:0,width:'100vw',height:'100%',justifyContent:'center',display:'flex',flexDirection:'column',fontSize:'15vmin',padding:'0 0'}}>
            
            <h4 style={{marginBottom:'30vh'}}>{text.sampleTriggerer[props.lang].text}</h4>
            <h6>{text.sampleTriggerer[props.lang].inst}</h6>
          </div>
          <canvas ref={canvas}  style={{zIndex:'80',width:window.innerWidth,height:window.innerHeight}} width={window.innerWidth*2} height={window.innerHeight*2} id='oscilloscope'/>
        </div>
      );
    }