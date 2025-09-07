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

	var workspace = new Workspace(this, 800, 600, width, height);

	var iconsMenuParam = 
	[
		{ name: "run-script", iconFile: "icons", iconName: "right-double-arrow-icon", toolTip: "Run script", action: function() { execProgram(); } },
		{ name: "add-script", iconFile: "icons", iconName: "add-element-icon", toolTip: "Add script", action: function() { addScript(); } },
	];

	var iconsMenu = new IconsMenu(iconsMenuParam, 20);

	grid.getById('toolsPanel').appendChild(iconsMenu);

	var tabManager = new TabManager();
	tabManager.setEditMode(true);

	var mainScriptEditor = new CodeEditor('javascript');

	var mainTab = new Tab('<span>' + "main.js" + '</span>', mainScriptEditor);
	tabManager.addTab(mainTab);

	var script = new Component('<script type="text/javascript" ></script>');
	var errorConsoleHTML = '<pre><code id="errorConsole" ></code></pre>';
	var errorConsole = new Component(errorConsoleHTML);
	
	grid.getById('codePanel').appendChild(tabManager);
	grid.getById('topPanel').appendChild(workspace);
	grid.getById('bottomPanel').appendChild(errorConsole);

	// Ajouter un bouton pour accéder à une bibliothèque d'assets

	//////////////
	// Méthodes //
	//////////////

	var scriptNameIsOk = function($scriptName)
	{
		var scriptNameOk = false;
		var scriptName = $scriptName.replace(/\.js$/, "");

		if (/^[a-zA-Z0-9]+$/.test(scriptName))
			scriptNameOk = true;

		return scriptNameOk;
	};

	var scriptNameDoesntExist = function($scriptName)
	{
		var scriptNameOk = true;
		var scriptName = $scriptName.replace(/\.js$/, "");

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			var label = tabList[i].getLabel();
			label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");

			if (label === scriptName)
				scriptNameOk = false;
		}

		return scriptNameOk;
	};

	var addScript = function()
	{
		var addScriptPopup = new ConfirmPopup('<h3>Add script</h3><p><input id="script-name" type="text" placeholder="Script name" /></p>');

		addScriptPopup.onOk = function()
		{
			var ok = false;

			var scriptName = this.getById('script-name').value;

			if (utils.isset(scriptName) && scriptName !== "" && scriptNameIsOk(scriptName) === true && scriptNameDoesntExist(scriptName) === true)
			{
				var newCodeEditor = new CodeEditor('javascript');
				scriptName = scriptName.replace(/\.js$/, "");
				var newTab = new Tab('<span>' + scriptName + '.js</span>', newCodeEditor);
				tabManager.addTab(newTab);

				newTab.onClose = function()
				{
					var close = false;
					var label = this.getLabel();
					label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");
					var removePopup = new ConfirmPopup('<p>Are you sure you want to remove the script "' + label + '" ? </p>');
					document.getElementById('main').appendChild(removePopup);
					removePopup.tabToRemove = this;

					removePopup.onOk = function()
					{
						var removeOk = true;
						this.tabToRemove.onClose = function() { return true; };
						tabManager.removeTab(this.tabToRemove);
						return removeOk;
					};

					return close;
				};

				newTab.onSelect = function($tab) { $tab.getContent().restoreScroll(); };

				newCodeEditor.onPaste = function($code) { return pasteCode($code); };
				newCodeEditor.onChange = function($code) { onChange($code); };

				$this.setSaved(false);
				ok = true;
			}
			else if (scriptNameIsOk(scriptName) !== true)
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>The script name is incorrect (only ASCII characters).</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else if (scriptNameDoesntExist(scriptName) !== true)
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>A script with this name already exists.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>The script name can\'t be empty.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}

			return ok;
		};

		document.getElementById('main').appendChild(addScriptPopup);
	};

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

		while (workspace.getPattern().getById('defs').firstChild)
			workspace.getPattern().getById('defs').removeChild(workspace.getPattern().getById('defs').firstChild);

		for (var i = 0; i < Doc.defList.length; i++)
		{
			var svgElement = Doc.defList[i].render();
			workspace.getPattern().getById('defs').appendChild(svgElement);
		}

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
		
		workspace.empty();
		Doc.empty();
		viewManager.render();

		script = new Component('<script type="text/javascript" >var scriptToExec = function() { ' + code + '\n};\n try { scriptToExec();\nviewManager.emptyError();\nviewManager.render(); }\ncatch($error) { viewManager.displayError($error); } </script>');
		document.getElementById('main').appendChild(script);
	};

	var onChange = function($code)
	{
		$this.setSaved(false);
	};

	var execProgram = async function()
	{
		waitScreen.setContent("<h2>Computing... Please wait.</h2>");
		document.getElementById('main').appendChild(waitScreen);

		viewManager.emptyError();
		Doc.empty();
		viewManager.render();

		if (utils.isset(execConfig))
		{
			for (var i = 0; i < execConfig.scripts.length; i++)
				Loader.removeScript(execConfig.scripts[i].tmpFile);
		}

		var plugins = viewManager.getPlugins();

		for (var i = 0; i < plugins.length; i++)
			Loader.removeScript(plugins[i]);

		plugins = window.electronAPI.refreshPlugIns();

		for (var i = 0; i < plugins.length; i++)
			Loader.addScript(plugins[i], plugins[i]);

		var tmpCode = $this.getCode();

		execConfig = await window.electronAPI.execProgram(filePath, tmpCode);

		if (utils.isset(execConfig))
		{
			for (var i = 0; i < execConfig.scripts.length; i++)
			{
				if (execConfig.scripts[i].name !== 'main' && execConfig.scripts[i].name !== 'main.js')
					Loader.addScript('file://' + execConfig.scripts[i].tmpFile, execConfig.scripts[i].tmpFile);
					//Loader.addScript('file://' + filePath + '/run/' + execConfig.scripts[i].tmpFile, execConfig.scripts[i].tmpFile);
			}

			Loader.onload = function()
			{
				//viewManager.refresh();

				for (var i = 0; i < execConfig.scripts.length; i++)
				{
					if (execConfig.scripts[i].name === 'main' || execConfig.scripts[i].name === 'main.js')
						Loader.addScript('file://' + execConfig.scripts[i].tmpFile, execConfig.scripts[i].tmpFile);
						//Loader.addScript('file://' + filePath + '/run/' + execConfig.scripts[i].tmpFile, execConfig.scripts[i].tmpFile);
				}

				Loader.onload = function()
				{
					viewManager.render();
					document.getElementById('main').removeChild(waitScreen);
				};
				
				Loader.load();
			};

			Loader.load();
		}

		/*
		GL_BUFFERS = [];
		NB_GL_INSTANCES = 0;

		//viewManager.save();

		var codeToExec = mainScriptEditor.getCode();

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			var label = tabList[i].getLabel();
			label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");
			
			if (label !== 'main')
			{
				var scriptCode = tabList[i].getContent().getCode();
				codeToExec = codeToExec.replace("loadScript('" + label + "')", scriptCode);
				codeToExec = codeToExec.replace("loadScript('" + label + ".js')", scriptCode);
				codeToExec = codeToExec.replace('loadScript("' + label + '")', scriptCode);
				codeToExec = codeToExec.replace('loadScript("' + label + '.js")', scriptCode);
				codeToExec = codeToExec.replaceAll("loadScript('" + label + "')", '');
				codeToExec = codeToExec.replaceAll("loadScript('" + label + ".js')", '');
				codeToExec = codeToExec.replaceAll('loadScript("' + label + '")', '');
				codeToExec = codeToExec.replaceAll('loadScript("' + label + '.js")', '');
			}
			else
			{
				codeToExec = codeToExec.replaceAll("loadScript('main')", '');
				codeToExec = codeToExec.replaceAll("loadScript('main.js')", '');
				codeToExec = codeToExec.replaceAll('loadScript("main")', '');
				codeToExec = codeToExec.replaceAll('loadScript("main.js")', '');
			}
		}

		execCode(codeToExec);

		//previewPanel.resize();
		//*/
	};

	this.insertAsset = function($data)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var selectedScriptEditor = selectedTab.getContent();
			//codeEditor.getById('editor').appendChild(document.createTextNode('\n\rvar asset = new Asset("' + $data + '");'));
			//codeEditor.getById('editor').appendChild(new Component('<p style="padding: 0px; margin: 0px; height: 0px;" ></p>'));
			//codeEditor.getById('editor').appendChild(document.createTextNode('\n\r'));
			//codeEditor.refresh();

			var codeToInsert = '\n\rvar asset = new Asset("' + $data + '");\n\r';
			selectedScriptEditor.insertCode(codeToInsert);
			$this.setSaved(false);
		}
	};

	this.insertCode = function($code)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var selectedScriptEditor = selectedTab.getContent();
			//selectedScriptEditor.insertCode('\n\r' + $code + '\n\r');
			selectedScriptEditor.insertCode('\n\r' + $code.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>') + '\n\r');
			$this.setSaved(false);
		}
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

	this.restoreScroll = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var selectedScriptEditor = selectedTab.getContent();
			selectedScriptEditor.restoreScroll();
		}
	};

	this.displayError = function($message, $source, $lineno, $colno, $error)
	{
		var source = $source;

		if (utils.isset(execConfig))
		{
			for (var i = 0; i < execConfig.scripts.length; i++)
			{
				if ($source.indexOf(execConfig.scripts[i].tmpFile) >= 0)
					source = execConfig.scripts[i].name;
			}
		}

		var stack = (new Error()).stack;
		errorConsole.getById('errorConsole').innerHTML = errorConsole.getById('errorConsole').innerHTML + $message + ' (at ' + source + '.js:' + $lineno + ':' + $colno + ')<br />';
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

	mainTab.onClose = function()
	{
		var close = false;
		var infoPopup = new InfoPopup('<p>Main script can\'t be removed.</p>');
		document.getElementById('main').appendChild(infoPopup);
		return close;
	};

	//this.onKeyDown = function($event) { mainScriptEditor.onKeyDown($event); };
	mainScriptEditor.onPaste = function($code) { return pasteCode($code); };
	mainScriptEditor.onChange = function($code) { onChange($code); };

	this.onResize = function()
	{
		var width = grid.getById('leftPanel').offsetWidth;
		var height = grid.getById('leftPanel').offsetHeight;

		workspace.setDimensions(width, height);

		if (initDisplay === false)
			$this.centerView();

		initDisplay = true;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	this.getFilePath = function() { return filePath; };
	this.isSaved = function() { return saved; };
	//this.getCode = function() { return codeEditor.getCode(); };

	this.getCode = function()
	{
		var code = {};

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			var label = tabList[i].getLabel();
			label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");
			var scriptCode = tabList[i].getContent().getCode();
			code[label] = scriptCode;
		}

		return code;
	};
	
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
		console.log($code);

		for (var key in $code)
		{
			if (key === 'main')
				mainScriptEditor.setCode($code['main']);
			else
			{
				var newCodeEditor = new CodeEditor('javascript');
				var newTab = new Tab('<span>' + key + '.js</span>', newCodeEditor);
				tabManager.addTab(newTab);

				newTab.onClose = function()
				{
					var close = false;
					var label = this.getLabel();
					label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");
					var removePopup = new ConfirmPopup('<p>Are you sure you want to remove the script "' + label + '" ? </p>');
					document.getElementById('main').appendChild(removePopup);
					removePopup.tabToRemove = this;

					removePopup.onOk = function()
					{
						var removeOk = true;
						this.tabToRemove.onClose = function() { return true; };
						tabManager.removeTab(this.tabToRemove);
						return removeOk;
					};

					return close;
				};

				newCodeEditor.setCode($code[key]);
				newCodeEditor.onPaste = function($code) { return pasteCode($code); };
				newCodeEditor.onChange = function($code) { onChange($code); };
			}
		}

		tabManager.getTabList()[0].select();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("document");

