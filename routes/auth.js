const express = require("express")
const { saveUser, verifyUser, guestAccess, getUserStatus, getUserByProperty } = require('../controllers/users');
const User = require("../models/user");
const router = express.Router();

router.get("/login", guestAccess, getUserStatus, (req, res) => {
    const error = req.query.error ? 'Username or password is not valid' : null
    res.render('login', {
        isLoggedIn: req.isLoggedIn,
        error
    })
})

router.post("/login", async (req, res) => {
    const { error, email } = await verifyUser(req, res)

    if (error) {
        return res.render('login', {
            error: 'Username or password is not correct'
        })
    }

    res.render('home', {
        title: 'home',
        isLoggedIn: true,
        email: email
    })
})

router.get("/register", guestAccess, getUserStatus, (req, res) => {
    const error = req.query.error ? 'Username or password is not valid' : null

    res.render('register', {
        isLoggedIn: req.isLoggedIn,
        error
    })
})

router.post("/register", async (req, res) => {

    const {
        email,
        password,
        rePassword
    } = req.body


    if (password !== rePassword) {
        return res.render('register', {
            error: "Password and Re-password don't match!",
            oldValues: { email, password, rePassword }
        })
    }

    let existingUser = await User.findOne({ email }).lean()

    if (existingUser) {
        return res.render('register', {
            error: "The given e-mail is already used",
            oldValues: { email, password, rePassword }
        })
    }



    if (!password || password.length < 5 || !password.match(/^[A-Za-z0-9]+$/)) {
        // res.redirect('register?error=true')
        return res.render('register', {
            error: "Password is not valid"
        })
    }

    const { error } = await saveUser(req, res)

    if (error) {
        return res.render('register', {
            error: "Username or password is not valid"
        })
    }
    res.render('home', {
        title: 'home',
        isLoggedIn: true,
        email: email
    })
})


module.exports = router;