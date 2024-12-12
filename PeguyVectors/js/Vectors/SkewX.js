function SkewX($skew)
{
	///////////////
	// Attributs //
	///////////////

    var skew = $skew;

    var transform = new Transform();

	//////////////
	// Méthodes //
	//////////////

    this.transform = function()
    {
        var commande = 'skewX(' + skew + ') ';
        return commande;
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getSkew = function() { return skew; };

	// SET
	
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(transform, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("skewX");