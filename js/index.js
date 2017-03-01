
var connectedstate = document.getElementById("connectedstate");
var robotstate = document.getElementById("robotstate");
var robotaddress = document.getElementById("robotAddress");
var header = document.getElementById("header");
var cameracell = document.getElementById("camera-cell");
var cameravalue = document.getElementById("camera-value");
var processvalue = document.getElementById("process-value");
var turnvalue = document.getElementById("turn-value");
var lower_red = document.getElementById("lower_red");
var upper_red = document.getElementById("upper_red");
var lower_blue = document.getElementById("lower_blue");
var upper_blue = document.getElementById("upper_blue");
var lower_green = document.getElementById("lower_green");
var upper_green = document.getElementById("upper_green");

//$("#red-slider").slider({max: 255, min: 0, range: true});
//$("#blue-slider").slider({max: 255, min: 0, range: true});
//$("#green-slider").slider({max: 255, min: 0, range: true});

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


NetworkTables.addKeyListener("/RaspberryPi/turn", function(key, value, isNew){
  turnvalue.innerHTML = parseFloat(value, 10).toFixed(5);
}, true);

NetworkTables.addKeyListener("/RaspberryPi/lower_red", function(key, value, isNew){
  lower_red.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/upper_red", function(key, value, isNew){
  upper_red.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/lower_blue", function(key, value, isNew){
  lower_blue.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/upper_blue", function(key, value, isNew){
  upper_blue.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/lower_green", function(key, value, isNew){
  lower_green.value = value;
}, true);

NetworkTables.addKeyListener("/RaspberryPi/upper_green", function(key, value, isNew){
  upper_green.value = value;
}, true);

lower_red.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/lower_red", parseFloat(lower_red.value, 10));
});

upper_red.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/upper_red", parseFloat(upper_red.value, 10));
});

lower_blue.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/lower_blue", parseFloat(lower_blue.value, 10));
});

upper_blue.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/upper_blue", parseFloat(upper_blue.value, 10));
});

lower_green.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/lower_green", parseFloat(lower_green.value, 10));
});

upper_green.addEventListener("input", function(e){
  NetworkTables.putValue("/RaspberryPi/upper_green", parseFloat(upper_green.value, 10));
});

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
