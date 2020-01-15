const sp = require('schemapack');


module.exports.stringSchema = sp.build('string');


module.exports.idNameSchema = sp.build([
    {
    id: 'string',
    name: 'string'
},{
    id: 'string',
    name: 'string'
}]);


module.exports.userStateSchema = sp.build({
    id: 'string',
    state: 'bool'
})

module.exports.midiMessageSchema = sp.build(['uint8','uint8']);

// module.exports.intSchema = 

module.exports.emptyEvent = (name)=>{
    return(
        this.generalSchema.encode(
            {
                name: name,
                data: this.stringSchema.encode('')
            }
        ));
}


module.exports.stringEvent = (name,data)=>{
    return(
        this.generalSchema.encode(
            {
                name: name,
                data: this.stringSchema.encode(data)
            }
        ));
}

module.exports.userStateEvent = (name,data)=>{
    return(
        this.generalSchema.encode(
            {
                name: name,
                data: this.userStateSchema.encode(data)
            }
        ));
}

module.exports.midiMessageEvent = (name,data)=>{
    return(
        this.generalSchema.encode(
            {
                name: name,
                data: this.midiMessageSchema.encode(data)
            }
        ));
}