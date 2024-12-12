var n = 12;
var angleStep = 2.0*Math.PI/n;
var radius = 400.0;

var colors = ['rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,255,0)', 
				'rgb(0,255,255)', 'rgb(0,0,255)', 'rgb(255,0,255)'];

Doc.add(new Rect(Doc.width, Doc.height));

for (var i = 0; i < n; i++)
{
	var x = radius*Math.cos(angleStep*i);
	var y = radius*Math.sin(angleStep*i);
	var color = colors[i%colors.length];
	var square = new Square(100.0);
	square.fill(color);
	square.add(new Translation(x, y));
	square.add(new Rotation(angleStep/Math.PI*180.0*i));
	Doc.add(square);
}

Doc.add(new Translation(Doc.width/2, Doc.height/2));