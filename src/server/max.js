const maxApi  = require('max-api');
const io = require('socket.io-client');
const {MAXADMIN_JOINED,MIDIIN} = require('../Events.js');
const sp = require('schemapack');
const {midiMessageSchema} = require('../utils/packTypes');

let socket;

maxApi.addHandler('connect',(url)=>{
    socket = io(url);
    socket.emit(MAXADMIN_JOINED);
    // socket.on('users',(users)=>maxApi.outlet(users));
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
})

