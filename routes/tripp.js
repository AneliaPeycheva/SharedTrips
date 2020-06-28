const env = process.env.NODE_ENV || 'development'
const jwt = require('jsonwebtoken')
const express = require("express")
const Tripp = require('../models/tripp')
const User = require('../models/user')
const { checkAuthentication, getUserStatus } = require('../controllers/users')
const { getTripp } = require('../controllers/tripps')
const user = require('../models/user')

const config = require('../config/config')[env];

const router = express.Router();


router.get('/create', checkAuthentication, getUserStatus, (req, res) => {

    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)

    res.render('offerTripp', {
        isLoggedIn: req.isLoggedIn,
        email: decodedObject.email
    })
})


router.post('/create', async (req, res) => {

    const {
        startAndEndPoint,
        dateTime,
        carImage,
        seats,
        number,
        description
    } = req.body

    const [startPoint, endPoint] = startAndEndPoint.split(' - ')
    const [date, time] = dateTime.split(' - ')


    // if (!name || name.length < 5 || !name.match(/^[0-9A-Za-z\s]+$/)) {
    //     return res.render('create', {
    //         title: 'Create Cube',           
    //         error: "Cube details are not valid"
    //     })
    // }
    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)


    const tripp = new Tripp({
        startPoint: startPoint.trim(),
        endPoint: endPoint.trim(),
        date: date.trim(),
        time: time.trim(),
        seats: seats.trim(),
        description: description.trim(),
        carImage: carImage,
        creator: decodedObject.userId
    })

    // tripp.save((err) => {
    //     if (err) {
    //         console.error(err)
    //         res.redirect('/create')
    //     } else {
    //         res.redirect('/')
    //     }
    // })
    try {
        await tripp.save()
        return res.redirect('/sharedTripps')
    } catch (error) {
        res.render('offerTripp', {
            isLoggedIn: req.isLoggedIn,
            error: "Trip details are not valid"
        })
    }

})

router.get('/details/:id', getUserStatus, async (req, res) => {

    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)
    const currentUser = JSON.stringify(decodedObject.userId)

    const trip = await Tripp.findById(req.params.id).populate('buddies').lean()
    //console.log(trip)  
    const creatorId=trip.creator
    const creator=await User.findById(creatorId)
   
    const availableSeats = trip.seats - trip.buddies.length
    // console.log(JSON.stringify(trip.creator)===JSON.stringify(decodedObject.userId ))
   
    res.render('details', {
        ...trip,
        isLoggedIn: req.isLoggedIn,
        email:decodedObject.email,
        creatorEmail: creator.email,
        isCreator: JSON.stringify(trip.creator) === currentUser,
        isAlreadyJoined: JSON.stringify(trip.buddies).includes(currentUser),
        isSeatsAvailable: availableSeats > 0,
        availableSeats        
    })
})

router.get("/edit/:id", checkAuthentication, getUserStatus, async(req, res) => {
    const token = req.cookies['aid']
    const decodedObject = jwt.verify(token, config.privateKey)
    const userId = decodedObject.userId
    //userId is the id of the current user
    //req.params.id is the id of current trip
    await Tripp.updateOne({_id:req.params.id},{$push:{buddies:userId}})
    await User.updateOne({_id:userId},{$push:{trippsHistory:req.params.id}})

    res.redirect(`/details/${req.params.id}`)
})

router.get("/delete/:id", checkAuthentication, getUserStatus, async (req, res) => {
   
    await Tripp.findByIdAndDelete(req.params.id)

    res.redirect('/sharedTripps')

})

module.exports = router;