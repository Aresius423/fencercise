var tagwrap = function(tag, content, {id,classname}={}){
	let idField = id?' id="' + id + '"' : ''
	let classField = classname?' class="' + classname + '"' : ''
	return `<${tag}${idField}${classField}>${content}</${tag}>`
}

class SimpleViewDrawer{
	constructor(controller){
		this.controller = controller
	}
	
	update(model){
		//notification
		if(model.exerciseStep == -1){
			this.drawViewFrames(model)
			document.getElementById("exercise-title").innerHTML = model.activeExercise.name
			UiDrawer.drawControls(this)
		}
		
		//update parts
		document.getElementById("stepdesc").innerHTML = model.activeInstructions
		document.getElementById("stepnote").innerHTML = model.activeNote
		this.updateParts(model)
		
		//update buttons
		if(model.activeExercise){			
			this.setButtonEnabled("next", (model.exerciseStep < model.activeExercise.flow.length - 1))
			this.setButtonEnabled("previous", (model.exerciseStep >= 0))
			this.setButtonEnabled("reset", true)
		}
		else {
			this.setButtonEnabled("next", false)
			this.setButtonEnabled("previous", false)
			this.setButtonEnabled("reset", false)
		}
	}
	
	static idGenerator(participantName, partName){
		return `${participantName}-${partName.replace(/\s/g,'')}`
	}
	
	participantTable(participantName, parts){
		let tableHeader = `<tr><th colspan="2">${participantName}</th></tr>`
		let participantParts = parts.map(el => {
			return {part:el,id:SimpleViewDrawer.idGenerator(participantName, el)}
		})
		
		return tableHeader + participantParts.map(el => {
			let partname = tagwrap('td', el["part"])
			let partstatus = tagwrap('td', "", {id:el["id"], classname:"widecol bodypartstatus"})
			let parttrace = tagwrap('td', "", {id:el["id"]+"-trace", classname:"widecol bodyparttrace"})
			return tagwrap('tr', partname + partstatus + parttrace)
		}).join("\n") + '<br><br>'
	}
	
	drawViewFrames(model){
		let parts = model.system.bodyparts
		document.getElementById("participant-0-frame").innerHTML = tagwrap("table", this.participantTable(model.system.participants[0], parts))
		document.getElementById("participant-1-frame").innerHTML = tagwrap("table", this.participantTable(model.system.participants[1], parts))
	}
	
	clearViewFrames(){
		Array.from(document.getElementsByClassName("bodypartstatus"))
			.forEach(el => {
				el.innerHTML = ''
				el.classList.remove("invalid")
			})
		Array.from(document.getElementsByClassName("bodyparttrace"))
			.forEach(el => el.innerHTML = '')
	}
	
	handleEvent(event){		
		switch(event.target.id){
			case "resetbutton":
				this.controller.requestReset()
				break;
			case "previousbutton":
				this.controller.requestPrevious()
				break;
			case "nextbutton":
				this.controller.requestNext()
				break;				
		}
	}
	
	updateParts(model){
		for(let actor of model.system.participants){
			for(let part of Object.keys(model.exerciseTrace[actor])){
				let currentPart = model.exerciseTrace[actor][part]
				let partId = SimpleViewDrawer.idGenerator(actor,part) 
				let domElement = document.getElementById(partId)
				let domTraceElement = document.getElementById(`${partId}-trace`)
				
				domElement.innerHTML = currentPart["value"].join("<br>")
				domTraceElement.innerHTML = currentPart["trace"].join("<br>")
				this.setPartValid(domElement, currentPart["valid"])
				
			}
		}
	}
	
	setPartValid(domElement, isValid = true){
		if(isValid){
			domElement.classList.remove("invalid")
		}
		else {
			domElement.classList.add("invalid")
		}
	}
	
	setButtonEnabled(elname, flipper){
		document.getElementById(`${elname}button`).disabled = !flipper
	}
}