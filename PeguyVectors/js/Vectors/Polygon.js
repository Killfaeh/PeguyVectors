function Polygon($points)
{
	///////////////
	// Attributs //
	///////////////

    var points = $points;

    if (!utils.isset(points))
        points = [];

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        var pointsSTR = '';

        if (points.length > 0)
        {
            pointsSTR = 'M ' + points[0][0] + ',' + points[0][1];

            for (var i = 1; i < points.length; i++)
                pointsSTR = pointsSTR + ' L' + points[i][0] + ',' + points[i][1];
            
            pointsSTR = pointsSTR + ' Z';
        }

        var objectCode = '<path d="' + pointsSTR + '" />';

        var svgObject = new Component(objectCode);

        $this['super'].render(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

    this.addPoint = function($x, $y)
    {
        points.push([$x, $y]);
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
    };

    this.points = function($points) { $this.setPoints($points); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("polygon");