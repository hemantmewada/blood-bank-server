const express = require("express");
const {registerController, loginController, currentUserController} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/current-user", authMiddleware, currentUserController);

module.exports = { authRouter };