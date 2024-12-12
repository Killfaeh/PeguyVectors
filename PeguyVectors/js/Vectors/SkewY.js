function SkewY($skew)
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
        var commande = 'skewY(' + skew + ') ';
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
	Loader.hasLoaded("skewY");