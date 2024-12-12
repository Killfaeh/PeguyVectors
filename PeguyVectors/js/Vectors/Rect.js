function Rect($width, $height)
{
	///////////////
	// Attributs //
	///////////////

    var width = $width;
    var height = $height;

    if (!utils.isset(width))
        width = 100;
    
    if (!utils.isset(height))
        height = 100;

    var roundX = 0;
    var roundY = 0;

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        //var objectCode = '<rect x="' + -width/2 + '" y="' + -height/2 + '" width="' + width + '" height="' + height + '" rx="' + roundX + '" ry="' + roundY + '" />';
        var objectCode = '<path d="M -' + (width/2) + ' -' + (height/2) + ' L ' + (width/2) + ' -' + (height/2) + ' L ' + (width/2) + ' ' + (height/2) + ' L -' + (width/2) + ' ' + (height/2)+ ' L -' + (width/2) + ' -' + (height/2) + ' Z" />';

        var svgObject = new Component(objectCode);

        $this['super'].render(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getWidth = function() { return width; };
    this.getHeight = function() { return height; };
    this.getRoundX = function() { return roundX; };
    this.getRoundY = function() { return roundY; };

	// SET
	
    this.setSize = function($width, $height)
    {
        width = $width;
        height = $height;

        if (!utils.isset(width))
            width = 100;
        
        if (!utils.isset(height))
            height = 100;
    };

    this.size = function($width, $height) { $this.setSize($width, $height); };

    this.setRound = function($roundX, $roundY)
    {
        roundX = $roundX;
        roundY = $roundY;
    };

    this.round = function($roundX, $roundY) { $this.setRound($roundX, $roundY); };

    this.clone = function($cloneTransform)
	{
		var clone = Rect(width, height);
		
        if ($cloneTransform === true)
		    clone.setTransformList($this.getTransformList());

        clone.fill($this.getFillColor());
        clone.round(roundX, roundY);
        clone.border($this.getBorderColor(), $this.getBorderWidth());
		return clone;
	};

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("rect");