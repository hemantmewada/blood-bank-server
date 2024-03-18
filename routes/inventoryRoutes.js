const express = require("express");
const { createInventoryController, getInventoryController, getDonarsController, getHospitalsController } = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const inventoryRotuer = express.Router();

inventoryRotuer.post("/create",authMiddleware, createInventoryController);
inventoryRotuer.get("/get-inventory-data",authMiddleware, getInventoryController);
inventoryRotuer.get("/get-donars",authMiddleware, getDonarsController);
inventoryRotuer.get("/get-hospitals",authMiddleware, getHospitalsController);

module.exports = { inventoryRotuer }