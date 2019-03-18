import restify from "restify";

const config = require('./config/app');
import Database from "./components/Connection";
import {delUser, getUser, postUser, putUser} from "./controls/User";
import {auth} from "./controls/Auth";

const rjwt = require('restify-jwt-community');
import {
    delMonitoredEndpoint,
    getMonitoredEndpoint,
    postMonitoredEndpoint,
    putMonitoredEndpoint
} from "./controls/MonitoredEndpoint";
import listen from "./components/Listener";
import {delMonitoringResults, getMonitoringResults} from "./controls/MonitoringResults";

global.database = new Database();

const server = restify.createServer();
server.use(require('restify-plugins').queryParser());
server.use(require('restify-plugins').bodyParser());
server.use(rjwt(config.jwt).unless({
    path: ['/auth']
}));

//listen();

server.post('/user', postUser);//name, email, password
server.get('/user', getUser);
server.get('/user/:uid', getUser); //uid
server.put('/user', putUser); //uid, name, email, password
server.del('/user', delUser); //uid

server.post('/endpoint', postMonitoredEndpoint); //name, url, monitoredInterval
server.get('/endpoint', getMonitoredEndpoint);
server.get('/endpoint/:id', getMonitoredEndpoint); //id
server.put('/endpoint', putMonitoredEndpoint); //id, name, url, monitoredInterval
server.del('/endpoint', delMonitoredEndpoint); //id

server.get('/monitoringResult/:column/:value/:limit', getMonitoringResults); // column enum(id, name, url, reationDate ,lastCheck, monitoredInterval, owner), value, limit
server.del('/monitoringResult', delMonitoringResults); // id

server.post('/auth', auth); //email, password


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

export default server;
