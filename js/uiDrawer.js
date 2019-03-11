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
	
	static drawControls(){
		document.getElementById("controlbox").innerHTML = '<br><br>' + 
			'<input id="resetbutton" type="button" value="reset" onclick="loadedSystem.initExercise();" disabled />' +
			'<input id="previousbutton" type="button" value="previous step" onclick="loadedSystem.unstepExercise();" disabled />' +
			'<input id="nextbutton" type="button" value="next step" onclick="loadedSystem.stepExercise();" disabled />'
	}
	
	static attachResetEvent(func){
		document.getElementById("resetbutton").addEventListener("click", func)
	}
	
	static attachPreviousEvent(func){
		document.getElementById("previousbutton").addEventListener("click", func)
	}
	
	static attachNextEvent(func){
		document.getElementById("nextbutton").addEventListener("click", func)
	}
}