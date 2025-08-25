const userModel = require('../models/userModel');

module.exports.createUser = async ({
    firstname,lastname,email,password
}) => {
    if(!firstname || !lastname || !password){
        throw new Error('Required fields are missing.');
    }

    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });

    return user;
}