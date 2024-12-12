function EditAssetPopup($asset)
{
	///////////////
	// Attributs //
	///////////////

	var asset = $asset;
	var keywordsList = [];

	var svgCode = atob(asset.data.replace('data:image/svg+xml;base64,', ''));
    svgCode = svgCode.replaceAll('\n', '');
    svgCode = svgCode.replaceAll('\t', '');
    svgCode = svgCode.replace(/^<.*\?>/, '');
    svgCode = svgCode.replace(/<!DOCTYPE .*><svg/, '<svg id="svg" ');

	var popupHTML = '<h2>Edit asset info</h2>'
						+ '<div class="preview" >' + svgCode + '</div>'
						+ '<p><strong>' + "Keywords" + '</strong></p>'
						+ '<div id="keywordsDisplay" class="keywordsDisplay" ></div>'
						+ '<div><input id="keywordsInput" class="keywordsInput" type="text" /></div>'
						+ '<p><strong>' + "Description" + '</strong></p>'
						+ '<textarea id="description" >' + asset.description + '</textarea>';
	
	var popup = new ConfirmPopup(popupHTML);
	
	popup.addClass('edit-asset-popup');

	var keywordsDisplay = new LabelList();

	popup.getById('keywordsDisplay').appendChild(keywordsDisplay);

	var keywordsArray = asset.keywords.split(',');

	for (var i = 0; i < keywordsArray.length; i++)
	{
		var keyword = keywordsArray[i];

		if (keyword !== '' && !/^ +$/.test(keyword))
		{
			keyword = keyword.replace(/^ +/, '').replace(/ +$/, '');
			keywordNode = new Label(keyword);
			keywordsDisplay.addLabel(keywordNode);
		}
	}
	
	//////////////
	// Méthodes //
	//////////////

	var keywordInputOnChange = function($event)
	{
		var inputValue = popup.getById('keywordsInput').value;
		
		if (!/^,+$/.test(inputValue) && /.*,$/.test(inputValue))
		{
			var keyword = inputValue.replace(',', '').replace(/^ +/, '').replace(/ +$/, '').toLowerCase();
			var index = keywordsList.indexOf(keyword);
					
			if (index < 0)
			{
				keywordsList.push(keyword);
				keywordNode = new Label(keyword);
				keywordsDisplay.addLabel(keywordNode);
				
				keywordNode.onClose = function($keyword)
				{
					var index = keywordsList.indexOf($keyword);
			
					if (index >= 0)
						keywordsList.splice(index, 1);
				};
			}
			
			popup.getById('keywordsInput').value = "";
		}
		else if (/^,+$/.test(inputValue))
			popup.getById('keywordsInput').value = "";
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	popup.getById('keywordsInput').onchange = keywordInputOnChange;
	popup.getById('keywordsInput').addEvent('keydown', keywordInputOnChange);
	popup.getById('keywordsInput').addEvent('keyup', keywordInputOnChange);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getKeywords = function()
	{
		var str = "";
		
		for (var i = 0; i < keywordsList.length; i++)
		{
			if (i > 0)
				str = str + ',';
			
			str = str + keywordsList[i];
		}

		return str;
	};

	this.getDescription = function() { return popup.getById('description').value; };
	
	// SET

	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("editAssetPopup");