import {QeuryBuilder} from "./Throws";
import passwordHash from "password-hash";

export function createUser(name, email, pass) {
    return database.query('INSERT INTO `users` ( `userName`, `email`, `password`) VALUES (?, ?, ?)', [name, email, passwordHash.generate(pass)]).then(res => {
        return res.insertId;
    });
}

function getWithHashedPass(value) {
    if (value.hasOwnProperty('password')) value.password = passwordHash.generate(value.password)
    return value;
}

export function updateUser(uid, values) {
    if (!values) throw new QeuryBuilder('Value is empty');
    if (!uid) throw new QeuryBuilder('UID is empty');

    return database.query('UPDATE users SET ? WHERE id = ? ', [getWithHashedPass(values), uid]).then(res => {
        return res;
    });
}

export function deleteUser(value, column = 'id') {
    if (!value) throw new QeuryBuilder('Value is empty');

    return database.query('delete from users WHERE ?? = ? ', [column, value]).then(res => {
        return res;
    });
}

export function getUserBy(column, value) {
    if (!column) throw new QeuryBuilder('Column name is empty');
    if (!value) throw new QeuryBuilder('Value is empty');
    return database.query('select * from users where ?? = ?', [column, getWithHashedPass(value)]).then(res => {
        return res;
    });
}


export function emailIsAvailable(email) {
    return getUserBy('email', email).then(res => {
        return res.length === 0;
    });
}

export function setToken(uid, token) {
    return updateUser(uid, {'token': token}).then(res => {
        return res;
    });
}

