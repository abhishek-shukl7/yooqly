const { validationResult } = require("express-validator");
const authService = require("../services/authService");

module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const loginData = await authService.login(email, password);

        // console.log('loginData',loginData);
        
        return res.status(200).json({ message: 'Loggedin successfully.', data: loginData });
    } catch (err) {
        console.error('Error during client login:', err);
        return res.status(401).json({ message: err.message });
    }
};