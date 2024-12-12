function SVGpanel()
{
	///////////////
	// Attributs //
	///////////////
	
	var width = 1000;
	var height = 1000;

	var html = '<div class="svgPanel" >'
		+ '</div>';
	
	var component = new Component(html);
	
	var svg = new Component('<svg xmlns="' + SVGNS + '" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" ></svg>');

	var cursorCode = '<g id="cursor" >'
						+ '<line id="x" x1="0" y1="0" x2="0" y2="100000000" style="stroke: rgb(0, 255, 0); " />'
						+ '<line id="y" x1="0" y1="0" x2="100000000" y2="0" style="stroke: rgb(255, 0, 0); " />'
					+ '</g>';
	
	var cursor = new Component(cursorCode);
	
	//svg.appendChild(cursor);
	component.appendChild(svg);
	
	//////////////
	// Méthodes //
	//////////////
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onMouseMove = function($event)
	{
		if (utils.isset(cursor.parentNode))
		{
			var mousePosition = $this.mousePosition($event);
			var thisPosition = $this.position();
			var mouseX = mousePosition.x - thisPosition.x - 10 + $this.scrollLeft;
			var mouseY = mousePosition.y - thisPosition.y - 10 + $this.scrollTop;
			
			/*
			cursor.getById('x').setAttributeNS(null, 'x1', mouseX);
			cursor.getById('x').setAttributeNS(null, 'x2', mouseX);
			cursor.getById('y').setAttributeNS(null, 'y1', mouseY);
			cursor.getById('y').setAttributeNS(null, 'y2', mouseY);
			//*/

			/*
			var physicalWidth = appData.getPhysicalWidth();
			var ratio = physicalWidth/$this.firstChild.getAttribute('width');
			var physicalX = ratio * mouseX;
			var physicalY = ratio * mouseY;
			//*/
			
			//viewManager.getPositionConsole().innerHTML = '<p>' + physicalX + ', ' + physicalY + '</p>';
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getCursor = function() { return cursor; };
	this.getSVG = function() { return svg; };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("svgPanel");