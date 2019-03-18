import {ValidationData} from "../models/Throws";
import {createMonitor, deleteMonitor, getMonitorBy, nameIsAvailable, updateMonitor} from "../models/MonitoredEndpoint";
import errs from "restify-errors";
import {getCurrentUser} from "./User";

async function validate(name, url, monitoredInterval) {
    if (!name) throw new ValidationData('Name is empty');
    if (!url) throw new ValidationData('Url is empty');
    if (!(await nameIsAvailable(name))) throw new ValidationData('Name is not available');
    if (!monitoredInterval) throw new ValidationData('Interval is empty');
    if (Number.isInteger(monitoredInterval)) throw new ValidationData('Interval must be Int');
}

export async function postMonitoredEndpoint(req, res, next) {
    try {
        let {name, url, monitoredInterval} = req.params;
        validate(name, url, monitoredInterval).then(() => {
            getCurrentUser(req).then(
                user => {
                    createMonitor(name, url, monitoredInterval, user.id).then(id => {
                        res.send({
                            newId: id
                        });
                        return next();
                    });
                }
            ).catch(e => {
                return next(new errs.InvalidArgumentError(e.message));
            });
        }).catch(e => {
            return next(new errs.InvalidArgumentError(e.message));
        });
    } catch (e) {
        return next(new errs.InvalidArgumentError(e.message));
    }
}

export async function getMonitoredEndpoint(req, res, next) {
    getMonitorBy('id', req.params.id).then(endpoint => {
        res.send(endpoint[0]);
    }).catch((e) => {
        return next(new errs.InvalidArgumentError(e.message));
    });
}

export async function putMonitoredEndpoint(req, res, next) {
    let {name, url, monitoredInterval, id} = req.params;
    validate(name, url, monitoredInterval).then(() => {
        updateMonitor(id, req.params).then(result => {
            res.send(result);
        }).catch((e) => {
            return next(new errs.InvalidArgumentError(e.message));
        });
    }).catch((e) => {
        return next(new errs.InvalidArgumentError(e.message));
    });
}

export async function delMonitoredEndpoint(req, res, next) {
    deleteMonitor(req.params.id).then(result => {
        res.send(result);
    }).catch((e) => {
        return next(new errs.InvalidArgumentError(e.message));
    });
}
