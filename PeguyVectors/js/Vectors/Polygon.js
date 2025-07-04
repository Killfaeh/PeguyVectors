function Polygon($points)
{
	///////////////
	// Attributs //
	///////////////

    var points = $points;

    if (!utils.isset(points))
        points = [];

	var vectorObject = new Path([]);

	//////////////
	// Méthodes //
	//////////////

    var updatePath = function()
    {
        vectorObject.setOperations([]);

        for (var i = 0; i < points.length; i++)
        {
            if (i === 0)
                vectorObject.moveTo([points[i][0], points[i][1]]);
            else 
                vectorObject.lineTo([points[i][0], points[i][1]]);
        }

        vectorObject.close();
    };

    this.render = function render()
    {
        updatePath();
        var svgObject = $this.execSuper('render', [], render);
        return svgObject;
    };

    this.addPoint = function($x, $y)
    {
        points.push([$x, $y]);
        updatePath();
    };

    this.clone = function($cloneTransform)
	{
		var clone = PolygonShape(points);
		
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
	
	this.getPoints = function() { return points; };

	// SET
	
    this.setPoints = function($points)
    {
        points = $points;
        updatePath();
    };

    this.points = function($points) { $this.setPoints($points); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
    updatePath();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("polygon");