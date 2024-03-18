const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    inventoryType: {
        type: String,
        enum: ["in", "out"]
    },
    bloodGroup: {
        type: String,
        required: [true, "blood group is required."],
        enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"]
    },
    quantity: {
        type: Number,
        required: [true, "quantity is required"]
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "organisation is required"]
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function (){
            return this.inventoryType == "out";
        }
    },
    email: {
        type: String,
        required: function (){
            return this.inventoryType == "in";
        }
    },
    donar: {
        type: mongoose.Schema.Types.ObjectId,
        required: function (){
            return this.inventoryType == "in";
        }
    }
},{ timestamps: true });

module.exports = mongoose.model("inventories",inventorySchema);