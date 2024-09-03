"use strict"
const { admin, defaultAuth } = require('../config.js');
const fs = require('fs');
const jwt = require('jsonwebtoken')
const path = require('path');
const { deleteFile, encodeImageToBase64, verifyUser, verifyUserBeforeRegister, createUserData, signupUser } = require('../services/user.service.js');
const { signupValidate } = require('../middlewares/validateUser.middleware.js');
const { generateToken } = require('../utils/utils.js');
const { responseMessage, profilePictureExtension, userCollection } = require('../constants.js');

async function signUpController(req, res) {
    try {
        const userData = await createUserData(JSON.parse(JSON.stringify(req.body)));

        try {
            await verifyUserBeforeRegister(userData.email);
        } catch (err) {

            return res.status(400).json({ err: err.message });
        }

        await signupUser(userData);

        res.status(201).json({ message: responseMessage.registrationSuccess });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: responseMessage.internalServerError })
    }
}


async function signInController(req, res) {
    try {
        const { email, password } = req.body
        let token;
        try {
            token = await verifyUser(email, password);
        } catch (err) {

            return res.status(400).json({ error: responseMessage.userNotRegistered });
        }
        res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: responseMessage.internalServerError });
    }
}


async function getProfileController(req, res) {
    res.status(200).json(req.userData);
}

async function updateProfileController(req, res) {
    try {
        const newQualification = req.body.qualification;
        if (!newQualification) {
            return res.status(400).send({ error: responseMessage.missingUpdationField });
        }
        const userId = req.userId;

        const docRef = await admin.firestore().collection(userCollection).doc(userId);

        await docRef.update({ qualification: newQualification });

        res.status(200).json({ message: responseMessage.updationSuccess });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: responseMessage.internalServerError });
    }
}

async function deleteUserController(req, res) {
    try {
        const dbUserId = req.userId;
        const email = req.userData.email;
        let userRecord;
        try {
            userRecord = await defaultAuth.getUserByEmail(email);
        } catch (err) {
            return res.status(500).json({ error: responseMessage.userNotFound });
        }

        const authUId = userRecord.uid;

        try {
            await defaultAuth.deleteUser(authUId);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: responseMessage.internalServerError });
        }

        const docRef = await admin.firestore().collection(userCollection).doc(dbUserId);
        await docRef.delete();

        await deleteFile(`./uploads/${email}-${profilePictureExtension}`);

        return res.status(200).json({ message: responseMessage.deletionSuccess });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: responseMessage.internalServerError });
    }
}


module.exports = { signUpController, signInController, getProfileController, updateProfileController, deleteUserController }