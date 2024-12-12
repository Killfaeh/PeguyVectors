function Scale($scaleX, $scaleY)
{
	///////////////
	// Attributs //
	///////////////

    var scaleX = $scaleX;
    var scaleY = $scaleY;

    var transform = new Transform();

	//////////////
	// Méthodes //
	//////////////

    this.transform = function()
    {
        var commande = 'scale(' + scaleX + ',' + scaleY + ') ';
        return commande;
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getScaleX = function() { return scaleX; };
    this.getScaleY = function() { return scaleY; };

	// SET
	
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(transform, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("scale");