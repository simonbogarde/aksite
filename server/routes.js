/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');
var path = require('path');

module.exports = function(app) {

    // Insert routes below
    app.use('/api/gallery', require('./api/gallery'));
    app.use('/api/files', require('./api/file'));
    app.use('/api/upload', require('./api/upload'));
    app.use('/api/projects', require('./api/project'));
    app.use('/api/featured', require('./api/featured'));
    app.use('/api/posts', require('./api/post'));
    app.use('/api/photos', require('./api/photo'));
    app.use('/api/things', require('./api/thing'));
    app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth'));

    app.route('/data/*')
        .get(function(req, res) {
            res.sendfile(config.root + req.url);
        });

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // Hopefully this will tell Wordpress to piss off and stop pinging my site
    app.route('/wordpress*')
        .get(errors[410]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendfile(path.resolve(app.get('appPath') + '/index.html'));
        });
};

