const mongoose = require('mongoose')


const taskSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})


module.exports = mongoose.model('tasks',taskSchema)