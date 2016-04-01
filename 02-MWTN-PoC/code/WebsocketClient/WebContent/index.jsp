<!--  Copyright (c) 2016 Wipro Ltd. and others. All rights reserved. 
	
 This program and the accompanying materials are made available under the 
	
  terms of the Eclipse Public License v1.0 which accompanies this distribution,
	
 and is available at http://www.eclipse.org/legal/epl-v10.html -->

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>WTG WebsocketClient</title>
<style type="text/css">
#footer {
	clear: both;
	position: relative;
	z-index: 10;
	height: 3em;
	margin-top: -3em;
}
</style>
<script type="text/javascript">
	var ws;
	function WebSocketTest() {
		if ("WebSocket" in window) {

			// Let us open a web socket
			var api = document.getElementById('api').value;
			if (ws != null) {
				ws.close();
			}
			ws = new WebSocket(api);

			var jsonArray = new Array();
			var chkScopes = document.getElementsByName("scopes");
			for (var i = 0; i < chkScopes.length; i++) {
				var chkScope = chkScopes[i];
				if (chkScope.checked) {
					jsonArray[jsonArray.length] = chkScope.value;
				}
			}
			var jsondata = JSON.stringify({
				'data' : 'scopes',
				'scopes' : jsonArray
			})
			ws.onopen = function() {
				// Web Socket is connected, send data using send()
				ws.send(jsondata);
			};

			ws.onmessage = function(evt) {
				var received_msg = evt.data;
				var table = document.getElementById("tblnot");
				var rowCount = table.rows.length;
				var row = table.insertRow(rowCount);
				var cell1 = row.insertCell(0);
				cell1.innerHTML = '&nbsp; &nbsp;' + (rowCount);
				var cell2 = row.insertCell(1);
				var notfcolor ;
				if (received_msg.indexOf("connected") != -1) {
				}else if (received_msg.indexOf("disconnected") != -1) {
				}else if (received_msg.indexOf("ObjectCreationNotification") != -1) {
					notfcolor = "#F5DA81";
				}else if (received_msg.indexOf("ObjectDeletionNotification") != -1) {
					notfcolor = "#A9A9F5";
				}else if (received_msg.indexOf("AttributeValueChangedNotification") != -1) {
					notfcolor = "#9FF781";
				}else if (received_msg.indexOf("ProblemNotification") != -1) {
					notfcolor = "#FA5858";
				}
				cell2.style.backgroundColor = notfcolor;
				var htmlString = String(received_msg).replace(/&/g, '&amp;')
						.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(
								/"/g, '&quot;');
				cell2.innerHTML = '&nbsp; &nbsp;' + htmlString
						+ '&nbsp; &nbsp;';
			};

			ws.onclose = function() {
				// websocket is closed.
				var table = document.getElementById("tblnot");
				var rowCount = table.rows.length;
				var row = table.insertRow(rowCount);
				var cell1 = row.insertCell(0);
				cell1.innerHTML = '&nbsp; &nbsp;' + (rowCount);
				var cell2 = row.insertCell(1);
				cell2.innerHTML = '&nbsp; &nbsp; You are disconnected from the server &nbsp; &nbsp;';
			};
		}

		else {
			// The browser doesn't support WebSocket
			alert("WebSocket NOT supported by your Browser!");
		}
	}
</script>
</head>
<body>
	<br>
	<div align="center">
		<h2>Microwave Transport Notifications</h2>
		<br> Websocket api : <input type="text" id="api"
			value="ws://10.200.8.225:8085/websocket" size="35" /> <br> <br>
	</div>
	<br>
	<div align="center">

		<label style="background-color: #F5DA81; font-weight: bolder;"><input
			type="checkbox" id="chkcreation" name="scopes"
			value="ObjectCreationNotification"> &nbsp; Object Creation
			&nbsp; &nbsp; </label> &nbsp; &nbsp; <label
			style="background-color: #A9A9F5; font-weight: bolder;"><input
			type="checkbox" id="chkdeletion" name="scopes"
			value="ObjectDeletionNotification"> &nbsp; Object Deletion
			&nbsp; &nbsp; </label> &nbsp; &nbsp; <label
			style="background-color: #9FF781; font-weight: bolder;"><input
			type="checkbox" id="chkattrvalchange" name="scopes"
			value="AttributeValueChangedNotification"> &nbsp; Attribute
			Value Changed &nbsp; &nbsp; </label> &nbsp; &nbsp; <label
			style="background-color: #FA5858; font-weight: bolder;"><input
			type="checkbox" id="chkattrvalchange" name="scopes"
			value="ProblemNotification"> &nbsp; Problem Notification
			&nbsp; &nbsp; </label> &nbsp; &nbsp;

		<button style="font-weight: bolder;"
			onclick="javascript:WebSocketTest()">Subscribe</button>
	</div>
	<br>
	<div align="center">
		<table id="tblnot" border="2" width="95%">
			<tr style="font-size: 18px; font-weight: bold; color: blue; background: #F5D0A9">
				<td width="100px">&nbsp; &nbsp; Sl No:&nbsp; &nbsp;</td>
				<td>&nbsp; &nbsp; Notifications&nbsp; &nbsp;</td>
			</tr>
		</table>
	</div>
	<br>
	<br>
	<br>
	<div class="footer" ></div>
</body>
</html>
