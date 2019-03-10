class SystemData {
	constructor(rawData){
		let jsData = JSON.parse(rawData)
		
		this.system = jsData["system"]
		this.techniques = jsData["techniques"]
		this.exercises = jsData["exercises"]
		
		this.p0name = this.system.participants[0]
		this.p1name = this.system.participants[1]
		
		this.activeExercise = null
		this.exerciseStep = -1
		
		//this.traceback = {[this.p0name]: {}, [this.p1name]: {}}
		this.stepTrace = {[this.p0name]: {}, [this.p1name]: {}}
		this.systemDrawer = new SimpleViewDrawer(this.system.participants, this.system.bodyparts)
	}
	
	listExercises(){
		//pass the list of exercises to the drawer
		listExercises(this.exercises.map(e => e.name))
	}
	
	loadExercise(exerciseNumber){
		this.activeExercise = this.exercises[exerciseNumber]
		this.systemDrawer.updateExercise(this.activeExercise)
		this.initExercise()
	}
	
	setupActor(actorName){
		let action = this.activeExercise.init[actorName]
		if(action)
			this.performAction(actorName, action)
		
		return action?`${actorName}: ${action}<br>`:""
	}
	
	initExercise(){
		this.exerciseStep = -1
		this.stepTrace = {[this.p0name]: {}, [this.p1name]: {}}
		this.systemDrawer.clearViewFrames()
		this.updateProgress()
		
		let p0init = this.setupActor(this.p0name)
		let p1init = this.setupActor(this.p1name)
		let note = this.activeExercise.init["note"]
		let noteText = note?note:""
		
		this.systemDrawer.displayAction(`${p0init}${p1init}`)
		this.systemDrawer.displayNote(noteText)
	}
	
	unstepExercise(){
		this.setExerciseStage(this.exerciseStep-1)
	}
	
	stepExercise(){
		this.exerciseStep++
		this.stepTrace = {[this.p0name]: {}, [this.p1name]: {}}
		
		let currentStep = this.activeExercise.flow[this.exerciseStep]
		this.systemDrawer.displayNote(currentStep.note ? currentStep.note : "")
		this.systemDrawer.displayAction(`${currentStep.actor}: ${currentStep.actions.join(", ")}`)
		currentStep.actions.forEach(action => this.performAction(currentStep.actor, action))
		this.runAssertions(currentStep.actor, currentStep.assertions)
		
		this.updateProgress()
	}
	
	updateProgress(){
		this.systemDrawer.updateProgess(this.exerciseStep, this.activeExercise.flow.length)
	}
	
	setExerciseStage(exerciseStep){
		this.initExercise()
		while(this.exerciseStep != exerciseStep)
			this.stepExercise();
	}
	
	runAssertions(actor, assertions){
		//assertions are stronger than property changes implied by actions
		
		if(assertions){
			Object.keys(assertions).forEach(part => {
				this.systemDrawer.setPartValid(actor, part)
				this.systemDrawer.updatePart(actor, part, [assertions[part]], [`explicit: ${part} - ${assertions[part]}`])
			})
		}
	}
	
	performAction(actor, action, trace = []){
		console.log(`${actor} is performing ${action}`)
		let actionItem = this.techniques.find(t => t.name === action)
		if(actionItem){			
			if(actionItem.assertions){
				Object.keys(actionItem.assertions).forEach(part => {
					if(this.stepTrace[actor][part]) {
						//this part has been updated in this step - check for discrepancy
						if(!this.stepTrace[actor][part].includes(actionItem.assertions[part])){
							//discrepancy detected
							this.systemDrawer.setPartInvalid(actor, part)
							this.stepTrace[actor][part].push(actionItem.assertions[part])
						}
						
						this.stepTrace[actor][`${part}-trace`].push(trace.concat(action))
					}
					else {
						//everything is hunky-dory
						this.stepTrace[actor][part] = [actionItem.assertions[part]]
						this.stepTrace[actor][`${part}-trace`] = [trace.concat(action)]
						this.systemDrawer.setPartValid(actor, part)
					}
					
					this.systemDrawer.updatePart(actor, part, this.stepTrace[actor][part], this.stepTrace[actor][`${part}-trace`])
				}
			)}
			
			if(actionItem.invokes){
				actionItem.invokes.forEach(invokedAction => this.performAction(actor, invokedAction, trace.concat(action)))
			}
		}
		else{
			console.log(`unknown technique - ${action}`)
		}
	}
}