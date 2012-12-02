var connect = require('connect');
connect.createServer(
connect.static(__dirname)
).listen(3000, "192.168.56.102");