import React,{useState} from 'react';
import {USER_JOINED} from '../Events';
import Tone from 'tone';
import './Join.css'
import text from '../utils/text';

export const Join=(props)=> {
    const [name,setName]=useState('');
  
    const handleJoin =()=>{
      props.socket.emit(USER_JOINED,name);
      props.socket.emit('getApp');
      props.changePage('currentAppContainer');
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
    };

    const handleChange =(e)=>{
      setName(e.target.value);
    };

    const handleEnter=e=>{
      if(e.key==='Enter'){
        handleJoin();
      }
    }



  
    
  
    return (
      <div className="App">
        <div className="main">
          <label className="switch_join">
            <input onChange={e=>props.changeLang(e)} type="checkbox"/>
            <span className="slider_join">
              <div className="lang">EN</div>
              <div className="lang">ES</div>
            </span>
          </label>
          <p style={{padding:'5vmin'}}>{text.join.p[props.lang]}</p>
          <h1>{text.join.h1[props.lang]}</h1>
          <input type='text' className="name" name="name" onKeyDown={handleEnter} onChange={handleChange} value={name}></input>
          <button className='button' onClick={handleJoin}>{text.join.button[props.lang]} {name}</button>
        </div>
      </div>
    );
  }