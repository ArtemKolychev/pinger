import {getMonitors} from "../models/MonitoredEndpoint";
import axios from "axios";
import {createMonitoringRes} from "../models/MonitoringResult";

export default async function listen() {
    let listeners = {};
    let resources;
    setInterval(() => {
        getMonitors(10).then(rows => {
            rows.forEach((row) => {
                let isChanged = false;
                if (listeners.hasOwnProperty(row.id)) {
                    isChanged = new Date(row.lastCheck).toTimeString() !== new Date(listeners[row.id].lastCheck).toTimeString();
                }
                if (
                    !listeners ||
                    !(listeners.hasOwnProperty(row.id)) ||
                    isChanged
                ) {
                    if (isChanged) {

                        if (listeners.hasOwnProperty(row.id)) {
                            console.log('stop ID:' + row.id);
                            clearInterval(listeners[row.id].interval);
                        }
                    }
                    listeners = {
                        ...listeners,
                        [row.id]: {
                            lastCheck: row.lastCheck,
                            interval: ping(row),
                        }
                    }
                }
            });
            let ids = rows.map(item => item.id);
            if (resources) resources.filter(row => {
                return ids.indexOf(row.id) === -1;
            }).forEach((row) => {
                console.log('stop ID:' + row.id);
                clearInterval(listeners[row.id].interval);
            });
            resources = rows;

        });
    }, 1000);//1 sec

}

function ping(row) {
    return setInterval(() => {
        axios.get(row.url).then(response => {
            createMonitoringRes(response.status, JSON.stringify(response.headers), row.id);
        }).catch(error => {
            createMonitoringRes(0, error.message, row.id);
        });
    }, row.monitoredInterval);
}