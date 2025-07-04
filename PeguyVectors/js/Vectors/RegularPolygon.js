function RegularPolygon($radius, $nbSides)
{
	///////////////
	// Attributs //
	///////////////

    var radius = $radius;

    if (!utils.isset(radius))
        radius = 1.0;

	var nbSides = $nbSides;

	if (!utils.isset(nbSides) || nbSides < 3)
		nbSides = 3;

	var vectorObject = new Path([]);

	//////////////
	// Méthodes //
	//////////////

	var updatePath = function()
    {
		var stepTheta = 2.0*Math.PI/nbSides;

        vectorObject.setOperations([]);
		vectorObject.moveTo([radius, 0.0]);

        for (var i = 1; i <= nbSides; i++)
            vectorObject.lineTo([radius*Math.cos(i*stepTheta), radius*Math.sin(i*stepTheta)]);

		vectorObject.close();
    };

	this.render = function render()
    {
        updatePath();
        var svgObject = $this.execSuper('render', [], render);
        return svgObject;
    };

    this.clone = function()
	{
		var clone = new RegularPolygon(radius, nbSides);
		clone.setTransformList(clone.getTransformList());
		return clone;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getRadius = function() { return radius; };
	this.getNbSides = function() { return nbSides; };

	// SET
	
    this.setRadius = function($radius)
    {
        radius = $radius;

        if (!utils.isset(radius))
            radius = 1.0;

		updatePath();
    };

    this.radius = function($radius) { $this.setRadius($radius); };

	this.setNbSides = function($nbSides)
    {
        var nbSides = $nbSides;

		if (!utils.isset(nbSides) || nbSides < 3)
			nbSides = 3;

		updatePath();
    };

	this.nbSides = function($nbSides) { $this.setNbSides($nbSides); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	updatePath();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("regularPolygon");