function Circle($radius)
{
	///////////////
	// Attributs //
	///////////////

    var radius = $radius;

    if (!utils.isset(radius))
        radius = 50;

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        //var objectCode = '<circle cx="0" cy="0" r="' + radius + '" />';
        var objectCode = '<path d="M -' + radius + ' 0 A ' + radius + ' ' + radius + ' 0 0 0 ' + radius + ' 0 A ' + radius + ' ' + radius + ' 0 0 0 -' + radius + ' 0 Z" />';

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
		var clone = Circle(radius);
		
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
	
	this.getRadius = function() { return radius; };

	// SET
	
    this.setRadius = function($radius)
    {
        radius = $radius;

        if (!utils.isset(radius))
            radius = 50;
    };

    this.radius = function($radius) { $this.setRadius($radius); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("circle");