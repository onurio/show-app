import React,{useState} from 'react'


export const Login=props=>{
    const [pass,setPass] = useState('');
    const [msg,setMsg] = useState('');

    const isGood =(pass)=>{
        if(pass==='saxmaster'){
            setMsg('GOOD');
        }else{
            setMsg('NOPE');
        }
    }

    return(
        <div>
            <h1>Login</h1>
            <h3>{msg}</h3>
            <input onChange={(e)=>{
                setPass(e.target.value);
                isGood(e.target.value);
                }}/>
            <button onClick={e=>props.login(pass)} >Login</button>
        </div>
        
    );
}