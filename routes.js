const routes = require('next-routes')();

routes.add('/campaigns/new', '/campaigns/new');
routes.add('/campaigns/:address', '/campaigns/campaign');

module.exports = routes;