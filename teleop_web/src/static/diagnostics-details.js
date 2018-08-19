/*
 deiagnostics-detail.js

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

var name = "";

function updateDiagnosticsDetails() {

	// Invoke diagnostics end point
	invokeDiagnosticEndPoint();

}

function updateDiagnosticsInfo(diagnosticsTree) {

	// Update diagnostic name		
	document.getElementById("diagnostics-name").innerHTML = diagnosticsTree.name;
	
	// Update diagnostic message		
	document.getElementById("diagnostics-message").innerHTML = diagnosticsTree.status.message;

}

function updateDiagnosticsTable(diagnosticsTree) {

	// Get table body		
	var tableBody = document.getElementById("diagnostics-values");

	// Clear table content
	tableBody.innerHTML = "";

	for (var index in diagnosticsTree.status.values) {
		
		// Create row
		var valueRow = document.createElement("tr");

		// Create cells
		var keyCell = document.createElement("td");
		var valueCell = document.createElement("td");

		// Create text nodes
		var keyTextNode = document.createTextNode(diagnosticsTree.status.values[index].key);
		var valueTextNode = document.createTextNode(diagnosticsTree.status.values[index].value);

		// Apply class style
		keyCell.classList.add("left");
		
		// Append to html
		keyCell.appendChild(keyTextNode);	
		valueCell.appendChild(valueTextNode);
		valueRow.appendChild(keyCell);
		valueRow.appendChild(valueCell);
		tableBody.appendChild(valueRow);
				
	}

}

function invokeDiagnosticEndPoint() {

	// Create request
	var xhttp = new XMLHttpRequest();

	// Set on ready state change
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {

			// Parse diagnostics as json
			var diagnosticsTree = JSON.parse(this.responseText);

			// Update view
			updateDiagnosticsInfo(diagnosticsTree);
			updateDiagnosticsTable(diagnosticsTree);

		}

	};

	// Open and send
	xhttp.open("GET", "/rest/diagnostics/tree/name/" + name, true);
	xhttp.send();

}

function init() {
	
	// Get status name
	name = window.location.search.substring(1);
	
	// Set update diagnostics interval
	setInterval(updateDiagnosticsDetails, 1000);
	
}
