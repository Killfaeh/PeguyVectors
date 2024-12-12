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

	this.render = function()
    {
        //var objectCode = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" />';
        var objectCode = '<path d="M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2 + '" />';

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
		var clone = Line(x1, y1, x2, y2);
		
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