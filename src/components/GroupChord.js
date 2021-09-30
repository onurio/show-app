import React,{useState, useEffect} from 'react';
import {rainbow,hexToComplimentary} from '../utils/utils'
import {midiMessageSchema} from '../utils/packTypes';
import {MIDIOUT} from '../Events';
import text from '../utils/text';


export const GroupChord=props=>{
    const [currentNote,setCurrentNote] = useState(undefined); 
    const [noteOneStyle,setNoteOneStyle] = useState('black');
    const [noteTwoStyle,setNoteTwoStyle] = useState('white');
    const [noteThreeStyle,setNoteThreeStyle] = useState('aqua');
    const [isPlaying,setIsPlaying] = useState(false);




    const handleStart=e=>{
        if(currentNote!==undefined){
            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([currentNote,0]));
        }
        if(e.target){
            let id =e.target.id;

            if(id==='noteOne'){
                setIsPlaying(true);
                props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([1,127]));
                setCurrentNote(1);
            } else{
                if(id==='noteTwo'){
                    setIsPlaying(true);
                    props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([2,127]));
                    setCurrentNote(2);
                } else {
                    if(id==='noteThree'){
                        setIsPlaying(true);
                        props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([3,127]));
                        setCurrentNote(3);
                    }
                }
            }
        }
    }

    const handleMove=(e)=>{

        const setNote=(target)=>{

            switch (target){
                case 'noteOne':
                    if(currentNote!==1 ){
                        if(currentNote!==undefined){
                            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([currentNote,0]));    
                        }
                        setCurrentNote(1);
                        props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([1,127]));    
                    }
                    break;
                case 'noteTwo':
                    if(currentNote!==2){
                        if(currentNote!==undefined){
                            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([currentNote,0]));    
                        }
                        if(isPlaying){
                            setCurrentNote(2);
                            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([2,127]));
    
                        }
                    }
                    break;
                case 'noteThree':
                    if(currentNote!==3){
                        if(currentNote!==undefined){
                            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([currentNote,0]));    
                        }
                        if(isPlaying){
                            setCurrentNote(3);
                            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([3,127]));
    
                        }
                    }
                    break;
                default:
                    return;

            }
        }

        let location = e.touches[0];
        let target = document.elementsFromPoint(location.clientX,location.clientY);
        if(target[0]){
            if(target[0].id !== ''){
            target = target[0].id;
            setNote(target);
        }  else{
            target = target[1].id; 
            setNote(target);  
        }         
        }
        
    }

    const handleEnd=e=>{
        if(currentNote!==undefined){
            props.socket.binary(true).emit(MIDIOUT,midiMessageSchema.encode([currentNote,0]));                            
        }
        setCurrentNote(undefined);
    }

    useEffect(()=>{
        if(!currentNote){
            setNoteOneStyle({bg:'white',text:'black'});
            setNoteTwoStyle({bg:'black',text:'white'});
            setNoteThreeStyle({bg:'white',text:'black'});
        } else {
            let color = rainbow(Math.round(Math.random()*20),Math.random()*20);
            switch (currentNote){
                case 1:
                    setNoteOneStyle({bg:color,text:hexToComplimentary(color)});
                    setNoteTwoStyle({bg:'black',text:'white'});
                    setNoteThreeStyle({bg:'white',text:'black'});
                    break;
                case 2:
                    setNoteTwoStyle({bg:color,text:hexToComplimentary(color)});
                    setNoteOneStyle({bg:'white',text:'black'});
                    setNoteThreeStyle({bg:'white',text:'black'});
                    break;
                case 3:
                    setNoteThreeStyle({bg:color,text:hexToComplimentary(color)});
                    setNoteOneStyle({bg:'white',text:'black'});
                    setNoteTwoStyle({bg:'black',text:'white'});
                    break;
                default:
                    return;

            }
        }
       
    },[currentNote])

    


    return (
        <div className='main' style={{height:'100%'}}>
            <div  className='center' style={{height:'33.333%',backgroundColor:noteThreeStyle.bg,width:'100vw',color:noteThreeStyle.text,position:'relative'}}>
                <h1 >{text.groupChord[props.lang].text} 3</h1>
                <div id='noteThree' onTouchStart={e=>handleStart(e)} onTouchEnd={e=>handleEnd(e)} onTouchMove={handleMove} style={{zIndex:6,position:'absolute',top:0,left:0,height:'100%',width:'100vw'}}></div>
            </div>
            <div   className='center' style={{height:'33.333%',backgroundColor:noteTwoStyle.bg,width:'100vw',color:noteTwoStyle.text,position:'relative'}}>
                <h1 >{text.groupChord[props.lang].text} 2</h1>
                <div id='noteTwo' onTouchEnd={e=>handleEnd(e)} onTouchMove={handleMove}  onTouchStart={e=>handleStart(e)} style={{zIndex:5,position:'absolute',top:0,left:0,height:'100%',width:'100vw'}}></div>
            </div>
            <div  className='center' style={{height:'33.333%',backgroundColor:noteOneStyle.bg,width:'100vw',color:noteOneStyle.text,position:'relative'}}>
                <h1 >{text.groupChord[props.lang].text} 1</h1>
                <div id='noteOne' onTouchStart={e=>handleStart(e)} onTouchEnd={e=>handleEnd(e)} onTouchMove={handleMove} style={{zIndex:6,position:'absolute',top:0,left:0,height:'100%',width:'100vw'}}></div>
            </div>
        </div>
    )
}