const Tripp = require('../models/tripp')

const getAllTrips = async () => {
    const tripps = await Tripp.find().lean()
    return tripps
}

const getTripp = async (id) => {
    const tripp = await Tripp.findById(id).lean()
    return tripp
}


module.exports = {
    getAllTrips,
    getTripp    
}