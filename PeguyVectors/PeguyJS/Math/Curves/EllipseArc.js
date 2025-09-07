function EllipseArc($start, $end, $radius, $axisRotation, $largeArcFlag, $sweepFlag)
{
	///////////////
	// Attributs //
	///////////////

	var bezier = new Bezier();

	var start = $start;
	var end = $end;
	var radius = $radius; // Taille 2, ellipse en 2 dimensions mais avec des roatations
	var axisRotation = $axisRotation;
	var largeArcFlag = $largeArcFlag;
	var sweepFlag = $sweepFlag;

	if (!utils.isset(start[2]))
		start.push(0.0);

	if (!utils.isset(end[2]))
		end.push(0.0);

	//console.log([start, end, radius, axisRotation, largeArcFlag, sweepFlag]);

	var svgObject = null;

	//// Calcul des repères ////

	var rot = axisRotation;

	// Repère local dans le repère global

	var localXaxis = [1.0, 0.0, 0.0];
	var localYaxis = [0.0, 1.0, 0.0];
	var localZaxis = [0.0, 0.0, 1.0];

	var delta = Vectors.delta(new Vector(start), new Vector(end));

	var dotX = Vectors.dotProduct(delta.normalize(), localXaxis);
	var dotY = Vectors.dotProduct(delta.normalize(), localYaxis);
	var dotZ = Vectors.dotProduct(delta.normalize(), localZaxis);

	delta = delta.values();
	delta[1] = 0.0;

	localXaxis = (new Vector(delta)).normalize().values();
	localZaxis = Vectors.crossProduct(new Vector(localXaxis), new Vector(localYaxis)).normalize().opposite().values();

	// Axe vertical
	if (dotZ >= 1.0)
	{
		localXaxis = [0.0, 0.0, 1.0];
		localYaxis = [0.0, 1.0, 0.0];
		localZaxis = [1.0, 0.0, 0.0];
	}
	// Axe aligné avec Y
	else if (dotY >= 1.0)
	{
		localXaxis = [0.0, 1.0, 0.0];
		localYaxis = [1.0, 0.0, 0.0];
		localZaxis = [0.0, 0.0, 1.0];
	}

	if (Array.isArray(axisRotation))
	{
		rot = axisRotation[0];

		/*
		var phi = axisRotation[1]/180.0*Math.PI;

		localZaxis = Vectors.sum([(new Vector(localZaxis)).scale(Math.cos(phi)), 
									(new Vector(localYaxis)).scale(Math.sin(phi))]).values();

		localYaxis = Vectors.crossProduct(new Vector(localZaxis), delta).normalize().values();
		//*/
	}

	var localReference = [new Vector(localXaxis), new Vector(localYaxis), new Vector(localZaxis)];

	var startLocal = [0.0, 0.0, 0.0];
	var endLocal = [end[0]-start[0], end[1]-start[1], end[2]-start[2]];
	endLocal = Vectors.changeReference(new Vector(endLocal), localReference).values();
	endLocal[2] = 0.0;

	// Repère global dans le repère local

	var globalXaxis = [1.0, 0.0, 0.0];
	var globalYaxis = [0.0, 1.0, 0.0];
	var globalZaxis = [0.0, 0.0, 1.0];

	globalXaxis = Vectors.changeReference(new Vector([1.0, 0.0, 0.0]), localReference).values();
	globalYaxis = Vectors.changeReference(new Vector([0.0, 1.0, 0.0]), localReference).values();
	globalZaxis = Vectors.changeReference(new Vector([0.0, 0.0, 1.0]), localReference).values();

	var globalReference = [new Vector(globalXaxis), new Vector(globalYaxis), new Vector(globalZaxis)];

	//////////////
	// Méthodes //
	//////////////

	var initSVG = function()
	{
		if (!utils.isset(svgObject))
		{
			var d = 'M ' + startLocal[0] + ',' + startLocal[1] + 'A ' + radius[0] + ' ' + radius[1] + ' ' + rot + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + endLocal[0] + ',' + endLocal[1] + ' ';
			var objectCode = '<path d="' + d + '" />';
			//console.log(objectCode);
			svgObject = new Component(objectCode);
		}
	};

	this.computeLength = function()
	{
		initSVG();
		length = svgObject.getTotalLength();
		bezier.setLength(length);
	};

	var globalToLocal = function($input)
	{
		if (!utils.isset($input[2]))
			$input.push(0.0);

		var output = $input;
		output = Vectors.changeReference(new Vector($input), globalReference).values();

		return output;
	};

	var localToGlobal = function($input)
	{
		if (!utils.isset($input[2]))
			$input.push(0.0);

		var output = $input;
		output = Vectors.changeReference(new Vector($input), localReference);
		output = Vectors.sum([output, new Vector(start)]);

		/*
		if (isNaN($input[0]) || isNaN($input[1]) || isNaN($input[2]))
			Debug.callstack();

		console.log("LOCAL");
		console.log($input);

		console.log("GLOBAL");
		console.log(output);
		//*/

		return output;
	};

	this.pointAtLength = function($t)
	{
		var output = start;

		if ($t <= 0.0)
			$t = 0.0;
		else if ($t >= 1.0)
		{
			$t = 1.0;
			output = end;
		}
		else
		{
			initSVG();
			var point = svgObject.pointAtLength($t);

			if (Array.isArray(axisRotation))
			{
				var phi = axisRotation[1]/180.0*Math.PI;
				// A faire
			}

			output = localToGlobal(point).values();
		}

		return output;
	};

	this.tangentAtLength = function($t, $precision)
	{
		initSVG();

		var precision = $precision;

		if (!utils.isset(precision))
			precision = 0.001;

		if ($t < 0.0)
			$t = 0.0;
		else if ($t > 1.0)
			$t = 1.0;

		var $tPrev = $t-precision;
		var $tNext = $t+precision;
			
		if ($tPrev < 0.0)
			$tPrev = 0.0;
		else if ($tPrev > 1.0)
			$tPrev = 1.0;
			
		if ($tNext < 0.0)
			$tNext = 0.0;
		else if ($tNext > 1.0)
			$tNext = 1.0;
				
		var pointPrev = $this.pointAtLength($tPrev);
		var pointNext = $this.pointAtLength($tNext);
			
		var deltaVect = [pointNext[0]-pointPrev[0], pointNext[1]-pointPrev[1], pointNext[2]-pointPrev[2]];
		var tangent = (new Vector(deltaVect)).normalize().values();

		return tangent;
	};

	this.normalAtLength = function($t, $precision)
	{
		initSVG();

		var precision = $precision;

		if (!utils.isset(precision))
			precision = 0.001;

		if ($t < 0.0)
			$t = 0.0;
		else if ($t > 1.0)
			$t = 1.0;

		var tPrev = $t-precision;
		var tNext = $t+precision;
			
		if (tPrev < 0.0)
			tPrev = 0.0;
		else if (tPrev > 1.0)
			tPrev = 1.0;
			
		if (tNext < 0.0)
			tNext = 0.0;
		else if (tNext > 1.0)
			tNext = 1.0;
		
		var t = $t;

		if (t <= 0.0)
			t = precision/2.0;
		else if (t > 1.0)
			t = 1.0-precision/2.0;

		var pointPrev = $this.pointAtLength(tPrev);
		var point = $this.pointAtLength(t);
		var pointNext = $this.pointAtLength(tNext);
		
		var xAxis = new Vector([pointPrev[0]-point[0], pointPrev[1]-point[1], pointPrev[2]-point[2]]);
		var yAxis = new Vector([pointNext[0]-point[0], pointNext[1]-point[1], pointNext[2]-point[2]]);
		var normal = Vectors.crossProduct(xAxis, yAxis).normalize();

		return normal.values();
	};

	this.samplePoints = function($n)
	{
		initSVG();
		var samples = svgObject.samplePoints($n);

		for (var i = 0; i < samples.length; i++)
		{
			if (Array.isArray(axisRotation))
			{
				var phi = axisRotation[1]/180.0*Math.PI;
				// A faire
			}

			samples[i] = localToGlobal(samples[i]).values();

			if (i === 0)
				samples[i] = start;
			else if (i === samples.length-1)
				samples[i] = end;
		}

		return samples;
	};

	this.samplePointsForWebGL = function($n)
	{
		initSVG();
		var samples = svgObject.samplePointsForWebGL($n);

		for (var i = 0; i < samples.length; i++)
		{
			var sample = samples[i];

			if (Array.isArray(axisRotation))
			{
				var phi = axisRotation[1]/180.0*Math.PI;
				// A faire
			}

			samples[i].point = localToGlobal(sample.point).values();

			if (i === 0)
				samples[i].point = start;
			else if (i === samples.length-1)
				samples[i].point = end;

			samples[i].tangent = $this.tangentAtLength(i/samples.length, 1.0/samples.length);
			//samples[i].normal = [samples[i].tangent[1], -samples[i].tangent[0], samples[i].tangent[2]];
			samples[i].normal = $this.normalAtLength(i/samples.length, 1.0/samples.length);
			samples[i].smooth = true;

			if (i === 0 || i === samples.length)
				samples[i].smooth = false;
		}

		//console.log("Sample ellipse : ");
		//console.log(samples);

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
	Loader.hasLoaded("ellipseArc");