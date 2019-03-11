class SystemController{
	constructor(system){
		this.system = system
	}
	
	requestReset(){
		this.system.initExercise()
	}
	
	requestPrevious(){
		this.system.unstepExercise()
	}
	
	requestNext(){
		this.system.stepExercise()
	}
}