const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

const PORT = process.env.PORT || 3001;

app.prepare().then(() => {
  createServer(handler).listen(PORT, (err) => {
    if (err) throw err
    console.log(`Server listening on ${PORT}`);
  })
})