import {getUserBy, setToken} from "../models/Users";
import errs from "restify-errors";
import * as jwt from "jsonwebtoken";
import passwordHash from "password-hash";

const config = require('../config/app');
export const authenticate = (username, password) => {
    return getUserBy('email', username).then((user) => {
        if (!user || !user[0]) {
            return {
                error: "User not found"
            };
        }
        if (!passwordHash.verify(password, user[0].password)) {
            return {
                error: "Password incorrect"
            };
        }
        return {
            uid: user[0].id,
            email: user[0].email,
            uName: user[0].userName,
        };
    });
};

export const auth = (req, res, next) => {
    try {
        let {email, password} = req.body;
        authenticate(email, password).then(data => {
            let token = jwt.sign(data, config.jwt.secret, {
                expiresIn: '15m'
            });
            if (data.error) {
                return next(new errs.NotAuthorizedError(data.error));
            }
            setToken(data.uid, token);

            let {iat, exp} = jwt.decode(token);
            res.send({iat, exp, token});
        })
    } catch (e) {
        return next(new errs.InvalidArgument(e.message));

    }
};