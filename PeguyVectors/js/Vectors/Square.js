function Square($size)
{
	///////////////
	// Attributs //
	///////////////

    var size = $size;

    if (!utils.isset(size))
        size = 100;

    var round = 0;

	var vectorObject = new Path([]);

	//////////////
	// Méthodes //
	//////////////

    var updatePath = function()
    {
        // Faudra ajouter les coins arrondis ! 
        vectorObject.setOperations([]);
        vectorObject.moveTo([-size/2, -size/2]);
        vectorObject.lineTo([size/2, -size/2]);
        vectorObject.lineTo([size/2, size/2]);
        vectorObject.lineTo([-size/2, size/2]);
        vectorObject.close();
    };

	this.render = function render()
    {
        updatePath();
        var svgObject = $this.execSuper('render', [], render);
        return svgObject;
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getSize = function() { return size; };
    this.getRound = function() { return round; };

	// SET
	
    this.setSize = function($size)
    {
        size = $size;

        if (!utils.isset(size))
            size = 100;

        updatePath();
    };

    this.size = function($size) { $this.setSize($size); };

    this.setRound = function($round)
    {
        round = $round;
        updatePath();
    };

    this.round = function($round) { $this.setRound($round); };

    this.clone = function($cloneTransform)
	{
		var clone = Square(size);

        if ($cloneTransform === true)
		    clone.setTransformList($this.getTransformList());
        
        clone.fill($this.getFillColor());
        clone.round(round);
        clone.border($this.getBorderColor(), $this.getBorderWidth());
		return clone;
	};

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
    updatePath();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("square");