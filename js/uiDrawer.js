var listSystems = function(){
	return systems.reduce((acc,cur) => 
	acc + `<li><a onclick="loadData('${cur[Object.keys(cur)[0]]}')" href="#">${Object.keys(cur)[0]}</a></li>\n`
	,"")
}

var listExercises = function(exercises){
	let indexedExercises = exercises.map(function(name, index){
		return `<li><a onclick="loadedSystem.loadExercise(${index})" href="#">${name}</a></li>`
	})
	
	document.getElementById("exercisepick").innerHTML = tagwrap("ul", indexedExercises.join('\n'))
}