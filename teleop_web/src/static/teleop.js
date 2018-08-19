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

function moveForward() {

	// Invoke move forward endpoint
	invokeTeleopEndPoint("forward");

}

function moveBack() {

	// Invoke move back endpoint
	invokeTeleopEndPoint("back");

}

function rotateLeft() {

	// Invoke rotate left endpoint
	invokeTeleopEndPoint("left");

}

function rotateRight() {

	// Invoke rotate right endpoint
	invokeTeleopEndPoint("right");

}

function stop() {

	// Invoke stop endpoint
	invokeTeleopEndPoint("stop");

}

function invokeTeleopEndPoint(cmd) {

	setTimeout(function() {
		
		// Create request
		var xhttp = new XMLHttpRequest();
	
		// Open and send
		xhttp.open("POST", "/rest/teleop/" + cmd, true);
		xhttp.send();
	
	}, 0);

}

function updateDiagnosticsStatus() {

	// Create request
	var xhttp = new XMLHttpRequest();

	// Set on ready state change
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {

			// Parse diagnostics as json
			var diagnosticsStatus = JSON.parse(this.responseText);

			// Update view
			document.getElementById("diagnostics_ok_cell").innerHTML = diagnosticsStatus.ok;
			document.getElementById("diagnostics_warn_cell").innerHTML = diagnosticsStatus.warn;
			document.getElementById("diagnostics_error_cell").innerHTML = diagnosticsStatus.error;
			document.getElementById("diagnostics_stale_cell").innerHTML = diagnosticsStatus.stale;

		}

	};

	// Open and send
	xhttp.open("GET", "/rest/diagnostics/status", true);
	xhttp.send();

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
						moveForward();
					
					} else if (evt.target.direction.angle == "left") {
	
						// Rotate left
						rotateLeft();
						
					} else if (evt.target.direction.angle == "down") {
	
						// Move back
						moveBack();
						
					} else if (evt.target.direction.angle == "right") {
	
						// Rotate right
						rotateRight();
						
					}
				
				}

			} else if (evt.type == "end") {

				// Stop
				stop();

			}

		});

	}).on('removed', function(evt, nipple) {

		// Remove all events
		nipple.off("start move end dir plain");

	});

}