const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoDBConnection = require("./config/db");
const { testRouter } = require("./routes/testRoutes");
const { authRouter } = require("./routes/authRoutes");
const { inventoryRotuer } = require("./routes/inventoryRoutes");

// dotenv config
dotenv.config();

// mongodb connection
mongoDBConnection();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/",(req, res) => {
    return res.status(200).send({
        status: true,
        message: "This apis are created by @hemantmewada."
    });
});

app.use("/api/v1/test",testRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/inventory",inventoryRotuer);

app.listen(PORT, () => {
    console.log("Node server is running on PORT : " + PORT);
});