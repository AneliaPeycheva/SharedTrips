const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true    
    },
    password:{
        type:String,
        required:true,
        minlength:5 
    },    
    trippsHistory: [{
        type: 'ObjectId',
        ref: 'Tripp'
    }],
})

module.exports=mongoose.model('User',userSchema)