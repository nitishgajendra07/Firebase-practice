const jwt = require('jsonwebtoken')
const { admin, defaultAuth } = require('../config');
const { responseMessage, userCollection, authorizationHeader, bearerTokenPrefix } = require('../constants');
const { BaseAuth } = require('firebase-admin/auth');

async function authenticate(req, res, next) {

    try {
        const token = req.header(authorizationHeader)?.replace(bearerTokenPrefix, "");

        if (!token) {
            return res.status(401).json({ error: responseMessage.tokenNotPassed });
        }
        let decodedToken
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        } catch (err) {
            return res.status(400).json({ error: responseMessage.invalidToken });
        }

        const userId = decodedToken.userId

        try {
            const authRecord = await defaultAuth.getUser(userId);
        } catch (err) {
            return res.status(400).json({ error: responseMessage.userNotFound });
        }

        const userDoc = await admin.firestore().collection(userCollection).doc(userId).get();

        if (!userDoc.exists) {
            return res.status(401).json({ error: responseMessage.userNotFound });
        }
        const userData = userDoc.data();
        req.userId = userId;
        req.userData = userData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: responseMessage.internalServerError })
    }
}

module.exports = { authenticate }