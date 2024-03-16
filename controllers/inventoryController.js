const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const inventoryController  = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findOne({_id: userId });
        if (!user) {
            return res.json({
                status: false,
                message: "user not found."
            });
        }
        const inventory = new inventoryModel(req.body);
        const inventorySave = await inventory.save();
        if (inventorySave) {
            return res.status(201).send({
                status: true,
                message: "Inventory created successfully.",
                data: inventorySave
            });
        } else {
            return res.status(400).send({
                status: true,
                message: "Inventory creation failed."
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: `Error in inventory API ${error}`,
            error
        })
    }
}

module.exports = { inventoryController };