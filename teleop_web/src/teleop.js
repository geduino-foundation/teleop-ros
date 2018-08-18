const rosnodejs = require('rosnodejs');
const geometry_msgs = rosnodejs.require('geometry_msgs').msg;

module.exports = {
	init: function (_nodeHandle) {
		
		// Set node handle
		nodeHandle = _nodeHandle;
		
		// Get linear speed
		nodeHandle.getParam('~/linear')
			.then(function (_linear) {
				
				// Set linear
				linear = _linear;
				
				// Log
				console.log("Linear speed set to %d m/s", linear);
				
		    })
		    .catch(function (reason) {
		    	
		    	// Log
		    	console.log('Unable to get param for linear speed: %s', reason);
		    	
		    });

		// Get angular speed
		nodeHandle.getParam('~/angular')
			.then(function (_angular) {
				
				// Set angular
				angular = _angular;
				
				// Log
				console.log("Angular speed set to %d rad/s", angular);
				
		    })
		    .catch(function (reason) {
		    	
		    	// Log
		    	console.log('Unable to get param for angular speed: %s', reason);
		    	
		    });

		// The cmd_vel publisher
		cmdVelPublisher = nodeHandle.advertise('/cmd_vel', geometry_msgs.Twist);
		
	},
	forward: function () {
	    
		// Log
		console.log('Move forward...');
		
		// Move forward
		cmdVelMessage.linear.x = linear;
		cmdVelMessage.angular.z = 0;
		
		// Publish
		cmdVelPublisher.publish(cmdVelMessage);
		
	},
	back: function () {
		
		// Log
		console.log('Move backward...');
	
		// Move backward
		cmdVelMessage.linear.x = -linear;
		cmdVelMessage.angular.z = 0;
		
		// Publish
		cmdVelPublisher.publish(cmdVelMessage);
				
	},
	left: function () {
		
		// Log
		console.log('Rotate left...');
	
		// Rotate left
		cmdVelMessage.angular.z = angular;
		
		// Publish
		cmdVelPublisher.publish(cmdVelMessage);
				
	},
	right: function () {
		
		// Log
		console.log('Rotate right...');
	
		// Rotate right
		cmdVelMessage.angular.z = -angular;
		
		// Publish
		cmdVelPublisher.publish(cmdVelMessage);
				
	},
	stop: function () {
		
		// Log
		console.log('Stop!');
	
		// Stop
		cmdVelMessage.linear.x = 0;
		cmdVelMessage.angular.z = 0;
		
		// Publish
		cmdVelPublisher.publish(cmdVelMessage);
		
	}
};

// The node handle
var nodeHandle;

// Default speeds
var linear = 0.1;
var angular = 0.52;

// The cmd_vel publisher
let cmdVelPublisher;

// The cmd_vel message
const cmdVelMessage = new geometry_msgs.Twist();
