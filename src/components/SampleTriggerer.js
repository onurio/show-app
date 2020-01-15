import React,{useState,useEffect,useRef} from 'react';
import Tone from 'tone';
import {midiMessageSchema} from '../utils/packTypes';
import clap from '../samples/clap.wav';



Tone.context.latencyHint = 'interactive';
const waveform = new Tone.Analyser('waveform',1024);

var sampler = new Tone.Sampler({
	"C3" : clap
}).chain(waveform).toMaster();




export const SampleTriggerer = (props) =>{
  const [bgColor,setBgColor]=useState('black');
//   const [currentNote,setCurrentNote] = useState(null);
  const canvas = useRef(null);
  let canvasCtx;
//   const [mode,setMode] = useState('free');

  

    useEffect(()=>{
          props.socket.on('noteon',(note)=>{
            // note = midiMessageSchema.decode(note);
            let frq = Tone.Midi(note[0]).toFrequency();
            sampler.triggerAttack('C3');
            // setCurrentNote(Tone.Frequency(frq).toNote()); 
            let color = `rgb(${Math.round(((frq%440)/440)*255)},${Math.round(((frq%220)/220)*255)},${Math.round(((frq%880)/880)*255)})`;
            setBgColor(color);
        });
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
      // console.log(bgColor);
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
      canvasCtx.strokeStyle = '#ffffff'
      canvasCtx.stroke();
    }


    

    return (
        <div className="App">
          <div style={{backgroundColor:bgColor,zIndex:'1',position:'absolute',top:0,left:0,width:'100vw',height:'100vh',justifyContent:'center',display:'flex',fontSize:'20vmin',padding:'10vh 0'}}>
            {/* {currentNote} */}
          </div>
          <canvas ref={canvas}  style={{zIndex:'999',width:window.innerWidth,height:window.innerHeight}} width={window.innerWidth*2} height={window.innerHeight*2} id='oscilloscope'/>
        </div>
      );
    }