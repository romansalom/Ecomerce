const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(5432, async () => {
    console.log('%s listening at 3001, estoy escuchando en el puerto 3001');
  });
});
