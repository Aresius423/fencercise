class SystemData {
	constructor(rawData){
		let jsData = JSON.parse(rawData)
		
		this.system = jsData["system"]
		this.techniques = jsData["techniques"]
		this.exercises = jsData["exercises"]
		
		this.activeExercise = null
		this.exerciseStep = 0
	}
	
	loadExercise(exercise){
		this.activeExercise = exercise
		this.exerciseStep = 0
	}
}