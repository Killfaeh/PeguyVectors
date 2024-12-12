function AppGrid()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="appGrid" >'
				+ '<div id="leftPanel" class="leftPanel" >'
					+ '<div id="openAssets" class="openAssets" ></div>'
				+'</div>'
				+ '<div id="rightPanel" class="rightPanel" >'
					/*
					+ '<div id="topPanel" class="topPanel" >'
					+ '</div>'
					+ '<div id="bottomPanel" class="panel bottomPanel" >'
					+ '</div>'
					//*/
				+ '</div>'
			+ '</div>';
	
	var component = new Component(html);
	
	var slide1 = new HorizontalSlide(component.getById('leftPanel'), component.getById('rightPanel'), 250);
	var slide2 = new VerticalSlide(component.getById('topPanel'), component.getById('bottomPanel'), 150);
	
	//component.appendChild(slide1);
	//component.getById('rightPanel').appendChild(slide2);

	var closeIcon = Loader.getSVG('icons', 'right-double-arrow-icon', 15, 15);
	var openIcon = Loader.getSVG('icons', 'left-double-arrow-icon', 15, 15);

	component.getById('openAssets').appendChild(closeIcon);
	component.getById('openAssets').appendChild(openIcon);
	
	openIcon.style.display = 'none';
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	//slide1.onDrag = function() { Events.resize(); };
	//slide2.onDrag = function() { Events.resize(); };

	closeIcon.onClick = function()
	{
		openIcon.removeAttribute('style');
		closeIcon.style.display = 'none';
		component.getById('rightPanel').style.display = 'none';
		component.getById('leftPanel').style.right = '0px';
		viewManager.resize();
	};

	openIcon.onClick = function()
	{
		closeIcon.removeAttribute('style');
		openIcon.style.display = 'none';
		component.getById('rightPanel').removeAttribute('style');
		component.getById('leftPanel').removeAttribute('style');
		viewManager.resize();
	}
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("appGrid");