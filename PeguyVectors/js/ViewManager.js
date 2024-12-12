function ViewManager()
{
	///////////////
	// Attributs //
	///////////////
	
	var component = new Component('<div></div>');

	//// Menu Bar ////

	var menuBar = new MenuBar();
	/*
	var positionConsole = new PositionConsole();
	//*/
	
	// File 
					
	var menuBarItemFile = new MenuItem("File");
	var itemNew = new MenuItem("New");
	var itemOpenFile = new MenuItem("Open file...");
	var itemOpenRecent = new MenuItem("Open recent");
	var itemSave = new MenuItem("Save");
	var itemSaveAs = new MenuItem("Save as...");
	var itemExport = new MenuItem("Export");

	var itemExportSVG = new MenuItem("To SVG file...");
	var itemExportPNG = new MenuItem("To PNG file...");
	
	// Edit

	var menuBarItemEdit = new MenuItem("Edit");
	var itemDocumentSize = new MenuItem("Document size...");
	var itemBackgroundColor = new MenuItem("Background color...");

	// Insert

	var menuBarItemInsert = new MenuItem("Insert");
	var itemAsset = new MenuItem("Asset...");

	// Doc

	var menuBarItemHelp = new MenuItem("Help");

	//// Grille ////

	var appGrid = new AppGrid();

	//// Tab manager ////

	tabManager = new TabManager();
	tabManager.setEditMode(true);

	appGrid.getById('leftPanel').appendChild(tabManager);

	//// Asset manager ////

	var assetLibrary = new AssetManager();

	//// Espace des ressources ////

	var resourcesTabManager = new TabManager();
	appGrid.getById('rightPanel').appendChild(resourcesTabManager);

	//// Panneau de saisie de code rapide ////

	var quickCodePanel = QuickCodePanel();
	resourcesTabManager.addTab(new Tab('Quick code', quickCodePanel));

	//////////////
	// Méthodes //
	//////////////

	this.init = function()
	{
		document.getElementById('screen').removeAllChildren();

		//// Menu Bar ////

		document.getElementById('screen').appendChild(menuBar);

		// File 

		itemSave.setDisable(true);
		itemSaveAs.setDisable(true);
		//itemExport.setDisable(true);
		itemExportSVG.setDisable(true);
		itemExportPNG.setDisable(true);

		menuBar.addElement(menuBarItemFile);
		menuBarItemFile.addElement(itemNew);
		menuBarItemFile.addElement(itemOpenFile);
		menuBarItemFile.addElement(itemOpenRecent);
		menuBarItemFile.addElement(itemSave);
		menuBarItemFile.addElement(itemSaveAs);
		menuBarItemFile.addElement(itemExport);

		itemExport.addElement(itemExportSVG);
		itemExport.addElement(itemExportPNG);

		// Edit

		itemDocumentSize.setDisable(true);
		itemBackgroundColor.setDisable(true);

		//menuBar.addElement(menuBarItemEdit);
		menuBarItemEdit.addElement(itemDocumentSize);
		//menuBarItemEdit.addElement(itemBackgroundColor);

		// Insert

		menuBar.addElement(menuBarItemInsert);
		menuBarItemInsert.addElement(itemAsset);

		// Doc

		menuBar.addElement(menuBarItemHelp);

		//// Tab manager ////

		//document.getElementById('screen').appendChild(tabManager);
		document.getElementById('screen').appendChild(appGrid);
		//tabManager.style.top = '34px';
		$this.focus();

		//// Asset manager ////

		//assetLibrary.getAssetList();

		/*
		grid.getById('leftPanel').appendChild(positionConsole);
		//*/
		
		//buttonsPanel.focus();

		window.electronAPI.loadSettingsInGUI();
	};
	
	this.resize = function()
	{
		
	};

	var activateMenu = function()
	{
		itemSave.setDisable(false);
		itemSaveAs.setDisable(false);
		//itemExport.setDisable(false);
		itemExportSVG.setDisable(false);
		itemExportPNG.setDisable(false);
		itemDocumentSize.setDisable(false);
		itemBackgroundColor.setDisable(false);
	};

	var createNewTab = function($tabName, $filePath, $code)
	{
		var newDocument = new Document();
		var tab = new Tab('<span>' + $tabName + '</span>', newDocument);
		tabManager.addTab(tab);
		newDocument.setFilePath($filePath);
		newDocument.setCode($code);
		newDocument.centerView();
		newDocument.setSaved(true);

		activateMenu();

		tab.onClose = function()
		{
			var close = false;

			var saved = tab.getContent().isSaved();

			if (saved === true)
				close = true;
			else
			{
				var savePopup = new SavePopup('<p>The modifications of the file "' + tab.getContent().getFilePath() + '" have not been saved. Do you want save them before closing ? </p>');
				document.getElementById('main').appendChild(savePopup);

				savePopup.onDontSave = function()
				{
					tabManager.removeTab(tab);
					return true;
				};

				savePopup.onSave = async function()
				{
					var saveSuccess = await save(tab);

					if (saveSuccess !== true)
					{
						var message = '<p style="text-align: left;" >An error occured when trying to save the file "' + tab.getLabel() + '".</p>';
						notifCenter.push(message, false);
					}
					else
					{
						tabManager.removeTab(tab);
						this.hide();
					}

					return saveSuccess;
				};
			}

			return close;
		};

		tab.onSelect = function($tab) { $tab.getContent().restoreScroll(); };
	};

	this.checkSavedFiles = function()
	{
		var isNotSavedFiles = false;

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			if (tabList[i].getContent().isSaved() === false)
			{
				isNotSavedFiles = true;
				i = tabList.length;
			}
		}

		window.electronAPI.setNotSavedFiles(isNotSavedFiles);
	};

	this.confirmCloseApp = function()
	{
		var savePopup = new SavePopup('<p>The modifications of some files have not been saved. Do you want save them before closing ? </p>');
		document.getElementById('main').appendChild(savePopup);

		savePopup.onDontSave = function()
		{
			window.electronAPI.setNotSavedFiles(false);
			window.electronAPI.quit();
			return true;
		};

		savePopup.onSave = async function()
		{
			var tabList = tabManager.getTabList();

			for (var i = 0; i < tabList.length; i++)
			{
				if (tabList[i].getContent().isSaved() === false)
					await save(tabList[i]);
			}

			window.electronAPI.quit();

			return true;
		};
	};

	var save = async function($tab)
	{
		var success = false;
		var fileName = '';

		var filePath = $tab.getContent().getFilePath();
		var code = $tab.getContent().getCode();

		// Enregistrer fichier existant
		if (utils.isset(filePath) && filePath !== '')
		{
			const file = await window.electronAPI.saveFile(filePath, code);

			if (utils.isset(file))
			{
				fileName = file.name;
				success = true;
			}
		}
		// Enregistrer un nouveau fichier
		else
		{
			const file = await window.electronAPI.saveFileAs(code);

			if (utils.isset(file))
			{
				fileName = file.name;
				$tab.setLabel('<span>' + file.name + '</span>');
				$tab.getContent().setFilePath(file.path);
				success = true;
			}
		}

		if (success === true)
		{
			$tab.getContent().setSaved(true);
			var message = '<p style="text-align: left;" >The file "' + fileName + '" has been saved.</p>';
			notifCenter.push(message, false);
			$this.checkSavedFiles();
		}

		return success;
	};

	var checkIfOpen = function($filePath)
	{
		var open = false;

		var tabList = tabManager.getTabList();

		for (var j = 0; j < tabList.length; j++)
		{
			// S'il est ouvert, on met le focus sur son onglet
			if ($filePath === tabList[j].getContent().getFilePath())
			{
				tabList[j].select();
				open = true;
				j = tabList.length;
			}
		}

		return open;
	};

	this.updateRecentFiles = function($recentFiles)
	{
		itemOpenRecent.removeAllElements();

		for (var i = $recentFiles.recentFiles.length-1; i >= 0 ; i--)
		{
			var recentFileItem = new MenuItem($recentFiles.recentFiles[i]);

			itemOpenRecent.addElement(recentFileItem);

			recentFileItem.onAction = async function()
			{
				const file = await window.electronAPI.openRecentFile(this.getLabel());

				if (utils.isset(file))
				{
					if (checkIfOpen(file.path) === false)
						createNewTab(file.name, file.path, file.content);
				}
				else
				{
					var message = '<p style="text-align: left;" >The file "' + this.getLabel() + '" doesn\'t exist.</p>';
					notifCenter.push(message, false);
				}
			};
		}
	};

	this.updateAssetManager = function($assets) { assetLibrary.loadAssetList($assets); };

	this.displayError = function($error)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.getContent().displayError($error);
	};

	this.emptyError = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.getContent().emptyError();
	};

	this.render = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.getContent().render();
	};

	this.updateSavedStatus = function($saved)
	{
		var notSavedMark = '<span style="color: rgb(242, 98, 33); " >•</span> ';

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var tabLabel = selectedTab.getLabel();

			if ($saved === true)
			{
				var newLabel = tabLabel.replace(notSavedMark, '');
				selectedTab.setLabel(newLabel);
			}
			else if (tabLabel.indexOf(notSavedMark) < 0)
			{
				var newLabel = notSavedMark + tabLabel;
				selectedTab.setLabel(newLabel);
			}
		};
	};

	this.insertCode = function($codeToInsert)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.getContent().insertCode($codeToInsert);
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	//// File ////

	itemNew.onAction = function()
	{
		//console.log("New");
		createNewTab("New document", "", "");
	};

	itemOpenFile.onAction = async function()
	{
		//console.log("Open file...");

		const filesList = await window.electronAPI.openFile();
		var tabList = tabManager.getTabList();

		for (var i = 0; i < filesList.length; i++)
		{
			if (checkIfOpen(filesList[i].path) === false)
				createNewTab(filesList[i].name, filesList[i].path, filesList[i].content);
		}
	};

	itemSave.onAction = async function()
	{
		//console.log("Save");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	itemSaveAs.onAction = async function()
	{
		//console.log("Save as...");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var code = selectedTab.getContent().getCode();

			const file = await window.electronAPI.saveFileAs(code);

			if (utils.isset(file))
			{
				selectedTab.setLabel('<span>' + file.name + '</span>');
				selectedTab.getContent().setFilePath(file.path);
				selectedTab.getContent().setSaved(true);
				var message = '<p style="text-align: left;" >The file "' + file.name + '" has been saved.</p>';
				notifCenter.push(message, false);
				$this.checkSavedFiles();
			}
		}
	};

	itemExportSVG.onAction = async function()
	{
		//console.log("Export to SVG...");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var fileData = selectedTab.getContent().exportToSVGFile();

			const file = await window.electronAPI.exportToSVG(fileData);

			if (utils.isset(file))
			{
				var message = '<p style="text-align: left;" >The image has been exported to the file "' + file.name + '".</p>';
				notifCenter.push(message, false);
			}
		}
	};

	itemExportPNG.onAction = async function()
	{
		console.log("Export to PNG...");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			selectedTab.getContent().exportToPNGFile(async function($img)
			{
				var fileData = $img.src.replace('data:image/png;base64,', '');

				//console.log(fileData);

				const file = await window.electronAPI.exportToPNG(fileData);

				if (utils.isset(file))
				{
					var message = '<p style="text-align: left;" >The image has been exported to the file "' + file.name + '".</p>';
					notifCenter.push(message, false);
				}
			});
		}
	};
	
	//// Edit ////

	itemDocumentSize.onAction = function()
	{
		console.log("Document size...");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var width = selectedTab.getContent().getWidth();
			var height = selectedTab.getContent().getHeight();
			var popup = new DocumentSizePopup(width, height);

			popup.onOk = function()
			{
				var width = popup.getWidth();
				var height = popup.getHeight();
				selectedTab.getContent().setSize(width, height);
				return true;
			};

			document.getElementById('main').appendChild(popup);
		}
	};

	itemBackgroundColor.onAction = function()
	{
		console.log("Background color...");
	};

	//// Insert ////

	itemAsset.onAction = function()
	{
		console.log("Insert asset...");
		document.getElementById('main').appendChild(assetLibrary);
	};

	//// Help ////

	menuBarItemHelp.onAction = function()
	{
		console.log("Help !");
		var helpPopup = new HelpPopup();
		document.getElementById('main').appendChild(helpPopup);
	};

	//// Asset manager ////

	assetLibrary.onOk = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var data = assetLibrary.getSelectedData();
			selectedTab.getContent().insertAsset(data);
		}
		
		return true;
	};

	//// Clavier ////
	
	Events.save = function($event)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	Events.saveAs = function($event)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	/*
	this.getPositionConsole = function() { return positionConsole; };
	//*/
	
	// SET

	var $this = utils.extend(component, this);
	var timer = setInterval(function() { $this.focus(); }, 50);
	return $this;
}
	
// A la fin du fichier Javascript, on signale au module de chargement que le fichier a fini de charger.
if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("viewManager");

