const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

// Manager Schema
const ManagerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    job_profile: {
        type: String,
        required: true
    }
});

ManagerSchema.plugin(uniqueValidator);

const Manager = module.exports = mongoose.model('Manager', ManagerSchema);

// Find the Manager by ID
module.exports.getManagerById = function (id, callback) {
    Manager.findById(id, callback);
}

// Find the Manager by Its username
module.exports.getManagerByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Manager.findOne(query, callback);
}

// to Register the Manager
module.exports.addManager = function (newManager, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newManager.password, salt, (err, hash) => {
            if (err) throw err;
            newManager.password = hash;
            newManager.save(callback);
        });
    });
}

// Compare Password
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}