function HelpPopup()
{
	///////////////
	// Attributs //
	///////////////

	var code2D = "/////////////////////\n"
				+ "//// 2D Elements ////\n"
				+ "/////////////////////\n\n"
	
				+"// Create square\n"
				+ "var size = 100;\n"
				+ "var square = new Square(size);\n\n"
				
				+ "// Create rectangle\n"
				+ "var width = 200;\n"
				+ "var height = 100;\n"
				+ "var rect = new Rect(width, height);\n\n"
				
				+ "// Create line\n"
				+ "var x1 = 0;\n"
				+ "var y1 = 0;\n"
				+ "var x2 = 1000;\n"
				+ "var y2 = 1000;\n"
				+ "var line = new Line(x1, y1, x2, y2);\n\n"
				
				+ "// Create circle\n"
				+ "var radius = 50;\n"
				+ "var circle = new Circle(radius);\n\n"
				
				+ "// Create ellipse\n"
				+ "var rX = 50;\n"
				+ "var rY = 25;\n"
				+ "var ellipse = new Ellipse(rX, rY);\n\n"
				
				+ "// Create polyline\n"
				+ "var points = [[-25, -25], [25, -25], [0, 25]];\n"
				+ "var polyline = new Polyline(points);\n\n"
				
				+ "// Create polygon\n"
				+ "var points = [[-25, -25], [25, -25], [0, 25]];\n"
				+ "var polygon = new Polygon(points);\n\n"
				
				+ "// Create path\n"
				+ "var operations = [['M', [-25, -25]], ['L', [25, -25]], ['L', [0, 25]], ['Z']];\n"
				+ "var path = new Path(operations);\n\n"

				+ "var path2 = new Path([]);\n"
				+ "path2.moveTo([$x, $y]);\n"
				+ "path2.lineTo([$x, $y]);\n"
				+ "path2.arc([$rx, $ry], $rotation, $largeArcFlag, $sweepFlag, [$endX, $endY]);\n"
				+ "path2.bezierQ([$hx, $hy], [$endX, $endY]);\n"
				+ "path2.bezierQT([$hx, $hy], [$endX, $endY], [$htx, $hty]);\n"
				+ "path2.bezierC([$h1x, $h1y], [$h2x, $h2y], [$endX, $endY]);\n"
				+ "path2.bezierCS([$h1x, $h1y], [$h2x, $h2y], [$endX, $endY], [$hs1x, $hs1y], [$hs2x, $hs2y]);\n"
				+ "path2.close();\n\n"

				+ "// Create asset instance\n"
				+ "var asset = new Asset($base64Code);\n\n"

				+ "// Create group\n"
				+ "var group = new Group();\n\n"
				
				+ "// Add element to group\n"
				+ "group.add($element);\n\n"
				
				+ "// Add element to the document\n"
				+ "Doc.add($element);\n\n";

	var codeProperties =  "/////////////////////////////\n"
				+ "//// Elements properties ////\n"
				+ "/////////////////////////////\n\n"

				+ "// Define element fill color\n"
				+ "var color = 'rgb(255, 0, 0)';\n"
				+ "element.fill(color);\n\n"

				+ "// Define element border\n"
				+ "var color = 'rgb(255, 0, 0)';\n"
				+ "var width = 2;\n"
				+ "element.border(color, width);\n\n"

				+ "// Get curve length\n"
				+ "element.totalLength();\n\n"

				+ "// Get coordinates of the point on the curve at length $t (value between 0. and 1.0)\n"
				+ "var t = 0.5;\n"
				+ "element.pointAtLength(t);\n\n"

				+ "// Get tangent of the curve at length $t (value between 0. and 1.0)\n"
				+ "var t = 0.5;\n"
				+ "element.tangentAtLength(t);\n\n"

				+ "// Get normal of the curve at length $t (value between 0. and 1.0)\n"
				+ "var t = 0.5;\n"
				+ "element.normalAtLength(t);\n\n"

				+ "// Get n points on the curve\n"
				+ "var n = 10;\n"
				+ "element.samplePoints(n);\n\n"
				
				+ "// Get n points on the curve with position data, tangent data and normal data\n"
				+ "var n = 10;\n"
				+ "element.samplePointsWithProperties(n);\n\n";

	var codeTransformations = "/////////////////////////\n"
				+ "//// Transformations ////\n"
				+ "/////////////////////////\n\n"
				
				+ "// Create translation\n"
				+ "var x = 500;\n"
				+ "var y = 500;\n"
				+ "var translation = new Translation(x, y);\n\n"
				
				+ "// Create rotation (value in degrees)\n"
				+ "var angle = 45;\n"
				+ "var rotation = new Rotation(angle);\n\n"
				
				+ "// Create scale\n"
				+ "var scaleX = 0.5;\n"
				+ "var scaleY = 1.5;\n"
				+ "var scale = new Scale(scaleX, scaleY);\n\n"
				
				+ "// Create skewX\n"
				+ "var skew = 25;\n"
				+ "var skewX = new SkewX(skew);\n\n"
				
				+ "// Create skewY\n"
				+ "var skew = 25;\n"
				+ "var skewY = new SkewY(skew);\n\n"
				
				+ "// Apply transformation to element\n"
				+ "element.add(transformation);\n\n"
				
				+ "// Apply transformation to group\n"
				+ "group.add(transformation);\n\n"
				
				+ "// Apply transformation to the document\n"
				+ "Doc.add(transformation);\n\n";
				
	var codePoints = "///////////////////////////\n"
				+ "//// Points utilities ////\n"
				+ "//////////////////////////\n\n"

				+ "// Distance between 2 points\n"
				+ "var point1 = [0, 0];\n"
				+ "var point2 = [100, 100];\n"
				+ "var distance = Points.distance(point1, point2);\n\n"
				
				+ "// Create grid of points\n"
				+ "var width = 500;\n"
				+ "var height = 250;\n"
				+ "var nX = 10;\n"
				+ "var nY = 5;\n"
				+ "var random = 10;\n"
				+ "Points.createGrid(width, height, nX, nY, random);\n\n"
				
				+ "// Create grid of staggered points\n"
				+ "var width = 500;\n"
				+ "var height = 250;\n"
				+ "var nX = 10;\n"
				+ "var nY = 5;\n"
				+ "var random = 10;\n"
				+ "Points.createStaggeredGrid(width, height, nX, nY, random);\n\n"
				
				+ "// Create Fibonacci pattern\n"
				+ "var width = 500;\n"
				+ "var height = 250;\n"
				+ "var nbDots = 100;\n"
				+ "var random = 10;\n"
				+ "Points.createFibonacciPattern(width, height, nbDots, random);\n\n"
				
				+ "// Remove points in the shape\n"
				+ "Points.cut($input, $shape);\n\n"
				
				+ "// Get points in the shape\n"
				+ "Points.intersect($input, $shape);\n\n"

				+ "// Union of 2 lists of points\n"
				+ "Points.union($input1, $input2);\n\n"
				
				+ "// Get n points on the curve\n"
				+ "var n = 10;\n"
				+ "element.samplePoints(n);\n\n"
				
				+ "// Get n points on the curve with position data, tangent data and normal data\n"
				+ "var n = 10;\n"
				+ "element.samplePointsWithProperties(n);\n\n"
				
				+ "// Easy way to create copies of an object on each point of a list\n"
				+ "elementToCopy.cloneToPoints($listOfPoints);\n\n";

	var html2D = '<div id="code-block" class="code-block" >'
					+ '<pre id="code-content" class="javascript" >' + code2D + '</pre>'
				+ '</div>';
	
	var htmlProperties = '<div id="code-block" class="code-block" >'
					+ '<pre id="code-content" class="javascript" >' + codeProperties + '</pre>'
				+ '</div>';

	var htmlTransformations = '<div id="code-block" class="code-block" >'
					+ '<pre id="code-content" class="javascript" >' + codeTransformations + '</pre>'
				+ '</div>';

	var htmlPoints = '<div id="code-block" class="code-block" >'
					+ '<pre id="code-content" class="javascript" >' + codePoints + '</pre>'
				+ '</div>';
	
	var popupHTML = '<h2>Help</h2>'
					+ '<div id="tabManager" ></div>';

	var popup = new Popup(popupHTML);
	
	popup.addClass('help-popup');

	var tabManager = new TabManager();
	tabManager.setEditMode(false);

	var tab2D = new Tab('<span>' + "2D elements" + '</span>', new Component(html2D));
	tabManager.addTab(tab2D);

	var tabProperties = new Tab('<span>' + "Elements properties" + '</span>', new Component(htmlProperties));
	tabManager.addTab(tabProperties);

	var tabTransformations = new Tab('<span>' + "Transformations" + '</span>', new Component(htmlTransformations));
	tabManager.addTab(tabTransformations);

	var tabPoints = new Tab('<span>' + "Points" + '</span>', new Component(htmlPoints));
	tabManager.addTab(tabPoints);

	tab2D.select();

	popup.getById('tabManager').appendChild(tabManager);
	tabManager.style.top = "80px";
	tabManager.style.bottom = "30px";
	tabManager.style.left = "30px";
	tabManager.style.right = "30px";
	tabManager.style.border = "solid 1px rgb(120, 120, 120)";

	hljs.highlightElement(tab2D.getContent().getById('code-content'));
	hljs.highlightElement(tabProperties.getContent().getById('code-content'));
	hljs.highlightElement(tabTransformations.getContent().getById('code-content'));
	hljs.highlightElement(tabPoints.getContent().getById('code-content'));
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("helpPopup");