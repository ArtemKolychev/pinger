import {QeuryBuilder} from "./Throws";

export function createMonitoringRes(statuseCode, payload, monitoredEndpointId) {
    return database.query('INSERT INTO monitoringResult ( statuseCode, payload, monitoredEndpointId) VALUES (?, ?, ?)',
        [statuseCode, payload, monitoredEndpointId]).then(res => {
        return res.insertId;
    });
}

export function deleteMonitoringRes(value, column = 'id') {
    if (!value) throw new QeuryBuilder('Value is empty');

    return database.query('delete from monitoringResult WHERE ?? = ? ', [column, value]).then(res => {
        return res;
    });
}

export function getMonitoringResBy(column, value, limit = null) {
    if (!column) throw new QeuryBuilder('Column name is empty');
    if (!value) throw new QeuryBuilder('Value is empty');
    let args = [column, value];
    if (limit) args.push(limit);
    return database.query('select * from monitoringResult where ?? = ? ' + (limit ? ' limit ? ' : null), args).then(res => {
        return res;
    });
}