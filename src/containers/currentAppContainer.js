import React from 'react';
import { PhonePiano } from '../components/PhonePiano';

export const CurrentAppContainer = (props) =>{
    switch (props.app){
        case 'phonePiano':
            return <PhonePiano socket={props.socket}/>;
        default:
            return <h1>Waiting for app</h1>;
    };
};