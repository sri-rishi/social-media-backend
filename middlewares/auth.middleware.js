const jwt = require("jsonwebtoken");

const secret = process.env["JWT_SECRET_KEY"]

const authVerify = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(token) {
            const decoded = jwt.verify(token, secret);
            req.body._id = decoded?.id
       }
       next();
    }catch(error) {
        res.status(401).json(error);
    }
}

module.exports = authVerify