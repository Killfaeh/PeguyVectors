function ButtonsPanel()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="panel buttonsPanel" >'
				+ '<input id="jsonButton" type="button" value="Save project" />'
				+ '<input id="svgButton" type="button" value="Export SVG" />'
				+ '<input id="pythonButton" type="button" value="Export 3D" />'
			+ '</div>';
	
	var component = new Component(html);
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('jsonButton').onClick = function()
	{
		var code = viewManager.getObjectsTreePanel().getJSON();
		
		try
		{
			pythonObject.saveProject(code);
		}
		catch ($exception)
		{
			code = code.replace('<', '&lt;').replace('>', '&gt;');
			code = code.replace('\n', '<br />');
			
			var popup = new CodePopup("Export JSON", code);
			document.getElementById('main').appendChild(popup);
		}
	};
	
	component.getById('svgButton').onClick = function()
	{
		var code = viewManager.getObjectsTreePanel().getSVGCode();
		
		try
		{
			code = code.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
			code = code.replace(/<br \/>/gi, '\n');
			
			pythonObject.saveSVG(code);
		}
		catch ($exception)
		{
			//code = code.replace('<', '&lt;').replace('>', '&gt;');
			//code = code.replace('/n', '<br />');
			
			var popup = new CodePopup("Export SVG", code);
			document.getElementById('main').appendChild(popup);
		}
	};
	
	component.getById('pythonButton').onClick = function()
	{
		//var code = viewManager.getObjectsTreePanel().getPythonCode();
		//var popup = new CodePopup("Export Python", code);
		//document.getElementById('main').appendChild(popup);
		
		progressBar.setCurrentValue(0);
		document.getElementById('loadingScreen').style.display = 'block';
		
		setTimeout(function()
		{
			var jsonCode = viewManager.getObjectsTreePanel().getJSON();
			
			try
			{
				pythonObject.save3D(jsonCode);
			}
			catch ($exception)
			{
				// A modifier plus tard pour retourner le code Python
				jsonCode = jsonCode.replace('<', '&lt;').replace('>', '&gt;');
				jsonCode = jsonCode.replace('\n', '<br />');
				
				document.getElementById('loadingScreen').style.display = 'none';
				
				var popup = new CodePopup("Export JSON", jsonCode);
				document.getElementById('main').appendChild(popup);
			}
			
		}, 50);
	};
	
	/*
	this.onKeyDown = function(inEvent)
	{
		var shortcutModifier = Events.keyPressTable['ctrl'];
		
		if (/mac os x/.test(navigator.userAgent.toLowerCase().replace(" ", "")) || /macosx/.test(navigator.userAgent.toLowerCase().replace(" ", "")))
			shortcutModifier = inEvent.metaKey;
	
		if (shortcutModifier === true)
		{
			var keylist = [66, 73, 80, 83, 87, 89, 90];
			
			if (keylist.indexOf(inEvent.keyCode) >= 0)
			{
				Events.preventDefault(inEvent);
				Events.stopPropagation(inEvent);
			}
			
			// Enregistrement
			if (inEvent.keyCode === 83)
			{
				var code = viewManager.getObjectsTreePanel().getJSON();
				var popup = new CodePopup("Export JSON", code);
				document.getElementById('main').appendChild(popup);
			}
		}
		
		contentEditable.onKeyDown(inEvent);
	};
	//*/
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("buttonsPanel");