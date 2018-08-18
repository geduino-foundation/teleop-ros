module.exports = {
	init: function (_nodeHandle) {
		
		// Create subscriber
		const diagnosticsSubscriber = _nodeHandle.subscribe('/diagnostics', 'diagnostic_msgs/DiagnosticArray', function (diagnosticsArray) {
			
			// Update diagnostics map
			updateDiagnosticsMap(diagnosticsArray);
			
			// Update status
			updateStatus();
			
		}, {
			queueSize: 10,
		    throttleMs: 1000
	    });
		
	},
	getStatus: function () {
		return status;
	}
}

// The diagnostic map
var diagnosticsMap = {}

// The diagnostics status
var status = {
		level: 3,
		ok: [],
		warn: [],
		error: [],
		stale: []
};

const updateDiagnosticsMap = function (diagnosticsArray) {
	
	// Update diagnostics map. This is needed if diagnostics are noy synchronized. 
	diagnosticsArray.status.forEach(function(diagnosticStatus) {

		// Put on map using name as key
		diagnosticsMap[diagnosticStatus.name] = diagnosticStatus;
		
	});
				
}

const updateStatus = function () {
	
	// Reset status
	status.ok.length = 0;
	status.warn.length = 0;
	status.error.length = 0;
	status.stale.length = 0;

	for (var key in diagnosticsMap) {
		
		// Create status value
		var statusValue = {
				'name' : key,
				'message' : diagnosticsMap[key].message
		}
		
		switch (diagnosticsMap[key].level) {
			
		case 0:
			
			// Add to oks
			status.ok.push(statusValue);
			
			break;
			
		case 1:
			
			// Add to warns
			status.warn.push(statusValue);
			
			break;
			
		case 2:
			
			// Add to errors
			status.errors.push(statusValue);
			
			break;
			
		case 3:
			
			// Add to stales
			status.stale.push(statusValue);
			
			break;
			
		default:
			
			// Log
			console.log("Unknow status level for %s: %d", key, diagnosticsMap[key].level);
		
		}
		
	}
	
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