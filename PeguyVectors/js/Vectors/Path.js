function Path($operations)
{
	///////////////
	// Attributs //
	///////////////

    var operations = $operations;

    if (!utils.isset(operations))
        operations = [];

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        var d = '';

        for (var i = 0; i < operations.length; i++)
        {
            var type = operations[i][0];

            if (type === 'M')
                d = d + 'M ' + operations[i][1] + ',' + operations[i][2] + ' ';
            else if (type === 'L')
                d = d + 'L ' + operations[i][1] + ',' + operations[i][2] + ' ';
            else if (type === 'Z')
                d = d + 'Z ';
            else if (type === 'A')
                d = d + 'A ' + operations[i][1] + ' ' + operations[i][2] + ' ' + operations[i][3] + ' ' + operations[i][4] + ' ' + operations[i][5] + ' ' + operations[i][6] + ',' + operations[i][7] + ' ';
            else if (type === 'Q')
                d = d + 'Q ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' ';
            else if (type === 'QT')
                d = d + 'Q ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' T ' + operations[i][5] + ',' + operations[i][6] + ' ';
            else if (type === 'C')
                d = d + 'C ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' ' + operations[i][5] + ',' + operations[i][6] + ' ';
            else if (type === 'CS')
                d = d + 'C ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' ' + operations[i][5] + ',' + operations[i][6] + ' S ' + operations[i][7] + ',' + operations[i][8] + ' ' + operations[i][9] + ',' + operations[i][10] + ' ';
        }

        var objectCode = '<path d="' + d + '" />';

        var svgObject = new Component(objectCode);

        $this['super'].render(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

    this.moveTo = function($x, $y)
    {
        operations.push(['M', $x, $y]);
        return 'M ' + $x + ',' + $y + ' ';
    };

    this.lineTo = function($x, $y)
    {
        operations.push(['L', $x, $y]);
        return 'L ' + $x + ',' + $y + ' ';
    };

    this.close = function()
    {
        operations.push(['Z']);
        return 'Z ';
    };

    this.arc = function($rx, $ry, $rotation, $largeArcFlag, $sweepFlag, $endX, $endY)
    {
        operations.push(['A', $rx, $ry, $rotation, $largeArcFlag, $sweepFlag, $endX, $endY]);
        return 'A ' + $rx + ' ' + $ry + ' ' + $rotation + ' ' + $largeArcFlag + ' ' + $sweepFlag + ' ' + $endX + ',' + $endY + ' ';
    };

    this.bezierQ = function($hx, $hy, $endX, $endY)
    {
        operations.push(['Q', $hx, $hy, $endX, $endY]);
        return 'Q ' + $hx + ',' + $hy + ' ' + $endX + ',' + $endY + ' ';
    };

    this.bezierQT = function($hx, $hy, $endX, $endY, $htx, $hty)
    {
        operations.push(['QT', $hx, $hy, $endX, $endY, $htx, $hty]);
        return 'Q ' + $hx + ',' + $hy + ' ' + $endX + ',' + $endY + ' T ' + $htx + ',' + $hty + ' ';
    };

    this.bezierC = function($h1x, $h1y, $h2x, $h2y, $endX, $endY)
    {
        operations.push(['C', $h1x, $h1y, $h2x, $h2y, $endX, $endY]);
        return 'C ' + $h1x + ',' + $h1y + ' ' + $h2x + ',' + $h2y + ' ' + $endX + ',' + $endY + ' ';
    };

    this.bezierCS = function($h1x, $h1y, $h2x, $h2y, $endX, $endY, $hs1x, $hs1y, $hs2x, $hs2y)
    {
        operations.push(['CS', $h1x, $h1y, $h2x, $h2y, $endX, $endY, $hs1x, $hs1y, $hs2x, $hs2y]);
        return 'C ' + $h1x + ',' + $h1y + ' ' + $h2x + ',' + $h2y + ' ' + $endX + ',' + $endY + ' S ' + $hs1x + ',' + $hs1y + ' ' + $hs2x + ',' + $hs2y + ' ';
    };

    this.clone = function($cloneTransform)
	{
		var clone = Path(operations);
		
        if ($cloneTransform === true)
		    clone.setTransformList($this.getTransformList());

        clone.fill($this.getFillColor());
        clone.border($this.getBorderColor(), $this.getBorderWidth());
		return clone;
	};

    this.samplePointsWithProperties = function($n)
    {
        var glPointsList = [];

        if (utils.isset($n) && $n !== '' && $n > 0)
        {
            var svgObject = $this.render();
            glPointsList = svgObject.samplePointsForWebGL($n);
        }
        else
        {
            var previousOperation = ['M', 0.0, 0.0];
            var previousType = previousOperation[0];
            var Mcoord = [0.0, 0.0];

            console.log(operations);

            for (var i = 1; i < operations.length; i++)
            {
                previousOperation = operations[i-1];
                previousType = previousOperation[0];
                Mcoord = [0.0, 0.0];

                if (previousType === 'M')
                    Mcoord = [previousOperation[1], previousOperation[2]];
                else if (previousType === 'L')
                    Mcoord = [previousOperation[1], previousOperation[2]];
                else if (previousType === 'A')
                    Mcoord = [previousOperation[6], previousOperation[7]];
                else if (previousType === 'Q')
                    Mcoord = [previousOperation[3], previousOperation[4]];
                else if (previousType === 'QT')
                    Mcoord = [previousOperation[3], previousOperation[4]];
                else if (previousType === 'C')
                    Mcoord = [previousOperation[5], previousOperation[6]];
                else if (previousType === 'CS')
                    Mcoord = [previousOperation[5], previousOperation[6]];

                var d = 'M ' + Mcoord[0] + ',' + Mcoord[1] + ' ';

                var type = operations[i][0];

                if (type === 'L')
                    d = d + 'L ' + operations[i][1] + ',' + operations[i][2] + ' ';
                else if (type === 'A')
                    d = d + 'A ' + operations[i][1] + ' ' + operations[i][2] + ' ' + operations[i][3] + ' ' + operations[i][4] + ' ' + operations[i][5] + ' ' + operations[i][6] + ',' + operations[i][7] + ' ';
                else if (type === 'Q')
                    d = d + 'Q ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' ';
                else if (type === 'QT')
                    d = d + 'Q ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' T ' + operations[i][5] + ',' + operations[i][6] + ' ';
                else if (type === 'C')
                    d = d + 'C ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' ' + operations[i][5] + ',' + operations[i][6] + ' ';
                else if (type === 'CS')
                    d = d + 'C ' + operations[i][1] + ',' + operations[i][2] + ' ' + operations[i][3] + ',' + operations[i][4] + ' ' + operations[i][5] + ',' + operations[i][6] + ' S ' + operations[i][7] + ',' + operations[i][8] + ' ' + operations[i][9] + ',' + operations[i][10] + ' ';
                else if (type === 'Z')
                    d = d + 'L ' + operations[0][1] + ',' + operations[0][2] + ' ';
                    
                var objectCode = '<path d="' + d + '" />';
                var svgObject = new Component(objectCode);

                // { point: point, tangent: tangent, normal: normal, smooth: true};

                //*
                if (type === 'L')
                {
                    var tangent = Math.normalizeVector([operations[i][1]-Mcoord[0], operations[i][2]-Mcoord[1], 0.0]);
                    var normal = [tangent[1], -tangent[0], 0.0];
                    glPointsList.push({point: [Mcoord[0], Mcoord[1], 0.0], tangent: tangent, normal: normal, smooth: false});
                    glPointsList.push({point: [operations[i][1], operations[i][2], 0.0], tangent: tangent, normal: normal, smooth: false});
                }
                else if (type === 'Z')
                {
                    closed = true;
                    var tangent = Math.normalizeVector([operations[i][1]-Mcoord[0], operations[i][2]-Mcoord[1], 0.0]);
                    var normal = [tangent[1], -tangent[0], 0.0];
                    glPointsList.push({point: [Mcoord[0], Mcoord[1], 0.0], tangent: tangent, normal: normal, smooth: false});
                    glPointsList.push({point: [operations[0][1], operations[0][2], 0.0], tangent: tangent, normal: normal, smooth: false});
                }
                else
                {
                    var totalLength = svgObject.totalLength();
                    var Nsamples = 32;
                    var samples = svgObject.samplePointsForWebGL(Nsamples);

                    for (var j = 0; j < samples.length; j++)
                        glPointsList.push(samples[j]);
                }
                //*/

                /*
                var subSample = 16;

                var totalLength = svgObject.totalLength();
                var Nsamples = subSample;
                var samples = svgObject.samplePointsForWebGL(Nsamples);

                for (var j = 0; j < samples.length; j++)
                    glPointsList.push(samples[j]);
                //*/
            }
        }

        return glPointsList;
    };

    this.samplePoints = function($n)
    {
        var glPointsList = [];
        var samples = $this.samplePointsWithProperties($n);

        for (var i = 0; i < samples.length; i++)
            glPointsList.push([samples[i].point[0], samples[i].point[1], 0.0]);

        return glPointsList;
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getOperations = function() { return operations; };

	// SET
	
    this.setOperations = function($operations)
    {
        operations = $operations;
    };

    this.operations = function($operations) { $this.setOperations($operations); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("path");