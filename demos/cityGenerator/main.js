//loadScript('constants');
//loadScript('lib');
//loadScript('randomizer');

var funcList = new Array();

for (var i = 0; i < functions.length; i++)
{
	var func = functions[i];
	var rate = func.rate;

	for (var j = 0; j < rate; j++)
		funcList.push(func);
}

if (fullnight === true)
{
	var rect = new Rect(Doc.width, Doc.height);
	rect.add(new Translation(Doc.width/2, Doc.height/2));
	rect.fill('rgb(0, 0, 0)');
	Doc.add(rect);
}

var rows = [];
var baseY = 0;

for (var i = 0; i < nbRows; i++)
{
	var group = new Group();
	var row = [];

	var sizeRate = startSize + (endSize - startSize)/nbRows*i;
	var baseWidth = sizeRate/100 * imgWidth;
	var baseHeight = sizeRate/100 * imgHeight;
	var nbStep = Math.ceil(Doc.width/baseWidth/interX*100);

	for (var j = 0; j < nbStep; j++)
	{
		var randomX = Math.floor(2*Math.random()*positionXVariation) - positionXVariation;
		var x = (j*baseWidth + baseWidth*randomX/100) * interX/100;

		var randomY = Math.floor(2*Math.random()*positionYVariation) - positionYVariation;
		var y = baseY + baseHeight*randomY/100;
		y = y + sizeRate/100*mountain*xVariationFunction(x, sizeRate/100)*yVariationFunction(y) + yOffset;

		var building;

		if (j%2 === 0)
		{
			var buildingNum = Math.floor(Math.random()*funcList.length);
			building = funcList[buildingNum].func(night, sizeRate);
		}
		else
			building = linkBuilding(night, sizeRate);

		building.add(new Translation(0, y));
		building.add(new Translation(x, y));
		building.add(new Scale(sizeRate/100.0, sizeRate/100.0));
		row[j] = building;
	}

	sort(row);

	for (var j = 0; j < row.length; j++)
		group.add(row[j]);

	rows[i] = group;

	baseY = baseY + baseHeight*interline/100;

	Doc.add(group);
}

