const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email : req.body.email });
        if (existingUser) {
            return res.status(200).send({
                status: false,
                message: "user already exist."
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        const user = await newUser.save();
        if (user) {
            return res.status(201).send({
                status: true,
                message: "Registration successfully.",
                data : user
            });
        } else {
            return res.status(400).send({
                status: true,
                message: "Registration failed."
            });
        }

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: `Error in registe API : ${error}`,
            error
        });
    }
}

const loginController = async (req, res) => {
    try {
        const {email, password, role} = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "user doesn't exist."
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(500).send({
                status: false,
                message: "wrong password."
            });
        }
        //check role
        if (role != user.role) {
            return res.status(404).send({
                status: false,
                message: `you are not a ${role}`
            });
        }
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: "1d" });
        return res.status(200).send({
            status: true,
            message: "Logged in succesfully.",
            token,
            data: user
        });

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: `Error in register API : ${error}`,
            error
        });
    }
}
const currentUserController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.body.userId});
        if (!user) {
            return res.status(404).send({
                status: true,
                message: "Not able to find user.",
            });
        }
        return res.status(200).send({
            status: true,
            message: "user found successfully.",
            data: user
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: `Error in registe API : ${error}`,
            error
        });
    }
}
module.exports = { registerController, loginController, currentUserController };