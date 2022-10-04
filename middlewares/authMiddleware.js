import jwt from 'jsonwebtoken';
import secret from "../config.js";

export default function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            res.status(403).json({message: "The user wasn't authorized"})
        }
        const decodedData = jwt.verify(token, secret.secret);
        req.user = decodedData;
        next();
    } catch (e) {
        console.log(e);
        res.status(403).json({message: "The user wasn't authorized"})
    }
};