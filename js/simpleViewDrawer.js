var tagwrap = function(tag, content, {id,classname}={}){
	let idField = id?' id="' + id + '"' : ''
	let classField = classname?' class="' + classname + '"' : ''
	return `<${tag}${idField}${classField}>${content}</${tag}>`
}

var idGenerator = function(participantName, partName){
	return `${participantName}-${partName.replace(/\s/g,'')}`
}

class SimpleViewDrawer{
	constructor(participants, bodyparts){
		this.p0name = participants[0]
		this.p1name = participants[1]
		this.parts = bodyparts
		
		this.drawViewFrames()
		this.drawControls()
	}
	
	participantTable(participantName){
		let tableHeader = `<tr><th colspan="2">${participantName}</th></tr>`
		let participantParts = this.parts.map(function(el){
			return {part:el,id:idGenerator(participantName, el)}
		})
		
		return tableHeader + participantParts.map(el => {
			let partname = tagwrap('td', el["part"])
			let partstatus = tagwrap('td', "", {id:el["id"], classname:"widecol bodypartstatus"})
			return tagwrap('tr', partname + partstatus)
		}).join("\n") + '<br><br>'
	}
	
	drawViewFrames(){
		document.getElementById("participant-0-frame").innerHTML = tagwrap("table", this.participantTable(this.p0name))
		document.getElementById("participant-1-frame").innerHTML = tagwrap("table", this.participantTable(this.p1name))
	}
	
	clearViewFrames(){
		Array.from(document.getElementsByClassName("bodypartstatus"))
			.forEach(el => el.innerHTML = '')
	}
	
	drawControls(){
		document.getElementById("controlbox").innerHTML = '<br><br>' + 
			'<input id="resetbutton" type="button" value="reset" onclick="loadedSystem.initExercise();" disabled />' +
			'<input id="previousbutton" type="button" value="previous step" onclick="loadedSystem.unstepExercise();" disabled />' +
			'<input id="nextbutton" type="button" value="next step" onclick="loadedSystem.stepExercise();" disabled />'
	}
	
	updatePart(actor, part, value){
		document.getElementById(idGenerator(actor, part)).innerHTML=value
	}
	
	enableElement(elname){
		document.getElementById(`${elname}button`).disabled = false
	}
	
	disableElement(elname){
		document.getElementById(`${elname}button`).disabled = true
	}
	
	displayAction(action){
		document.getElementById("stepdesc").innerHTML = action
	}
	
	displayNote(note){
		document.getElementById("stepnote").innerHTML = note
	}
}