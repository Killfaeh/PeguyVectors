function Square($size)
{
	///////////////
	// Attributs //
	///////////////

    var size = $size;

    if (!utils.isset(size))
        size = 100;

    var round = 0;

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        //var objectCode = '<rect x="' + -size/2 + '" y="' + -size/2 + '" width="' + size + '" height="' + size + '" rx="' + round + '" ry="' + round + '" />';
        var objectCode = '<path d="M -' + (size/2) + ' -' + (size/2) + ' L ' + (size/2) + ' -' + (size/2) + ' L ' + (size/2) + ' ' + (size/2) + ' L -' + (size/2) + ' ' + (size/2)+ ' L -' + (size/2) + ' -' + (size/2) + ' Z" />';

        var svgObject = new Component(objectCode);

        $this['super'].render(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
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
    };

    this.size = function($size) { $this.setSize($size); };

    this.setRound = function($round)
    {
        round = $round;
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
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("square");