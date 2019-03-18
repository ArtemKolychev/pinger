import 'babel-polyfill';

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index";
import should from "should";
import {createUser, deleteUser} from "../models/Users";
import {deleteMonitor} from "../models/MonitoredEndpoint";

chai.use(chaiHttp);
let userData = {
    name: 'test',
    email: (new Date()).getTime() + 'test@test.com',
    password: '123456'
};
let epData = {
    name: (new Date()).getTime() + 'test',
    url: 'https://www.google.com/',
    interval: '100'
};
let token;
let idEP;

describe('/ENDPOINTS', () => {
    it('create user', (done) => {
        createUser(userData.name, userData.email, userData.password);
        chai.request(server)
            .post('/auth')
            .field({email: userData.email, password: userData.password})
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('Create new endpoint 1', (done) => {
        chai.request(server)
            .post('/endpoint')
            .set('Authorization', 'JWT ' + token)
            .end((err, res) => {
                should(res.status).equal(409);
                should(res.body.message).equal('Name is empty');
                done();
            });
    });
    it('Create new endpoint 2', (done) => {
        chai.request(server)
            .post('/endpoint')
            .set('Authorization', 'JWT ' + token)
            .field({name: epData.name})
            .end((err, res) => {
                should(res.status).equal(409);
                should(res.body.message).equal('Url is empty');
                done();
            });
    });
    it('Create new endpoint 3', (done) => {
        chai.request(server)
            .post('/endpoint')
            .set('Authorization', 'JWT ' + token)
            .field({name: epData.name, url: epData.url, monitoredInterval: epData.interval})
            .end((err, res) => {
                console.log(res.body);
                should(res.status).equal(200);
                should(res.body.newId).is.Number();
                idEP = res.body.newId;
                done();
            });
    });
    it('Create new endpoint 4', (done) => {
        chai.request(server)
            .post('/endpoint')
            .set('Authorization', 'JWT ' + token)
            .field({name: epData.name, url: epData.url, monitoredInterval: epData.interval})
            .end((err, res) => {
                should(res.status).equal(409);
                should(res.body.message).equal('Name is not available');
                done();
            });
    });

    it('Get endpoint', (done) => {
        chai.request(server)
            .get('/endpoint/' + idEP)
            .set('Authorization', 'JWT ' + token)
            .end((err, res) => {
                console.log(res.body);
                should(res.status).equal(200);
                should(res.body.name).equal(epData.name);
                done();
            });
    });

    it('Update endpoint', (done) => {
        chai.request(server)
            .delete('/endpoint')
            .set('Authorization', 'JWT ' + token)
            .field({'id': idEP, email: epData.name + '3',})
            .end((err, res) => {
                should(res.status).equal(200);
                done();
            });
    });

    it('Delete endpoint', (done) => {
        chai.request(server)
            .delete('/endpoint')
            .set('Authorization', 'JWT ' + token)
            .field({'id': idEP})
            .end((err, res) => {
                should(res.status).equal(200);
                done();
            });
    });

    it('FINISH', (done) => {
        deleteUser(userData.email, 'email');
        deleteMonitor(idEP);
        done();
    });
});