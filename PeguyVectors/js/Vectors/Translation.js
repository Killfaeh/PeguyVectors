function Translation($x, $y)
{
	///////////////
	// Attributs //
	///////////////

    var x = $x;
    var y = $y;

    var transform = new Transform();

	//////////////
	// Méthodes //
	//////////////

    this.transform = function() { return 'translate(' + x + ',' + y + ') ' };

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getX = function() { return x; };
    this.getY = function() { return y; };

	// SET
	
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(transform, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("translation");