var NB_GRADIENTS = 0;

function Gradient($colors)
{
	NB_GRADIENTS++;

	///////////////
	// Attributs //
	///////////////

	var type = 'gradient';
	var id = NB_GRADIENTS + '';
	var colors = $colors;

	if (!utils.isset(colors))
		colors = [['rgb(0, 0, 0)', 0, 1.0], ['rgb(255, 255, 255)', 100, 1.0]];

	var localCoordinates = true;
	var spreadMethod = "pad";

	//////////////
	// Méthodes //
	//////////////

	this.render = function($svgObject)
	{
		for (var i = 0; i < colors.length; i++)
		{
			var colorCode = '<stop offset="' + colors[i][1] + '" style="stop-color: ' + colors[i][0] + '; stop-opacity: ' + colors[i][2] + ';" />';
        	var colorNode = new Component(colorCode);
			$svgObject.appendChild(colorNode);
		}

		$svgObject.setAttributeNS(null, 'id', 'gradient' + id);

		if (localCoordinates === true)
			$svgObject.setAttributeNS(null, 'gradientUnits', 'objectBoundingBox');
		else
			$svgObject.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');

		if (spreadMethod === "repeat")
			$svgObject.setAttributeNS(null, 'spreadMethod', 'repeat');
		else if (spreadMethod === "reflect")
			$svgObject.setAttributeNS(null, 'spreadMethod', 'reflect');
		else
			$svgObject.setAttributeNS(null, 'spreadMethod', 'pad');
	};

	this.symetry = function($axis) { return $this; };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getType = function() { return type; };
	this.getId = function() { return id; };

	this.getColors = function() { return colors; };
	this.isLocalCoordinates = function() { return localCoordinates; };
	this.getSpreadMethod = function() { return spreadMethod; };

	// SET

	this.setColors = function($colors) { colors = $colors; };
	this.setLocalCoordinates = function($localCoordinates) { localCoordinates = $localCoordinates; };
	this.setSpreadMethod = function($spreadMethod) { spreadMethod = $spreadMethod; };

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gradient");