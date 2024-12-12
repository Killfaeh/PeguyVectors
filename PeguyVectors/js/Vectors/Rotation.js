function Rotation($theta, $x, $y)
{
	///////////////
	// Attributs //
	///////////////

    var theta = $theta;
    var x = $x;
    var y = $y;

    var transform = new Transform();

	//////////////
	// Méthodes //
	//////////////

    this.transform = function()
    {
        var commande = 'rotate(' + theta + ',' + x + ',' + y + ') ';

        if (!utils.isset(x) || !utils.isset(y))
            commande = 'rotate(' + theta + ') ';

        return commande;
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET

    this.getTheta = function() { return theta; };
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
	Loader.hasLoaded("rotation");