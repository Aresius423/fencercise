//todo: everything

const systems = [{"Lovag Arlow Gusztáv - Kardvívás (1902)":"arlow.json"}];
var loadedSystem = null
var systemDrawer = null

window.onload = function(){
document.getElementById("syspick").innerHTML = `<ul>${listSystems()}</ul>`
}

var listSystems = function(){
	return systems.reduce((acc,cur) => 
	acc + `<li><a onclick="loadData('${cur[Object.keys(cur)[0]]}')" href="#">${Object.keys(cur)[0]}</a></li>\n`
	,"")
}

var loadData = function(filename, exercise=null){
	//todo: implement bookmarkable/reloadable states
	//parameter(s) in URL intentionally passed as fragment identifier - Web Server for Chrome doesn't support parameters,
	//and until this feature is implemented, switching to a proper server is not warranted.
	window.history.pushState('loadedpage', null, `index.html#lf=${filename}${exercise?"#ex="+encodeURI(exercise):""}`);
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
	  if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
		parseData(xmlhttp.responseText, exercise);
		}
	};
	xmlhttp.open("GET",`data/${filename}`,true);
	xmlhttp.overrideMimeType('text/xml; charset=utf-8');
	xmlhttp.send();
}

var parseData = function(data, exercise=null){
	loadedSystem = new SystemData(data)
	systemDrawer = loadedSystem.instantiateDrawer()
	systemDrawer.drawViewFrames()
	systemDrawer.drawControls()
}