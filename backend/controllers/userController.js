const { validationResult } = require("express-validator");
const userModel = require("../models/usersModel");
const userService = require("../services/userService");

module.exports.getUser = async (req,res,next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'user not found.' });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.createUser = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { email, name , role , companyId, password } = req.body;
    const userExists = await userService.findUserByEmail({ userEmail });

    if(userExists){
        return res.status(400).json({ message : 'user already exists.'});
    }

    const hashedPwd = await userModel.hashPwd(password);

    const user = await userService.createuser({
        email : email,
        name : name,
        role: role,
        companyId: companyId,
        password: hashedPwd
    });

    const token = user.generateAuthToken();

    return res.status(200).json({token: token,user: user});
}


module.exports.updateUser = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'user not found.' });
        }
        return res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({ users });
    } catch (err) {
        console.error('Error fetching all users:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'user not found.' });
        }
        return res.status(200).json({ message: 'user deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};