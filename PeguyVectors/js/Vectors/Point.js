var Points = 
{
    distance: function($point1, $point2)
    {
        var dist2 = ($point2[0]-$point1[0])*($point2[0]-$point1[0]) + ($point2[1]-$point1[1])*($point2[1]-$point1[1]);
        var dist = Math.sqrt(dist2);
        return dist;
    },

    createGrid: function($width, $height, $nX, $nY, $random)
    {
        var pointsList = [];

        var random = $random;

        if (!utils.isset(random) || random == '')
            random = 0.0;

        if ($nX > 1 && $nY > 1)
        {
            var stepX = $width/($nX-1);
            var stepY = $height/($nY-1);

            for (var i = 0; i < $nX; i++)
            {
                for (var j = 0; j < $nY; i++)
                {
                    var x = i*stepX + Math.random()*2.0*random - random;
                    var y = j*stepY + Math.random()*2.0*random - random;
                    pointsList.push([x, y]);
                }
            }
        }

        return pointsList;
    },

    createStaggeredGrid: function($width, $height, $nX, $nY, $random)
    {
        var pointsList = [];

        var random = $random;

        if (!utils.isset(random) || random == '')
            random = 0.0;

        if ($nX > 1 && $nY > 1)
        {
            var stepX = $width/($nX-1);
            var stepY = $height/($nY-1);

            for (var i = 0; i < $nX; i++)
            {
                for (var j = 0; j < $nY; i++)
                {
                    var x = i*stepX + Math.random()*2.0*random - random;
                    var y = j*stepY + Math.random()*2.0*random - random;

                    if (j%2 === 1)
                        x = x + stepX/2;

                    pointsList.push([x, y]);
                }
            }
        }

        return pointsList;
    },

    createFibonacciPattern: function($width, $height, $nbDots, $random)
    {
        var pointsList = [];

        var goldenNb = 1.0 + Math.sqrt(5.0);
        var baseRadius = Math.sqrt(500000.0);
        var baseNbDots = 20000;
        var random = $random;

        if (!utils.isset(random) || random == '')
            random = 0.0;

        var patternRadius2 = ($width*$width + $height*$height)/4.0;
        var patternRadius = Math.sqrt(patterRadius2);
        var nbDots = Math.round(patternRadius2/500000.0*baseNbDots);

        for (var i = 0; i < $nbDots; i++)
        {
            var r = patternRadius*Math.sqrt((i+0.5)/nbDots);
            var theta = Math.PI*goldenNb*(i+0.5);
            var point = Math.toCartesian(r, theta);
            pointsList.push([point.x + Math.random()*2.0*random - random, point.y + Math.random()*2.0*random - random]);
        }

        return pointsList;
    },

    cut: function($input, $shape)
    {
        var pointsList = [];

        var svgShape = $shape.render();

        for (var i = 0; i < $input.length; i++)
        {
            var point = svgShape.createSVGPoint();
            point.x = $input[i][0];
            point.y = $input[i][1];
            var isInside = svgShape.isPointInFill(point);

            if (isInside !== true)
                pointsList.push($input[i]);
        }

        return pointsList;
    },

    intersect: function($input, $shape)
    {
        var pointsList = [];

        var svgShape = $shape.render();

        for (var i = 0; i < $input.length; i++)
        {
            var point = svgShape.createSVGPoint();
            point.x = $input[i][0];
            point.y = $input[i][1];
            var isInside = svgShape.isPointInFill(point);

            if (isInside === true)
                pointsList.push($input[i]);
        }

        return pointsList;
    },

    union: function($input1, $input2)
    {
        var pointsList = [];

        for (var i = 0; i < $input1.length; i++)
            pointsList.push($input1[i]);

        for (var i = 0; i < $input2.length; i++)
            pointsList.push($input2[i]);

        return pointsList;
    }
};

function Point($x, $y)
{
	///////////////
	// Attributs //
	///////////////

    var x = $x;
    var y = $y;

    if (!utils.isset(x))
        x = 0;
    
    if (!utils.isset(y))
        y = 0;

	//////////////
	// Méthodes //
	//////////////

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getX = function() { return x; };
    this.getY = function() { return y; };

	// SET
	
    this.setX = function($x) { x = $x; };
    this.setY = function($y) { y = $y; };

	//////////////
	// Héritage //
	//////////////
	
	var $this = this; 
}

function InflectionPoint($x, $y, $theta, $dist1, $dist2)
{
    ///////////////
	// Attributs //
	///////////////

    var theta = $theta;
    var dist1 = $dist1;
    var dist2 = $dist2;

    if (!utils.isset(theta))
        theta = 45.0;
    
    if (!utils.isset(dist1))
        dist1 = 1.0;

    if (!utils.isset(dist2))
        dist2 = 1.0;

    var point = new Point($x, $y, 0.0);

    //////////////
	// Méthodes //
	//////////////

	////////////////
	// Accesseurs //
	////////////////

    // GET

    this.getTheta = function() { return theta; };
    this.getDist1 = function() { return dist1; };
    this.getDist2 = function() { return dist2; };

    this.getHandles = function()
    {
        var radTheta = theta/180.0*Math.PI;
        var handle1 = Math.toCartesian(dist1, radTheta+Math.PI, 0.0);
        var handle2 = Math.toCartesian(dist2, radTheta, 0.0);
        return [[handle1.x + point.getX(), handle1.y + point.getY()], [handle2.x + point.getX(), handle2.y + point.getY()]]
    };

    // SET

    this.setTheta = function($theta) { theta = $theta; };
    this.setDist1 = function($dist1) { dist1 = $dist1; };
    this.setDist2 = function($dist2) { dist2 = $dist2; };

    //////////////
	// Héritage //
	//////////////

    var $this = utils.extend(point, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("point");