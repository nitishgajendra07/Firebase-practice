
"use strict"

const { responseMessage } = require("../constants");
const { getHashedpassword } = require("../services/user.service");

function signupValidate(req, res, next) {
    const { name, age, qualification, email, password } = req.body;
    if (!name || !age || !qualification || !email || !password) {
        return res.status(400).json({ error: responseMessage.missingRequiredFields });
    }



    const ageRegEx = /^1[0-4]\d$|^[1-9]\d?$|^150$/;
    const emailRegEx = /^[0-9a-zA-Z]+@(yahoo|gmail)+.(com|in)$/;


    if (!ageRegEx.test(age)) {
        return res.status(400).json({ error: responseMessage.invalidAge });
    }
    if (!emailRegEx.test(email)) {
        return res.status(400).json({ error: responseMessage.invalidEmail });
    }
    next();
}

function signinValidate(req, res, next) {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({ error: responseMessage.missingUsernamePassword });
    }

    const emailRegEx = /^[0-9a-zA-Z]+@(yahoo|gmail)+.(com|in)$/;

    if (!emailRegEx.test(email)) {
        return res.status(400).json({ error: responseMessage.invalidEmail });
    }

    next();
}

module.exports = { signupValidate, signinValidate };

