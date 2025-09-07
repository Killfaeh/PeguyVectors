function Workspace($parentDocument, $width, $height, $docWidth, $docHeight)
{
	///////////////
	// Attributs //
	///////////////
	
	var parentDocument = $parentDocument;
	var docWidth = $docWidth;
	var docHeight = $docHeight;
	var scale = 1.0;
	var offsetX = 0.0;
	var offsetY = 0.0;
	
	var svg = new SVG($width, $height);
	svg.setAttribute('class', 'workspace');
	
	var patternCode = '<defs>'
							+ '<pattern id="gridPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" >'
								+ '<line x1="0" y1="100" x2="100" y2="100" class="gridLine" />'
								+ '<line x1="100" y1="0" x2="100" y2="100" class="gridLine" />'
							+ '</pattern>'
							+ '<clipPath id="mask">'
								+ '<rect id="maskRect" class="background" x="0" y="0" width="' + docWidth + '" height="' + docHeight + '" />'
							+ '</clipPath>'
							+ '<g id="defs" ></g>'
						+ '</defs>';
	
	var pattern = new Component(patternCode);
	
	pattern.getById('gridPattern').setAttribute('id', 'gridPattern');
	
	var svgCode = '<g>'
						+ '<g id="translateGroup" transform="translate(0.0,0.0)" >'
							+ '<g id="scaleGroup" transform="scale(1.0)" >'
								+ '<rect id="gridRect" x="-10000000" y="-10000000" width="20000000" height="20000000" style="fill: url(#gridPattern);" />'
								+ '<rect id="background" class="background" x="0" y="0" width="' + docWidth + '" height="' + docHeight + '" />'
								+ '<g id="layers" ></g>'
								//+ '<rect id="selectRect1" class="selectRect1" x="0" y="0" width="10" height="10" style="display: none; " />'
								//+ '<rect id="selectRect" class="selectRect" x="0" y="0" width="10" height="10" style="display: none; " />'
							+ '</g>'
						+ '</g>'
					+ '</g>';
	
	var g = new Component(svgCode);
	
	g.getById('gridRect').setAttribute('style', 'fill: url(#gridPattern);');
	g.getById('layers').setAttribute('style', 'clip-path:url(#' + pattern.getRealId('mask') + ');');
	
	svg.appendChild(pattern);
	svg.appendChild(g);
	
	// Navigation et sélection
	var selectMode = false;
	var activeSelection = false;
	var dragModifier = 'shift'; 
	var dragging = false;
	var select = false;
	var move = false;
	var startX = 0;
	var startY = 0;
	var previousX = 0;
	var previousY = 0;
	
	var displayedPanel = this;
	
	//////////////
	// Méthodes //
	//////////////

	var updateScale = function()
	{
		g.getById('scaleGroup').setAttributeNS(null, 'transform', 'scale(' + scale + ')');
	};
	
	var updatePosition = function()
	{
		g.getById('translateGroup').setAttributeNS(null, 'transform', 'translate(' + offsetX + ',' + offsetY + ')');
	};

	this.addLayer = function($layer)
	{
		g.getById('layers').appendChild($layer);
	};

	this.empty = function()
	{
		pattern.getById('defs').empty();
		g.getById('layers').empty();
	};

	this.exportToSVGFile = function()
	{
		var svgCode = '<?xml version="1.0" encoding="UTF-8"?>'
						+ '<!-- Generator: Péguy Vectors - v1.0 -->'
						+ '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
						+ '<svg version="1.0" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg" width="' + docWidth + 'px" height="' + docHeight + 'px" viewBox="0 0 ' + docWidth + ' ' + docHeight + '">'
							+ '<defs>'
							+ pattern.getById('defs').innerHTML
							+ '</defs>'
							+ '<g>'
							+ g.getById('layers').innerHTML
							+ '</g>'
						+ '</svg>';
		
		return svgCode;
	};

	this.exportToPNGFile = function($callback)
	{
		var tmpNode = new Component('<svg><defs>' + pattern.getById('defs').innerHTML + '</defs>' + g.getById('layers').innerHTML + '</svg>');
		var svgTmp = new SVG(docWidth, docHeight);
		svgTmp.innerHTML = tmpNode.innerHTML;
		console.log(svgTmp.innerHTML);
		svgTmp.toBitmap(function($img) { $callback($img); }, 'image/png');
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function() {};
	
	svg.onClick = function($event)
	{
		if (move !== true && selectMode === true)
		{
			g.getById('selectRect').setAttributeNS(null, 'style', 'display: none;');
			g.getById('selectRect1').setAttributeNS(null, 'style', 'display: none;');
			activeSelection = false;
		}
	};
	
	svg.onMouseDown = function($event)
	{
		Events.preventDefault($event);

		var mousePosition = document.getElementById('main').mousePosition($event);
		
		startX = mousePosition.x;
		startY = mousePosition.y;
		previousX = startX;
		previousY = startY;

		console.log($event);
		
		/*
		if ($event.button === 0)
		{
			if (Events.keyPressTable[dragModifier] !== true && $event.metaKey !== true && selectMode === true)
			{
				dragging = true;

				var mousePosition = $this.getMousePosition($event);
				
				startX = mousePosition.x;
				startY = mousePosition.y;
				
				select = true;
				g.getById('selectRect').setAttributeNS(null, 'x', startX);
				g.getById('selectRect').setAttributeNS(null, 'y', startY);
				g.getById('selectRect').setAttributeNS(null, 'width', 0);
				g.getById('selectRect').setAttributeNS(null, 'height', 0);
				g.getById('selectRect').setAttributeNS(null, 'style', 'display: block;');
				g.getById('selectRect1').setAttributeNS(null, 'x', startX);
				g.getById('selectRect1').setAttributeNS(null, 'y', startY);
				g.getById('selectRect1').setAttributeNS(null, 'width', 0);
				g.getById('selectRect1').setAttributeNS(null, 'height', 0);
				g.getById('selectRect1').setAttributeNS(null, 'style', 'display: block;');
			}
			else if (Events.keyPressTable[dragModifier] === true)
				dragging = true;
		}
		else if ($event.button === 1)
			dragging = true;
		//*/

		if ($event.button === 0)
			dragging = true;
		
		return false;
	};
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			move = true;
			
			if (select === true)
			{
				var mousePosition = $this.getMousePosition($event);
				
				var rectX = startX;
				var rectY = startY;
				var rectWidth = Math.abs(mousePosition.x - startX);
				var rectHeight = Math.abs(mousePosition.y - startY);
				
				// Peut-être mettre ça avec la touche MAJ plus tard
				if (rectWidth > rectHeight)
					rectHeight = rectWidth;
				else
					rectWidth = rectHeight;

				if (startX > mousePosition.x)
					rectX = mousePosition.x;
				
				if (startY > mousePosition.y)
					rectY = mousePosition.y;
				
				g.getById('selectRect').setAttributeNS(null, 'x', rectX);
				g.getById('selectRect').setAttributeNS(null, 'y', rectY);
				g.getById('selectRect').setAttributeNS(null, 'width', rectWidth);
				g.getById('selectRect').setAttributeNS(null, 'height', rectHeight);
				g.getById('selectRect1').setAttributeNS(null, 'x', rectX);
				g.getById('selectRect1').setAttributeNS(null, 'y', rectY);
				g.getById('selectRect1').setAttributeNS(null, 'width', rectWidth);
				g.getById('selectRect1').setAttributeNS(null, 'height', rectHeight);
			}
			else
			{
				var mousePosition = document.getElementById('main').mousePosition($event);

				if ($event.metaKey === true)
				{
					console.log($event);

					var deltaX = mousePosition.x - previousX;
					var deltaY = mousePosition.y - previousY;
					var delta = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

					if (deltaX < 0)
						delta = -delta;
					
					var oldScale = scale;
					var percentScale = scale*100.0;
					
					percentScale = percentScale+delta/10.0;
					
					if (percentScale < 20.0)
						percentScale = 20.0;
					else if (percentScale > 500.0)
						percentScale = 500.0;
					
					scale = percentScale/100.0;
					
					var mousePosition = document.getElementById('main').mousePosition($event);
					var contentPosition = $this.parentNode.position($event);
					
					offsetX = (mousePosition.x - contentPosition.x) * (1.0 - scale/oldScale) + offsetX*scale/oldScale;
					offsetY = (mousePosition.y - contentPosition.y) * (1.0 - scale/oldScale) + offsetY*scale/oldScale;
					
					updateScale();
					updatePosition();
				}
				else
				{
					offsetX = offsetX + mousePosition.x - startX;
					offsetY = offsetY + mousePosition.y - startY;
					
					updatePosition();
					
					startX = mousePosition.x;
					startY = mousePosition.y;
				}

				previousX = mousePosition.x;
				previousY = mousePosition.y;
			}
		}
		else
		{
			
		}
	};
	
	//document.getElementById('main').onMouseMove.push(onMouseMove);
	svg.onMouseMove = onMouseMove;
	
	var onMouseUp = function($event)
	{
		if (dragging !== true)
		{
			
		}
		else
		{
			if (select === true)
			{
				//if (Events.keyPressTable['shift'] !== true)
				//	$this.unselectAll();
				
				/*
				for (var i = 0; i < displayedPanel.getNodesList().length; i++)
				{
					if (displayedPanel.getNodesList()[i].isInSelectRect(g.getById('selectRect')) === true)
						displayedPanel.getNodesList()[i].select();
				}
				//*/

				activeSelection = true;
			}
			
			setTimeout(function() { move = false; }, 50);
		}
		
		dragging = false;
		select = false;
		//g.getById('selectRect').setAttributeNS(null, 'style', 'display: none;');
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	svg.onMouseWheel = function($event)
	{
		var deltaX = $event.wheelDeltaX;
		var deltaY = $event.wheelDeltaY;
		
		var oldScale = scale;
		var percentScale = scale*100.0;
		
		percentScale = percentScale+deltaY/20.0;
		
		if (percentScale < 20.0)
			percentScale = 20.0;
		else if (percentScale > 500.0)
			percentScale = 500.0;
		
		scale = percentScale/100.0;
		
		var mousePosition = document.getElementById('main').mousePosition($event);
		var contentPosition = $this.parentNode.position($event);
		//var mousePositionInSVG = $this.getMousePosition($event);
		//var mousePositionInWindow = { x: mousePosition.x - contentPosition.x, y : mousePosition.y - contentPosition.y };
		//var virtualWindowWidth = scale*svg.getWidth();
		//var virtualWindowHeight = scale*svg.getHeight();
		
		offsetX = (mousePosition.x - contentPosition.x) * (1.0 - scale/oldScale) + offsetX*scale/oldScale;
		offsetY = (mousePosition.y - contentPosition.y) * (1.0 - scale/oldScale) + offsetY*scale/oldScale;
		
		updateScale();
		updatePosition();
	};
	
	/*
	svg.connect('onSelectNode', onSelect);
	svg.connect('onAddNodesGroup', onAddGroup);
	svg.connect('onUngroupNode', onUngroup);
	svg.connect('onMouseMoveOnModeInput', onMouseMove);
	svg.connect('onMouseUpOnModeInput', onMouseUp);
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getPattern = function() { return pattern; };
	this.getSVG = function() { return g; };

	this.getDocWidth = function() { return docWidth; };
	this.getDocHeight = function() { return docHeight; };
	
	this.getDisplayedPanel = function() { return displayedPanel; };
	
	this.getMousePosition = function($event)
	{
		var mousePosition = document.getElementById('main').mousePosition($event);
		var contentPosition = $this.parentNode.position($event);
		
		return { x: (mousePosition.x - contentPosition.x - offsetX)/scale, y: (mousePosition.y - contentPosition.y - offsetY)/scale };
	};

	this.isSelectMode = function() { return selectMode; };
	this.isActiveSelection = function() { return activeSelection; };
	
	// SET
	
	this.setDimensions = function($width, $height)
	{
		$this.setWidth($width);
		$this.setHeight($height);
	};

	this.setDocDimensions = function($docWidth, $docHeight)
	{
		docWidth = $docWidth;
		docHeight = $docHeight;
		pattern.getById('maskRect').setAttributeNS(null, 'width', docWidth);
		pattern.getById('maskRect').setAttributeNS(null, 'height', docHeight);
		g.getById('background').setAttributeNS(null, 'width', docWidth);
		g.getById('background').setAttributeNS(null, 'height', docHeight);
	};
	
	this.setScale = function($scale)
	{
		scale = $scale;
		updateScale();
	};
	
	this.setOffsetX = function($offsetX)
	{
		offsetX = $offsetX;
		updatePosition();
	};
	
	this.setOffsetY = function($offsetY)
	{
		offsetY = $offsetY;
		updatePosition();
	};
	
	this.setDragModifier = function($dragModifier) { dragModifier = $dragModifier; };

	this.setSelectMode = function($selectMode) { selectMode = $selectMode; };
	this.setActiveSelection = function($activeSelection) { activeSelection = $activeSelection; };
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("workspace");