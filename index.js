const env = process.env.NODE_ENV || 'development';

const mongoose=require('mongoose')
const connectionStr = 'mongodb://localhost:27017/SharedTrippdb'
const config = require('./config/config')[env];
const express=require('express')
const indexRouter=require('./routes')
const authRouter=require('./routes/auth')
const trippRouter=require('./routes/tripp')


const app = express();

mongoose.connect(connectionStr,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true 
},function (err) {
    if (err) {
        console.error('Something happend with DB')
        throw err
    }
    console.log('Database is setup and running')
})

require('./config/express')(app)

app.use('/',authRouter)
app.use('/',trippRouter)
app.use('/',indexRouter)



app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found'
    })
})

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));