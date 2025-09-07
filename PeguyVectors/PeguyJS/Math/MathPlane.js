function MathPlane($a, $b, $c, $d)
{
	///////////////
	// Attributs //
	///////////////

	var a = $a;
	var b = $b;
	var c = $c;
	var d = $d;

	if (!utils.isset(a))
		a = 1.0;

	if (!utils.isset(b))
		b = 1.0;

	if (!utils.isset(c))
		c = 1.0;

	if (!utils.isset(d))
		d = 1.0;

	//////////////
	// Méthodes //
	//////////////

	this.computeFromNormal = function($normal, $vertex)
	{
		var normal = $normal.normalize();

		a = normal.x;
		b = normal.y;
		c = normal.z;
		d = -(a*$vertex.x + b*$vertex.y + c*$vertex.z);
	};

	this.getDistance = function($vertex)
	{
		return Math.abs(a * $vertex.x + b * $vertex.y + c * $vertex.z + d) / Math.sqrt(a * a + b * b + c * c);
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET 

	this.getA = function() { return a; };
	this.getB = function() { return b; };
	this.getC = function() { return c; };
	this.getD = function() { return d; };
	
	// SET 

	this.setA = function($a) { a = $a; };
	this.setB = function($b) { b = $b; };
	this.setC = function($c) { c = $c; };
	this.setD = function($d) { d = $d; };

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("math-plane");