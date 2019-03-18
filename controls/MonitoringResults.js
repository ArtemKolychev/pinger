import {ValidationData} from "../models/Throws";
import errs from "restify-errors";
import {getMonitoringResBy, deleteMonitoringRes} from "../models/MonitoringResult";


export async function getMonitoringResults(req, res, next) {
    let {column, value, limit} = req.params;
    try {
        if (!column) throw new ValidationData('Column is empty');
        if (!value) throw new ValidationData('Value is empty');
        if (limit && !(limit = Number.parseInt(limit))) throw new ValidationData('Limit must be integer');
        getMonitoringResBy(column, value, limit).then(rows => {
            res.send(rows);
        }).catch((e) => {
            return next(new errs.InvalidArgumentError(e.message));
        });
    } catch (e) {
        return next(new errs.InvalidArgumentError(e.message));
    }
}

export async function delMonitoringResults(req, res, next) {
    deleteMonitoringRes(req.params.id).then(result => {
        res.send(result);
    }).catch((e) => {
        return next(new errs.InvalidArgumentError(e.message));
    });
}
