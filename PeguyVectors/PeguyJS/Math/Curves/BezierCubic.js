function BezierCubic($p0, $p1, $p2, $p3)
{
	///////////////
	// Attributs //
	///////////////

	var bezier = new Bezier();

	var p0 = $p0;
	var p1 = $p1;
	var p2 = $p2;
	var p3 = $p3;

	if (!utils.isset(p0[2]))
		p0.push(0.0);

	if (!utils.isset(p1[2]))
		p1.push(0.0);

	if (!utils.isset(p2[2]))
		p2.push(0.0);

	if (!utils.isset(p3[2]))
		p3.push(0.0);

	//console.log([p0, p1, p2, p3]);

	//////////////
	// Méthodes //
	//////////////

	this.derivative = function($t)
	{
		var t2 = $t*$t;
		var mt = 1.0 - $t;
    	var dx = 3*mt*mt*(p1[0]-p0[0]) + 6*mt*$t*(p2[0]-p1[0]) + 3*t2*(p3[0]-p2[0]);
    	var dy = 3*mt*mt*(p1[1]-p0[1]) + 6*mt*$t*(p2[1]-p1[1]) + 3*t2*(p3[1]-p2[1]);
    	var dz = 3*mt*mt*(p1[2]-p0[2]) + 6*mt*$t*(p2[2]-p1[2]) + 3*t2*(p3[2]-p2[2]);
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
			output = p3;
		}
		else
		{
			var s = $this.findTforArcLength($t);
			var mt = 1 - s;
			var mt2 = mt * mt;
			var t2 = s * s;

			output =
			[
				mt2*mt*p0[0] + 3*mt2*s*p1[0] + 3*mt*t2*p2[0] + t2*s*p3[0],
				mt2*mt*p0[1] + 3*mt2*s*p1[1] + 3*mt*t2*p2[1] + t2*s*p3[1],
				mt2*mt*p0[2] + 3*mt2*s*p1[2] + 3*mt*t2*p2[2] + t2*s*p3[2]
			];
		}

    	return output;
	};

	this.samplePoints = function($n)
	{
		var samples = $this['super'].samplePoints($n);

		samples[0] = p0;
		samples[samples.length-1] = p3;

		return samples;
	};

	this.samplePointsForWebGL = function($n)
	{
		var samples = $this['super'].samplePointsForWebGL($n);

		samples[0].point = p0;
		samples[samples.length-1].point = p3;

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
	Loader.hasLoaded("bezierCubic");