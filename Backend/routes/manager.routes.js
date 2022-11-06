const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const config = require('../config/database');


router.post('/register', (req, res) => {
    let newManager = new Manager({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        job_profile: req.body.job_profile
    });
    Manager.addManager(newManager, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username is already taken. ";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: "Manager registration is successful."
            });
        }
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Manager.getManagerByUsername(username, (err, manager) => {
        if (err) throw err;
        if (!manager) {
            return res.json({
                success: false,
                message: "Manager not found."
            });
        }

        Manager.comparePassword(password, manager.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "manager",
                    data: {
                        _id: manager._id,
                        username: manager.username,
                        name: manager.name,
                        email: manager.email,
                        contact: manager.contact,
                        job_profile: manager.job_profile
                    }
                }, config.secret, {
                    expiresIn: 604800 // for 1 week time in milliseconds
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});

/**
 * Get Authenticated user profile
 */

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;