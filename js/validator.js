var validateJson = function(systemData){
	let errors = []
	let techniqueNames = systemData.techniques.map(e => e.name)
	
	systemData.techniques.map(techniqueToInvokes).forEach(t => {
		t.actions.forEach(a => {
		if(!techniqueNames.includes(a)){
			errors = errors.concat(`Technique ${t.name} contains an error: technique ${a} doesn't exist.`)
		}
})})
	
	systemData.exercises.map(exerciseToInvokes).forEach(t => t.actions.forEach(a => {
		if(!techniqueNames.includes(a)){
			errors = errors.concat(`Exercise ${t.name} contains an error: technique ${a} doesn't exist.`)
		}
	}))

	return errors
}

var techniqueToInvokes = function(technique){
	invokes = []
	if(technique.invokes){
		invokes = technique.invokes
	}
	
	return {
		'name': technique.name,
		'actions': invokes,
	}
}

var exerciseToInvokes = function(exercise){
	actions = new Set()
	exercise.flow.forEach(f => {
		if(f.actions){
			actions = new Set([...actions, ...f.actions])
		}
	})
	
	return {
		'name': exercise.name,
		'actions': actions,
	}
}