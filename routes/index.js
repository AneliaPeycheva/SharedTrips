const env = process.env.NODE_ENV || 'development'

const jwt = require('jsonwebtoken')
const config = require('../config/config')[env];
const { Router } = require('express');
const { getUserStatus, checkAuthentication, verifyUser } = require('../controllers/users')
const { getAllTrips, getTripp } = require('../controllers/tripps')

const router = Router()

router.get('/', getUserStatus, (req, res) => {

    res.render('home', {
        title: 'home',
        isLoggedIn: req.isLoggedIn,

    })
})

router.get('/sharedTripps', getUserStatus, async (req, res) => {
    const token=req.cookies['aid']
    const decodedObject=jwt.verify(token,config.privateKey)    

    const tripps = await getAllTrips()

    res.render('sharedTripps', {
        isLoggedIn: req.isLoggedIn,
        tripps,
        email:decodedObject.email       
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('aid')
    res.redirect('/')
})


module.exports = router