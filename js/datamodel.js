class SystemData {
	constructor(rawData){
		this.subscribers = []
		let jsData = JSON.parse(rawData)
		
		this.system = jsData["system"]
		this.techniques = jsData["techniques"]
		this.exercises = jsData["exercises"]
		
		this.p0name = this.system.participants[0]
		this.p1name = this.system.participants[1]
		
		this.activeExercise = null
		this.exerciseStep = -1
		
		this.exerciseTrace = {[this.p0name]: {}, [this.p1name]: {}}
		this.systemDrawer = new SimpleViewDrawer(this.system.participants, this.system.bodyparts)
	}
	
	subscribe(subscriber){
		if(!this.subscribers.includes(subscriber)){
			this.subscribers.push(subscriber)
		}
	}
	
	unsubscribe(subscriber){
		this.subscribers = this.subscribers.filter(sub => subscriber != sub)
	}
	
	notifyAll(){
		this.subscribers.forEach(sub => sub.call(this))
	}
	
	loadExercise(exerciseNumber){
		this.activeExercise = this.exercises[exerciseNumber]
		//this.systemDrawer.updateExercise(this.activeExercise)
		this.initExercise()
		
		this.notifyAll()
	}
	
	setupActor(actorName){
		let action = this.activeExercise.init[actorName]
		if(action)
			this.performAction(actorName, action)
		
		return action?`${actorName}: ${action}<br>`:""
	}
	
	initExercise(){
		this.exerciseStep = -1
		this.exerciseTrace = {[this.p0name]: {}, [this.p1name]: {}}
		
		let p0init = this.setupActor(this.p0name)
		let p1init = this.setupActor(this.p1name)
		let note = this.activeExercise.init["note"]
		let noteText = note?note:""
		
		//this.systemDrawer.displayAction(`${p0init}${p1init}`)
		//this.systemDrawer.displayNote(noteText)
		
		notifyAll()
	}
	
	unstepExercise(){
		this.setExerciseStage(this.exerciseStep-1)
		
		notifyAll()
	}
	
	stepExercise(){
		this.exerciseStep++
		let stepTrace = {[this.p0name]: {}, [this.p1name]: {}}
		
		let currentStep = this.activeExercise.flow[this.exerciseStep]
		this.systemDrawer.displayNote(currentStep.note ? currentStep.note : "")
		this.systemDrawer.displayAction(`${currentStep.actor}: ${currentStep.actions.join(", ")}`)
		currentStep.actions.forEach(action => this.performAction(currentStep.actor, action, stepTrace))
		this.runAssertions(currentStep.actor, currentStep.assertions)
		
		notifyAll()
	}
		//this.systemDrawer.updateProgess(this.exerciseStep, this.activeExercise.flow.length)
	
	setExerciseStage(exerciseStep){
		this.initExercise()
		while(this.exerciseStep != exerciseStep)
			this.stepExercise();
		
		notifyAll()
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
	
	performAction(actor, action, stepTrace, trace = []){
		console.log(`${actor} is performing ${action}`)
		let actionItem = this.techniques.find(t => t.name === action)
		if(actionItem){			
			if(actionItem.assertions){
				Object.keys(actionItem.assertions).forEach(part => {
					if(stepTrace[actor][part]) {
						//this part has been updated in this step - check for discrepancy
						if(!stepTrace[actor][part].includes(actionItem.assertions[part])){
							//discrepancy detected
							this.systemDrawer.setPartInvalid(actor, part)
							stepTrace[actor][part].push(actionItem.assertions[part])
						}
						
						stepTrace[actor][`${part}-trace`].push(trace.concat(action))
					}
					else {
						//everything is hunky-dory
						stepTrace[actor][part] = [actionItem.assertions[part]]
						stepTrace[actor][`${part}-trace`] = [trace.concat(action)]
						this.systemDrawer.setPartValid(actor, part)
					}
					
					this.systemDrawer.updatePart(actor, part, stepTrace[actor][part], stepTrace[actor][`${part}-trace`])
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