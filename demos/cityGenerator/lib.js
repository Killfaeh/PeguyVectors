var xVariationFunction = function($x, $sizeRate) { return Math.cos($x/Doc.width*Math.PI/$sizeRate); };
var yVariationFunction = function($y) { return Math.sin(4*$y/Doc.height*Math.PI); };

var buildingBlock = function($nbColumn, $nbFloor, $night, $sizeRate)
{
	var group = new Group();

	var greyScale = 255 - Math.floor($sizeRate/100 * 255);

	if (fullnight === true)
		greyScale = Math.floor(($sizeRate-startSize)/100 * 255);

	var alightLevel = 0.6 + Math.random()*0.3;

	var width = ($nbColumn+2)*10;
	var height = ($nbFloor+2)*20;

	var rect = new Rect(width, height);
	rect.fill('rgb(' + greyScale + ',' + greyScale + ',' + greyScale + ')');
	group.add(rect);

	if ($night === true)
	{
		for (var i = 0; i < $nbFloor; i++)
		{
			for (var j = 0; j < $nbColumn; j++)
			{
				var alight = Math.random();

				if (alight >= alightLevel)
				{
					var window = new Rect(6, 10);
					window.add(new Translation((j+1)*10 + 2 + 3, -(i+2)*20 - 5 + 5));
					window.add(new Translation(-width/2, height/2));
					window.fill('rgb(255, 255, 255)');
					group.add(window);
				}
			}
		}
	}

	group.add(new Translation(width/2, height/2-($nbFloor+2)*20));
	group.x = 0;
	group.y = -($nbFloor+2)*20;

	return group;
};

var buildingBlock2 = function($nbColumn, $nbFloor, $night, $sizeRate)
{
	var group = new Group();

	var greyScale = 255 - Math.floor($sizeRate/100 * 255);

	if (fullnight === true)
		greyScale = Math.floor(($sizeRate-startSize)/100 * 255);

	var alightLevel = 0.6 + Math.random()*0.3;

	var width = ($nbColumn+2)*10;
	var height = ($nbFloor+2)*20;

	var rect = new Rect(width, height);
	rect.fill('rgb(' + greyScale + ',' + greyScale + ',' + greyScale + ')');
	group.add(rect);

	if ($night === true)
	{
		for (var i = 0; i < $nbFloor; i++)
		{
			for (var j = 0; j < $nbColumn; j++)
			{
				var alight = Math.random();

				if (alight >= alightLevel)
				{
					var window = new Rect(8, 6);
					window.add(new Translation((j+1)*10 + 1 + 4, -(i+2)*20 - 7 + 3));
					window.add(new Translation(-width/2, height/2));
					window.fill('rgb(255, 255, 255)');
					group.add(window);
				}
			}
		}
	}

	group.add(new Translation(width/2, height/2-($nbFloor+2)*20));
	group.x = 0;
	group.y = -($nbFloor+2)*20;

	return group;
};

var linkBuilding = function($night, $sizeRate)
{
	var group = new Group();
	var nbFloor = 7 + Math.ceil(Math.random()*7);
	var nbColumn = 20 + Math.ceil(Math.random()*30);

	var choose = Math.random();

	if (choose > 0.5)
		group.add(buildingBlock2(nbColumn, nbFloor, $night, $sizeRate));
	else
		group.add(buildingBlock(nbColumn, nbFloor, $night, $sizeRate));

	return group; 
};

var shuffle = function(input)
{
	for (var i = 0; i < input.length; i++)
	{
		var randomIndex = Math.floor(Math.random() * input.length); 
		var tmp = input[i];
		input[i] = input[randomIndex];
		input[randomIndex] = tmp; 
	}

	return input;
};

var sort = function(input)
{
	for (var i = 0; i < input.length; i++)
	{
		for (var j = i; j < input.length; j++)
		{
			if (input[j].y < input[i].y)
			{
				var tmp = input[i];
				input[i] = input[j];
				input[j] = tmp;
			}
		}
	}

	return input;
};
