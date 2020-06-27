const env = process.env.NODE_ENV || 'development'
const jwt = require('jsonwebtoken')
const express = require("express")
const Tripp = require('../models/tripp')
const { checkAuthentication, getUserStatus } = require('../controllers/users')

const config = require('../config/config')[env];

const router = express.Router();


router.get('/create', checkAuthentication, getUserStatus, (req, res) => {
    
    const token=req.cookies['aid']
    const decodedObject=jwt.verify(token,config.privateKey)
    
    res.render('offerTripp', {
        isLoggedIn: req.isLoggedIn,
        email:decodedObject.email   
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

const [startPoint,endPoint]=startAndEndPoint.split(' - ')
const [date,time]=dateTime.split(' - ')


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
        endPoint:endPoint.trim(),
        date:date.trim(),
        time:time.trim(),
        seats:seats.trim(),
        description: description.trim(),
        carImage:carImage        
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

// router.get('/details/:id', getUserStatus, async (req, res) => {
//     const cube = await getCubeWithAccessories(req.params.id)
//     res.render('details', {
//         title: 'Details | Cube Workshop',
//         ...cube,
//         isLoggedIn: req.isLoggedIn
//     })
// })

// router.get("/edit", checkAuthentication, getUserStatus, (req, res) => {
//     res.render('editCube', {
//         isLoggedIn: req.isLoggedIn
//     })
// })
// router.get("/delete", checkAuthentication, getUserStatus, (req, res) => {
//     res.render('deleteCube', {
//         isLoggedIn: req.isLoggedIn
//     })
// })

module.exports = router;