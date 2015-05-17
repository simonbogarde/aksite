'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
    .get('/', passport.authenticate('linkedin', {
        failureRedirect: '/signup',
        scope: [
            //'r_network',
            //'r_fullprofile',
            //'r_contactinfo',
            'r_emailaddress'
        ],
        session: false
    }))

    .get('/callback', auth.addAuthHeaderFromCookie(), auth.appendUser(), passport.authenticate('linkedin', {
        failureRedirect: '/signup',
        session: false
    }), auth.setTokenCookie);

module.exports = router;
