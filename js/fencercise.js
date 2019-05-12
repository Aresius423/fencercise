//todo: everything

const systems = [
					{"Lovag Arlow Gusztáv - Kardvívás (1902)":"arlow.json"},
					{"Your very own fencing system":"demo.json"}
				]

window.onload = function(){
	UiDrawer.listSystems(systems)
}

var loadData = function(filename, exercise=null){
	//todo: implement bookmarkable/reloadable states
	//parameter(s) in URL intentionally passed as fragment identifier - Web Server for Chrome doesn't support parameters,
	//and until this feature is implemented, switching to a proper server is not warranted.
	window.history.pushState('loadedpage', null, `index.html#lf=${filename}${exercise?"#ex="+encodeURI(exercise):""}`)
	
	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function(){
	  if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
		parseData(xmlhttp.responseText, exercise)
		}
	}
	xmlhttp.open("GET",`data/${filename}`,true)
	xmlhttp.overrideMimeType('text/xml; charset=utf-8')
	xmlhttp.send()
}

var parseData = function(data, exercise=null){
	let newSystem = new SystemData(data)
	let systemController = new SystemController(newSystem)
	let simpleViewDrawer = new SimpleViewDrawer(systemController)
	
	newSystem.subscribe(simpleViewDrawer)
	
	UiDrawer.listExercises(newSystem)
}