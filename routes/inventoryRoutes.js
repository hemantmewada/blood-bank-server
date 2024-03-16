const express = require("express");
const { inventoryController } = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const inventoryRotuer = express.Router();

inventoryRotuer.post("/create",authMiddleware, inventoryController);

module.exports = { inventoryRotuer }