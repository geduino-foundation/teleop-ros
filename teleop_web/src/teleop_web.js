#!/usr/bin/env node

/*
 main.js
 
 Copyright (C) 2018 Alessandro Francescon
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

// Requires
const rosnodejs = require('rosnodejs');
const express = require('express');
const serveStatic = require('serve-static');
const teleop = require('./teleop');
const diagnostics = require('./diagnostics');
const map = require('./map');
const bodyParser = require('body-parser');

// Init node
rosnodejs
	.initNode('teleop_web', { onTheFly: true })
	.then((nodeHandle) => {
	
		// Init teleop
		teleop.init(nodeHandle);
		
		// Init diagnostics
		diagnostics.init(nodeHandle);
		
		// Init map
		map.init(nodeHandle);
		
	});

// Rest end points
const rest = express();

rest.use(bodyParser.json());
rest.use(bodyParser.urlencoded({ extended: true })); 

// Teleop forward end-point
rest.post('/rest/teleop/forward', function(req, res) {
	
	// Move forward
	teleop.forward();
	
	// End request
	res.end();
	
})

// Teleop back end-point
rest.post('/rest/teleop/back', function(req, res) {
	
	// Move back
	teleop.back();
	
	// End request
	res.end();
	
})

// Teleop left end-point
rest.post('/rest/teleop/left', function(req, res) {
	
	// Rotate left
	teleop.left();
	
	// End request
	res.end();
	
})

// Teleop right end-point
rest.post('/rest/teleop/right', function(req, res) {
	
	// Rotate right
	teleop.right();
	
	// End request
	res.end();
	
})

// Teleop stop end-point
rest.post('/rest/teleop/stop', function(req, res) {
	
	// Stop
	teleop.stop();
	
	// End request
	res.end();
	
})

// Diagnostics status end-point
rest.get('/rest/diagnostics/status', function(req, res) {
	
	// Get diagnostic status
	var status = diagnostics.getStatus();

	// Set response header
	res.setHeader('content-type', 'application/json');
	
	// Send response
	res.end(JSON.stringify(status));
	
})

// Diagnostics status end-point
rest.get('/rest/diagnostics/tree/name/*', function(req, res) {
	
	// Get diagnostic status
	var status = diagnostics.getTreeByName(req.params[0]);

	// Set response header
	res.setHeader('content-type', 'application/json');
	
	// Send response
	res.end(JSON.stringify(status));
	
})

// Diagnostics tree end-point
rest.get('/rest/diagnostics/tree', function(req, res) {
	
	// Get diagnostic status
	var tree = diagnostics.getTree();

	// Set response header
	res.setHeader('content-type', 'application/json');
	
	// Send response
	res.end(JSON.stringify(tree));
	
})

// Map data end-point
rest.get('/rest/map/data', function(req, res) {
	
	map.onceMapReceived(function(mapData) {
		
		// Set response header
		res.setHeader('content-type', 'application/json');
		
		// Send response
		res.end(JSON.stringify(mapData));
		
	});
	
})

// Map pose end-point
rest.get('/rest/map/pose', function(req, res) {
	
	map.onPoseReceived(function(pose) {
		
		// Set response header
		res.setHeader('content-type', 'application/json');
		
		// Send response
		res.end(JSON.stringify(pose));
		
	});
	
})

// Map png end-point
rest.get('/rest/map/png/:id', function(req, res) {
	
	// Get map
	var mapPng = map.getMap(req.params.id);
		
	// Set response header
	res.setHeader('content-type', 'image/png');
		
	// Send as response
	mapPng.pack().pipe(res);
	
})

// Map goal end-point
rest.post('/rest/map/goal', function(req, res) {
	
	// Set goal
	map.goal(req.body);
	
	// End request
	res.end();
	
})

// Static resources
rest.use(serveStatic(__dirname + '/static/', {'index': ['teleop.html']}));

// Start server
const server = rest.listen(8080, function () {

	// Get host and port
	var host = server.address().address;
	var port = server.address().port;
	
	// Log
	console.log("Listening at http://%s:%s", host, port);

})

