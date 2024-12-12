function Ellipse($rX, $rY)
{
	///////////////
	// Attributs //
	///////////////

    var rX = $rX;
    var rY = $rY;

    if (!utils.isset(rX))
        rX = 50;
    
    if (!utils.isset(rY))
        rY = 50;

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        //var objectCode = '<ellipse cx="0" cy="0" rx="' + rX + '" ry="' + rY + '" />';
        var objectCode = '<path d="M -' + rX + ' 0 A ' + rX + ' ' + rY + ' 0 0 0 ' + rX + ' 0 A ' + rX + ' ' + rY + ' 0 0 0 -' + rX + ' 0 Z" />';

        var svgObject = new Component(objectCode);

        $this['super'].render(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

    this.clone = function($cloneTransform)
	{
		var clone = Ellipse(rx, ry);
		
        if ($cloneTransform === true)
		    clone.setTransformList($this.getTransformList());

        clone.fill($this.getFillColor());
        clone.border($this.getBorderColor(), $this.getBorderWidth());
		return clone;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getRadiusX = function() { return rX; };
    this.getRadiusY = function() { return rY; };

	// SET
	
    this.setRadius = function($rx, $ry)
    {
        rX = $rX;
        rY = $rY;
    
        if (!utils.isset(rX))
            rX = 50;
        
        if (!utils.isset(rY))
            rY = 50;
    };

    this.radius = function($rX, $rY) { $this.setRadius($rX, $rY); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("ellipse");