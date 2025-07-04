function Document()
{
	///////////////
	// Attributs //
	///////////////

	var width = 1000;
	var height = 1000;
	var filePath = "";
	var initDisplay = false;
	var saved = true;

	var html = '<div class="document" ></div>';

    var component = new Component(html);

    var grid = new Grid();
    component.appendChild(grid);

	var iconsMenuParam = 
	[
		{ name: "run-script", iconFile: "icons", iconName: "right-double-arrow-icon", toolTip: "Run script", action: function() { execProgram(); } },
	];

	var iconsMenu = new IconsMenu(iconsMenuParam, 20);

	//var svgPanel = new SVGpanel();
	var workspace = new Workspace(this, 800, 600, width, height);
	
	//var codeEditorHTML = '<pre id="preBlock" ><code id="codeBlock" class="javascript" contenteditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" ></code></pre>';
	//var codeEditor = new Component(codeEditorHTML);
	var codeEditor = new CodeEditor('javascript');
	var script = new Component('<script type="text/javascript" ></script>');
	var errorConsoleHTML = '<pre><code id="errorConsole" ></code></pre>';
	var errorConsole = new Component(errorConsoleHTML);

	grid.getById('toolsPanel').appendChild(iconsMenu);
	grid.getById('codePanel').appendChild(codeEditor);
	//grid.getById('leftPanel').appendChild(svgPanel);
	grid.getById('topPanel').appendChild(workspace);
	grid.getById('bottomPanel').appendChild(errorConsole);

	// Ajouter un bouton pour accéder à une bibliothèque d'assets

	//////////////
	// Méthodes //
	//////////////

	this.focusCodeEditor = function()
	{

	};

	this.render = function()
	{
		var elementsGroup = new Component('<g></g>');

		for (var i = 0; i < Doc.elementsList.length; i++)
		{
			var svgElement = Doc.elementsList[i].render();
			elementsGroup.appendChild(svgElement);
		}

		elementsGroup.setAttributeNS(null, 'transform', Doc.transform());

		while (workspace.getSVG().getById('layers').firstChild)
			workspace.getSVG().getById('layers').removeChild(workspace.getSVG().getById('layers').firstChild);
		
		workspace.getSVG().getById('layers').appendChild(elementsGroup);

		$this.setSize(Doc.width, Doc.height);
	};

	var execCode = function($code)
	{
		console.log($code);

		var code = $code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

		var scriptParent = script.parentNode;

		if (utils.isset(scriptParent))
			scriptParent.removeChild(script);
		
		Doc.empty();

		script = new Component('<script type="text/javascript" >var scriptToExec = function() { ' + code + '\n};\n try { scriptToExec();\nviewManager.emptyError();\nviewManager.render(); }\ncatch($error) { viewManager.displayError($error); } </script>');
		document.getElementById('main').appendChild(script);
	};

	var onChange = function($code)
	{
		$this.setSaved(false);
	};

	var execProgram = function()
	{
		var codeToExec = codeEditor.getCode();
		execCode(codeToExec);
	};

	this.insertAsset = function($data)
	{
		//codeEditor.getById('editor').appendChild(document.createTextNode('\n\rvar asset = new Asset("' + $data + '");'));
		//codeEditor.getById('editor').appendChild(new Component('<p style="padding: 0px; margin: 0px; height: 0px;" ></p>'));
		//codeEditor.getById('editor').appendChild(document.createTextNode('\n\r'));
		//codeEditor.refresh();

		var codeToInsert = '\n\rvar asset = new Asset("' + $data + '");\n\r';
		codeEditor.insertCode(codeToInsert);
		
		$this.setSaved(false);
	};

	this.insertCode = function($code)
	{
		//codeEditor.insertCode('\n\r' + $code + '\n\r');
		codeEditor.insertCode('\n\r' + $code.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>') + '\n\r');
	};

	var pasteCode = function($code)
	{
		var code = $code;

		if (/^<\?xml/.test($code) || /<\/[a-zA-Z]+>/.test($code) || /<[^<]+\/>/.test($code))
		{
			console.log("Traitement SVG");

			var code = '';

			$code = $code.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '');
			$code = $code.replace(/^<\?xml[^<]*>/, '');
			$code = $code.replace(/^<!DOCTYPE[^<]*>/, '');

			if (!/^<svg/.test($code))
				$code = '<svg viewBox="0 0 1000 1000" >' + $code + '</svg>';

			console.log($code);

			var b64Code = btoa($code);

			var flatSVG = VectorUtils.flatSVGtree(b64Code);

			for (var i = 0; i < flatSVG.length; i++)
			{
				var svgNode = new Component(flatSVG[i].code);
				var subCode = VectorUtils.svgNodeToCode(svgNode);
				subCode = subCode.replaceAll('wire', 'wire' + i);
				code = code + subCode + '\n\r';
			}

			console.log(code);
		}

		return code;
	};

	this.restoreScroll = function() { codeEditor.restoreScroll(); };

	this.displayError = function($error)
	{
		console.log($error);
		errorConsole.getById('errorConsole').innerHTML = $error.stack;
	};

	this.emptyError = function()
	{
		errorConsole.getById('errorConsole').innerHTML = "";

		var scriptParent = script.parentNode;

		if (utils.isset(scriptParent))
			scriptParent.removeChild(script);
	};

	this.centerView = function()
	{
		var width = grid.getById('leftPanel').offsetWidth;
		var height = grid.getById('leftPanel').offsetHeight;
		var ratio = width/height;

		var docWidth = workspace.getDocWidth();
		var docHeight = workspace.getDocHeight();
		var offsetX = (width-docWidth)/2;
		var offsetY = (height-docHeight)/2;
		workspace.setOffsetX(offsetX);
		workspace.setOffsetY(offsetY);

		if (docWidth > 8.0/10.0*width || docHeight > 8.0/10.0*height)
		{
			var docRatio = docWidth/docHeight;
			var scale = 1.0;

			if (docRatio > ratio)
				scale = (8.0/10.0*width)/docWidth;
			else
				scale = (8.0/10.0*height)/docHeight;

			workspace.setScale(scale);

			offsetX = (width/2.0) * (1.0 - scale) + offsetX*scale;
			offsetY = (height/2.0) * (1.0 - scale) + offsetY*scale;

			workspace.setOffsetX(offsetX);
			workspace.setOffsetY(offsetY);
		}
	};

	var updateDocumentSize = function()
	{
		workspace.setDocDimensions(width, height);
		//$this.centerView();
	};

	this.exportToSVGFile = function()
	{
		return workspace.exportToSVGFile();
	};

	this.exportToPNGFile = function($callback)
	{
		workspace.exportToPNGFile($callback);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onResize = function()
	{
		var width = grid.getById('leftPanel').offsetWidth;
		var height = grid.getById('leftPanel').offsetHeight;

		workspace.setDimensions(width, height);

		if (initDisplay === false)
			$this.centerView();

		initDisplay = true;
	};
	
	codeEditor.onPaste = function($code) { return pasteCode($code); };
	codeEditor.onChange = function($code) { onChange($code); };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	this.getFilePath = function() { return filePath; };
	this.isSaved = function() { return saved; };
	this.getCode = function() { return codeEditor.getCode(); };
	
	// SET
	
	this.setWidth = function($width)
	{
		width = $width;
		updateDocumentSize();
	};

	this.setHeight = function($height)
	{
		height = $height;
		updateDocumentSize();
	};

	this.setFilePath = function($filePath) { filePath = $filePath; };

	this.setSaved = function($saved)
	{
		saved = $saved;
		viewManager.updateSavedStatus(saved);

		if (saved === false)
			window.electronAPI.setNotSavedFiles(true);
	};

	this.setSize = function($width, $height)
	{
		width = $width;
		height = $height;
		updateDocumentSize();
	};

	this.setCode = function($code)
	{
		codeEditor.setCode($code);
		onChange($code);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("document");

