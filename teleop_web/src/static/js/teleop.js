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

function sendTeleopCommand(cmd) {

	// Send command
	$.ajax({
		cache: false,
		url: "/rest/teleop/" + cmd,
		type: "POST"
	});
	
}

function updateDiagnosticsStatus() {

	// Ask for diagnostic status
	$.ajax({
		cache: false,
		url: "/rest/diagnostics/status",
		type: "GET",
		success: function (diagnosticsStatus) {
			
			// Update view
			$("#diagnostics_ok_cell").text(diagnosticsStatus.ok);
			$("#diagnostics_warn_cell").text(diagnosticsStatus.warn);
			$("#diagnostics_error_cell").text(diagnosticsStatus.error);
			$("#diagnostics_stale_cell").text(diagnosticsStatus.stale);
			
		}
	});

}

function init() {
	
	// Set update diagnostics interval
	setInterval(updateDiagnosticsStatus, 1000);

	// Joystick options
	var options = {
		zone : document.getElementById("joystick")
	};

	// Create joystick manager
	var manager = nipplejs.create(options);

	// Add events
	manager.on("added", function(evt, nipple) {

		nipple.on("move end", function(evt) {

			if (evt.type == "move") {

				if (evt.target.direction != undefined) {

					if (evt.target.direction.angle == "up") {

						// Move forward
						sendTeleopCommand("forward");
					
					} else if (evt.target.direction.angle == "left") {
	
						// Rotate left
						sendTeleopCommand("left");
						
					} else if (evt.target.direction.angle == "down") {
	
						// Move back
						sendTeleopCommand("back");
						
					} else if (evt.target.direction.angle == "right") {
	
						// Rotate right
						sendTeleopCommand("right");
						
					}
				
				}

			} else if (evt.type == "end") {

				// Stop
				sendTeleopCommand("stop");

			}

		});

	}).on('removed', function(evt, nipple) {

		// Remove all events
		nipple.off("start move end dir plain");

	});

}