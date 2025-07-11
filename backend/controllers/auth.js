import User from "../models/User.js"
import jwt from 'jsonwebtoken'; // to generate signed token
import { expressjwt } from "express-jwt";// for authorization check
import dotenv from 'dotenv'
dotenv.config()

export const signup = async (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(() => {
            user.salt = undefined;
            user.hashed_password = undefined;
            res.json({
                user
            });
        })
        .catch((err) => {
            return res.status(400).json({
                error: err
            });
        })
};


export const signin = (req, res) => {
   const { email, password } = req.body;
    User.findOne({ email })
    .then((user) => {
  // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    })
    .catch((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // if user is found, make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
    })
};

export const signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};

export const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ["HS256"]
});

export const isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin only! Access denied'
        });
    }
    next();
};