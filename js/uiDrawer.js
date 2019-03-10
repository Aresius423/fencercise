class UiDrawer{
	static listSystems(){
		let systemList = systems.reduce((acc,cur) => 
			acc + `<li><a onclick="loadData('${cur[Object.keys(cur)[0]]}')" href="#">${Object.keys(cur)[0]}</a></li>\n`
			,"")
			
		document.getElementById("syspick").innerHTML = tagwrap("ul", systemList)
	}

	static listExercises(system){
		let indexedExercises = system.exercises.map(function(exercise, index){
			return `<li><a onclick="loadedSystem.loadExercise(${index})" href="#">${exercise.name}</a></li>`
		})
		
		document.getElementById("exercisepick").innerHTML = tagwrap("ul", indexedExercises.join('\n'))
	}
}