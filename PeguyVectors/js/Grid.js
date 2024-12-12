function Grid()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="documentGrid" >'
				+ '<div id="leftPanel" class="panel leftPanel" ></div>'
				+ '<div id="rightPanel" class="rightPanel" >'
					+ '<div id="topPanel" class="panel topPanel" >'
					+ '</div>'
					+ '<div id="bottomPanel" class="panel bottomPanel" >'
					+ '</div>'
				+ '</div>'
			+ '</div>';
	
	var component = new Component(html);
	
	var slide1 = new HorizontalSlide(component.getById('leftPanel'), component.getById('rightPanel'), 400);
	var slide2 = new VerticalSlide(component.getById('topPanel'), component.getById('bottomPanel'), 200);
	
	component.appendChild(slide1);
	component.getById('rightPanel').appendChild(slide2);
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	slide1.onDrag = function() { Events.resize(); };
	slide2.onDrag = function() { Events.resize(); };
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("grid");