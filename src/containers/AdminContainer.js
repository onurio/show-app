import React,{useState} from 'react';
import { Admin } from '../components/Admin';
import { Login } from '../components/Login';



export const AdminContainer=props=>{
    const [isAuthenticated,setIsAuthenticaited] = useState(false);

    

    const auth =(password)=>{
        if (password==='saxmaster'){
            setIsAuthenticaited(true);
        }
        else{
            setIsAuthenticaited(false);
        }
    }

    switch(isAuthenticated){
        case true:
            return <Admin socket={props.socket} setApp={props.setApp} logout={auth}/>
        case false:
            return <Login login={auth}/>
        default:
            return <Login login={auth}/>
    }
}