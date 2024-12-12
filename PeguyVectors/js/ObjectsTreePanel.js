function ObjectsTreePanel()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="panel objectsTreePanel" >'
		+ '</div>';
	
	var component = new Component(html);
	
	var tree = new Tree(false);
	component.appendChild(tree);
	
	//////////////
	// Méthodes //
	//////////////
	
	var loadFiles = function($fileList)
	{
		appData.setVertices([]);
		
		var data = $fileList[0].data;
		
		if ($fileList[0].type === 'image/svg+xml')
		{
			appData.setOriginalSVGdata(data);
			var originalSVGDOM = appData.updateOriginalSVGDOM();
			
			var viewBox = originalSVGDOM.getAttribute('viewBox');
			var width = parseInt(viewBox.replace(/^[0-9]+ [0-9]+/, '').replace(/ [0-9]+$/, ''));
			var height = parseInt(viewBox.replace(/^[0-9]+ [0-9]+ [0-9]+ /, ''));
			
			originalSVGDOM.setAttribute('width', width);
			originalSVGDOM.setAttribute('height', height);
			appData.getJsonFileData().svgWidth = width;
			appData.getJsonFileData().svgHeight = height;
			
			Events.emit('onLoadSVG', [originalSVGDOM]);
			
			$this.build();
		}
		else if ($fileList[0].type === 'application/json')
		{
			console.log(data);
			
			appData.setJsonFileData(JSON.parse(data));
			var jsonData = appData.getJsonFileData();
			$this.buildFromJSON();
			Events.emit('onLoadJSON', [jsonData]);
		}
		
		console.log(appData.getVertices());
	};
	
	var buildNodeBranch = function($svgItem, $svgNode)
	{
		if ($svgNode.nodeType !== Node.TEXT_NODE)
		{
			var svgBranch = new SVGitem($svgNode, $svgItem.getTransformMatrix());
			$svgItem.select();
			tree.addElement(svgBranch);
			
			for (var i = 0; i < $svgNode.childNodes.length; i++)
				buildNodeBranch(svgBranch, $svgNode.childNodes[i]);
		}
	};
	
	this.build = function()
	{
		for (var i = 0; i < appData.getOriginalSVGDOM().childNodes.length; i++)
		{
			var svgNode = appData.getOriginalSVGDOM().childNodes[i];
			
			if (svgNode.nodeType !== Node.TEXT_NODE)
			{
				var identityMatrix = new Matrix();
				identityMatrix.identity();
				var svgBranch = new SVGitem(svgNode, identityMatrix);
				tree.deselectAll();
				tree.addElement(svgBranch);
				
				for (var j = 0; j < svgNode.childNodes.length; j++)
					buildNodeBranch(svgBranch, svgNode.childNodes[j]);
			}
		}
		
		tree.deselectAll();
		viewManager.getSVGpanel().unselectAll();
		viewManager.getObjectOptionsPanel().removeAllChildren();
	};
	
	var buildNodeBranchFromJSON = function($svgItem, $json)
	{
		var svgBranch = new SVGitem($json, $svgItem.getTransformMatrix());
		$svgItem.select();
		tree.addElement(svgBranch);
		
		for (var i = 0; i < $json.children.length; i++)
			buildNodeBranchFromJSON(svgBranch, $json.children[i]);
	};
	
	this.buildFromJSON = function()
	{
		var json = appData.getJsonFileData();
		
		for (var i = 0; i < json.children.length; i++)
		{
			var identityMatrix = new Matrix();
			identityMatrix.identity();
			var svgBranch = new SVGitem(json.children[i], identityMatrix);
			tree.deselectAll();
			tree.addElement(svgBranch);
			
			for (var j = 0; j < json.children[i].children.length; j++)
				buildNodeBranchFromJSON(svgBranch, json.children[i].children[j]);
		}
		
		tree.deselectAll();
		viewManager.getSVGpanel().unselectAll();
		viewManager.getObjectOptionsPanel().removeAllChildren();
	};
	
	this.findNodes = function()
	{
		var children = tree.getBranches();
		
		for (var i = 0; i < children.length; i++)
			children[i].findNode();
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	var onDropFile = function($event)
	{
		var effectAllowed = $event.dataTransfer.effectAllowed;
		
		if (effectAllowed === "all")
		{
			//popup.getById('images-list-block').style.backgroundColor = 'rgb(255, 255, 255)';
			
			var files = $event.dataTransfer.files;
			
			var filesToDisplay = [];
			var dataToDisplay = [];
			var readyFiles = 0;
			
			var onReady = function()
			{
				readyFiles++;
				
				if (readyFiles >= filesToDisplay.length)
					loadFiles(dataToDisplay);
			};
			
			if (files[0].type === 'image/svg+xml' || files[0].type === 'application/json')
				filesToDisplay.push(files[0]);
			
			for (var i = 0; i < filesToDisplay.length; i++)
			{
				var file = filesToDisplay[i];
				
				var reader = new FileReader();
				reader.name = file.name;
				reader.type = file.type;
				
				reader.onload = function (inEvent)
				{
					var fileData = inEvent.target.result;
					var fileName = this.name;
					var fileType = this.type;
					
					dataToDisplay.push({ name: fileName, type: fileType, data: fileData });
					onReady();
				};
				
				if (file.type === 'image/svg+xml')
					reader.readAsDataURL(file);
				else if (file.type === 'application/json')
					reader.readAsText(file);
			}
		}
	};
	
	//*
	tree.onSelect = function($selectedElement)
	{
		viewManager.getSVGpanel().unselectAll();
		
		if (utils.isset($selectedElement.getOriginalSVGnode().addClass))
			$selectedElement.getOriginalSVGnode().addClass('selected');
		
		viewManager.getObjectOptionsPanel().removeAllChildren();
		viewManager.getObjectOptionsPanel().appendChild($selectedElement.getOptionsTable());
		return true;
	};
	//*/
	
	component.connect('onDropFiles', onDropFile);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getTree = function() { return tree; };
	
	this.getSVGCode = function()
	{
		appData.setVertices([]);
		
		var json = appData.getJsonFileData();
		
		var code = '&lt;svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" ';
		code = code + 'width="100%" height="100%" ';
		//code = code + 'viewBox="' + viewManager.getSVGpanel().firstChild.getAttribute('viewBox') + '" ';
		code = code + 'viewBox="0 0 ' + json.svgWidth + ' ' + json.svgHeight + '" ';
		code = code + 'version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"&gt;<br />';
		
		var children = tree.getBranches();
		
		for (var i = 0; i < children.length; i++)
			code = code + children[i].getSVGCode(true);
		
		code = code + '&lt;/svg&gt;';
		
		var width = parseFloat(json.svgWidth);
		var height = parseFloat(json.svgHeight);
		
		appData.getVertices().push({ x: 0, y: 0 });
		appData.getVertices().push({ x: width, y: 0 });
		appData.getVertices().push({ x: width, y: height });
		appData.getVertices().push({ x: 0, y: height });
		appData.getVertices().push({ x: width/2.0, y: 0 });
		appData.getVertices().push({ x: width/2.0, y: height });
		appData.getVertices().push({ x: 0, y: height/2.0 });
		appData.getVertices().push({ x: width, y: height/2.0 });
		appData.getVertices().push({ x: width/2.0, y: height/2.0 });
		
		return code;
	};
	
	/*
	this.getPythonCode = function()
	{
		var code = 'import math<br /><br />';
		
		code = code + 'from SuiseiModules.General.geometry import *<br />';
		code = code + 'from SuiseiModules.General.transform import *<br />';
		code = code + 'from SuiseiModules.General.importFromSVG import *<br />';
		code = code + 'from SuiseiModules.General.wires import *<br />';
		code = code + 'from SuiseiModules.General.primitives import *<br />';
		code = code + 'from SuiseiModules.General.complexShapes import *<br />';
		code = code + 'from SuiseiModules.General.SVGmapping import *<br /><br />';
		
		code = code + 'def build():<br /><br />';
		
		code = code + '\tsceneElements = []<br />';
		code = code + '\tsvgMapping = SVGmapping()<br /><br />';
		
		code = code + '\tsvgMapping.setMapRect(' + viewManager.getGeneralOptionsPanel().getById('widthInput').value + ', ';
		code = code + "'";
		code = code + '&lt;rect x="0" y="0" width="' + viewManager.getSVGpanel().firstChild.getAttribute('width') + '" height="' + viewManager.getSVGpanel().firstChild.getAttribute('height') + '" /&gt;';
		code = code + "'";
		code = code + ')<br /><br />';
		
		var children = tree.getBranches();
		
		for (var i = 0; i < children.length; i++)
			code = code + children[i].getPythonCode('0');
		
		code = code + '\tfor element in svgMapping.getSceneElements():<br />';
		code = code + '\t\tsceneElements.append(element)<br /><br />';
		
		code = code + '\tsaveScene("SVGmapping-object", sceneElements)<br /><br />';
		
		code = code + '\treturn sceneElements[0]<br />';
		
		return code;
	};
	//*/
	
	this.getJSON = function()
	{
		var json =
		{
			svgWidth: viewManager.getSVGpanel().firstChild.getAttribute('width'),
			svgHeight: viewManager.getSVGpanel().firstChild.getAttribute('height'),
			physicalWidth: appData.getPhysicalWidth(),
			physicalHeight: appData.getPhysicalHeight(),
			children: []
		};
		
		var children = tree.getBranches();
		
		for (var i = 0; i < children.length; i++)
			json.children.push(children[i].getJSON());
		
		var code = JSON.stringify(json, null, "\t");
		code = code;
		
		return code;
	};
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("objectsTreePanel");