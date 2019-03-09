var tagwrap = function(tag, content, {id,classname}={}){
	let idField = id?' id="' + id + '"' : ''
	let classField = classname?' class="' + classname + '"' : ''
	return `<${tag}${idField}${classField}>${content}</${tag}>`
}

var idGenerator = function(participantName, partName){
	return `${participantName}-${partName.replace(/\s/g,'')}`
}

class SimpleViewDrawer{
	constructor(system){
		this.sysdata = system
	}
	
	
	
	participantTable(participantName){
		let tableHeader = `<tr><th colspan="2">${participantName}</th></tr>`
		let participantParts = this.sysdata.system.bodyparts.map(function(el){
			return {part:el,ident:idGenerator(participantName, el)}
		})
		
		
		
		return tableHeader + participantParts.map(el => {
			let partname = tagwrap('td', el["part"])
			let partstatus = tagwrap('td', "", {id:el["id"], classname:"widecol"})
			return tagwrap('tr', partname + partstatus)
		}).join("\n") + '<br><br>'
	}
	
	drawViewFrames(){
		document.getElementById("participant-0-frame").innerHTML = tagwrap("table", this.participantTable(this.sysdata.system.participants[0]))
		document.getElementById("participant-1-frame").innerHTML = tagwrap("table", this.participantTable(this.sysdata.system.participants[1]))
	}
}