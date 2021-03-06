var tagwrap = function(tag, content, {id,classname}={}){
	let idField = id?' id="' + id + '"' : ''
	let classField = classname?' class="' + classname + '"' : ''
	return `<${tag}${idField}${classField}>${content}</${tag}>`
}

class SimpleViewDrawer{
	constructor(controller){
		this.controller = controller
		this.prevEnabled = false
		this.nextEnabled = false
		
		UiDrawer.subscribeKeydown(this)
	}
	
	destroy(){
		UiDrawer.unsubscribeKeydown(this)
	}
	
	update(model){
		//notification
		if(model.loadStatus == "firstload"){
			this.drawViewFrames(model)
			document.getElementById("exercise-title").innerHTML = tagwrap("center", model.activeExercise.name)
			UiDrawer.drawControls(this)
			UiDrawer.drawLegend()
			UiDrawer.setupSlider(model.activeExercise.flow.length)
		}
		
		//update parts
		this.clearViewFrames(model.partStates)
		document.getElementById("stepdesc").innerHTML = model.activeInstructions.join('<br>')
		document.getElementById("stepnote").innerHTML = model.activeNote.join('<br>')
		this.updateParts(model)
		
		if(model.exerciseStep == -1){
			this.clearViewFrames(model.partStates, false)
		}
	
		//update buttons
		if(model.activeExercise){
			this.setNextEnabled(model.exerciseStep < model.activeExercise.flow.length - 1)
			this.setPrevEnabled(model.exerciseStep >= 0)
		}
		else {
			this.setNextEnabled(false)
			this.setPrevEnabled(false)
		}
		
		UiDrawer.moveSlider(model.exerciseStep)
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
		if (model.system.participants.length == 2){
			document.getElementById("participant-0-frame").innerHTML = tagwrap("center", tagwrap("table", this.participantTable(model.system.participants[0], parts)))
			document.getElementById("participant-1-frame").innerHTML = tagwrap("center", tagwrap("table", this.participantTable(model.system.participants[1], parts)))
		}
		else {  // TODO: prettify
			document.getElementById("participant-0-frame").innerHTML = model.system.participants.map(participant => tagwrap("center", tagwrap("table", this.participantTable(participant, parts)))).join('')
			document.getElementById("participant-1-frame").innerHTML = ''
		}
	}
	
	clearViewFrames(partStates, clearContent = true){
		Array.from(document.getElementsByClassName("bodypartstatus"))
			.forEach(el => {
				if(clearContent){
					el.innerHTML = ''
				}
				el.classList.remove.apply(el.classList, partStates)
			})
		if(clearContent){
			Array.from(document.getElementsByClassName("bodyparttrace"))
				.forEach(el => el.innerHTML = '')	
		}
	}
	
	handleEvent(event){
		let handle = `on${event.type}`
		if(this[handle])
			this[handle](event)
	}
	
	onkeydown(event){
		switch(event.which){
			case 68:
			case 102:
			case 39:
				if(this.nextEnabled){
					this.controller.requestNext()
					event.stopPropagation()
				}
				break
				
			case 65:
			case 100:
			case 37:
				if(this.prevEnabled){
					this.controller.requestPrevious()
					event.stopPropagation()
				}
				break
		}
	}
	
	onclick(event){
		switch(event.target.id){
			case "previousbutton":
				this.controller.requestPrevious()
				break
			case "nextbutton":
				this.controller.requestNext()
				break				
		}
	}
	
	oninput(event){
		this.controller.requestSet(event.target.value)
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
				this.setPartStatus(domElement, currentPart["status"], model.partStates)
				
			}
		}
	}
	
	setPartStatus(domElement, partStatus, partStates){
		domElement.classList.remove.apply(domElement.classList, partStates)
		
		domElement.classList.add(partStatus)
	}
	
	setPrevEnabled(flipper){
		this.prevEnabled = flipper
		document.getElementById('previousbutton').disabled = !flipper
	}
	
	setNextEnabled(flipper){
		this.nextEnabled = flipper
		document.getElementById('nextbutton').disabled = !flipper
	}
}
