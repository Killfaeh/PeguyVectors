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

	var vectorObject = new Path([]);

	//////////////
	// Méthodes //
	//////////////

    var updatePath = function()
    {
		vectorObject.setOperations([]);
		vectorObject.moveTo([-rX, 0.0]);
		vectorObject.arc([rX, rY], 0, 0, 0, [rX, 0]);
		vectorObject.arc([rX, rY], 0, 0, 0, [-rX, 0]);
		vectorObject.close();
    };

	this.render = function render()
    {
        updatePath();
        var svgObject = $this.execSuper('render', [], render);
        return svgObject;
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

        updatePath();
    };

    this.radius = function($rX, $rY) { $this.setRadius($rX, $rY); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
    updatePath();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("ellipse");