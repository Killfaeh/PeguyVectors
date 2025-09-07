var functions = 
[
	// Building 1
	{
		rate: 4,
		
		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor = 10 + Math.ceil(Math.random()*20);
			var nbColumn = 7 + Math.ceil(Math.random()*15);
			group.add(buildingBlock(nbColumn, nbFloor, $night, $sizeRate));
			return group;
		}
	}, 

	// Building 2
	{
		rate: 3,

		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor = 10 + Math.ceil(Math.random()*20);
			var nbColumn = 7 + Math.ceil(Math.random()*5);
			group.add(buildingBlock(nbColumn, nbFloor, $night, $sizeRate));

			// Add roof
			var greyScale = 255 - Math.floor($sizeRate/100 * 255);

			if (fullnight === true)
				greyScale = Math.floor(($sizeRate-startSize)/100 * 255);

			var topY = -(nbFloor+2)*20 + 2;
			var buildingWidth = (nbColumn+2)*10;
			var topWidth = buildingWidth*0.8;
			var topHeight = topWidth/2.0/Math.tan(Math.PI/6);

			var top = new Polygon([[(buildingWidth-topWidth)/2.0, topY], 
									[(buildingWidth+topWidth)/2.0, topY], 
									[buildingWidth/2.0, topY - topHeight]]);

			top.fill('rgb(' + greyScale + ',' + greyScale + ',' + greyScale + ')');
			group.add(top);

			return group;
		}
	},

	// Building 3
	{
		rate: 4,

		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor1 = 10 + Math.ceil(Math.random()*15);
			var nbColumn1 = 10 + Math.ceil(Math.random()*12);
			group.add(buildingBlock(nbColumn1, nbFloor1, $night, $sizeRate));
			var nbFloor2 = 2 + Math.ceil(Math.random()*3);
			var nbColumn2 = nbColumn1-4;
			var top = buildingBlock(nbColumn2, nbFloor2, $night, $sizeRate);
			top.add(new Translation(20, -(nbFloor1+2)*20 + 2));
			group.add(top);
			return group;
		}
	},

	// Building 4
	{
		rate: 8, 

		func: function($night, $sizeRate)
		{
			var group = new Group();
			var nbFloor = 10 + Math.ceil(Math.random()*20);
			var nbColumn = 7 + Math.ceil(Math.random()*15);
			group.add(buildingBlock2(nbColumn, nbFloor, $night, $sizeRate));
			return group;
		}
	}, 
];