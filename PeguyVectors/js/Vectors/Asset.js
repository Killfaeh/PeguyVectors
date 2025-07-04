function Asset($base64Code)
{
	///////////////
	// Attributs //
	///////////////

    var base64Code = $base64Code;

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function render()
    {
        var svgCode = atob(base64Code.replace('data:image/svg+xml;base64,', ''));
        svgCode = svgCode.replaceAll('\n', '');
        svgCode = svgCode.replaceAll('\t', '');
        svgCode = svgCode.replace(/^<.*\?>/, '');
        svgCode = svgCode.replace(/<!DOCTYPE .*><svg/, '<svg');
        svgCode = svgCode.replace(/<svg[^>]*>/, '<g>');
        svgCode = svgCode.replace("svg>", 'g>');

		//console.log(svgCode);

        var svgObject = new Component(svgCode);

        //$this['super'].render(svgObject);

		$this.execSuper('render', [svgObject], render);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

	this.clone = function()
	{
		var clone = Asset(base64Code);
		clone.setTransformList(clone.getTransformList());
		return clone;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getCode = function() { return base64Code; };

	// SET
	
    this.setCode = function($base64Code) { base64Code = $base64Code; };
    this.code = function($base64Code) { $this.setCode($base64Code); };

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("asset");