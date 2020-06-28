// •	Buddies – Reference to the User model – creator (required)
const mongoose=require('mongoose')

const trippSchema=new mongoose.Schema({
    startPoint:{
        type:String,
        required:true
    },
    endPoint:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    seats:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    carImage:{
        type:String,
        required:true
    },
    creator:{
        type: 'ObjectId',
        ref: 'User'
    },
    buddies :[{
        type: 'ObjectId',
        ref: 'User',
        required:true
        }]
})

module.exports=mongoose.model('Tripp',trippSchema)