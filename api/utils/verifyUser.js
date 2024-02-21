import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const { token } = req.user;

    if (!token) {
        return next(errorHandler(401, 'Unauthorized: Token not provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return next(errorHandler(403, 'Forbidden: Invalid token'));
        }

        // Token is valid, attach the decoded user information to the request object
        req.user = decoded;
        next();
    });
}
