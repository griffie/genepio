/****************************************************************************

After ajax load of ontology_ui.json, top.data contains:
{
	@context
	specifications
	units
	field_units
	picklists
}
*/

/*********** ALL THE SETUP *************************/

data = {}
bag = {}
formatD = 'yyyy-mm-dd'
formatT = 'Thh:ii:SS'

Foundation.Abide.defaults.live_validate = true // validate the form as you go
Foundation.Abide.defaults.validate_on_blur = true // validate whenever you focus/blur on an input field
    focus_on_invalid : true, // automatically bring the focus to an invalid input field
Foundation.Abide.defaults.error_labels = true, // labels with a for="inputId" will recieve an `error` class
    // the amount of time Abide will take before it validates the form (in ms). 
    // smaller time will result in faster validation
Foundation.Abide.defaults.timeout = 1000
Foundation.Abide.defaults.patterns = {
      alpha: /^[a-zA-Z]+$/,
      alpha_numeric : /^[a-zA-Z0-9]+$/,
      integer: /^[-+]?\d+$/,
      number: /^[-+]?[1-9]\d*$/,
      decimal: /^[-+]?[1-9]\d*.\d+$/,

      // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
      email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

      url: /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,
      // abc.de
      domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,

      datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
      // YYYY-MM-DD
      date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
      // HH:MM:SS
      time : /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
      dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
      // MM/DD/YYYY
      month_day_year : /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,

    }


/*********** ACTION *************************/
$.getJSON('ontology_ui.json', function( data ) {
	top.data = data;

	$("#sidebar > ul").html(renderMenu('obo:OBI_0000658')).foundation() // Data specification
	renderForm('obo:GENEPIO_0001740') // Line list object
	$("#modalTechnical").foundation()

	//$('#sidebar > ul').foundation('down', $('#obo:OBI_0001741') ) ; //Doesn't work?!
});


function renderForm(entityId) {
	console.log("Rendering entity ", entityId)
	top.bag = {}
	$("#content").empty().html('<form id="mainForm"  data-abide>'+ render(entityId, null, 0) + '</form>').foundation()
	
	// Set up all date inputs; using http://foundation-datepicker.peterbeno.com/example.html
	$('input[placeholder="xmls:date"]').fdatepicker({format: formatD, disableDblClickSelection: true});
	$('input[placeholder="xmls:dateTime"]').fdatepicker({format: formatD+formatT, disableDblClickSelection: true});
	$('input[placeholder="xmls:dateTimeStamp"]').fdatepicker({format: formatD+formatT, disableDblClickSelection: true});

}

function renderMenu(entityId, depth = 0 ) {

	var html = ""
	var entity = top.data['specifications'][entityId]
	if (entity) {
		if ('parent' in entity && parent['id'] == entityId) {
			console.log("Node: " + entityId + " is a parent of itself and so is not re-rendered.")
			return html
		}

		if (depth > 0) html = '<li><a><span onclick="renderForm(\''+entityId+'\')">'+entity['uiLabel']+'</span></a>' // id="'+entityId+'"
		if ('members' in entity) {
			for (var memberId in entity['members']) { // use "is-active" class ?
				if (depth == 0) html += renderMenu(memberId, depth + 1)

				else html += '<ul class="menu vertical nested">' + renderMenu(memberId, depth + 1) + '</ul>'	//id="'+memberId+'"
			}
		}

		html +=	'</li>'
	}
	return html
}


function render(entityId, referrerId, depth, inherited) {
	console.log("Render",entityId,referrerId,depth,inherited)

	if (!inherited) inherited = false
	var html = ''

	if (depth > 20) {
		console.log ("AWOL Loop? While rendering", entityId, referrerId )
		return html
	}
	// Prevents an item from being rendered in loop.
	// PROBLEM: Prevents >0 of an entity even when desired.e.g. phone/cell
	//if (entityId in top.bag) {console.log('ISSUE: entity '+entityId+' is in a loop');return ""} 
	//else top.bag[entityId] = true		

	var entity = $.extend(true, {}, top.data['specifications'][entityId]) // clone entity so we can change it.
	if (!entity) {
		console.log("Node: " + entityId + " has no specification entry.")
		return html
	}
	if ('parent' in entity && parent['id'] == entityId) {
		console.log("Node: " + entityId + " is a parent of itself and so cannot be re-rendered.")
		return html
	}

	var label = '<label>' + getLabel(entity) + '</label>'
	// When this is a "has value specification" part of another entity, 
	// that entity will indicate how many of this part are allowed.

	entity['required'] = ''
	entity['features'] = {}
	if (referrerId) {
		var cardinality = getCardinality(entity, referrerId)
		if (cardinality.length) {
			var requiredLabel = cardinality.join('.')
			label = '<span class="info label float-right"><i class="fi-widget"></i>' + requiredLabel  + '</span>' + label
			entity['required'] = (requiredLabel.indexOf('required') >=0 ) ? ' required ' : ''
		}
		entity['features'] = getFeatures(entityId, referrerId)
		// Currently showing "hidden" feature as disabled.
		entity['disabled'] = ('hidden' in entity['features']) ? ' disabled="disabled"' : '';

	}
	
	
	switch (entity['datatype']) {
		case undefined: // Anonymous node
			// Issue, nodes that inherit primitive data type not getting marked by that data type.
			html += renderSection('<strong>Error: No datatype!</strong><ul><li>Hint: A picklist must be a subclass of "categorical tree specification".</li><li>Other fields need a "has primitive value spec" data type.</li></ul>')

		case 'specification':
			// Here we go up the hierarchy to render all inherited superclass 'has value specification' components.
			if ('parent' in entity) { // aka member_of or subclass of
				var parentId = entity['parent']
				if (parentId != 'obo:OBI_0000658') {//Top level spec.
					//console.log('' + depth + ": Specification "+entityId+" inheriting: " + parentId)
					html += render(parentId, null, depth-1, true)
				}
			}	

			var ids = getSort(entity['parts'], 'specifications') // "has value specification" parts. 
			for (var ptr in ids) { 
				// Sort so fields within a group are consistenty orderd:
				childId = ids[ptr]
				html += render(childId, entityId, depth+1)
			}

			if (inherited == false) {
				var ids = getSort(entity['members'], 'specifications') //'is a' members.
				for (var ptr in ids) { 
					childId = ids[ptr]
					html += render(childId, null, depth+1) // cardinality doesn't apply to subclasses.
				}
			}

			if (html.length > 0)
				if (entity['uiLabel'] != '[no label]')
					html = '<div class="callout' +  entity['required']+ '"><h5>' + label + '</h5>' + html + '</div>'

			break;

		/* PRIMITIVE data types 
		Inputs as sepecified in an OWL Ontology file can have all the standard xmls data types and restrictions.
		Potentially create ZURB Foundation fields: text, date, datetime, datetime-local, email, month, number, password, search, tel, time, url, and week
		*/

		/*
		DATE DATATYPES: date dateTime duration gDay (just DD day) gMonth (the month MM) gMonthDay	(MM-DD) gYear (YYYY) gYearMonth (YYYY-MM) time
		*/
		case 'xmls:date': //YYYY-MM-DD  and possibly time zone "Z" for UTC or +/-HH:MM
		case 'xmls:time': //HH:MM:SS and possibly .DDDD  and time zone as above.
		case 'xmls:dateTime': //YYYY-MM-DDTHH:MM:SS
		case 'xmls:dateTimeStamp': //YYYY-MM-DDTHH:MM:SS  and required time zone as above.

		case 'xmls:duration': //[-]P (period, required) + nYnMnD (years / months / days) T nHnMnS (hours / minuts / seconds)

		// Applicable restrictions : enumeration length maxLength minLength pattern whiteSpace
		case 'xmls:string':
		case 'xmls:normalizedString':
		case 'xmls:token':
			html += renderInput(entity, label)
			break;
 
		// renderInteger(entity, minInclusive, maxInclusive)
		case 'xmls:integer':			html += renderInteger(entity, label);	break
		case 'xmls:positiveInteger': 	html += renderInteger(entity, label, 1);	break
		case 'xmls:nonNegativeInteger':	html += renderInteger(entity, label, 0);	break
		case 'xmls:unsignedByte':		html += renderInteger(entity, label, 0, 255); break// (8-bit)	
		case 'xmls:unsignedShort':		html += renderInteger(entity, label, 0, 65535); break// (16-bit) 
		case 'xmls:unsignedInt':		html += renderInteger(entity, label, 0, 4294967295);	break// (32-bit)		
		case 'xmls:unsignedLong':		html += renderInteger(entity, label, 0, 18446744073709551615); break// (64-bit) 

		case 'xmls:negativeInteger':	html += renderInteger(entity, label, null, -1); break
		case 'xmls:nonPositiveInteger':	html += renderInteger(entity, label, null, 0); break

		case 'xmls:byte': 	html += renderInteger(entity, label, -128, 127);	break// (signed 8-bit)
		case 'xmls:short': 	html += renderInteger(entity, label, -32768, 32767);	break// (signed 16-bit)
		case 'xmls:int': 	html += renderInteger(entity, label, -2147483648, 2147483647);	break// (signed 32-bit)
		case 'xmls:long': 	html += renderInteger(entity, label, -9223372036854775808, 9223372036854775807); break // (signed 64-bit)

		case 'xmls:decimal': // max 18 digits
		case 'xmls:float':
			html += renderNumber(entity, label)
			break;

		case 'xmls:boolean': // Yes/No inputs here
			html += renderBoolean(entity)
			break;

		case 'xmls:anyURI': // Picklists are here
			if (entityId in top.data['picklists'])
				html += renderChoices(entity, label)
			else
				html += '<p class="small-text">ERROR: Categorical variable [' + entityId + '] not marked as a "Categorical tree specification"</p>'
			break;

		default:
			html += renderSection('UNRECOGNIZED: '+ entityId + ' [' + entity['datatype']  + ']' + label  )
			break;
	}
		return html
	

}

function renderSection(text) {
	html = '<div>\n'
	html +=	'	<label>' + text + '</label>\n'
	//html +=	'	<input type="text" placeholder="" />\n'
	html +=	'</div>\n'

	return html
}

function renderItem(text) {
	html = '<div>\n'
	html +=	'	<label>' + text + '</label>\n'
	html +=	'</div>\n'

	return html
}

function renderInput(entity, label) {
	/*
	Add case for paragraph / textarea?
	 <textarea placeholder="None"></textarea>
	*/
	label = label.replace("</label>","")

	html = '<div class="input-wrapper">\n'
	html +=		label
	html +=	'	<div class="input-group">\n'
	html +=	'		<input class="input-group-field '+entity['id']+'" type="text" ' + getStringConstraints(entity) + entity['required']+ entity['disabled']  +  ' placeholder="'+ entity['datatype']+ '" />\n'
    html += 		renderUnits(entity)
	html +=	'	</div>\n'
	html += ' 	</label>'
	html +=		renderHelp(entity)
	html +=	'</div>\n'

	return html
}


/* NUMERIC DATATYPES HANDLED HERE */
function renderNumber(entity, label) {

	html = '<div class="input-wrapper">\n'
	html +=		label
	html +=	'	<div class="input-group">\n'
	html +=	'		<input class="input-group-field '+entity['id']+'" type="text"' + entity['required']+ entity['disabled'] + 'placeholder="'+ entity['datatype']+'" />\n'
    html += 		renderUnits(entity)
	html +=	'	</div>\n'
	html +=		renderHelp(entity)
	html +=	'</div>\n'

	return html
}

function renderInteger(entity, label, minInclusive, maxInclusive) {
	
	html = '<div class="input-wrapper">\n'
	html +=		label
	html +=	'	<div class="input-group">\n'
	html +=	'		<input class="input-group-field '+entity['id']+'" type="number"' + entity['required'] + entity['disabled'] + getIntegerConstraints(entity, minInclusive, maxInclusive) + ' placeholder="'+ entity['datatype']+'" pattern="integer" />\n'
    html += 		renderUnits(entity)
	html +=	'	</div>\n'
	html +=		renderHelp(entity)
	html +=	'</div>\n'

	return html
}


function renderBoolean(entity) {
html = '<div class="input-wrapper">\n'
	html +=	'	<div class="switch small">\n'
	html +=	'	  <input class="switch-input" id="smallSwitch" type="checkbox" name="'+entity['id']+'"' + entity['required']+ entity['disabled'] + '>\n'
	html +=	'		<label class="switch-paddle" for="'+entity['id']+'">\n'
	html +=	'	    <span class="show-for-sr">' + getLabel(entity) + '</span>\n'
	html +=	'	  </label>\n'
	html +=		renderHelp(entity)
	html +=	'	</div>\n'
	return html
}

function renderChoices(entity, label) {
	/* FUTURE: OPTION FOR RENDERING AS SELECT OPTIONS, RADIOBUTTONS OR CHECKBOXES ...

	*/
	picklistId = entity['id']
	html = '<div class="input-wrapper">\n' 
	html +=		label
	html +=	'	<div class="input-group">\n'
	html +=	'		<select name="haha" placeholder="'+entity['datatype'] + '"  class="input-group-field '+entity['id'] + '"' + entity['required'] + entity['disabled'] + '>\n'
	html +=				renderChoice(top.data['picklists'][picklistId], 0)
	html +=	'		</select>\n'
	if ('lookup' in entity['features']) 
		html += '		<a class="input-group-label small" onclick="getChoices(this,\''+entity['id']+'\')">more choices...</a>\n'

	html +=	'	</div>\n'
	html += renderHelp(entity)
	html +=	'</div>\n'

	return html
}



function renderChoice(entity, depth, type="select") { 

	var html = ""
	if (depth > 10) return "MAX DEPTH PROBLEM WITH " + entity['id']
	if ('members' in entity) 
		var prefix = Array(depth+1).join("&nbsp; &nbsp; ")
		var memberIds = getSort(entity['members'],'picklists') 
		//console.log("List:",entity['uiLabel'], memberIds)
		for (var ptr in memberIds) {
			var memberId = memberIds[ptr]
			var part = top.data['picklists'][memberId]
			if (!part) // Should never happen.
				console.log("Error: picklist choice not available: ", memberId, " for list ",entity['id'])
			else {
				// Currently showing "hidden" feature as disabled.
				var disabled = getFeature(entity['id'], memberId, 'hidden') ? ' disabled="disabled"' : '';
				var kidHTML = renderChoice(part, depth+1)
				// Some extra pizaz for capitalizing labels that appear at 1st depth in hierarchic lists with descendants.
				var label = (depth == 0 && (kidHTML.length > 0)) ? part['uiLabel'].toUpperCase() : part['uiLabel']
				switch (type) {

					case "checkbox": // future
						break;
					case "radio": // future
						break;
					case "select":

					default:
						html += '<option value="'+part['id']+'" class="'+depth+'" '+disabled+'>' + prefix + label + ' - ' + part['id'] + '</option>\n'
				}
			}
			html += kidHTML
		}
	return html
}

function renderUnits(entity) {
	// Future: enable default unit (cm, mm, m, km etc.); allow user to select which unit data entry is in.
	if ('units' in entity) {
		var units = entity['units']
		var label = getLabel(top.data['units'][units[0]])
		if (units.length == 1) 
			return '<a class="input-group-label small">'+ label + '</a>\n'

		// FOR FUTURE USE
		var html ='<ul class="input-group-label button dropdown menu small" data-dropdown-menu>'
		html += '	<li><a>'+ label + '</a>'
		html += '	<ul class="menu">'
		for (var ptr in units.slice(1)) {
			var unit = top.data['units'][units[ptr]]
			html += '		<li>' + (unit['uiLabel'] ? unit['uiLabel'] : unit['label']) + '</li>'
		}
		html += '</ul></li></ul>\n'
		return html
   	}
   	return ''
}


function renderHelp(entity) {
	definition = ('definition' in entity) ? entity['definition'] : ''
	definition = ('uiDefinition' in entity) ? 'UI definition:' + entity['uiDefinition'] + ' Original definition:' + definition : definition
	if (definition > '')
		// need div to be  [aria-describedby="exampleHelpText"] , and id below as  [id="exampleHelpText"]
		return '	<p class="help-text" id="">'+ definition+'</p>\n'
  	return ''
 }


/************************** UTILITIES ************************/


function getLabel(entity) {
	label = ('label' in entity && entity['label'] != entity['uiLabel']) ? entity['label'] + ' - ': ''
		return '<span data-tooltip aria-haspopup="true" class="has-tip" data-disable-hover="false" title="' + label + entity['id']+'">'+entity['uiLabel']+'</span>'
	
	return entity['uiLabel']

}

function getSort(members, myList) { // an object with entity ids as keys
	/* Complicated by the fact that some items, like individuals, may not have uiLabel.
	*/

	var memberIds = []
	for (var memberId in members) memberIds.push(memberId)

	var pl = top.data[myList]
	return memberIds.sort(function(a,b) {
		try {
			var aLabel = pl[a]['uiLabel'].toLowerCase()
			var bLabel = pl[b]['uiLabel'].toLowerCase()
		}
		catch (e) {
			//console.log("SORTING", memberIds)
			console.log("ERROR: Trying to sort a picklist but one item doesn't have a label:", a, b)
			return 0
		}

		if ( aLabel == bLabel) return 0
		return aLabel.localeCompare(bLabel) // Wierd, the ">" operator doesn't work for GEO items.

	})
}

function getFeatures(entityId, referrerId) {
	// Since a feature like "hidden" or "feature" may exist in both members and parts lists,
	// its a bit more hassle to determine where referrerId is to include the feature.

	var referrer = top.data['specifications'][referrerId]
	if (!referrer) referrer = top.data['picklists'][referrerId]
	if (!referrer) {console.log("ERROR: can't find entity ", referrerId, " to get feature for." );return false }
	var myFeatures = {}
	var myLists = {'members':null,'parts':null}
	for (var myList in myLists) {
		if (myList in referrer) {
			var features = referrer[myList][entityId]
			if (features) {
				//console.log("FEATURES array? ",features)
				for (var ptr in features) {
					var myobj = features[ptr]
					if ('feature' in myobj) {
						if (typeof myobj['feature'] === 'object') 
							for (item in myobj['feature'])
								myFeatures[item] = myobj['feature'][item]
						else
							myFeatures[myobj['feature']] = myobj['feature']
					}
				}
				//console.log("FEATURES",myFeatures)
			}
		}
	}
	return myFeatures
}

function getFeature(entityId, referrerId, feature) {
	// a feature like "hidden" or "feature" may exist in both members and parts lists

	var referrer = top.data['specifications'][referrerId]
	if (!referrer) referrer = top.data['picklists'][referrerId]
	if (!referrer) {console.log("ERROR: can't find entity ", referrerId, " to get feature for." );return false }

	for (myList in ['members','parts']) 
		if (myList in referrer) {
			var features = referrer[myList][entityId]
			if (features)
				for (var item in features) {
					if (feature in features[item]) {
						//console.log("found", feature, id, "in", entity['id']);
						return [features[item][feature]] //true
					}
				}
		}
	return false
}

function getConstraints(entity) {
	//Each constraint has "constraint", "datatype", and "value"
	output = {}
	if ('constraints' in entity && entity['constraints'].length) {
		var constraints = entity['constraints']
		for (var ptr in constraints) {
			var constraint = constraints[ptr]['constraint']
			var value = constraints[ptr]['value']
			switch (constraint) {
				// Numeric
				case 'xmls:minInclusive':
				case 'xmls:maxInclusive':
				//case 'xmls:minExclusive': // converted into minInclusive already
				//case 'xmls:maxExclusive': // ditto.
				case 'xmls:fractionDigits':
				case 'xmls:totalDigits':

				case 'xmls:length': // exact length
				case 'xmls:minLength': // preserve|collapse|replace
				case 'xmls:maxLength': // an allowed value.
					output[constraint] = parseInt(value)
					break;

				// String
				case 'xmls:pattern': //reg. exp. for string or number.  Foundation accepts some preset expression names.
					if (value in Foundation.Abide.defaults.patterns)
						output[constraint] = value
					else
						output[constraint] = "^" + value + '$' //Match input string start to finish.
					break
				case 'xmls:whiteSpace': // preserve|collapse|replace
				case 'xmls:enumeration': //an allowed value.
					output[constraint] = value
					break;		
				default:
					break;
			}
		}
	}
	return output
}

function getIntegerConstraints(entity, minInclusive, maxInclusive) {
	var constraints = getConstraints(entity), min, max, pattern
	if (maxInclusive === undefined || maxInclusive > constraints['xmls:maxInclusive']) 
		maxInclusive = constraints['xmls:maxInclusive']
	if (minInclusive === undefined || minInclusive < constraints['xmls:minInclusive']) 
		minInclusive = constraints['xmls:minInclusive']
	min = (minInclusive === undefined) ? '' : ' min='+minInclusive+' ' 
	max = (maxInclusive === undefined) ? '' : ' max='+maxInclusive+' ' 
	//console.log(entity['id'],max,maxInclusive, maxInclusive === undefined, constraints['xmls:maxInclusive'])
	pattern = 'xmls:pattern' in constraints ? ' pattern="' + constraints['xmls:pattern'] + '" ' : ''
	return min + max + pattern
}

function getStringConstraints(entity) {
	var constraints = getConstraints(entity), min, max, pattern
	min 	= 'xmls:minLength' in constraints ? ' minLength="'+constraints['xmls:minLength']+'" ' : ''
	max 	= 'xmls:maxLength' in constraints ? ' maxLength="'+constraints['xmls:maxLength']+'" ' : ''
	//size 	= 'xmls:length' in constraints ? ' size="'+constraints['xmls:length']+'" ' : ''
	pattern = 'xmls:pattern' in constraints ? ' pattern="' + constraints['xmls:pattern'] + '" ' : ''
	return min + max + pattern
}


function getCardinality(entity, referrerId) {
	/* Each part comes with a cardinality qualifier that indicates how many of
		that part can exist in an entity's data structure and by extension, on a form. 
		NOTE: limits on the data range of numeric values is handled separately in the
		constraints functions above.

		EXPLANATION
		In OWL/Protege it is often stated that entity A has relation B to entity C, 

			e.g.: h-antigen 'has primitive value spec' some 'xsd:string'
			
		This is equivalent to the cardinality "min 1" aka "minQualifiedCardinality 1" 
		or in plain english, "1 or more", which is ok in many logic scenarios as it
		enforces the existence of at least one example.  The cardinality of "some" in
		a user interface would on the face of it allow the user to add more than one 
		of a particular item which is fine for things like multiple phone number and 
		alternate email datums.

		However, if we're looking for one and only one datum of a certain type in an 
		entity data structure, we actually need to say that entity A has exactly 
		"owl:qualifiedCardinality 1" aka "exactly 1" of entity B, no less and no more.  
	*/
	var constraints = []
	var id = entity['id']
	var referrer = top.data['specifications'][referrerId]

	for (var cptr in referrer['parts'][id]) {
		var condition = referrer['parts'][id][cptr]
		
		var limit = 'value' in condition ? parseInt(condition['value']) : 1
		switch (condition['cardinality']) {
			case 'owl:someValuesFrom': constraints.push('1+ required'); break // 1 of ...
			case 'owl:qualifiedCardinality': // exactly ...
				constraints.push( (limit == 1) ? 'required' : limit + ' required'); break 
			case 'owl:minQualifiedCardinality': //at least ...
				constraints.push(limit + '+ ' + (limit == 0 ? 'optional' : 'required') ); break
			case 'owl:maxQualifiedCardinality': // at most ...
				constraints.push((limit == 1) ? 'optional' : limit + ' optional'); break 
			default:
		}

	}
	//console.log(referrerId, id, constraints, referrer['parts'][id])
	return constraints

}



function getChoices(helper, entityId) {
	// If user makes a selection, and then clicks "lookup", selection list tree will be extended/fetched?

	var select = $(helper).parent('div[class="input-group"]').find("select")
	var term = select.val().split(":")[1]
	var ontology = term.split("_")[0]

	// https://www.ebi.ac.uk/ols/api/ontologies/doid/terms/http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252FDOID_0050589/children
	// http://www.ebi.ac.uk/ols/api/ontologies/doid/terms?iri=http://purl.obolibrary.org/obo/DOID_77

	fetchURL = 'https://www.ebi.ac.uk/ols/api/ontologies/'
	fetchURL += ontology.toLowerCase()
	fetchURL += '/terms/http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252F'
	fetchURL += term
	fetchURL += '/children'

	$.getJSON(fetchURL, function( data ) {
		msg = ''
		if ('_embedded' in data) {
			content=data._embedded.terms
			labels = []
			for (ptr in content) {
				item = content[ptr]
				//iri = item.iri
				label = item.label
				labels.push(label)
			}
			labels.sort()
			msg += labels.join('\n - ') 

			alert ('COMING SOON: DYNAMIC LOOKUP!  An agency can enable this feature for a hierarchic pick list that has more detail available than the default selection list.\n\nThese choices (subclasses of selected term) were dynamically retrieved from https://www.ebi.ac.uk/ols/:\n\n - ' + msg)
			//alert( entityId + ":" + select.val())
		}
		else 
			alert("Coming soon, dynamic lookup!\n\nYour choice has no underlying ontology selections")
	})

	return false
}
