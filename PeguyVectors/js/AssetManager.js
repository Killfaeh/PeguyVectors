function AssetManager()
{
	///////////////
	// Attributs //
	///////////////

	var popupHTML = '<h2>Assets library</h2>'
						+ '<div id="asset-list-block" class="asset-list-block" >'
							+ '<ul id="asset-list" class="asset-list" ></ul>'
						+ '</div>'
						+ '<div id="manageButtons" class="manageButtons" ></div>';
	
	var popup = new ConfirmPopup(popupHTML);
	//var popup = new InfoPopup(popupHTML);
	
	popup.addClass('asset-manager-popup');

	var addNewButton = new InputFile('image/*', '', '', 'imgFile-' + popup.getId());
	var newIcon = Loader.getSVG('icons', 'plus-icon', 30, 30);
	addNewButton.getById('icon').appendChild(newIcon);

	var editButton = new InputFile('image/*', '', '', 'imgFile-' + popup.getId());
	var editIcon = Loader.getSVG('icons', 'edit-icon', 30, 30);
	editButton.getById('icon').appendChild(editIcon);
	editButton.style.display = 'none';

	var deleteIcon = Loader.getSVG('icons', 'trash-icon', 30, 30);
	deleteIcon.style.display = 'none';

	var iconsMenuList = 
	[ 
		{ name: "add", iconFile: "icons", iconName: "plus-icon", toolTip: "Load from computer", action: function() { console.log("Load from computer"); } },
		{ name: "edit", iconFile: "icons", iconName: "edit-icon", toolTip: "Edit", action: function() { openEditPopup(); } },
		{ name: "remove", iconFile: "icons", iconName: "trash-icon", toolTip: "Remove", action: function() { confirmDeleteAsset(); } },
	];

	var iconsMenu = IconsMenu(iconsMenuList, 30);
	iconsMenu.hide('edit');
	iconsMenu.hide('remove');

	//popup.getById('manageButtons').appendChild(addNewButton);
	//popup.getById('manageButtons').appendChild(editButton);
	//popup.getById('manageButtons').appendChild(deleteIcon);
	popup.getById('manageButtons').appendChild(iconsMenu);

	var displayFreezeScreen = function() {};
	var hideFreezeScreen = function() {};

	var params = {};
	var assetList = [];
	var selected = null;
	
	var imagesToUpload = [];
	var imagesUploaded = 0;
	var uploadedUrls = [];

	//////////////
	// Méthodes //
	//////////////

	this.loadAssetList = function($assets)
	{
		for (var i = 0; i < $assets.assets.length; i++)
		{
			// var jsonData = { id: id, name: $file.name, type: $file.type, keywords: '', description: '', data: $file.data.replace('data:image/svg+xml;base64,', ''), item: item, viewBox: item.getById('svg').getAttribute('viewBox'), flatTree: flatTree };

			var jsonData = $assets.assets[i];

			var svgCode = atob(jsonData.data.replace('data:image/svg+xml;base64,', ''));
			//console.log(svgCode);
			svgCode = svgCode.replaceAll('\n', '');
			svgCode = svgCode.replaceAll('\t', '');
			svgCode = svgCode.replace(/^<.*\?>/, '');
			svgCode = svgCode.replace(/<svg/, '<svg id="svg" ');
			svgCode = svgCode.replace(/<!DOCTYPE .*><svg/, '<svg');

			var itemHTML = '<li imgId="' + jsonData.id + '" base64Code="' + jsonData.data + '">'
								+ '<div class="preview" >'
									+ svgCode
									+ '<p>' +  jsonData.name + '</p>'
								+ '</div>'
								+ '<div id="magnifying-glass" class="magnifying-glass" ></div>'
								+ '<div class="wall" ></div>'
							+ '</li>';
			
			var item = new Component(itemHTML);
			
			var magnifyingGlassIcon = Loader.getSVG('icons', 'magnifying-glass-icon', 25, 25);
			item.getById('magnifying-glass').appendChild(magnifyingGlassIcon);

			 /*
			item.getById('magnifying-glass').onClick = function()
			{
				var imagePopup = new ImagePopup(this.parentNode.getById('img').src, '');
				document.getElementById('main').appendChild(imagePopup);
			};
			//*/
			
			item.onMouseOver = function()
			{
				var svg = this.getById('svg');
				var svgWidth = svg.offsetWidth;
				var svgHeight = svg.offsetHeight;
				
				if (svgWidth > svgHeight)
					this.getById('magnifying-glass').style.top =  ((svgWidth-svgHeight)/2) + 'px';
				else
					this.getById('magnifying-glass').style.top =  ((svgHeight-svgWidth)/2) + 'px';
				
				this.getById('magnifying-glass').style.display = 'block';
			};

			item.onMouseOut = function() { this.getById('magnifying-glass').style.display = 'none'; };
			item.onClick = function() { $this.select(this); };

			jsonData.item = item;
			assetList.push(jsonData);

			popup.getById('asset-list').appendChild(item);
		}
	};

	var addAsset = function($file)
	{
		var id = (new Date()).getTime();

        var svgCode = atob($file.data.replace('data:image/svg+xml;base64,', ''));
		//console.log(svgCode);
        svgCode = svgCode.replaceAll('\n', '');
        svgCode = svgCode.replaceAll('\t', '');
        svgCode = svgCode.replace(/^<.*\?>/, '');
        svgCode = svgCode.replace(/<svg/, '<svg id="svg" ');
        svgCode = svgCode.replace(/<!DOCTYPE .*><svg/, '<svg');

		var itemHTML = '<li imgId="' + id + '" base64Code="' + $file.data + '">'
							+ '<div class="preview" >'
        	                    + svgCode
								+ '<p>' +  $file.name + '</p>'
							+ '</div>'
							+ '<div id="magnifying-glass" class="magnifying-glass" ></div>'
							+ '<div class="wall" ></div>'
						+ '</li>';
		
		var item = new Component(itemHTML);
		
		var magnifyingGlassIcon = Loader.getSVG('icons', 'magnifying-glass-icon', 25, 25);
		item.getById('magnifying-glass').appendChild(magnifyingGlassIcon);

		 /*
		item.getById('magnifying-glass').onClick = function()
		{
			var imagePopup = new ImagePopup(this.parentNode.getById('img').src, '');
			document.getElementById('main').appendChild(imagePopup);
		};
        //*/
		
		item.onMouseOver = function()
		{
			var svg = this.getById('svg');
			var svgWidth = svg.offsetWidth;
			var svgHeight = svg.offsetHeight;
			
			if (svgWidth > svgHeight)
				this.getById('magnifying-glass').style.top =  ((svgWidth-svgHeight)/2) + 'px';
			else
				this.getById('magnifying-glass').style.top =  ((svgHeight-svgWidth)/2) + 'px';
			
			this.getById('magnifying-glass').style.display = 'block';
		};

		item.onMouseOut = function() { this.getById('magnifying-glass').style.display = 'none'; };
		item.onClick = function() { $this.select(this); };

		var flatTree = VectorUtils.flatSVGtree($file.data);
		
		console.log(item);

		var jsonData = { id: id, name: $file.name, type: $file.type, keywords: '', description: '', data: $file.data.replace('data:image/svg+xml;base64,', ''), item: item, viewBox: item.getById('svg').getAttribute('viewBox'), flatTree: flatTree };

		console.log(jsonData);

		assetList.push(jsonData);
		
		popup.getById('asset-list').appendChild(item);
		
		if (utils.isset(popup.getById('asset-list-block').scrollTo))
			popup.getById('asset-list-block').scrollTo(0, popup.getById('asset-list-block').scrollHeight);
		else
			popup.getById('asset-list-block').scrollTop = popup.getById('asset-list-block').scrollHeight;

		return item;
	};

	var addAssets = function($fileArray)
    {
        for (var i = 0; i < $fileArray.length; i++)
            addAsset($fileArray[i]);

		console.log(assetList);

		//viewManager.updateVectorialAssetsList();

		// Enregistrement de la bibliothèque avec Node.js
		saveAssets();
    };

	this.deselectAll = function()
	{
		selected = null;
		//editButton.style.display = 'none';
		//deleteIcon.style.display = 'none';
		iconsMenu.hide('edit');
		iconsMenu.hide('remove');
		
		for (var i = 0; i < assetList.length; i++)
            assetList[i].item.removeAttribute('class');
	};

	this.select = function($item)
	{
		$this.deselectAll();
		
		var id = $item.getAttribute('imgId');
		
		for (var i = 0; i < assetList.length; i++)
		{
			if (parseInt(id) === parseInt(assetList[i].id))
			{
				selected = assetList[i];
				selected.item.setAttribute('class', 'selected');
				//editButton.style.display = 'inline-block';
				//deleteIcon.style.display = 'inline-block';
				iconsMenu.display('edit');
				iconsMenu.display('remove');
				i = assetList.length;
			}
		}
	};

	var loadFromComputer = function()
	{
		// Appel à Node.js
	};

	var openEditPopup = function()
	{
		// Ouvrir une popup d'édition des info de l'asset

		if (utils.isset(selected))
		{
			var editPopup = new EditAssetPopup(selected);

			editPopup.onOk = function()
			{
				var keywords = this.getKeywords();
				var description = this.getDescription();
				selected.keywords = keywords;
				selected.description = description;
				//console.log(assetList);
				//viewManager.updateVectorialAssetsList();
				saveAssets();
				return true;
			};

			document.getElementById('main').appendChild(editPopup);
		}
	};

	var confirmDeleteAsset = function()
	{
		if (utils.isset(selected))
		{
			var confirmPopup = new ConfirmPopup('<div>'
													+ '<p>' + KEYWORDS.confirmDeleteImage + '</p>'
												+ '</div>', true);
												
			confirmPopup.onOk = function() 
			{
				deleteAsset(selected.id);
				return true;
			};
			
			document.getElementById('main').appendChild(confirmPopup);
		}
	};

	var deleteAsset = function($id)
	{
		// Suppression de l'asset

		for (var i = 0; i < assetList.length; i++)
		{
			var asset = assetList[i]; 

			if (asset.id === $id)
			{
				assetList.splice(i, 1);

				if (utils.isset(asset.item.parentNode))
					asset.item.parentNode.removeChild(asset.item);

				i = assetList.length;
			}
		}

		//viewManager.updateVectorialAssetsList();

		// Enregistrement de la bibliothèque avec Python
		saveAssets();
	};

	var saveAssets = function()
	{
		var jsonObject  = { assets: assetList };
		window.electronAPI.saveAssets(JSON.stringify(jsonObject));
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	var dragColor = 'rgb(60, 60, 60)';
	var dragEndColor = 'rgb(40, 40, 40)';

	popup.getById('asset-list-block').onDragEnter = function($event) { popup.getById('asset-list-block').style.backgroundColor = dragColor; };
	popup.getById('asset-list').onDragEnter = function($event) { popup.getById('asset-list-block').style.backgroundColor = dragColor; };
	popup.getById('asset-list-block').onDragLeave = function($event) { popup.getById('asset-list-block').style.backgroundColor = dragEndColor; };
	popup.getById('asset-list').onDragLeave = function($event) { popup.getById('asset-list-block').style.backgroundColor = dragEndColor; };
	popup.getById('asset-list-block').onDragEnd = function($event) { popup.getById('asset-list-block').style.backgroundColor = dragEndColor; };
	popup.getById('asset-list').onDragEnd = function($event) { popup.getById('asset-list-block').style.backgroundColor = dragEndColor; };

	var onDropFiles = function($event)
	{
		Files.drop($event, function($fileList)
		{
			console.log($fileList);

			popup.getById('asset-list-block').style.backgroundColor = dragEndColor;

			var filesToAdd = [];

			for (var i = 0; i < $fileList.length; i++)
			{
				if (/^image\/svg\+xml/.test($fileList[i].type))
					filesToAdd.push($fileList[i]);
			}

			addAssets(filesToAdd);
		});
	};

	popup.getById('asset-list-block').onDrop = function($event)
	{
		$this.onImagesUpload = function($urls) {};
		onDropFiles($event);
	};

	popup.getById('asset-list').onDrop = function($event)
	{
		$this.onImagesUpload = function($urls) {};
		onDropFiles($event);
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getDisplayFreezeScreen = function() { return displayFreezeScreen; };
	this.getHideFreezeScreen = function() { return hideFreezeScreen; };

	this.getGetImagesListRequest = function() { return getImagesListRequest; };
	this.getUploadImageRequest = function() { return uploadImageRequest; };
	this.getEditImageRequest = function() { return editImageRequest; };
	this.getDeleteImageRequest = function() { return deleteImageRequest; };
	
	this.getParams = function() { return params; };
	
	this.getSelected = function() { return selected; };

	this.getSelectedData = function()
	{
		var selectedData = null;
		
		if (utils.isset(selected))
            selectedData = selected.data;
		
		return selectedData;
	};

	this.getAssetList = function() { return assetList; }; 

	this.getAsset = function($assetId, $nodeId)
	{
		console.log($assetId + ', ' + $nodeId);

		var asset = null;

		for (var i = 0; i < assetList.length; i++)
		{
			console.log($assetId + ', ' + assetList[i].id);

			if (parseInt($assetId) === parseInt(assetList[i].id))
			{
				console.log('Affect asset');
				asset = assetList[i];
				i = assetList.length;
			}
		}

		var subAsset = null;

		if (utils.isset(asset))
		{
			console.log(asset.flatTree.length);

			for (var i = 0; i < asset.flatTree.length; i++)
			{
				console.log($nodeId + ', ' + asset.flatTree[i].id);

				if (parseInt($nodeId) === parseInt(asset.flatTree[i].id))
				{
					console.log('Affect subasset');
					subAsset = asset.flatTree[i];
					i = asset.flatTree.length;
				}
			}
		}

		return subAsset;
	};
	
	// SET

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("assetManager");