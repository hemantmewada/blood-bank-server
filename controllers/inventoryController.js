const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

const createInventoryController  = async (req, res) => {
    try {
        const { userId, bloodGroup, quantity, email } = req.body;
        const user = await userModel.findOne({email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "user not found."
            });
        }
        if (req.body.inventoryType == "out") {
            const requestedBloodGroup = bloodGroup;
            const requestedQuantity = quantity;
            const organisation = new mongoose.Types.ObjectId(userId);
            // calculate blood group quantity
            const totalInQuantity = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "in",
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: {$sum: "$quantity"}
                    }
                }
            ]);
            const totalOutQuantity = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup
                    }
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" }
                    }
                }
            ])
            const totalIn = totalInQuantity[0]?.total || 0;
            const totalOut = totalOutQuantity[0]?.total || 0;
            const availableQuantity = totalIn - totalOut;
            if (availableQuantity < requestedQuantity) {
                return res.status(500).send({
                    status: false,
                    message: `Only ${availableQuantity} ML of ${requestedBloodGroup} is available`
                });
            }
            req.body.hospital = user?._id;
        }else{
            req.body.donar = user?.id;
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
const getInventoryController  = async (req, res) => {
    try {
        const { userId } = req.body;
        const inventory = await inventoryModel.find({organisation: userId}).populate("organisation").sort( { createdAt: -1 });
        if (inventory) {
            return res.status(200).send({
                status: true,
                message: "Inventory fetched successfully.",
                data: inventory
            });
        } else {
            return res.status(404).send({
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
const getDonarsController  = async (req, res) => {
    try {
        const { userId } = req.body;
        const donarsId = await inventoryModel.distinct("donar",{
            organisation: userId,
        });
        const donars = await userModel.find({
            _id: { $in: donarsId }
        })
        if (donars) {
            return res.status(200).send({
                status: true,
                message: "Donars fetched successfully.",
                data: donars
            });
        } else {
            return res.status(404).send({
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
const getHospitalsController  = async (req, res) => {
    try {
        const { userId } = req.body;
        const hospitalsId = await inventoryModel.distinct("hospital",{
            organisation: userId,
        });
        const hospitals = await userModel.find({
            _id: { $in: hospitalsId }
        })
        if (hospitals) {
            return res.status(200).send({
                status: true,
                message: "Hospitals fetched successfully.",
                data: hospitals
            });
        } else {
            return res.status(404).send({
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

module.exports = { createInventoryController, getInventoryController, getDonarsController, getHospitalsController };