function Circle($radius)
{
	///////////////
	// Attributs //
	///////////////

    var radius = $radius;

    if (!utils.isset(radius))
        radius = 50;

	var vectorObject = new Path([]);

	//////////////
	// Méthodes //
	//////////////

	var updatePath = function()
    {
		vectorObject.setOperations([]);
		vectorObject.moveTo([-radius, 0.0]);
		vectorObject.arc([radius, radius], 0, 0, 0, [radius, 0]);
		vectorObject.arc([radius, radius], 0, 0, 0, [-radius, 0]);
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

		updatePath();
    };

    this.radius = function($radius) { $this.setRadius($radius); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	updatePath();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("circle");