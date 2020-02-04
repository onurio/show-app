const maxApi  = require('max-api');
const io = require('socket.io-client');
const {MAXADMIN_JOINED,MIDIIN,MIDIOUT} = require('../Events.js');
const sp = require('schemapack');
const {midiMessageSchema,intSchema} = require('../utils/packTypes');


let appName = undefined;

let socket;

maxApi.addHandler('connect',(url)=>{
    socket = io(url);
    socket.emit(MAXADMIN_JOINED);
    // socket.on('users',(users)=>maxApi.outlet(users));
    socket.on(MIDIOUT,(msg)=>{   
        msg = intSchema.decode(msg);
        if(msg === 1){
            maxApi.outlet(1);
        } else {
            maxApi.outlet(2);
        }
    });
});


maxApi.addHandler('disconnect',()=>{
    socket.close();
});

maxApi.addHandler('midiin',(note,vel)=>{
    socket.emit(MIDIIN,midiMessageSchema.encode([note,vel]));
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
