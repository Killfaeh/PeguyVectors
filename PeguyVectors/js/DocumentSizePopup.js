function DocumentSizePopup($width, $height)
{
	///////////////
	// Attributs //
	///////////////

	var width = $width;
	var height = $height;

	var popupHTML = '<h2 draggable="true" >Document size</h2>'
						+ '<table>'
							+ '<tr>'
								+ '<td style="text-align: left; " >Width</td>'
								+ '<td style="text-align: right; " ><input id="width" type="number" value="' + width + '" /></td>'
							+ '</tr>'
							+ '<tr>'
								+ '<td style="text-align: left; " >Height</td>'
								+ '<td style="text-align: right; " ><input id="height" type="number" value="' + height + '" /></td>'
							+ '</tr>'
						+ '</table>';
	
	var popup = new ConfirmPopup(popupHTML);
	
	//////////////
	// Méthodes //
	//////////////
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getWidth = function() { return popup.getById('width').value; };
	this.getHeight = function() { return popup.getById('height').value; };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("documentSizePopup");