Doc.height = 500;
var night = true;
var fullnight = false;
var startSize = 40;
var endSize = 80;
var sizeVariation = 5;
var positionXVariation = 5;
var positionYVariation = 5;
var nbRows = 3;
var yOffset = 170;
var imgWidth = 500;
var imgHeight = 250;
var interX = 25;
var interline = 40;
var mountain = 5;

var functions = 
[
	// Building 1
	{
		rate: 4,
		
		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor = 10 + Math.ceil(Math.random()*20);
			var nbColumn = 7 + Math.ceil(Math.random()*15);
			group.add(buildingBlock(nbColumn, nbFloor, $night, $sizeRate));
			return group;
		}
	}, 

	// Building 2
	{
		rate: 3,

		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor = 10 + Math.ceil(Math.random()*20);
			var nbColumn = 7 + Math.ceil(Math.random()*5);
			group.add(buildingBlock(nbColumn, nbFloor, $night, $sizeRate));

			// Add roof
			var greyScale = 255 - Math.floor($sizeRate/100 * 255);

			if (fullnight === true)
				greyScale = Math.floor(($sizeRate-startSize)/100 * 255);

			var topY = -(nbFloor+2)*20 + 2;
			var buildingWidth = (nbColumn+2)*10;
			var topWidth = buildingWidth*0.8;
			var topHeight = topWidth/2.0/Math.tan(Math.PI/6);

			var top = new Polygon([[(buildingWidth-topWidth)/2.0, topY], 
									[(buildingWidth+topWidth)/2.0, topY], 
									[buildingWidth/2.0, topY - topHeight]]);

			top.fill('rgb(' + greyScale + ',' + greyScale + ',' + greyScale + ')');
			group.add(top);

			return group;
		}
	},

	// Building 3
	{
		rate: 4,

		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor1 = 10 + Math.ceil(Math.random()*15);
			var nbColumn1 = 10 + Math.ceil(Math.random()*12);
			group.add(buildingBlock(nbColumn1, nbFloor1, $night, $sizeRate));
			var nbFloor2 = 2 + Math.ceil(Math.random()*3);
			var nbColumn2 = nbColumn1-4;
			var top = buildingBlock(nbColumn2, nbFloor2, $night, $sizeRate);
			top.add(new Translation(20, -(nbFloor1+2)*20 + 2));
			group.add(top);
			return group;
		}
	},

	// Building 4
	{
		rate: 8, 

		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor = 10 + Math.ceil(Math.random()*20);
			var nbColumn = 7 + Math.ceil(Math.random()*15);
			group.add(buildingBlock2(nbColumn, nbFloor, $night, $sizeRate));
			return group;
		}
	}, 
];

var xVariationFunction = function($x, $sizeRate) { return Math.cos($x/Doc.width*Math.PI/$sizeRate); };
var yVariationFunction = function($y) { return Math.sin(4*$y/Doc.height*Math.PI); };

var buildingBlock = function($nbColumn, $nbFloor, $night, $sizeRate)
{
	var group = new Group();

	var greyScale = 255 - Math.floor($sizeRate/100 * 255);

	if (fullnight === true)
		greyScale = Math.floor(($sizeRate-startSize)/100 * 255);

	var alightLevel = 0.6 + Math.random()*0.3;

	var width = ($nbColumn+2)*10;
	var height = ($nbFloor+2)*20;

	var rect = new Rect(width, height);
	rect.fill('rgb(' + greyScale + ',' + greyScale + ',' + greyScale + ')');
	group.add(rect);

	if ($night === true)
	{
		for (var i = 0; i < $nbFloor; i++)
		{
			for (var j = 0; j < $nbColumn; j++)
			{
				var alight = Math.random();

				if (alight >= alightLevel)
				{
					var window = new Rect(6, 10);
					window.add(new Translation((j+1)*10 + 2 + 3, -(i+2)*20 - 5 + 5));
					window.add(new Translation(-width/2, height/2));
					window.fill('rgb(255, 255, 255)');
					group.add(window);
				}
			}
		}
	}

	group.add(new Translation(width/2, height/2-($nbFloor+2)*20));
	group.x = 0;
	group.y = -($nbFloor+2)*20;

	return group;
};

var buildingBlock2 = function($nbColumn, $nbFloor, $night, $sizeRate)
{
	var group = new Group();

	var greyScale = 255 - Math.floor($sizeRate/100 * 255);

	if (fullnight === true)
		greyScale = Math.floor(($sizeRate-startSize)/100 * 255);

	var alightLevel = 0.6 + Math.random()*0.3;

	var width = ($nbColumn+2)*10;
	var height = ($nbFloor+2)*20;

	var rect = new Rect(width, height);
	rect.fill('rgb(' + greyScale + ',' + greyScale + ',' + greyScale + ')');
	group.add(rect);

	if ($night === true)
	{
		for (var i = 0; i < $nbFloor; i++)
		{
			for (var j = 0; j < $nbColumn; j++)
			{
				var alight = Math.random();

				if (alight >= alightLevel)
				{
					var window = new Rect(8, 6);
					window.add(new Translation((j+1)*10 + 1 + 4, -(i+2)*20 - 7 + 3));
					window.add(new Translation(-width/2, height/2));
					window.fill('rgb(255, 255, 255)');
					group.add(window);
				}
			}
		}
	}

	group.add(new Translation(width/2, height/2-($nbFloor+2)*20));
	group.x = 0;
	group.y = -($nbFloor+2)*20;

	return group;
};

var linkBuilding = function($night, $sizeRate)
{
	var group = new Group();
	var nbFloor = 7 + Math.ceil(Math.random()*7);
	var nbColumn = 20 + Math.ceil(Math.random()*30);

	var choose = Math.random();

	if (choose > 0.5)
		group.add(buildingBlock2(nbColumn, nbFloor, $night, $sizeRate));
	else
		group.add(buildingBlock(nbColumn, nbFloor, $night, $sizeRate));

	return group; 
};

var shuffle = function(input)
{
	for (var i = 0; i < input.length; i++)
	{
		var randomIndex = Math.floor(Math.random() * input.length); 
		var tmp = input[i];
		input[i] = input[randomIndex];
		input[randomIndex] = tmp; 
	}

	return input;
};

var sort = function(input)
{
	for (var i = 0; i < input.length; i++)
	{
		for (var j = i; j < input.length; j++)
		{
			if (input[j].y < input[i].y)
			{
				var tmp = input[i];
				input[i] = input[j];
				input[j] = tmp;
			}
		}
	}

	return input;
};

var funcList = new Array();

for (var i = 0; i < functions.length; i++)
{
	var func = functions[i];
	var rate = func.rate;

	for (var j = 0; j < rate; j++)
		funcList.push(func);
}

if (fullnight === true)
{
	var rect = new Rect(Doc.width, Doc.height);
	rect.add(new Translation(Doc.width/2, Doc.height/2));
	rect.fill('rgb(0, 0, 0)');
	Doc.add(rect);
}

var rows = [];
var baseY = 0;

for (var i = 0; i < nbRows; i++)
{
	var group = new Group();
	var row = [];

	var sizeRate = startSize + (endSize - startSize)/nbRows*i;
	var baseWidth = sizeRate/100 * imgWidth;
	var baseHeight = sizeRate/100 * imgHeight;
	var nbStep = Math.ceil(Doc.width/baseWidth/interX*100);

	for (var j = 0; j < nbStep; j++)
	{
		var randomX = Math.floor(2*Math.random()*positionXVariation) - positionXVariation;
		var x = (j*baseWidth + baseWidth*randomX/100) * interX/100;

		var randomY = Math.floor(2*Math.random()*positionYVariation) - positionYVariation;
		var y = baseY + baseHeight*randomY/100;
		y = y + sizeRate/100*mountain*xVariationFunction(x, sizeRate/100)*yVariationFunction(y) + yOffset;

		var building;

		if (j%2 === 0)
		{
			var buildingNum = Math.floor(Math.random()*funcList.length);
			building = funcList[buildingNum].func(night, sizeRate);
		}
		else
			building = linkBuilding(night, sizeRate);

		building.add(new Translation(0, y));
		building.add(new Translation(x, y));
		building.add(new Scale(sizeRate/100.0, sizeRate/100.0));
		row[j] = building;
	}

	sort(row);

	for (var j = 0; j < row.length; j++)
		group.add(row[j]);

	rows[i] = group;

	baseY = baseY + baseHeight*interline/100;

	Doc.add(group);
}

