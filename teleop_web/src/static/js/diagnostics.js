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

function updateDiagnosticsTreeTable(diagnosticsTree) {

	// Get diagnostics table body
	var diagnosticsTableBody = $("#diagnostics");
	
	// Empty table
	diagnosticsTableBody.empty();	

	// Add root
	addDiagnosticsTreeElement(diagnosticsTableBody, 0, diagnosticsTree);

}

function addDiagnosticsTreeElement(tableBody, index, treeElement) {
	
	if (treeElement.status != undefined) {
		
		// Append tree row
		tableBody.append(
			$("<tr>")
				.append($("<td>")
						.addClass("left")
						.text(treeElement.name)
						.css('padding-left', 20 * index + "px"))
				.append($("<td>")
						.append($("<span>")
								.addClass("badge")
								.addClass(LEVELS_CLASS[treeElement.status.level])
								.text(LEVELS[treeElement.status.level])))
				.append($("<td>")
						.append($("<a>")
								.attr("href", "/diagnostics-details.html?name=" + treeElement.status.name)
								.append($("<span>")
										.addClass("badge badge-pill badge-primary")
										.text("?")))));

	}

	for (var child in treeElement.children) {

		// Add child
		addDiagnosticsTreeElement(tableBody, index + 1, treeElement.children[child]);

	}

}

function updateDiagnosticsTree() {

	// Ask for diagnostics tree
	$.ajax({
		cache: false,
		url: "/rest/diagnostics/tree",
		type: "GET",
		success: updateDiagnosticsTreeTable
	});
	
}

function init() {
	
	// Set update diagnostics interval
	setInterval(updateDiagnosticsTree, 1000);
	
}
