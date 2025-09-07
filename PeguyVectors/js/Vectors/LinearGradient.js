function LinearGradient($colors, $x1, $y1, $x2, $y2)
{
	///////////////
	// Attributs //
	///////////////

	var gradient = new Gradient($colors);

	var x1 = $x1;
    var y1 = $y1;
    var x2 = $x2;
    var y2 = $y2;

	if (!utils.isset(x1))
		x1 = 0;

	if (!utils.isset(y1))
		y1 = 0;

	if (!utils.isset(x2))
		x2 = 100;

	if (!utils.isset(y2))
		y2 = 0;

	//////////////
	// Méthodes //
	//////////////

	this.render = function render()
    {
		var objectCode = '<linearGradient x1="' + x1 + '%" y1="' + y1 + '%" x2="' + x2 + '%" y2="' + y2 + '%" ></linearGradient>';
        var svgObject = new Component(objectCode);
        $this.execSuper('render', [svgObject], render);
        return svgObject;
    };

	this.symetry = function($axis)
	{
		if (!utils.isset($axis))
            $axis = 'y';

		var clone = new LinearGradient(gradient.getColors(), x1, y1, x2, y2);
		clone.setLocalCoordinates(gradient.isLocalCoordinates());
		clone.setSpreadMethod(gradient.getSpreadMethod());

		if ($axis === 'x')
		{
			clone.setY1(100-y1);
			clone.setY2(100-y2);
		}
		else
		{
			clone.setX1(100-x1);
			clone.setX2(100-x2);
		}

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

	this.setX1 = function($x1) { x1 = $x1; };
	this.setY1 = function($y1) { y1 = $y1; };
	this.setX2 = function($x2) { x2 = $x2; };
	this.setY2 = function($y2) { y2 = $y2; };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(gradient, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("linearGradient");