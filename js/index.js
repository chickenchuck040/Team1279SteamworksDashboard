
var connectedstate = document.getElementById("connectedstate");
var robotstate = document.getElementById("robotstate");
var robotaddress = document.getElementById("robotAddress");

var header = document.getElementById("header");
var debugbtn = document.getElementById("debug-btn");
var notdebugbtn = document.getElementById("not-debug-btn");

var cameradiv = document.getElementById("camera-div");
var debugdiv = document.getElementById("debug-div");
var notdebugdiv = document.getElementById("not-debug-div");

var autoselect = document.getElementById("auto-select");

var cameravalue = document.getElementById("camera-value");
var processvalue = document.getElementById("process-value");
var turnvalue = document.getElementById("turn-value");

var clawdiv = document.getElementById("claw-div");
var clawstate = document.getElementById("claw-state");

var gearliftstate = document.getElementById("gearliftstate");
var liftup = document.getElementById("lift-up");
var liftdown = document.getElementById("lift-down");
var gearopen = document.getElementById("gear-open");
var gearclose = document.getElementById("gear-close");
var gearstate = document.getElementById("gear-state");
var gearimg = document.getElementById("gear-img");

var lower_red = document.getElementById("lower_red");
var upper_red = document.getElementById("upper_red");
var lower_blue = document.getElementById("lower_blue");
var upper_blue = document.getElementById("upper_blue");
var lower_green = document.getElementById("lower_green");
var upper_green = document.getElementById("upper_green");


console.log("Starting");

debugdiv.style.display = "none";
notdebugdiv.style.display = "inline-block";

debugbtn.addEventListener("click", function(e){
  debugdiv.style.display = "inline-block";
  notdebugdiv.style.display = "none";
});

notdebugbtn.addEventListener("click", function(e){
  debugdiv.style.display = "none";
  notdebugdiv.style.display = "inline-block";
});

  
// sets a function that will be called when the websocket connects/disconnects
NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// sets a function that will be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);



var smoothie = new SmoothieChart({
  minValue: 0,
  maxValue: 10
});
smoothie.streamTo(document.getElementById("current"));

var masterliftcurrentline = new TimeSeries({
  strokeStyle:'#0000ff'
});

var slaveliftcurrentline = new TimeSeries({
  strokeStyle:'#ff0000'
});

var clawcurrentline = new TimeSeries({
  strokeStyle:'#00ff00'
});


smoothie.addTimeSeries(masterliftcurrentline);
smoothie.addTimeSeries(slaveliftcurrentline);
smoothie.addTimeSeries(clawcurrentline);

NetworkTables.addKeyListener("/Robot/masterliftcurrent", function(key, value, isNew){
  masterliftcurrentline.append(new Date().getTime(), value);
}, true);

NetworkTables.addKeyListener("/Robot/slaveliftcurrent", function(key, value, isNew){
  slaveliftcurrentline.append(new Date().getTime(), value);
}, true);

NetworkTables.addKeyListener("/Robot/clawcurrent", function(key, value, isNew){
  clawcurrentline.append(new Date().getTime(), value);
}, true);

setInterval(function(){
  masterliftcurrentline.append(new Date().getTime(), NetworkTables.getValue("/Robot/masterliftcurrent"));
  slaveliftcurrentline.append(new Date().getTime(), NetworkTables.getValue("/Robot/slaveliftcurrent"));
  clawcurrentline.append(new Date().getTime(), NetworkTables.getValue("/Robot/clawcurrent"));
}, 500);



NetworkTables.addKeyListener("/RaspberryPi/lock", function(key, value, isNew){
  cameradiv.style.backgroundColor = value ? 'green' : 'white';
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


/*
NetworkTables.addKeyListener("/Robot/hasgear", function(key, value, isNew){
  clawdiv.style.backgroundColor = value ? 'green' : 'white';
}, true);

NetworkTables.addKeyListener("/Robot/clawstate", function(key, value, isNew){
  clawstate.innerHTML = value;
}, true);
*/


NetworkTables.putValue("/Robot/automode", autoselect.value);

autoselect.addEventListener("change", function(e){
  NetworkTables.putValue("/Robot/automode", autoselect.value);
});



NetworkTables.addKeyListener("/Robot/liftup", function(key, value, isNew){
  liftup.style.backgroundColor = value ? "green" : "grey";
}, true);


NetworkTables.addKeyListener("/Robot/liftdown", function(key, value, isNew){
  liftdown.style.backgroundColor = value ? "green" : "grey";
}, true);


NetworkTables.addKeyListener("/Robot/clawstate", function(key, value, isNew){
  if(value === "OPEN"){
    gearopen.style.backgroundColor = "green";
    gearclose.style.backgroundColor = "grey";
  }else if(value === "OPENING"){
    gearopen.style.backgroundColor = "yellow";
    gearclose.style.backgroundColor = "grey";
  }else if(value === "CLOSING"){
    gearopen.style.backgroundColor = "grey";
    gearclose.style.backgroundColor = "yellow";
  }else if(value === "GRABBING"){
    gearopen.style.backgroundColor = "grey";
    gearclose.style.backgroundColor = "green";
  }else if(value === "MISSED"){
    gearopen.style.backgroundColor = "grey";
    gearclose.style.backgroundColor = "grey";
  }else if(value === "STOPPED_OPENING"){
    gearopen.style.backgroundColor = "red";
    gearclose.style.backgroundColor = "grey";
  }else if(value === "STOPPED_CLOSING"){
    gearopen.style.backgroundColor = "grey";
    gearclose.style.backgroundColor = "red";
  }
}, true);

NetworkTables.addKeyListener("/Robot/gearswitch", function(key, value, isNew){
  gearstate.style.backgroundColor = value ? "green" : "grey";
}, true);

NetworkTables.addKeyListener("/Robot/hasgear", function(key, value, isNew){
  gearimg.style.display = value ? "block" : "none";
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
	if (isNew && (key.startsWith("/RaspberryPi") || key.startsWith("/SmartDashboard") || key.startsWith("/Robot"))) {
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
