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

	this.render = function render()
    {
        var d = '';

        for (var i = 0; i < operations.length; i++)
        {
            var type = operations[i][0];

            if (type === 'M')
                d = d + 'M ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ';
            else if (type === 'L')
                d = d + 'L ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ';
            else if (type === 'Z')
                d = d + 'Z ';
            else if (type === 'A')
                d = d + 'A ' + operations[i][1][0] + ' ' + operations[i][1][1] + ' ' + operations[i][2] + ' ' + operations[i][3] + ' ' + operations[i][4] + ' ' + operations[i][5][0] + ',' + operations[i][5][1] + ' ';
            else if (type === 'Q')
                d = d + 'Q ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' ';
            else if (type === 'QT')
                d = d + 'Q ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' T ' + operations[i][3][0] + ',' + operations[i][3][1] + ' ';
            else if (type === 'C')
                d = d + 'C ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' ' + operations[i][3][0] + ',' + operations[i][3][1] + ' ';
            else if (type === 'CS')
                d = d + 'C ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' ' + operations[i][3][0] + ',' + operations[i][3][1] + ' S ' + operations[i][4][0] + ',' + operations[i][4][1] + ' ' + operations[i][5][0] + ',' + operations[i][5][1] + ' ';
        }

        var objectCode = '<path d="' + d + '" />';

        var svgObject = new Component(objectCode);

        //$this['super'].render(svgObject);
        $this.execSuper('render', [svgObject], render);

        console.log(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

    this.addOperation = function($operation)
    {
        operations.push($operation);
    };

    this.moveTo = function($point)
    {
        operations.push(['M', $point]);
        return 'M ' + $point[0] + ',' + $point[1] + ' ';
    };

    this.lineTo = function($point)
    {
        operations.push(['L', $point]);
        return 'L ' + $point[0] + ',' + $point[1] + ' ';
    };

    this.close = function()
    {
        operations.push(['Z']);
        return 'Z ';
    };

    this.arc = function($r, $rotation, $largeArcFlag, $sweepFlag, $end)
    {
        operations.push(['A', $r, $rotation, $largeArcFlag, $sweepFlag, $end]);
        return 'A ' + $r[0] + ' ' + $r[1] + ' ' + $rotation + ' ' + $largeArcFlag + ' ' + $sweepFlag + ' ' + $end[0] + ',' + $end[1] + ' ';
    };

    this.bezierQ = function($h, $end)
    {
        operations.push(['Q', $h, $end]);
        return 'Q ' + $h[0] + ',' + $h[1] + ' ' + $end[0] + ',' + $end[1] + ' ';
    };

    this.bezierQT = function($h, $end, $ht)
    {
        operations.push(['QT', $h, $end, $ht]);
        return 'Q ' + $h[0] + ',' + $h[1] + ' ' + $end[0] + ',' + $end[1] + ' T ' + $ht[0] + ',' + $ht[1] + ' ';
    };

    this.bezierC = function($h1, $h2, $end)
    {
        operations.push(['C', $h1, $h2, $end]);
        return 'C ' + $h1[0] + ',' + $h1[1] + ' ' + $h2[0] + ',' + $h2[1] + ' ' + $end[0] + ',' + $end[1] + ' ';
    };

    this.bezierCS = function($h1, $h2, $end, $hs1, $hs2)
    {
        operations.push(['CS', $h1, $h2, $end, $hs1, $hs2]);
        return 'C ' + $h1[0] + ',' + $h1[1] + ' ' + $h2[0] + ',' + $h2[1] + ' ' + $end[0] + ',' + $end[1] + ' S ' + $hs1[0] + ',' + $hs1[1] + ' ' + $hs2[0] + ',' + $hs2[1] + ' ';
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

    this.borderToPath = function($width)
    {
        return new Path([]);
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
            var previousOperation = ['M', [0.0, 0.0]];
            var previousType = previousOperation[0];
            var Mcoord = [0.0, 0.0];

            console.log(operations);

            for (var i = 1; i < operations.length; i++)
            {
                previousOperation = operations[i-1];
                previousType = previousOperation[0];
                Mcoord = [0.0, 0.0];

                if (previousType === 'M')
                    Mcoord = [previousOperation[1][0], previousOperation[1][1]];
                else if (previousType === 'L')
                    Mcoord = [previousOperation[1][0], previousOperation[1][1]];
                else if (previousType === 'A')
                    Mcoord = [previousOperation[5][0], previousOperation[5][1]];
                else if (previousType === 'Q')
                    Mcoord = [previousOperation[2][0], previousOperation[2][1]];
                else if (previousType === 'QT')
                    Mcoord = [previousOperation[2][0], previousOperation[2][1]];
                else if (previousType === 'C')
                    Mcoord = [previousOperation[3][0], previousOperation[3][1]];
                else if (previousType === 'CS')
                    Mcoord = [previousOperation[3][0], previousOperation[3][1]];

                var d = 'M ' + Mcoord[0] + ',' + Mcoord[1] + ' ';

                var type = operations[i][0];

                if (type === 'L')
                    d = d + 'L ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ';
                else if (type === 'A')
                    d = d + 'A ' + operations[i][1][0] + ' ' + operations[i][1][1] + ' ' + operations[i][2] + ' ' + operations[i][3] + ' ' + operations[i][4] + ' ' + operations[i][5][0] + ',' + operations[i][5][1] + ' ';
                else if (type === 'Q')
                    d = d + 'Q ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' ';
                else if (type === 'QT')
                    d = d + 'Q ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' T ' + operations[i][3][0] + ',' + operations[i][3][1] + ' ';
                else if (type === 'C')
                    d = d + 'C ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' ' + operations[i][3][0] + ',' + operations[i][3][1] + ' ';
                else if (type === 'CS')
                    d = d + 'C ' + operations[i][1][0] + ',' + operations[i][1][1] + ' ' + operations[i][2][0] + ',' + operations[i][2][1] + ' ' + operations[i][3][0] + ',' + operations[i][3][1] + ' S ' + operations[i][4][0] + ',' + operations[i][4][1] + ' ' + operations[i][5][0] + ',' + operations[i][5][1] + ' ';
                else if (type === 'Z')
                    d = d + 'L ' + Mcoord[0] + ',' + Mcoord[1] + ' ';
                    
                var objectCode = '<path d="' + d + '" />';
                var svgObject = new Component(objectCode);

                // { point: point, tangent: tangent, normal: normal, smooth: true};

                //*
                if (type === 'L')
                {
                    var tangent = (new Vector([operations[i][1][0]-Mcoord[0], operations[i][1][1]-Mcoord[1], 0.0])).normalize();
                    var normal = [tangent.values()[1], -tangent.values()[0], 0.0];
                    glPointsList.push({point: [Mcoord[0], Mcoord[1], 0.0], tangent: tangent.values(), normal: normal, smooth: false});
                    glPointsList.push({point: [operations[i][1][0], operations[i][1][1], 0.0], tangent: tangent.values(), normal: normal, smooth: false});
                }
                else if (type === 'Z')
                {
                    closed = true;

                    var tangent = (new Vector([operations[0][1][0]-Mcoord[0], operations[0][1][1]-Mcoord[1], 0.0])).normalize();
                    var normal = [tangent.values()[1], -tangent.values()[0], 0.0];
                    glPointsList.push({point: [Mcoord[0], Mcoord[1], 0.0], tangent: tangent.values(), normal: normal, smooth: false});
                    glPointsList.push({point: [operations[0][1][0], operations[0][1][1], 0.0], tangent: tangent.values(), normal: normal, smooth: false});
                }
                else
                {
                    var totalLength = svgObject.totalLength();
                    var Nsamples = Doc.resolution;
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