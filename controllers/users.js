const env = process.env.NODE_ENV || 'development'

const jwt = require('jsonwebtoken')
const config = require('../config/config')[env];
const bcrypt = require('bcrypt');
const User = require('../models/user')
const saltRounds = 10;

const generateToken = (data) => {
    const token = jwt.sign(data, config.privateKey)
    return token
}

const saveUser = async (req, res) => {
    const {
        email,
        password
    } = req.body

    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        email,
        password: hashedPassword
    })

    const userObject = await user.save()

    const token = generateToken({
        userId: userObject._id,
        email: userObject.email
    })

//res.status(201).cookie('aid',token,{maxAge:3600000})
    res.cookie('aid', token)
    return true
}

const verifyUser = async (req, res) => {
    const {
        email,
        password
    } = req.body

    try {
        const user = await User.findOne({ email })
        if (user) {
            const status = await bcrypt.compare(password, user.password);

            if (status) {
                const token = generateToken({
                    userId: user._id,
                    email: user.email
                })
                res.cookie('aid', token)                
            }
            return {
                error: !status,
                message: status || 'Wrong password',
                email:email
            }
        } else {
            return {
                error: true,
                message: 'There is no such user'
            }
        }

    } catch (error) {
        return {
            error: true,
            message: 'There is no such user',
            status
        }
    }


}

const checkAuthentication = (req, res, next) => {
    const token = req.cookies['aid']

    if (!token) {
        return res.redirect('/')
    }
    try {
        jwt.verify(token, config.privateKey)
        next()
    } catch (error) {
        res.redirect('/')
    }
}
const guestAccess = (req, res, next) => {
    const token = req.cookies['aid']

    if (token) {
        return res.redirect('/')
    }
    next()
}
const getUserStatus = (req, res, next) => {
    const token = req.cookies['aid']

    if (!token) {
        req.isLoggedIn = false
    }
    try {
        jwt.verify(token, config.privateKey)               
        req.isLoggedIn = true       
    } catch (error) {
        req.isLoggedIn = false
    }
    next()
}

module.exports = {
    saveUser,
    verifyUser,
    checkAuthentication,
    guestAccess,
    getUserStatus    
}