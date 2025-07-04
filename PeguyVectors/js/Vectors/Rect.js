function Rect($width, $height)
{
	///////////////
	// Attributs //
	///////////////

    var width = $width;
    var height = $height;

    if (!utils.isset(width))
        width = 100;
    
    if (!utils.isset(height))
        height = 100;

    var roundX = 0;
    var roundY = 0;

	var vectorObject = new Path([]);

	//////////////
	// Méthodes //
	//////////////

    var updatePath = function()
    {
        // Faudra ajouter les coins arrondis ! 
        vectorObject.setOperations([]);
        vectorObject.moveTo([-width/2, -height/2]);
        vectorObject.lineTo([width/2, -height/2]);
        vectorObject.lineTo([width/2, height/2]);
        vectorObject.lineTo([-width/2, height/2]);
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
	
	this.getWidth = function() { return width; };
    this.getHeight = function() { return height; };
    this.getRoundX = function() { return roundX; };
    this.getRoundY = function() { return roundY; };

	// SET
	
    this.setSize = function($width, $height)
    {
        width = $width;
        height = $height;

        if (!utils.isset(width))
            width = 100;
        
        if (!utils.isset(height))
            height = 100;

        updatePath();
    };

    this.size = function($width, $height) { $this.setSize($width, $height); };

    this.setRound = function($roundX, $roundY)
    {
        roundX = $roundX;
        roundY = $roundY;
        updatePath();
    };

    this.round = function($roundX, $roundY) { $this.setRound($roundX, $roundY); };

    this.clone = function($cloneTransform)
	{
		var clone = Rect(width, height);
		
        if ($cloneTransform === true)
		    clone.setTransformList($this.getTransformList());

        clone.fill($this.getFillColor());
        clone.round(roundX, roundY);
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
	Loader.hasLoaded("rect");