import 'babel-polyfill';
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index";
import should from "should";
import {createUser, deleteUser} from "../models/Users";

chai.use(chaiHttp);
let userData = {
    name: 'test',
    email: (new Date()).getTime() + 'test@test.com',
    password: '1234567'
};
describe('init', () => {
    it('create user', (done) => {
        createUser(userData.name, userData.email, userData.password);
        done();
    });
});


let token;
let id;
/*describe('/AUTH', () => {
    it('Auth user', (done) => {
        chai.request(server)
            .post('/auth')
            .field({email: userData.email})
            .end((err, res) => {
                should(res.status).equal(403);
                should(res.body.message).equal('Password incorrect');
                done();
            });
    });
});*/
describe('/AUTH', () => {
    it('Auth user', (done) => {
        chai.request(server)
            .post('/auth')
            .field({email: userData.email, password: userData.password})
            .end((err, res) => {
                should(res.status).equal(200);
                should(res.body.token).is.String();
                token = res.body.token;
                done();
            });
    });
    it('Auth error', (done) => {
        chai.request(server)
            .get('/user')
            .set('Authorization', '')
            .end((err, res) => {
                should(res.status).equal(401);
                should(res.body.message).equal('No authorization token was found');
                done();
            });
    });
    it('Auth ok', (done) => {
        chai.request(server)
            .get('/user')
            .set('Authorization', 'JWT ' + token)
            .end((err, res) => {
                should(res.status).equal(200);
                should(res.body.email).equal(userData.email);
                done();
            });
    });
});
describe('/POST user', () => {

    it('Create new user 1', (done) => {
        chai.request(server)
            .post('/user')
            .set('Authorization', 'JWT ' + token)
            .end((err, res) => {
                should(res.status).equal(409);
                should(res.body.message).equal('Name is empty');
                done();
            });
    });
    it('Create new user 2', (done) => {
        chai.request(server)
            .post('/user')
            .set('Authorization', 'JWT ' + token)
            .field({'name': 'test'})
            .end((err, res) => {
                should(res.status).equal(409);
                should(res.body.message).equal('Email is empty');
                done();
            });
    });
    it('Create new user 3', (done) => {
        chai.request(server)
            .post('/user')
            .set('Authorization', 'JWT ' + token)
            .field({'name': 'test', 'email': userData.email, 'password': userData.password})
            .end((err, res) => {
                should(res.status).equal(409);
                should(res.body.message).equal('Email is not available');
                done();
            });
    });
    it('Create new user 4', (done) => {
        chai.request(server)
            .post('/user')
            .set('Authorization', 'JWT ' + token)
            .field({'name': 'test2', 'email': userData.email + '2', 'password': userData.password})
            .end((err, res) => {
                console.log(res.body);
                should(res.status).equal(200);
                should(res.body.newId).is.Number();
                id = res.body.newId;
                done();
            });
    });
});

describe('/GET user', () => {
    it('Get user', (done) => {
        chai.request(server)
            .get('/user/' + id)
            .set('Authorization', 'JWT ' + token)
            .end((err, res) => {
                should(res.status).equal(200);
                should(res.body.email).equal(userData.email + '2');
                done();
            });
    });
});
describe('/PUT user', () => {

    it('Update user', (done) => {
        chai.request(server)
            .delete('/user')
            .set('Authorization', 'JWT ' + token)
            .field({'uid': id, email: userData.email + '3',})
            .end((err, res) => {
                should(res.status).equal(200);
                done();
            });
    });
});

describe('/DEL user', () => {

    it('Delete user', (done) => {
        chai.request(server)
            .delete('/user')
            .set('Authorization', 'JWT ' + token)
            .field({'uid': id})
            .end((err, res) => {
                should(res.status).equal(200);
                done();
            });
        deleteUser(userData.email, 'email');
    });
});
