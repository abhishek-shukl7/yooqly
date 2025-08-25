const axios = require("axios");
const driverModel = require("../models/driverModel");

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status == "OK"){
            const location = response.data.results[0].geometry.location;
            return {
                ltd : location.lat,
                lng : location.lng
            };
        }else{
            throw new Error('Unable to fetch coordinates');
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin , destination) => {
    if(!origin || !destination){
        throw new Error('Origin or destination is missing.');
    }

    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status == "OK"){
            if(response.data.rows[0].elements[0].status == "ZERO_RESULTS"){
                throw new Error('No routes found');
            }else{
                return response.data.rows[0].elements[0];
            }
        }else{
            throw new Error('Unable to get distance time.');
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports.getSuggestions = async (input) => {
    if(!input){
        throw new Error('Input is required  .');
    }

    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status == "OK"){
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        }else{
            throw new Error('Unable to get suggestions.');
        }
    }catch(error){
        console.log(error);
        throw error;
    }    
}

module.exports.driversInRadius = async (ltd,lng,radius) => {
    const driversInRadius = await driverModel.find({
        location : {
            $geoWithin:{
                $centerSphere : [ [ ltd,lng ], radius / 6371 ]
            }
        }
    });

    return driversInRadius;
}