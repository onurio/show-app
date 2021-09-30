import React, { useEffect } from 'react';
import { PhonePiano } from '../components/PhonePiano';
import {SampleTriggerer} from '../components/SampleTriggerer';
// import text from '../utils/text';
import { PingPong } from '../components/PingPong';
import { PingPongSpectator } from '../components/PingPongSpectator';
import { WaitingScreen } from '../components/WaitingScreen';
import { GroupChord } from '../components/GroupChord';

export const CurrentAppContainer = (props) =>{
    useEffect(()=>{
        // props.socket.removeAllListeners();
    },[props.app,props.socket])
    switch (props.app){
        case 'phonePiano':
            return <PhonePiano socket={props.socket}/>;
        case 'sampleTriggerer':
            return <SampleTriggerer socket={props.socket} lang={props.lang} />;
        case 'pingPong':
            return <PingPong setApp={props.setApp} socket={props.socket} lang={props.lang} />;
        case 'pingPongSpectator':
            return <PingPongSpectator setApp={props.setApp} lang={props.lang} socket={props.socket} />;
        case 'waitingScreen':
            return <WaitingScreen lang={props.lang} />
        case 'groupChord':
            return <GroupChord lang={props.lang} socket={props.socket}/>
        default:
            return <WaitingScreen lang={props.lang} />;
    };
};