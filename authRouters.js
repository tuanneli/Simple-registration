import {Router} from "express";
import authController from "./authController.js";
import {check} from "express-validator";
import authMiddleware from "./middlewares/authMiddleware.js";
import roleMiddleware from "./middlewares/roleMiddleware.js";

const router = new Router();

router.post('/registration', [
    check('username', "The field can't be empty!").notEmpty(),
    check('password', "Min passwords length is 8 symbols").isLength({min: 8})
], authController.registration);
router.post('/login', authController.login);
router.get('/users', roleMiddleware(["USER"]), authController.getUsers);

export default router;