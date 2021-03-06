'use strict';

var express = require('express'),
    controller = require('./photo.controller'),
    auth = require('../../auth/auth.service'),
    router = express.Router();

router.get('/', auth.appendUser(), controller.index);
router.get('/count', auth.hasRole('admin'), controller.count);
router.get('/:id', auth.appendUser(), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
