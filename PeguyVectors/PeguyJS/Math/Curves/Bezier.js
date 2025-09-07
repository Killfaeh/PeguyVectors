function Bezier()
{
	///////////////
	// Attributs //
	///////////////

	var gaussLegendreTable =
	{
    	2:
		{
        	x: [-0.5773502692, 0.5773502692],
        	w: [1.0, 1.0]
    	},

    	3:
		{
        	x: [-0.7745966692, 0.0, 0.7745966692],
        	w: [0.5555555556, 0.8888888889, 0.5555555556]
    	},
		
		4:
		{
        	x: [-0.8611363116, -0.3399810436, 0.3399810436, 0.8611363116],
        	w: [0.3478548451, 0.6521451549, 0.6521451549, 0.3478548451]
    	},
		
		5:
		{
        	x: [-0.9061798459, -0.5384693101, 0.0, 0.5384693101, 0.9061798459],
        	w: [0.2369268851, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268851]
    	},

    	6:
		{
        	x: [-0.9324695142, -0.6612093865, -0.2386191861, 0.2386191861, 0.6612093865, 0.9324695142],
        	w: [0.1713244924, 0.3607615730, 0.4679139346, 0.4679139346, 0.3607615730, 0.1713244924]
    	},

    	7:
		{
        	x: [-0.9491079123, -0.7415311856, -0.4058451514, 0.0, 0.4058451514, 0.7415311856, 0.9491079123],
        	w: [0.1294849662, 0.2797053915, 0.3818300505, 0.4179591837, 0.3818300505, 0.2797053915, 0.1294849662]
    	},

    	8:
		{
        	x: [-0.9602898565, -0.7966664774, -0.5255324099, -0.1834346425, 0.1834346425, 0.5255324099, 0.7966664774, 0.9602898565],
        	w: [0.1012285363, 0.2223810345, 0.3137066459, 0.3626837834, 0.3626837834, 0.3137066459, 0.2223810345, 0.1012285363]
    	},

    	9:
		{
        	x: [-0.9681602395, -0.8360311073, -0.6133714327, -0.3242534234, 0.0, 0.3242534234, 0.6133714327, 0.8360311073, 0.9681602395],
        	w: [0.0812743884, 0.1806481607, 0.2606106964, 0.3123470770, 0.3302393550, 0.3123470770, 0.2606106964, 0.1806481607, 0.0812743884]
    	},

    	10:
		{
        	x: [-0.9739065285, -0.8650633667, -0.6794095683, -0.4333953941, -0.1488743390, 0.1488743390, 0.4333953941, 0.6794095683, 0.8650633667, 0.9739065285],
        	w: [0.0666713443, 0.1494513492, 0.2190863625, 0.2692667193, 0.2955242247, 0.2955242247, 0.2692667193, 0.2190863625, 0.1494513492, 0.0666713443]
    	}
	};

	var order = 10;
	var length = 0.0;
	var tolerance = 0.000001;

	//////////////
	// Méthodes //
	//////////////

	this.derivative = function($t) { return 0.0; }; // A surcharger

	this.integrate = function($a, $b)
	{
		var table = gaussLegendreTable[order];
    	
		if (!table) throw new Error("Ordre non supporté (2 <= n <= 10)");

    	var x = table.x;
		var w = table.w;

    	var xm = 0.5 * ($a + $b);
    	var xr = 0.5 * ($b - $a);

    	var s = 0.0;
    
		for (var i = 0; i < x.length; i++)
        	s = s + w[i] * $this.derivative(xm + xr * x[i]);
    
    	return s * xr;
	};

	this.computePartialLength = function($t) { return $this.integrate(0.0, $t); };
	this.computeLength = function() { length = $this.computePartialLength(1.0); };

	this.findTforArcLength = function($s)
	{
    	if (length === 0.0)
			length = $this.computePartialLength(1.0);

    	var target = $s * length;

    	var low = 0.0;
		var high = 1.0;
		var mid = 0.5;

		while (high - low > tolerance)
		{
        	mid = 0.5 * (low + high);
        	var len = $this.computePartialLength(mid);

			if (len < target)
            	low = mid;
        	else
	            high = mid;
    	}

    	return 0.5 * (low + high);
	};

	this.pointAtLength = function($t) { return [0.0, 0.0, 0.0]; }; // A surcharger

	this.tangentAtLength = function($t, $precision)
	{
		var precision = $precision;

		if (!utils.isset(precision))
			precision = 0.001;
		
		if ($t < 0.0)
			$t = 0.0;
		else if ($t > 1.0)
			$t = 1.0;

		//var $tPrev = $t-Math.pow(10, -PEGUY.glPrecision)/length;
		//var $tNext = $t+Math.pow(10, -PEGUY.glPrecision)/length;

		var $tPrev = $t - precision;
		var $tNext = $t + precision;
			
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
			
		var deltaVect = Vectors.delta(new Vector(pointPrev), new Vector(pointNext));
		var output = deltaVect.normalize();

		return output.values();
	};

	this.normalAtLength = function($t, $precision)
	{
		var precision = $precision;

		if (!utils.isset(precision))
			precision = 0.001;

		if ($t < 0.0)
			$t = 0.0;
		else if ($t > 1.0)
			$t = 1.0;

		var tPrev = $t - precision;
		var tNext = $t + precision;
			
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
		else if (t >= 1.0)
			t = 1.0-precision/2.0;

		var pointPrev = $this.pointAtLength(tPrev);
		var point = $this.pointAtLength(t);
		var pointNext = $this.pointAtLength(tNext);
		
		var xAxis = new Vector([pointPrev[0]-point[0], pointPrev[1]-point[1], pointPrev[2]-point[2]]);
		var yAxis = new Vector([pointNext[0]-point[0], pointNext[1]-point[1], pointNext[2]-point[2]]);
		var normal = Vectors.crossProduct(xAxis, yAxis).normalize();

		/*
		//if (isNaN(normal.values()[0]) || isNaN(normal.values()[1]) || isNaN(normal.values()[2]))
		{
			console.log("Normal");
			console.log(t);
			console.log(pointPrev);
			console.log(point);
			console.log(pointNext);
			console.log(xAxis.values());
			console.log(yAxis.values());
			console.log(normal.values());
		}
		//*/

		return normal.values();
	};

	this.samplePoints = function($n)
	{
		var n = $n;

		if (n < 2)
			n = 2;
			
		var pointsList = [];
			
		for (var i = 0; i < n; i++)
		{
			var t = i/(n-1);
			pointsList.push($this.pointAtLength(t));
		}

		//console.log("Sampled points : ");
		//console.log(pointsList);

		return pointsList;
	};

	this.samplePointsForWebGL = function($n)
	{
		var n = $n;

		if (n < 2)
			n = 2;

		var pointsList = [];
			
		for (var i = 0; i < n; i++)
		{
			var t = i/(n-1);
			var point = $this.pointAtLength(t);
			var tangent = $this.tangentAtLength(t, 1.0/n);
			//var normal = Vectors.crossProduct(new Vector(tangent), new Vector([0.0, 0.0, 1.0])).values();
			var normal = $this.normalAtLength(t, 1.0/n);
			var smooth = true;

			if (i === 0 || i === n)
				smooth = false;
			
			var data = { point: point, tangent: tangent, normal: normal, smooth: smooth, t: t};
			pointsList.push(data);
		}

		//console.log("Sampled points : ");
		//console.log(pointsList);

		return pointsList;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getLength = function() { return length; };
	this.totalLength = function() { return length; };

	// SET

	this.setLength = function($length) { length = $length; };

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("bezier");