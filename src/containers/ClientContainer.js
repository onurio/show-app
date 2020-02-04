import React,{useState} from 'react';
import {Join} from '../components/Join';
import { CurrentAppContainer } from './currentAppContainer';
import text from '../utils/text';

export const ClientContainer =props=>{
    const [page,setPage] = useState('join');
    const [lang,setLang] = useState('EN');
    const [instWidth,setInstWidth] = useState(0);

    const handlePageChange =(page)=>{
        setPage(page);
      };

    const changeLang =e=>{
       if(e.target.checked){
           setLang('ES');
       }else{
           setLang('EN');
       }
    }




    switch (page){
        case 'join':
        return(
            <Join changeLang={changeLang} lang={lang} changePage={handlePageChange} socket={props.socket} />
        );
        case 'currentAppContainer':
        return(
             <div style={{height:'100%'}}>
                <div onTouchStart={e=>setInstWidth(0)} style={{height:'100%',backgroundColor:'#282c34',opacity:instWidth,width:`${instWidth}%`,transition:'.5s',position:'absolute',left:'0',top:'0',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',zIndex:'999',textAlign: 'left'}}>
                    <h1>{text.instructions.head[lang]}</h1>
                    <h2>{text.instructions.body[props.app][lang].name}</h2>
                    <h4 style={{margin:'3vmin 10vmin'}}>{text.instructions.body[props.app][lang].text}</h4>
                </div>
                <CurrentAppContainer setApp={props.setApp} app={props.app} lang={lang} socket={props.socket} />
                <h1 onTouchStart={e=>setInstWidth(100)} style={{position:'absolute',bottom:10,right:20,color:'black',backgroundColor:'white',border: '2px solid black',borderRadius:'100%',padding:'4vmin',width:'5vmin',height:'5vmin',display:'flex',justifyContent:'center',alignItems:'center',zIndex:'100'}}>?</h1>
            </div>
        );
        default:
        return(
            <Join changePage={handlePageChange} socket={props.socket} />
        );
  }
}