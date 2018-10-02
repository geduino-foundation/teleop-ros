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

function updateMap() {

	// Ask for map data
	$.ajax({
		cache: false,
		url: "/rest/map/data",
		type: "GET",
		success: function (mapData) {
			
			// Get map
			var map = $("#map");
			
			// Update map image source
			map.attr("src", "/rest/map/png/" + mapData.id + "?t=" + new Date().getTime());
			
			// Store map data
			map.data("data", mapData);
			
			// Set update map timeout
			setTimeout(updateMap, 250);
						
		}
	
	});

}

function updatePose() {

	// Ask for pose
	$.ajax({
		cache: false,
		url: "/rest/map/pose",
		type: "GET",
		success: function (pose) {
			
			// Get map
			var map = $("#map");
			
			// Get map data
			var mapData = map.data().data;
			
			if (mapData != undefined) {
				
				// Get relative position
				var xr = 1 - (pose.x - mapData.origin.x) / (mapData.width * mapData.resolution);
				var yr = (pose.y - mapData.origin.y) / (mapData.height * mapData.resolution);
				
				// Get pose img
				var poseImg = $("#pose");
				
				var orientation = -(pose.orientation + Math.PI);
				
				var width = 50 * (Math.abs(Math.cos(orientation)) +
					Math.abs(Math.sin(orientation)));
				var height = 50 * (Math.abs(Math.sin(orientation)) +
					Math.abs(Math.cos(orientation)));
				
				poseImg.show();
				poseImg.offset({
					left: map.offset().left + map.width() * xr - width  / 2,
					top: map.offset().top + map.height() * yr  - height / 2
				});
				poseImg.css({
                    "-webkit-transform": "rotate(" + orientation + "rad)",
                    "-moz-transform": "rotate(" + orientation + "rad)",
                    "-ms-transform": "rotate(" + orientation + "rad)",
                    "-o-transform": "rotate(" + orientation + "rad)",
                    "transform": "rotate(" + orientation + "rad)"
				});
				
			}
			
			// Set update map timeout
			setTimeout(updatePose, 250);
						
		}
	
	});

}

function sendTargetPose(targetPose) {
	
	// Send command
	$.ajax({
		cache: false,
		url: "/rest/map/goal",
		type: "POST",
		data: JSON.stringify(targetPose),
		contentType: "application/json",
	    dataType: "json"
	});
		
}

function init() {
	
	// Update map first time
	updateMap();

	// Update pose first time
	updatePose();
		
	// Joystick options
	var options = {
		zone : document.getElementById("joystick")
	};

	// Create joystick manager
	var manager = nipplejs.create(options);

	// Add events
	manager.on("added", function(evt, nipple) {

		nipple.on("start move end", function(evt, data) {

			if (evt.type == "start") {
				
				// Get joystick zone
				var zone = $(data.options.zone);
				
				// Get map data
				var mapData = $("#map").data().data;
				
				// Get relative position
				var xr = (evt.target.position.x - zone.offset().left) / zone.width();
				var yr = (evt.target.position.y - zone.offset().top) / zone.height();
				
				// Set goal position
				evt.target.goal = {
					x: mapData.origin.x + (1 - xr) * mapData.width * mapData.resolution,
					y: yr * mapData.height * mapData.resolution + mapData.origin.y,
					orientation: 0
				}

			} else if (evt.type == "move") {

				// Set goal orientation
				evt.target.goal.orientation = data.angle.radian - Math.PI;
				
			} else if (evt.type == "end") {
				
				// Send target pose
				sendTargetPose(evt.target.goal);

			}

		});

	}).on("removed", function(evt, nipple) {

		// Remove all events
		nipple.off("start move end");

	});
	
}