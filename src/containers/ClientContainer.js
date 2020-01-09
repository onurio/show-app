import React,{useState} from 'react';
import {Join} from '../components/Join';
import { CurrentAppContainer } from './currentAppContainer';

export const ClientContainer =props=>{
    const [page,setPage] = useState('join');
    const [lang,setLang] = useState('EN');

    const handlePageChange =(page)=>{
        setPage(page);
      };

    const changeLang =e=>{
       if(e.target.checked){
           setLang('ES');
       }else{
           setLang('EN');
       }
    //    console.log(lang);
    }

    switch (page){
        case 'join':
        return(
            <Join changeLang={changeLang} lang={lang} changePage={handlePageChange} socket={props.socket} />
        );
        case 'currentAppContainer':
        return(
            <CurrentAppContainer app={props.app} socket={props.socket} />
        );
        default:
        return(
            <Join changePage={handlePageChange} socket={props.socket} />
        );
  }
}