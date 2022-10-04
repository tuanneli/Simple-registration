import Role from "./model/Role.js";
import User from "./model/User.js";
import bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import jwt from 'jsonwebtoken';
import secret from "./config.js"

const generateWebToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    // console.log(roles)
    return jwt.sign(payload, secret.secret, {expiresIn: '24h'})
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({message: "Registration error", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if (candidate) {
                res.status(400).json("The user already exists!");
            }
            const hashPassword = bcrypt.hashSync(password, 5);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save();
            res.json(user);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Registration error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username})
            if (!user) {
                return res.status(404).json({message: `User ${username} was not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(404).json({message: "Incorrect password"})
            }
            const token = generateWebToken(user._id, user.roles);
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})

        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

export default new AuthController();