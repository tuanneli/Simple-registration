import jwt from 'jsonwebtoken';
import secret from "../config.js";

export default function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                res.status(403).json({message: "The user wasn't authorized"})
            }
            const {roles: userRole} = jwt.verify(token, secret.secret);
            let hasRole = false;
            userRole.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "You don't have access"})
            }
            next();
        } catch (e) {
            console.log(e);
            res.status(403).json({message: "The user wasn't authorized"})
        }
    };
}
