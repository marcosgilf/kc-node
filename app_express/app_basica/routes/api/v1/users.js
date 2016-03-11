'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../../../lib/auth.js'); // variable de entorno

//router.use(auth('admin', 'pass')); // MIDDLEWARE de autenticación general

/* Petición GET, sacar de la db CON AUTENTICACIÓN */
router.get('/', auth('admin', 'pass'), function(req, res) {
	
	var sort = req.query.sort || 'name';
	
	User.list(sort, function(err, rows) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: rows });	
	});
	
});

/* Petición POST, añadir un user */
router.post('/', function(req, res) {

	// Instanciamos objeto en memoria
	var user = new User(req.body);

	// Guardamos en la base de datos
	user.save(function(err, newRow) {
		if (err) {
			return res.json({ result: false, error: err });
		}
		return res.json({ result: true, rows: newRow });
	});

});

/* Petición PUT, editar un user */
router.put('/:id', function(req, res) {
	var options = {};
	//var options = { multi: true }; // Para actualizar varios 
	User.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
		if (err) {
			return res.json( { result: false, error: err });
		}
		res.json({ result: true, rows: data });
	});

});

module.exports = router;