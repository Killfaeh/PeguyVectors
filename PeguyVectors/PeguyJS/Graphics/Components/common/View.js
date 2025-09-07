function View($name, $html)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var html = $html;

	if (!utils.isset(html))
		html = '';
	
	var component = new Component('<div class="view" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;" >' + html + '</div>');

	//////////////
	// Méthodes //
	//////////////

	// A surcharger
	this.init = function() {};
	this.update = function() {};
	this.resize = function() {};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getName = function() { return name; };

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("view");