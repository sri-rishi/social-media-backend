const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

// registering new user

const registerUser = async(req, res) => {
    const {username, password, firstname, lastname} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new UserModel({
        username, 
        password:hashPassword, 
        firstname, 
        lastname
    });

    try {
        const prevUser = await UserModel.findOne({username})
        if(prevUser) {
            return res.status(400).json({message: "username is already registerd"});
        }
        const user = await newUser.save();
        const token = jwt.sign({
            username: user.username, id: user._id
        }, process.env.JWT_SECRET_KEY, {expiresIn: "24h"});
        res.status(200).json({user, token});
    }catch(error) {
        res.status(500).json(error)
    }
}

// login user

const loginUser = async(req, res) => {
    const {username, password} = req.body;

    try {
        const user = await UserModel.findOne({username: username});

        if(user) {
            const validity = await bcrypt.compare(password, user.password);

            if(!validity) {
                res.status(400).json({message: "Wrong password"})
            }else {
                const token = jwt.sign({
                    username: user.username, id: user._id
                }, process.env.JWT_SECRET_KEY, {expiresIn: "24h"});
                res.status(200).json({user, token});
            }
        }
        else {
            res.status(404).json("User does not exists");
        }
    }catch(error) {
        res.status(500).json(error);
    }
}

module.exports = {registerUser, loginUser}