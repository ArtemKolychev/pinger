import {ValidationData} from "../models/Throws";
import {emailIsAvailable, createUser, getUserBy, deleteUser, updateUser} from "../models/Users";
import errs from "restify-errors";

import validator from "email-validator";

async function validate(name, email, pass) {
    if (!name) throw new ValidationData('Name is empty');
    if (!email) throw new ValidationData('Email is empty');
    if (!(await emailIsAvailable(email))) throw new ValidationData('Email is not available');
    if (!validator.validate(email)) throw new ValidationData("Email is not valid");

    if (!pass) throw new ValidationData('Password is empty');
    if (pass.length < 6) throw new ValidationData('Password is short. Minimal length is 6 symbols');
}

export async function postUser(req, res, next) {
    let {name, email, password} = req.params;

    validate(name, email, password).then(() => {
        createUser(name, email, password).then(id => {
            res.send({
                newId: id
            });
            return next();
        });
    }).catch(e => {
        return next(new errs.InvalidArgumentError(e.message));
    });

}

export async function getUser(req, res, next) {

    if (req.params.uid) {
        getUserBy('id', req.params.uid).then(user => {
            delete user[0].password;
            res.send(user[0]);
        }).catch((e) => {
            return next(new errs.InvalidArgumentError(e.message));
        });
    } else {
        getCurrentUser(req).then(currentUser => {
            res.send(currentUser);
        }).catch((e) => {
            return next(new errs.InvalidArgumentError(e.message));
        });
    }
}

export async function putUser(req, res, next) {
    let {name, email, password, uid} = req.params;

    validate(name, email, password).then(() => {
        updateUser(uid, req.params).then(result => {
            res.send(result);
        }).catch((e) => {
            return next(new errs.InvalidArgumentError(e.message));
        });
    }).catch((e) => {
        return next(new errs.InvalidArgumentError(e.message));
    });
}

export async function delUser(req, res, next) {
    deleteUser(req.params.uid).then(result => {
        res.send(result);
    }).catch((e) => {
        return next(new errs.InvalidArgumentError(e.message));
    });
}


export async function getCurrentUser(req) {
    let currentUser = (await getUserBy('token', req.headers.authorization.split(' ')[1]))[0];
    delete currentUser.password;
    return currentUser;
}