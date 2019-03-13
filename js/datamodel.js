class SystemData {
	constructor(rawData){
		this.subscribers = []
		this.notificationsEnabled = true
		
		let jsData = JSON.parse(rawData)
		
		this.system = jsData["system"]
		this.techniques = jsData["techniques"]
		this.exercises = jsData["exercises"]
		
		this.activeExercise = null
		this.exerciseStep = -1
		
		//data for external processing
		
		this.exerciseTrace = this.defaultTrace()
		this.activeInstructions = ""
		this.activeNote = ""
	}
	
	enableNotifications(){this.notificationsEnabled = true}
	disableNotifications(){this.notificationsEnabled = false}
	
	subscribe(subscriber){
		if(!this.subscribers.includes(subscriber)){
			this.subscribers.push(subscriber)
		}
	}
	
	unsubscribe(subscriber){
		this.subscribers = this.subscribers.filter(sub => subscriber != sub)
	}
	
	notifyAll(){
		if(this.notificationsEnabled){
			this.subscribers.forEach(sub => sub.update(this))	
		}
	}
	
	loadExercise(exerciseNumber){
		this.activeExercise = this.exercises[exerciseNumber]
		this.initExercise()
		
		this.notifyAll()
	}
	
	setupActor(actorName){
		let action = this.activeExercise.init[actorName]
		let stepTrace = this.defaultTrace()
		if(action)
			this.performAction(actorName, action, stepTrace)
		
		this.updateExerciseTrace(stepTrace)
		
		return action?`${actorName}: ${action}<br>`:""
	}
	
	initExercise(){
		this.exerciseStep = -1
		this.exerciseTrace = this.defaultTrace()
		this.activeInstructions = ""
		
		for(let actor of this.system.participants){
			this.activeInstructions += this.setupActor(actor)
		}
		let note = this.activeExercise.init["note"]
		
		this.activeNote = note?note:""
		
		this.notifyAll()
	}
	
	unstepExercise(){
		this.setExerciseStage(this.exerciseStep-1)
	}
	
	stepExercise(){
		this.exerciseStep++
		let currentStep = this.activeExercise.flow[this.exerciseStep]
		
		let stepTrace = this.defaultTrace()
		this.activeInstructions = `${currentStep.actor}: ${currentStep.actions.join(", ")}`
		this.activeNote = currentStep.note ? currentStep.note : ""
		
		currentStep.actions.forEach(action => this.performAction(currentStep.actor, action, stepTrace))
		this.runAssertions(currentStep.actor, currentStep.assertions, stepTrace)
		
		this.updateExerciseTrace(stepTrace)
		
		this.notifyAll()
	}
	
	updateExerciseTrace(stepTrace){
		let mergedTrace = this.exerciseTrace
		for(let actor of this.system.participants){
			for(let part of Object.keys(stepTrace[actor])){
				mergedTrace[actor][part] = stepTrace[actor][part]
			}
		}
		
		this.exerciseTrace = mergedTrace
	}
	
	setExerciseStage(exerciseStep){
		this.initExercise()
		
		this.disableNotifications()
		
		while(this.exerciseStep != exerciseStep)
			this.stepExercise();
		
		this.enableNotifications()
		
		this.notifyAll()
	}
	
	runAssertions(actor, assertions, stepTrace){
		//assertions are stronger than property changes implied by actions
		
		if(assertions){
			Object.keys(assertions).forEach(part => {
				stepTrace[actor][part] = 
					{"value":[assertions[part]], "status":"assertion", "trace":[`explicit: ${part} - ${assertions[part]}`]}
				this.activeInstructions += `<br>${part} : ${assertions[part]}`
			})
		}
	}
	
	performAction(actor, action, stepTrace, trace = []){
		console.log(`${actor} is performing ${action}`)
		let actionItem = this.techniques.find(t => t.name === action)
		if(actionItem){			
			if(actionItem.assertions){
				Object.keys(actionItem.assertions).forEach(part => {
					if(stepTrace[actor][part]) {
						//this part has been updated in this step - check for discrepancy
						if(!stepTrace[actor][part]["value"].includes(actionItem.assertions[part])){
							//discrepancy detected
							stepTrace[actor][part]["status"]="invalid"
							stepTrace[actor][part]["value"].push(actionItem.assertions[part])
						}
						stepTrace[actor][part]["trace"].push(trace.concat(action))
					}
					else {
						//everything is hunky-dory
						stepTrace[actor][part] = {"value":[actionItem.assertions[part]], "status":"valid", "trace":[trace.concat(action)]}
					}
				}
			)}
			
			if(actionItem.invokes){
				actionItem.invokes.forEach(invokedAction => this.performAction(actor, invokedAction, stepTrace, trace.concat(action)))
			}
		}
		else{
			console.log(`unknown technique - ${action}`)
		}
	}
	
	defaultTrace(){
		return {[this.system.participants[0]]: {}, [this.system.participants[1]]: {}}
	}
}
