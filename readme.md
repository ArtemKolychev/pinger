**postUser** post:  `/user`    input params: 'name', email, password                                    
**getUser** get:  `/user`                                         
**getUser** get:  `/user/:uid`    input params: 'uid'                                    
**putUser** put:  `/user`    input params: 'uid', name, email, password                                     
**delUser** del:  `/user`    input params: 'uid'                                     
**postMonitoredEndpoint** post:  `/endpoint`    input params: 'name'', url, monitoredInterval                                    
**getMonitoredEndpoint** get:  `/endpoint`                                         
**getMonitoredEndpoint** get:  `/endpoint/:id`    input params: 'id'                                     
**putMonitoredEndpoint** put:  `/endpoint`    input params: 'id', name, url, monitoredInterval                                     
**delMonitoredEndpoint** del:  `/endpoint`    input params: 'id'                                     
**getMonitoringResults** get:  `/monitoringResult/:column/:value/:limit`    input params:  'column 'enum(id, name, url, reationDate ,lastCheck, monitoredInterval, owner), value, limit                                   
**delMonitoringResults** del:  `/monitoringResult`    input params:  'id'                                     
**auth** post:  `/auth`    input params: 'email'', password                                    


Start application:
1. `git clone https://PerecTema@bitbucket.org/PerecTema/monitoredendpoints.git`
2. `cd monitoredendpoints`
3. import database from file: '/db.sql'
4. `npm install`
5. `npm run dev`

User for test-> email:`test@test.com`, password:`1234567`

For test: `npm run test`
 











