import { usermodel  } from "../models/user.model.js";
import jwt from "jsonwebtoken"

async function authmiddleware(req,res,next) {
    // Support token from cookie or Authorization header (Bearer)
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers?.authorization?.split(' ')[1];
    const token = cookieToken || headerToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export {authmiddleware}