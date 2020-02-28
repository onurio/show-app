const maxApi  = require('max-api');
const io = require('socket.io-client');
const {MAXADMIN_JOINED,MIDIIN,MIDIOUT,CTLIN} = require('../Events.js');
const sp = require('schemapack');
const {midiMessageSchema,intSchema} = require('../utils/packTypes');


let appName = undefined;

let socket;

maxApi.addHandler('connect',(url)=>{
    socket = io(url);
    socket.emit(MAXADMIN_JOINED);
    socket.on('reconnect',(times)=>{
        console.log(`reconnected ${times} times`);
        socket.emit(MAXADMIN_JOINED);   
    })
    // socket.on('users',(users)=>maxApi.outlet(users));
    socket.on(MIDIOUT,(msg)=>{ 
        switch(appName){
            case 'pingPong':
                msg = intSchema.decode(msg);
                if(msg !== 128){
                    maxApi.outlet([msg,127]);                        
                }
                break;
            default:
                maxApi.outlet(msg);
                break;

        }  
    });
});


maxApi.addHandler('disconnect',()=>{
    socket.close();
});

maxApi.addHandler('midiin',(note,vel)=>{
    socket.emit(MIDIIN,midiMessageSchema.encode([note,vel]));
});


maxApi.addHandler('ctlin',(value,controller)=>{
    socket.emit(CTLIN,midiMessageSchema.encode([value,controller]));
});

maxApi.addHandler('phonepiano_mode',(msg)=>{
    socket.binary(true).emit('phonepiano_mode',msg);
});




maxApi.addHandler('appName',(msg)=>{
    socket.emit('appName',msg);
    appName = msg;
})

maxApi.addHandler('pipo_stop',(msg)=>{
    socket.emit('pipo_stop');
});

maxApi.addHandler('pipo_start',(msg)=>{
    socket.emit('pipo_start');
});
