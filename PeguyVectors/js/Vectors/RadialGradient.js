function RadialGradient($colors, $cx, $cy, $r, $fx, $fy)
{
	///////////////
	// Attributs //
	///////////////

	var gradient = new Gradient($colors);

	var cx = $cx;
	var cy = $cy;
	var r = $r;
	var fx = $fx;
	var fy = $fy;

	if (!utils.isset(cx))
		cx = 50;

	if (!utils.isset(cy))
		cy = 50;

	if (!utils.isset(r))
		r = 100;

	if (!utils.isset(fx))
		fx = 50;

	if (!utils.isset(fy))
		fy = 50;

	//////////////
	// Méthodes //
	//////////////

	this.render = function render()
    {
		var objectCode = '<radialGradient cx="' + cx + '%" cy="' + cy + '%" r="' + r + '%" fx="' + fx + '%" fy="' + fy + '%" ></radialGradient>';
        var svgObject = new Component(objectCode);
        $this.execSuper('render', [svgObject], render);
        return svgObject;
    };

	this.symetry = function($axis)
	{
		if (!utils.isset($axis))
            $axis = 'y';

		var clone = new RadialGradient(gradient.getColors(), cx, cy, r, fx, fy);
		clone.setLocalCoordinates(gradient.isLocalCoordinates());
		clone.setSpreadMethod(gradient.getSpreadMethod());

		if ($axis === 'x')
		{
			clone.setCY(100-cy);
			clone.setFY(100-fy);
		}
		else
		{
			clone.setCX(100-cx);
			clone.setFX(100-fx);
		}

		return clone;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getCX = function() { return cx; };
	this.getCY = function() { return cy; };
	this.getR = function() { return r; };
	this.getFX = function() { return fx; };
	this.getFY = function() { return fy; };

	// SET

	this.setCX = function($cx) { cx = $cx; };
	this.setCY = function($cy) { cy = $cy; };
	this.setR = function($r) { r = $r; };
	this.setFX = function($fx) { fx = $fx; };
	this.setFY = function($fy) { fy = $fy; };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(gradient, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("radialGradient");