
var connectedstate = document.getElementById("connectedstate");
var robotstate = document.getElementById("robotstate");
var robotaddress = document.getElementById("robotAddress");
var header = document.getElementById("header");
var cameracell = document.getElementById("camera-cell");
var cameravalue = document.getElementById("camera-value");
var processvalue = document.getElementById("process-value");
var turnvalue = document.getElementById("turn-value");

console.log("Starting");
// sets a function that will be called when the websocket connects/disconnects
NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);

// sets a function that will be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

NetworkTables.addKeyListener("/RaspberryPi/lock", function(key, value, isNew){
  cameracell.style.backgroundColor = value ? 'green' : 'white';
}, true);

NetworkTables.addKeyListener("/RaspberryPi/camera", function(key, value, isNew){
  cameravalue.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/process", function(key, value, isNew){
  processvalue.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/turn", function(key, value, isNew){
  turnvalue.innerHTML = parseFloat(value, 10).toFixed(5);
}, true);

cameravalue.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/camera", parseInt(cameravalue.value, 10));
});

processvalue.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/process", parseInt(processvalue.value, 10));
});

function onRobotConnection(connected) {
	robotstate.innerHTML = connected ? "Connected!" : "Disconnected";
	robotaddress.innerHTML = connected ? NetworkTables.getRobotAddress() : "disconnected";
  header.style.backgroundColor =  connected ? "green" : "red";
}

function onNetworkTablesConnection(connected) {
	if (connected) {
		connectstate.innerHTML = "Connected!";
	} else {
		connectstate.innerHTML = "Disconnected!";
	}
}

function onValueChanged(key, value, isNew) {
	// key thing here: we're using the various NetworkTable keys as
	// the id of the elements that we're appending, for simplicity. However,
	// the key names aren't always valid HTML identifiers, so we use
	// the NetworkTables.keyToId() function to convert them appropriately
	if (isNew && (key.startsWith("/RaspberryPi") || key.startsWith("/SmartDashboard"))) {
		var tr = $('<tr></tr>').appendTo($('#nt > tbody:last'));
		$('<td></td>').text(key).appendTo(tr);
		$('<td></td>').attr('id', NetworkTables.keyToId(key))
					   .text(value)
					   .appendTo(tr);
	} else {
	
		// similarly, use keySelector to convert the key to a valid jQuery
		// selector. This should work for class names also, not just for ids
		$('#' + NetworkTables.keySelector(key)).text(value);
	}
}
