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

var LEVELS = [ "Ok", "Warning", "Error", "Stale" ];
var LEVELS_CLASS = [ "badge-success", "badge-warning", "badge-danger", "badge-primary" ];

function updateDiagnosticsStatus() {

	// Invoke diagnostics end point
	invokeDiagnosticEndPoint();

}

function updateDiagnosticsTable(diagnosticsTree) {

	// Get table body		
	var tableBody = document.getElementById("diagnostics");

	// Clear table content
	tableBody.innerHTML = "";

	// Add root
	addDiagnosticsTreeElement(tableBody, 0, diagnosticsTree);

}

function addDiagnosticsTreeElement(tableBody, index, treeElement) {
	
	if (treeElement.status != undefined) {

		// Create row
		var statusRow = document.createElement("tr");

		// Create cells
		var nameCell = document.createElement("td");
		var statusCell = document.createElement("td");
		var linkCell = document.createElement("td");

		// Create span
		var statusSpan = document.createElement("span");

		// Create text nodes
		var nameTextNode = document.createTextNode(treeElement.name);
		var statusTextNode = document.createTextNode(LEVELS[treeElement.status.level]);

		// Create link
		var link = document.createElement("a");
		link.innerHTML = "<span class='badge badge-pill badge-primary'>?</span>"
		link.href = "/diagnostics-details.html?name=" + treeElement.status.name;
		
		// Apply class style
		nameCell.classList.add("left");
		statusSpan.classList.add("badge");
		statusSpan.classList.add(LEVELS_CLASS[treeElement.status.level]);

		// Apply style
		nameCell.style.paddingLeft = 20 * index + "px";
		
		// Append to html
		nameCell.appendChild(nameTextNode);	
		statusSpan.appendChild(statusTextNode);
		statusCell.appendChild(statusSpan);
		linkCell.appendChild(link);
		statusRow.appendChild(nameCell);
		statusRow.appendChild(statusCell);
		statusRow.appendChild(linkCell);
		tableBody.appendChild(statusRow);

	}

	for (var child in treeElement.children) {

		// Add child
		addDiagnosticsTreeElement(tableBody, index + 1, treeElement.children[child]);

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
			updateDiagnosticsTable(diagnosticsTree);

		}

	};

	// Open and send
	xhttp.open("GET", "/rest/diagnostics/tree", true);
	xhttp.send();

}

function init() {
	
	// Set update diagnostics interval
	setInterval(updateDiagnosticsStatus, 1000);
	
}
