/*
 teleop.js

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

const rosnodejs = require('rosnodejs');
const geometry_msgs = rosnodejs.require('geometry_msgs').msg;

module.exports = {
	init : function(_nodeHandle) {

		// Set node handle
		nodeHandle = _nodeHandle;

		// Get linear speed
		nodeHandle.getParam('~/linear')
			.then(function(_linear) {

				// Set linear
				linear = _linear;

				// Log
				console.log("Linear speed set to %d m/s", linear);

			});

		// Get angular speed
		nodeHandle.getParam('~/angular')
			.then(function(_angular) {

				// Set angular
				angular = _angular;

				// Log
				console.log("Angular speed set to %d rad/s", angular);

			});

		// The cmd_vel publisher
		cmdVelPublisher = nodeHandle.advertise('/cmd_vel', geometry_msgs.Twist);

		// Set initialized to true
		initialized = true;

	},
	forward : function() {

		if (initialized) {

			// Log
			console.log('Move forward...');

			// Move forward
			cmdVelMessage.linear.x = linear;
			cmdVelMessage.angular.z = 0;

			// Publish
			cmdVelPublisher.publish(cmdVelMessage);

		} else {

			// Log
			console.log('Not yet connected to ROS');

		}

	},
	back : function() {

		if (initialized) {

			// Log
			console.log('Move backward...');

			// Move backward
			cmdVelMessage.linear.x = -linear;
			cmdVelMessage.angular.z = 0;

			// Publish
			cmdVelPublisher.publish(cmdVelMessage);

		} else {

			// Log
			console.log('Not yet connected to ROS');

		}

	},
	left : function() {

		if (initialized) {

			// Log
			console.log('Rotate left...');

			// Rotate left
			cmdVelMessage.angular.z = angular;

			// Publish
			cmdVelPublisher.publish(cmdVelMessage);

		} else {

			// Log
			console.log('Not yet connected to ROS');

		}

	},
	right : function() {

		if (initialized) {

			// Log
			console.log('Rotate right...');

			// Rotate right
			cmdVelMessage.angular.z = -angular;

			// Publish
			cmdVelPublisher.publish(cmdVelMessage);

		} else {

			// Log
			console.log('Not yet connected to ROS');

		}

	},
	stop : function() {

		if (initialized) {

			// Log
			console.log('Stop!');

			// Stop
			cmdVelMessage.linear.x = 0;
			cmdVelMessage.angular.z = 0;

			// Publish
			cmdVelPublisher.publish(cmdVelMessage);

		} else {

			// Log
			console.log('Not yet connected to ROS');

		}

	}
};

// The node handle
var nodeHandle;

// The initialized status
var initialized = false;

// Default speeds
var linear = 0.1;
var angular = 0.52;

// The cmd_vel publisher
let cmdVelPublisher;

// The cmd_vel message
const cmdVelMessage = new geometry_msgs.Twist();