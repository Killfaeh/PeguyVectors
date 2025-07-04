function Line($x1, $y1, $x2, $y2)
{
	///////////////
	// Attributs //
	///////////////

    var x1 = $x1;
    var y1 = $y1;
    var x2 = $x2;
    var y2 = $y2;

	var vectorObject = new VectorObject();

    vectorObject.fill('none');
    vectorObject.border('rgb(0, 0, 0)', 2);

	//////////////
	// Méthodes //
	//////////////

	this.render = function render()
    {
        //var objectCode = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" />';
        var objectCode = '<path d="M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2 + '" />';

        var svgObject = new Component(objectCode);

        //$this['super'].render(svgObject);

        $this.execSuper('render', [svgObject], render);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

    this.clone = function($cloneTransform)
	{
		var clone = Line(x1, y1, x2, y2);
		
        if ($cloneTransform === true)
		    clone.setTransformList($this.getTransformList());

        clone.fill($this.getFillColor());
        clone.border($this.getBorderColor(), $this.getBorderWidth());
		return clone;
	};

    this.borderToPath = function($width)
    {
        return new Path([]);
    };

    this.samplePoints = function($n)
    {
        var svgObject = $this.render();

        if (!utils.isset($n) || $n < 2)
        {
            var pointsList = [];
            pointsList.push(svgObject.pointAtLength(0.0));
            pointsList.push(svgObject.pointAtLength(1.0));
            return pointsList;
        }
        else
            return svgObject.samplePoints($n);
    };

    this.samplePointsWithProperties = function($n)
    {
        var svgObject = $this.render();

        if (!utils.isset($n) || $n < 2)
        {
            var pointsList = [];
            var vertex1 = svgObject.pointAtLength(0.0);
            var vertex2 = svgObject.pointAtLength(1.0);
            var tangent = (new Vector([vertex2[0]-vertex1[0], vertex2[1]-vertex1[1]])).normalize();
            var normal = [tangent.values()[1], -tangent.values()[0]];
            pointsList.push({point: vertex1, tangent: tangent, normal: normal, smooth: false});
            pointsList.push({point: vertex2, tangent: tangent, normal: normal, smooth: false});
            return pointsList;
        }
        else
            return svgObject.samplePointsForWebGL($n);
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getX1 = function() { return x1; };
    this.getY1 = function() { return y1; };
    this.getX2 = function() { return x2; };
    this.getY2 = function() { return y2; };

	// SET
	
    this.setPosition = function($x1, $y1, $x2, $y2)
    {
        x1 = $x1;
        y1 = $y1;
        x2 = $x2;
        y2 = $y2;
    };

    this.position = function($x1, $y1, $x2, $y2) { $this.setPosition($x1, $y1, $x2, $y2); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("line");