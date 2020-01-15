import React, { useEffect } from 'react';
import { PhonePiano } from '../components/PhonePiano';
import {SampleTriggerer} from '../components/SampleTriggerer';
import text from '../utils/text';
import { PingPong } from '../components/PingPong';
import { PingPongSpectator } from '../components/PingPongSpectator';

export const CurrentAppContainer = (props) =>{
    useEffect(()=>{
        // props.socket.removeAllListeners();
    },[props.app,props.socket])
    switch (props.app){
        case 'phonePiano':
            return <PhonePiano socket={props.socket}/>;
        case 'sampleTriggerer':
            return <SampleTriggerer socket={props.socket} />;
        case 'pingPong':
            return <PingPong setApp={props.setApp} socket={props.socket} lang={props.lang} />;
        case 'pingPongSpectator':
            return <PingPongSpectator/>;
        default:
            return <h1>{text.waiting[props.lang]}</h1>;
    };
};