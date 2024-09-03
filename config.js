const admin = require('firebase-admin')

const credentials = require('./key.json')
const { getAuth } = require('firebase-admin/auth')

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const defaultAuth = getAuth();


module.exports = { admin, defaultAuth }