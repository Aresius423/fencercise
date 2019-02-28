var tagwrap = function(tag, content, id=null, cls=null){
	let idField = id?' id="' + id + '"' : ''
	let classField = cls?' class="' + cls + '"' : ''
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
		let participantElements = this.sysdata.system["elements"].map
		(function(el){
			return {part:el,ident:idGenerator(participantName, el)}
		})
		return tableHeader + participantElements.map(el => tagwrap('tr', tagwrap('td', el["part"]) + tagwrap('td', "", el["id"], "widecol"))).join("\n") + '<br><br>'
	}
	
	drawViewFrames(){
		console.log(this.sysdata)
		document.getElementById("participant-0-frame").innerHTML = tagwrap("table", this.participantTable(this.sysdata.system["participants"][0]))
		document.getElementById("participant-1-frame").innerHTML = tagwrap("table", this.participantTable(this.sysdata.system["participants"][1]))
	}
}