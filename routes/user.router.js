const express = require('express');
const { signUpController, signInController, getProfileController, updateProfileController, deleteUserController } = require('../controllers/user.controller.js');
const { authenticate } = require('../middlewares/user.authenticate.js');
const multer = require('multer');
const { signupValidate, signinValidate } = require('../middlewares/validateUser.middleware.js');
const { profilePictureExtension } = require('../constants.js');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        req.body.profilePicture = `${req.body.email}-${profilePictureExtension}`;
        return cb(null, `${req.body.email}-${profilePictureExtension}`);
    }
});

const upload = multer({ storage: storage });

router.route('/signup')
    .post(upload.single('profilePicture'), signupValidate, signUpController)

router.route('/signin')
    .post( signinValidate, signInController)

router.route('/profile')
    .get(authenticate, getProfileController)
    .patch(authenticate, updateProfileController)
    .delete(authenticate, deleteUserController)

module.exports = { router }