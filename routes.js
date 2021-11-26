const routes = require('next-routes')();

routes.add('/campaigns/new', '/campaigns/new');
routes.add('/campaigns/:address', '/campaigns/campaign');
routes.add('/campaigns/:address/requests', '/campaigns/requests');
routes.add('/campaigns/:address/requests/new', '/campaigns/requests/newRequest');


module.exports = routes;