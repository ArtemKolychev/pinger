import {QeuryBuilder} from "./Throws";
import {getUserBy} from "./Users";

export function createMonitor(name, url, interval, owner) {
    return database.query('INSERT INTO monitoredEndpoint ( name, url, monitoredInterval, owner) VALUES (?, ?, ?, ?)', [name, url, interval, owner]).then(res => {
        return res.insertId;
    });
}

export function updateMonitor(uid, values) {
    if (!values) throw new QeuryBuilder('Value is empty');
    if (!uid) throw new QeuryBuilder('UID is empty');

    return database.query('UPDATE monitoredEndpoint SET ? WHERE id = ? ', [values, uid]).then(res => {
        return res;
    });
}

export function deleteMonitor(value, column = 'id') {
    if (!value) throw new QeuryBuilder('Value is empty');

    return database.query('delete from monitoredEndpoint WHERE ?? = ? ', [column, value]).then(res => {
        return res;
    });
}

export function getMonitorBy(column, value) {
    if (!column) throw new QeuryBuilder('Column name is empty');
    if (!value) throw new QeuryBuilder('Value is empty');
    return database.query('select * from monitoredEndpoint where ?? = ?', [column, value]).then(res => {
        return res;
    });
}

export function getMonitors(limit = 0) {
    return database.query('select * from monitoredEndpoint ' + (limit ? ' limit ' + limit : ''),).then(res => {
        return res;
    });
}


export function nameIsAvailable(name) {
    return getMonitorBy('name', name).then(res => {
        return res.length === 0;
    });
}