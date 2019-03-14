class SystemController{
	constructor(system){
		this.system = system
	}
	
	requestSet(value){
		this.system.setExerciseStage(value)
	}
	
	requestPrevious(){
		this.system.unstepExercise()
	}
	
	requestNext(){
		this.system.stepExercise()
	}
}