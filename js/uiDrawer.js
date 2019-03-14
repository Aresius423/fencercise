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
	
	static drawControls(listener){
		document.getElementById("controlbox").innerHTML = '<br><br>' + 
			'<input id="previousbutton" type="button" value="\u2190" disabled />' +
			'<input id="stageslider" type="range" class="stageslider" min="-1" onkeydown="return false"/>' +
			'<input id="nextbutton" type="button" value="\u2192" disabled />'
			
		document.getElementById("previousbutton").addEventListener("click", listener)
		document.getElementById("nextbutton").addEventListener("click", listener)
		document.getElementById("stageslider").addEventListener("input", listener)
	}
	
	static setupSlider(range){
		document.getElementById("stageslider").max = range-1
	}
	
	static moveSlider(value){
		document.getElementById("stageslider").value = value
	}
	
	static subscribeKeydown(listener){
		document.addEventListener("keydown", listener)
	}
	
	static unsubscribeKeydown(listener){
		document.removeEventListener("keydown", listener)
	}
}