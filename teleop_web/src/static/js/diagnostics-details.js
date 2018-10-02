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

function updateDiagnosticsTable(diagnosticsTree) {
	
	// Update diagnostic name and message
	$("#diagnostics-name").text(diagnosticsTree.name);
	$("#diagnostics-message").text(diagnosticsTree.status.message);
	
	// Get table body		
	var tableBody = $("#diagnostics-values")

	// Clear table content
	tableBody.empty();

	for (var index in diagnosticsTree.status.values) {
		
		// Append detail row
		tableBody.append(
				$("<tr>")
					.append($("<td>")
							.addClass("left")
							.text(diagnosticsTree.status.values[index].key))
					.append($("<td>")
							.text(diagnosticsTree.status.values[index].value)));
				
	}

}

function updateDiagnosticsDetails() {

	// Ask for diagnostics details
	$.ajax({
		cache: false,
		url: "/rest/diagnostics/tree/name/" + name,
		type: "GET",
		success: updateDiagnosticsTable
	});

}

function init() {
	
	// Get status name
	name = window.location.search.substring(1);
	
	// Set update diagnostics interval
	setInterval(updateDiagnosticsDetails, 1000);
	
}
