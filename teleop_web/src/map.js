/*
 map.js

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
const png = require('node-png');
const EventEmitter = require('events');
const rosnodejs = require('rosnodejs');
const geometry_msgs = rosnodejs.require('geometry_msgs').msg;

module.exports = {
	init: function (nodeHandle) {
		
		// Get free threshold
		nodeHandle.getParam('teleop_web/free_threshold')
			.then(function(_freeThreshold) {

				// Set free threshold
				freeThreshold = _freeThreshold;

				// Log
				console.log("Free threshold set to %d%", freeThreshold);

			})
			.catch(function(reason) {});
		
		// Get map frame
		nodeHandle.getParam('teleop_web/map_frame_id')
			.then(function(_mapFrameId) {

				// Set map frame id
				mapFrameId = _mapFrameId;

				// Log
				console.log("Map frame id set to %s%", mapFrameId);

			})
			.catch(function(reason) {});
				
		// Create subscriber
		const mapSubscriber = nodeHandle.subscribe(
				'map',
				'nav_msgs/OccupancyGrid', 
				updateMap,
				{
					queueSize: 10,
				    throttleMs: 1000
			    });
		
		// Create subscriber
		const poseSubscriber = nodeHandle.subscribe(
				'robot_pose',
				'geometry_msgs/PoseStamped', 
				updatePose,
				{
					queueSize: 10,
				    throttleMs: 1000
			    });
		
		// The goal publisher
		goalPublisher = nodeHandle.advertise('/goal', geometry_msgs.PoseStamped);
		
	},
	onceMapReceived: function (callback) {
		
		// Add callback to map received event
		emitter.once("map-received", callback)
		
	},
	onPoseReceived: function (callback) {
		
		// Add callback to pose received event
		emitter.once("pose-received", callback)
		
	},
	getMap: function (id) {
		
		// Get map from history
		return mapHistory[id];
		
	},
	goal: function (targetPose) {
		
		// The goal message
		const goalMessage = new geometry_msgs.PoseStamped();
		goalMessage.header.stamp.sec = Math.floor(new Date() / 1000);
		goalMessage.header.frame_id = mapFrameId;
		goalMessage.pose.position.x = targetPose.x;
		goalMessage.pose.position.y = targetPose.y;
		goalMessage.pose.orientation.z = Math.sin(targetPose.orientation/2);
		goalMessage.pose.orientation.w = Math.cos(targetPose.orientation/2);
		
		// Publish goal
		goalPublisher.publish(goalMessage);
		
	}
	
}

//The goal publisher
let goalPublisher;

// The free threshold
var freeThreshold = 50;

// The map frame id
var mapFrameId = "map";

// The event emitter
const emitter = new EventEmitter();

// The map index
var mapIndex = 0;

// The map history
var mapHistory = [];

// The map history size
const mapHistorySize = 5;

const updateMap = function (occupancyGrid) {
	
	// Get map size
	var width = occupancyGrid.info.width;
	var height = occupancyGrid.info.height;
	
	// Create map
	var map = new png.PNG({
		width: width,
		height: height
	});
	
	// Fill with white color
	map.data.fill(0);
	
	for (var x = 0; x < width; x++) {
	
		for (var y = 0; y < height; y++) {
			
			// Get probability cell is occupied
			var occupancyProbability = occupancyGrid.data[y * width + x];
			
			if (occupancyProbability == -1) {
				
				// If status is unknown leave cell unchanged
				continue;
				
			}
	
			// Get cell index in png
			var index = 4 * (y * width + width - x);
			
			if (occupancyProbability < freeThreshold) {
				
				// Mark as free
				map.data[index] = 100;
				map.data[index + 1] = 100;
				map.data[index + 2] = 100;
				map.data[index + 3] = 255;
				
			} else {

				// Mark as occupied
				map.data[index] = 0;
				map.data[index + 1] = 0;
				map.data[index + 2] = 0;
				map.data[index + 3] = 255;
				
			}
			
		}
		
	}
	
	// Store map image into history
    mapHistory[mapIndex] = map;
	
	// Create map data
	var mapData = {
		id: mapIndex,
		width: occupancyGrid.info.width,
		height: occupancyGrid.info.height,
		resolution: occupancyGrid.info.resolution,
		origin: {
			x: occupancyGrid.info.origin.position.x,
			y: occupancyGrid.info.origin.position.y
		}
	};
	
	// Increase map index
	if (++mapIndex > mapHistorySize) {
		
		// Reset map index
		mapIndex = 0;
		
	}
	
	
	// Emit map received event
	emitter.emit("map-received", mapData);
	
}

const updatePose = function (poseStamped) {
	
	// Convert quaterion to euler
	var yaw = Math.atan2(2 * poseStamped.pose.orientation.w * poseStamped.pose.orientation.z,
			1 - 2 * poseStamped.pose.orientation.z * poseStamped.pose.orientation.z);
	
	// Create pose euler
	var poseEuler = {
			x: poseStamped.pose.position.x,
			y: poseStamped.pose.position.y,
			orientation: yaw
	}
	
	// Emit map received event
	emitter.emit("pose-received", poseEuler);
	
}