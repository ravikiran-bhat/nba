if (process.env.PORT)
  require('./app').listen(process.env.PORT)
else
  require('./app').listen(require('./config').server.port)