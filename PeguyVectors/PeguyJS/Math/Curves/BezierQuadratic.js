function BezierQuadratic($p0, $p1, $p2)
{
	///////////////
	// Attributs //
	///////////////

	var bezier = new Bezier();

	var p0 = $p0;
	var p1 = $p1;
	var p2 = $p2;

	if (!utils.isset(p0[2]))
		p0.push(0.0);

	if (!utils.isset(p1[2]))
		p1.push(0.0);

	if (!utils.isset(p2[2]))
		p2.push(0.0);

	//console.log([p0, p1, p2]);

	//////////////
	// Méthodes //
	//////////////

	this.derivative = function($t)
	{
		var mt = 1.0 - $t;
    	var dx = 2*mt*(p1[0]-p0[0]) + 2*$t*(p2[0]-p1[0]);
    	var dy = 2*mt*(p1[1]-p0[1]) + 2*$t*(p2[1]-p1[1]);
    	var dz = 2*mt*(p1[2]-p0[2]) + 2*$t*(p2[2]-p1[2]);

		var d = Math.sqrt(dx*dx + dy*dy + dz*dz);
    	return d;
	};

	this.pointAtLength = function($t)
	{
		var output = p0;

		if ($t <= 0.0)
			$t = 0.0;
		else if ($t >= 1.0)
		{
			$t = 1.0;
			output = p2;
		}
		else
		{
			var s = $this.findTforArcLength($t);
			var mt = 1 - s;
			var mt2 = mt * mt;
			var t2 = s * s;

			output =
			[
				mt2*p0[0] + 2*mt*s*p1[0] + t2*p2[0],
				mt2*p0[1] + 2*mt*s*p1[1] + t2*p2[1],
				mt2*p0[2] + 2*mt*s*p1[2] + t2*p2[2]
			];
		}

    	return output;
	};

	this.samplePoints = function($n)
	{
		var samples = $this['super'].samplePoints($n);

		samples[0] = p0;
		samples[samples.length-1] = p2;

		return samples;
	};

	this.samplePointsForWebGL = function($n)
	{
		var samples = $this['super'].samplePointsForWebGL($n);

		samples[0].point = p0;
		samples[samples.length-1].point = p2;

		return samples;
	};

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(bezier, this);
	$this.computeLength();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("bezierQuadratic");