const testController = (req, res) => {
    return res.status(200).json({
        status: true,
        message: "This route is just for testing."
    });
}

module.exports = { testController };