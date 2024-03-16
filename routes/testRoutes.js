const express = require("express");
const {testController} = require("../controllers/testController");

const testRouter = express.Router();

testRouter.get("/",testController);

module.exports = {testRouter};