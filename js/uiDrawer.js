class UiDrawer{
	static listSystems(sysList){
		let systemDomList = sysList.reduce((acc,cur) => 
			acc + `<li><a onclick="loadData('${cur[Object.keys(cur)[0]]}')" href="#">${Object.keys(cur)[0]}</a></li>\n`
			,"")
			
		document.getElementById("syspick").innerHTML = tagwrap("ul", systemDomList)
	}

	static listExercises(system){
		let indexedExercises = system.exercises.map(function(exercise, index){
			return `<li><button id="exercise-${index}-button" class="link">${exercise.name}</button></li>`
		})
		
		document.getElementById("exercisepick").innerHTML = tagwrap("ul", indexedExercises.join('\n'))
		
		indexedExercises.forEach(function(_, index){
			document
				.getElementById(`exercise-${index}-button`)
				.addEventListener("click", function(){return system.loadExercise(index)})
		})
	}
	
	static drawControls(listener = null){
		document.getElementById("controlbox").innerHTML = '<br><br>' + 
			'<input id="resetbutton" type="button" value="reset" disabled />' +
			'<input id="previousbutton" type="button" value="previous step" disabled />' +
			'<input id="nextbutton" type="button" value="next step" disabled />'
			
		if(listener){
			document.getElementById("resetbutton").addEventListener("click", listener)
			document.getElementById("previousbutton").addEventListener("click", listener)
			document.getElementById("nextbutton").addEventListener("click", listener)
		}
	}
}