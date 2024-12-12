function Group()
{
	///////////////
	// Attributs //
	///////////////

    var elementsList = [];

	var vectorObject = new VectorObject();

	//////////////
	// Méthodes //
	//////////////

	this.render = function()
    {
        var objectCode = '<g></g>';

        var svgObject = new Component(objectCode);

        for (var i = 0; i < elementsList.length; i++)
            svgObject.appendChild(elementsList[i].render());

        $this['super'].render(svgObject);

        return svgObject;
    };

    this.pathCode = function()
    {
        return '';
    };

    this.add = function($input)
    {
        if (Array.isArray($input))
        {
            for (var i = 0; i < $input.length; i++)
                $this.add($input[i]);
        }
        else
        {
            var type = $input.getType();

            if (type === 'object')
                elementsList.push($input);
            else if (type === 'transform')
                $this['super'].add($input);
        }
    };

	////////////////
	// Accesseurs //
	////////////////

	// GET

	// SET

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(vectorObject, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("group");