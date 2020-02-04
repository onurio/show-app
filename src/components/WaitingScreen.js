import React, { useEffect ,useState} from 'react';
import {rainbow,hexToComplimentary} from '../utils/utils';
import text from '../utils/text';

export const WaitingScreen=props=>{
    const [bgColor,setBgColor]=useState('white');
    const [textColor,setTextColor] = useState('white');

    useEffect(()=>{
        let color=rainbow(Math.round(Math.random()*20),Math.random()*20);
        setBgColor(color);
        setTextColor(hexToComplimentary(color));
        setInterval(()=>{
            let color=rainbow(Math.round(Math.random()*20),Math.random()*20);
            setBgColor(color);
            setTextColor(hexToComplimentary(color));
        },1000);
    },[]);

    return (
        <div className="App">
          <div style={{minHeight:'100%', backgroundColor:bgColor,color: textColor,zIndex:'1',position:'absolute',top:0,left:0,width:'100vw',height:'100%',justifyContent:'center',display:'flex',flexDirection:'column',fontSize:'5vmin',padding:'0 0'}}>
            <div style={{padding:'0 3vmin'}} >
                <h1 style={{marginBottom:'10vmin',padding:'0 2vmin'}} >{text.waitingScreen[props.lang].head}</h1>
                <h3>{text.waitingScreen[props.lang].text}</h3>
            </div>            
          </div>
        </div>
      );
}