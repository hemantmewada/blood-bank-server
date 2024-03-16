const mongoose = require("mongoose")
const mongoDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Mongo DB Connection success ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`Mongo DB connection Error : ${error}`);
    }
};

module.exports = mongoDBConnection;