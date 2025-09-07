function VectorObject()
{
	///////////////
	// Attributs //
	///////////////

    var type = 'object';

    var transformList = [];
    var joinList = [];

    var fillColor = "rgb(0, 0, 0)";
    var borderColor = "none";
    var borderWidth = 0;

	//////////////
	// Méthodes //
	//////////////

    this.add = function($input)
    {
        var type = $input.getType();

        if (type === 'object')
            joinList.push($input);
        else if (type === 'transform')
            transformList.push($input);
    };

    this.fill = function($fillColor)
    {
        fillColor = $fillColor;
    };

    this.border = function($borderColor, $borderWidth)
    {
        borderColor = $borderColor;
        borderWidth = $borderWidth;
    };

    this.render = function($svgObject)
    {
        var transformCommand = '';

        for (var i = 0; i < transformList.length; i++)
            transformCommand = transformCommand + transformList[i].transform();

        if (transformCommand !== '')
            $svgObject.setAttributeNS(null, 'transform', transformCommand);
        
        if (utils.isset(fillColor.getId))
        {
            $svgObject.setAttributeNS(null, 'style', 'fill: url(#gradient' + fillColor.getId() + '); stroke: ' + borderColor + '; stroke-width: ' + borderWidth + 'px;');
            Doc.add(fillColor);
        }
        else
            $svgObject.setAttributeNS(null, 'style', 'fill: ' + fillColor + '; stroke: ' + borderColor + '; stroke-width: ' + borderWidth + 'px;');
    };

    this.pathCode = function() { return ''; };

    this.clone = function() {};

    this.borderToPath = function($width)
    {
        return new Path([]);
    };

    this.cloneToPoints = function($pointsList, $alignToTangent)
    {
        var clonesList = [];

        for (var i = 0; i < $pointsList.length; i++)
        {
            var clone = $this.clone();
            clone.add(new Translation($pointsList[i][0], $pointsList[i][1]));

            if (utils.isset($alignToTangent) && utils.isset($pointsList[i][2]))
                clone.add(new Rotation($pointsList[i][2]));

            clonesList.push(clone);
        }

        return clonesList;
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement

    this.totalLength = function()
    {
        var svgObject = $this.render();
        return svgObject.totalLength();
    };

    this.pointAtLength = function($t)
    {
        var svgObject = $this.render();
        return svgObject.pointAtLength($t);
    };

    this.tangentAtLength = function($t)
    {
        var svgObject = $this.render();
        return svgObject.tangentAtLength($t);
    };

    this.normalAtLength = function($t)
    {
        var svgObject = $this.render();
        return svgObject.normalAtLength($t);
    };

    this.samplePoints = function($n)
    {
        if (!utils.isset($n))
            $n = 32;

        if ($n < 2)
            $n = 2;

        var svgObject = $this.render();
        return svgObject.samplePoints($n);
    };

    this.samplePointsWithProperties = function($n)
    {
        if (!utils.isset($n))
            $n = 32;
        
        if ($n < 2)
            $n = 2;
        
        var svgObject = $this.render();
        return svgObject.samplePointsForWebGL($n);
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
    this.getType = function() { return type; };
	
    this.getFillColor = function() { return fillColor; };
    this.getBorderColor = function() { return borderColor; };
    this.getBorderWidth = function() { return borderWidth; };

    this.getTransformList = function() { return transformList; };

	// SET
	
    this.setTransformList = function($transformList) { transformList = $transformList; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vectorObject");