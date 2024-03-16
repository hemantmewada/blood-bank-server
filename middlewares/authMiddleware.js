const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) {
                return res.status(401).send({
                    status: false,
                    message: `Authentication failed ${error}`
                });
            }
            req.body.userId = decode.userId;
            next();
        })
    } catch (error) {
        return res.status(401).send({
            status: false,
            message: `Authentication failed ${error}`
        });
    }
};