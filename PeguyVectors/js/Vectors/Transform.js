function Transform()
{
	///////////////
	// Attributs //
	///////////////

    var type = 'transform';

	var x = 0;
    var y = 0;
    var theta = 0;
    var scaleX = 1.0;
    var scaleY = 1.0;

	//////////////
	// Méthodes //
	//////////////

	this.translate = function($x, $y)
    {
        x = $x;
        y = $y;
    };

    this.rotate = function($theta)
    {
        theta = $theta;
    };

    this.scale = function($scaleX, $scaleY)
    {
        scaleX = $scaleX;
        scaleY = $scaleY;
    };

    this.transform = function() { return '' };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
    this.getType = function() { return type; };

	this.getX = function() { return x; };
    this.getY = function() { return y; };
    this.getTheta = function() { return theta; };
    this.getScaleX = function() { return scaleX; };
    this.getScaleY = function() { return scaleY; };

	// SET
	
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("transform");