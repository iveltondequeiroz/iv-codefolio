var elements = [
			{ id:'name', label:'Name', type:'text'},
			{ id:'age', label:'Age', type:'comparenumber', default:'older'},
			{ id:'gender', label:'Gender', type:'dropdown', default:'Male', options:['Male', 'Female']},
			{ id:'likes', label:'Likes', type:'text'},
			{ id:'livespast', label:'Live Past', type:'text'},
			{ id:'livespresent', label:'Live Now', type:'text'},
			{ id:'speaks', label:'Speaks', type:'dropdown', default:'German', options:['German', 'English', 'French', 'Italian']},
			{ id:'visited', label:'Visited', type:'text'},
			{ id:'relationship', label:'Relationship', type:'dropdown', default:'Single', options:['Single','Married']},
			{ id:'interestedin', label:'Interested In', type:'dropdown', default:'Female', options:['Female','Male']}
		];

var jsonquery = {};
var elementsCount=0;

function initBuilder(){
	$.each(elements, function(index, value) {
    	$('<li/>', {html: value.label, class:'ui-state-default li-query'}).appendTo('ul.source')
   	})

   	$(".source li").draggable({helper:'clone'});

	$("#querybuilder").droppable({drop:function(event, ui){
		elementsCount++;
		if(elementsCount>10) { return };
		var elementLabel = ui.draggable.text();
		var element = getElement(elementLabel)
		var uniqid = "id"+Date.now();
		var row = '<div class="wrapper" id="'+uniqid+'"><button class="btn btn-primary row-item">'+element.label+'</button>'

		switch(element.type){
			case 'text':
				var rowElement = '<input type="text" id="'+element.id+'" class="form-control" onblur="onBlurElement(this.id)"></input>';
				row+=rowElement;
				break;
			case 'comparenumber':
				var drop = '<select id="select'+element.id+'"'+
				'class="form-control" '+
				'onchange="selectCompareChange(this.id,'+element.id+','+element.id+' )" >'+
				'<option value="older">Older Than</option>'+
				'<option value="younger">Younger Than</option>'+
				'<option value="equal">Equal</option>'+
				'</select>';

				row+=drop;
				var rowElement = '<input type="number" id="'+element.id+'" class="common" onblur="onBlurElement(this.id)"></input>';
				row+=rowElement;
				break;

			case 'dropdown':
				var drop = '<select id="'+element.id+'" class="form-control" onchange="selectChange(this.id)" >';
				for(var v=0;v<element.options.length; v++){
					drop +='<option value="'+element.options[v]+'">'+element.options[v]+'</option>'
				}
				drop+='</select>'
				jsonquery[element.id] = element.default;
				row+=drop;
				break;
		}

		row+='<button class="btn btn-success row-item" onclick="removeRow('+uniqid+');"><span class="glyphicon glyphicon-trash"></span></button>'
		row+='</div>'
		$("#content").append($(row));
		updateJsonTextArea();
	}});
}


function getElement(elementLabel){
	var element='none';
	var result = $.grep(elements, function(e){ return e.label == elementLabel; });
	if (result.length == 1) {
		element = result[0];
	}
	return element;
}

function selectChange(id){
	var newValue = $('#'+id).val();
	jsonquery[id] = newValue;
	updateJsonTextArea();
}

function selectCompareChange(dropid,valid,id){
	var value = $('#'+valid.id).val();
	if(value.length!=0){
		var condition = $('#'+dropid).val();
		var value = $('#'+valid.id).val();
		var newValue ='';
		switch(condition){
			case 'younger':
				newValue="<";
				break;
			case 'older':
				newValue=">";
				break;
			case 'equal':
				newValue="=";
				break;
		}
		jsonquery[id.id] = newValue+value;
		updateJsonTextArea();
	}
}

function onBlurElement(label) {
	var id = label.replace(" ", "").toLowerCase();
		var newValue = $('#'+id).val();
		if(label=='age'){
			var condition = $('#selectage').val();
			var operator ='';
			switch(condition){
				case 'younger':
					operator="<";
					break;
				case 'older':
					operator=">";
					break;
				case 'equal':
					operator="=";
					break;
			}
			jsonquery[id] = operator+newValue;
		} else {
			jsonquery[id] = newValue;
		}
		updateJsonTextArea();
}

function updateJsonTextArea(){
	$('#jsonquery').val(JSON.stringify(jsonquery, null, "\t"));
}

function removeRow(divid){
	$('#'+divid.id).remove();
	elementsCount--;
}
