const userModel = require('../models/usersModel');

module.exports.createuser = async ({ userData }) => {
    if(!userData.email || !userData.name || !userData.password || !userData.role || !userData.companyId){
        throw new Error('Required fields are missing.');
    }

    try {
        const user = await userModel.create(userData);
        return user;
    } catch (err) {
        throw new Error('Error saving user to database.');
    }
}

module.exports.findUserByEmail = async (email) => {
    return await userModel.findOne({ email });
};

module.exports.getAllUsers= async () => {
    return await userModel.find();
};

module.exports.getUserById = async (id) => {
    return await userModel.findById(id);
};

module.exports.updateUser = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports.deleteUser = async (id) => {
    return await userModel.findByIdAndDelete(id);
};
