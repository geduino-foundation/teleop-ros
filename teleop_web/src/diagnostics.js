/*
 deiagnostics.js

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

module.exports = {
	init: function (_nodeHandle) {
		
		// Create subscriber
		const diagnosticsSubscriber = _nodeHandle.subscribe('/diagnostics_agg', 'diagnostic_msgs/DiagnosticArray', function (diagnosticsArray) {
			
			// Update diagnostics tree
			updateDiagnosticsTree(diagnosticsArray);
			
			// Update status
			updateDiagnosticsStatus(diagnosticsArray);
			
		}, {
			queueSize: 10,
		    throttleMs: 1000
	    });
		
	},
	getTree: function () {
		return tree;
	},
	getTreeByName: function (name) {
		
		// Get path tokens
		var pathTokens = name.split("/");
		
		// Set pointer to root of diagnostics tree
		var treePtr = tree;
		
		for (var index in pathTokens) {
			
			// Ignore empty tokens
			if (pathTokens[index] != "") {
				
				if (treePtr.children[pathTokens[index]] != undefined) {
					
					// Set pointer
					treePtr = treePtr.children[pathTokens[index]];
					
				}
				
			}
			
		}
		
		return treePtr;
		
	},
	getStatus: function () {
		return status;
	}
}

// The diagnostic tree
var tree = {
		children: {}
}

// The global status
var status = {
		level: 3,
		ok: 0,
		warn: 0,
		error: 0,
		stale: 0
}

const updateDiagnosticsTree = function (diagnosticsArray) {
	
	// Update diagnostics map. This is needed if diagnostics are noy synchronized. 
	diagnosticsArray.status.forEach(addToDiagnosticsTree);
	
}

const addToDiagnosticsTree = function (diagnosticsStatus) {
	
	// Get name
	var name = diagnosticsStatus.name;
	
	// Get path tokens
	var pathTokens = name.split("/");
	
	// Set pointer to root of diagnostics tree
	var treePtr = tree;
	
	for (var index in pathTokens) {
		
		// Ignore empty tokens
		if (pathTokens[index] != "") {
			
			if (treePtr.children[pathTokens[index]] == undefined) {
				
				// Create level if not exists
				treePtr.children[pathTokens[index]] = {
						name : pathTokens[index],
						children : {}
				};
				
			}
			
			// Set pointer
			treePtr = treePtr.children[pathTokens[index]];
			
		}
		
	}
	
	// Add status
	treePtr.status = diagnosticsStatus;
	
	
}

const updateDiagnosticsStatus = function (diagnosticsArray) {
	
	// Reset status
	status.ok = 0;
	status.warn = 0;
	status.error = 0;
	status.stale = 0;
	
	diagnosticsArray.status.forEach(function (diagnosticsStatus) {
		
		switch (diagnosticsStatus.level) {
		
		case 0:
			
			// Increase oks
			status.ok++;
			
			break;
			
		case 1:
			
			// Increase warns
			status.warn++;
			
			break;
			
		case 2:
			
			// Increase errors
			status.error++;
			
			break;
			
		case 3:
			
			// Increase stales
			status.stale++;
			
			break;
			
		default:
			
			// Log
			console.log("Unknow status level for %s: %d", key, diagnosticsMap[key].level);
		
		}
		
	});
	
	if (status.stale.length > 0) {
		
		// Set status level
		status.level = 3;
		
	} else if (status.error.length > 0) {
		
		// Set status level
		status.level = 2;
		
	} else if (status.warn.length > 0) {
		
		// Set status level
		status.level = 1;
		
	} else {
		
		// Set status level
		status.level = 0;
		
	}
	
}