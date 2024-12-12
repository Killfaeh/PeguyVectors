var VectorUtils = 
{
	countID: 0,

	computeSVGnode: function($originalSVGnode, $parentTransformMatrix)
	{
		var nodesList = [];
		var originalSVGnode = $originalSVGnode;

		var transformMatrix = new Matrix(); 
		transformMatrix.identity();
		
		//console.log(originalSVGnode);

		if (utils.isset(originalSVGnode.getAttributeNS))
		{
			var transformAttribute = originalSVGnode.getAttributeNS(null, 'transform');
			
			if (utils.isset(transformAttribute) && /^matrix/.test(transformAttribute))
			{
				var transformStr = transformAttribute.replace('matrix(', '').replace(')', '');
				var transformStrArray = transformStr.split(",");
				
				transformMatrix.setItemMatrix(0, 0, transformStrArray[0]); 
				transformMatrix.setItemMatrix(1, 0, transformStrArray[2]); 
				transformMatrix.setItemMatrix(2, 0, transformStrArray[4]); 
				transformMatrix.setItemMatrix(0, 1, transformStrArray[1]); 
				transformMatrix.setItemMatrix(1, 1, transformStrArray[3]); 
				transformMatrix.setItemMatrix(2, 1, transformStrArray[5]); 
			}
			
			transformMatrix.multiplyRight($parentTransformMatrix);

			var style = originalSVGnode.getAttributeNS(null,  'style');

			var id = (new Date()).getTime() + '' + VectorUtils.countID;
			VectorUtils.countID++;

			if (originalSVGnode.tagName === 'rect')
			{
				var x = parseFloat(originalSVGnode.getAttributeNS(null,  'x'));
				var y = parseFloat(originalSVGnode.getAttributeNS(null,  'y'));
				var width = parseFloat(originalSVGnode.getAttributeNS(null,  'width'));
				var height = parseFloat(originalSVGnode.getAttributeNS(null,  'height'));
					
				var originalVertex1 = [x, y, 1.0, 0.0];
				var originalVertex2 = [x + width, y + height, 1.0, 0.0];
					
				var newVertex1 = transformMatrix.multiplyVect(originalVertex1);
				var newVertex2 = transformMatrix.multiplyVect(originalVertex2);

				var newX = parseFloat(newVertex1[0]);
				var newY = parseFloat(newVertex1[1]);
				var newWidth = newVertex2[0] - newVertex1[0];
				var newHeight = newVertex2[1] - newVertex1[1];

				nodesList.push({ id: id, code: '<rect id="' + id + '" x="' + newX + '" y="' + newY + '" width="' + newWidth + '" height="' + newHeight + '" style="' + style + '" />' });
			}
			else if (originalSVGnode.tagName === 'circle')
			{
				var cx = parseFloat(originalSVGnode.getAttributeNS(null,  'cx'));
				var cy = parseFloat(originalSVGnode.getAttributeNS(null,  'cy'));
				var r = parseFloat(originalSVGnode.getAttributeNS(null,  'r'));
				
				var originalCenter = [cx, cy, 1.0, 0.0];
				var originalOnCircle = [cx + r, cy, 1.0, 0.0];
				
				var newCenter = transformMatrix.multiplyVect(originalCenter);
				var newOnCircle = transformMatrix.multiplyVect(originalOnCircle);
				var newR = Math.sqrt((newOnCircle[0]-newCenter[0])*(newOnCircle[0]-newCenter[0]) + (newOnCircle[1]-newCenter[1])*(newOnCircle[1]-newCenter[1]));

				nodesList.push({ id: id, code: '<circle id="' + id + '" cx="' + newCenter[0] + '" cy="' + newCenter[1] + '" r="' + newR + '" style="' + style + '" />' });
			}
			else if (originalSVGnode.tagName === 'ellipse')
			{
				var cx = parseFloat(originalSVGnode.getAttributeNS(null,  'cx'));
				var cy = parseFloat(originalSVGnode.getAttributeNS(null,  'cy'));
				var rx = parseFloat(originalSVGnode.getAttributeNS(null,  'rx'));
				var ry = parseFloat(originalSVGnode.getAttributeNS(null,  'ry'));
				
				var originalCenter = [cx, cy, 1.0, 0.0];
				var originalOnCircleX = [cx + rx, cy, 1.0, 0.0];
				var originalOnCircleY = [cx, cy + ry, 1.0, 0.0];
				
				var newCenter = transformMatrix.multiplyVect(originalCenter);
				var newOnCircleX = transformMatrix.multiplyVect(originalOnCircleX);
				var newOnCircleY = transformMatrix.multiplyVect(originalOnCircleY);
				var newRX = Math.sqrt((newOnCircleX[0]-newCenter[0])*(newOnCircleX[0]-newCenter[0]) + (newOnCircleX[1]-newCenter[1])*(newOnCircleX[1]-newCenter[1]));
				var newRY = Math.sqrt((newOnCircleY[0]-newCenter[0])*(newOnCircleY[0]-newCenter[0]) + (newOnCircleY[1]-newCenter[1])*(newOnCircleY[1]-newCenter[1]));

				nodesList.push({ id: id, code: '<ellipse id="' + id + '" cx="' + newCenter[0] + '" cy="' + newCenter[1] + '" rx="' + newRX + '" ry="' + newRY + '" style="' + style + '" />' });
			}
			else if (originalSVGnode.tagName === 'line')
			{
				var x1 = parseFloat(originalSVGnode.getAttributeNS(null,  'x1'));
				var y1 = parseFloat(originalSVGnode.getAttributeNS(null,  'y1'));
				var x2 = parseFloat(originalSVGnode.getAttributeNS(null,  'x2'));
				var y2 = parseFloat(originalSVGnode.getAttributeNS(null,  'y2'));
				
				var originalVertex1 = [x1, y1, 1.0, 0.0];
				var originalVertex2 = [x2, y2, 1.0, 0.0];
				var newVertex1 = transformMatrix.multiplyVect(originalVertex1);
				var newVertex2 = transformMatrix.multiplyVect(originalVertex2);

				nodesList.push({ id: id, code: '<line id="' + id + '" x1="' + newVertex1[0] + '" y1="' + newVertex1[1] + '" x2="' + newVertex2[0] + '" y2="' + newVertex2[1] + '" style="' + style + '" />' });
			}
			else if (originalSVGnode.tagName === 'polyline' || originalSVGnode.tagName === 'polygon')
			{
				var points = originalSVGnode.getAttributeNS(null,  'points');
				var newPoints = '';
				
				if (utils.isset(points.split))
				{
					var pointsArray = points.split(' ');

					for (var i = 0; i < pointsArray.length; i++)
					{
						var vertex = pointsArray[i].split(',');
						var originalVertex = [parseFloat(vertex[0]), parseFloat(vertex[1]), 1.0, 0.0];
						var newVertex = transformMatrix.multiplyVect(originalVertex);
						newPoints = newPoints + ' ' + newVertex[0] + ',' + newVertex[1];
					}
				}
				else
					newPoints = points;

				nodesList.push({ id: id, code: '<' + originalSVGnode.tagName + ' id="' + id + '" points="' + newPoints + '" style="' + style + '" />' });
			}
			else if (originalSVGnode.tagName === 'path')
			{
				var d = originalSVGnode.getAttributeNS(null,  'd');
				var newD = '';
				
				if (utils.isset(d.replace))
				{
					var dWidthSeparator = d.replace(/([a-zA-Z])/gi, ';$1').replace(/^;/, '');
					var dArray = dWidthSeparator.split(';');

					for (var i = 0; i < dArray.length; i++)
					{
						var type = dArray[i][0];
						var commandArray = dArray[i].replace(/^[a-zA-Z]/, '').split(' ');
						
						//*
						if (type === 'M')
						{
							var moveToVertexArray = commandArray[0].split(',');
							var moveToVertex = [parseFloat(moveToVertexArray[0]), parseFloat(moveToVertexArray[1]), 1.0, 0.0];
							newMoveToVertex = transformMatrix.multiplyVect(moveToVertex);

							newD = newD + ' M ' + newMoveToVertex[0] + ',' + newMoveToVertex[1];
						}
						else if (type === 'L')
						{
							var lineToVertexArray = commandArray[0].split(',');
							var lineToVertex = [parseFloat(lineToVertexArray[0]), parseFloat(lineToVertexArray[1]), 1.0, 0.0];
							newLineToVertex = transformMatrix.multiplyVect(lineToVertex);

							newD = newD + ' M ' + newLineToVertex[0] + ',' + newLineToVertex[1];
						}
						else if (type === 'H')
						{
							var lineToVertexHArray = commandArray[0].split(',');
							var lineToVertexH = [parseFloat(lineToVertexHArray[0]), parseFloat(lineToVertexHArray[1]), 1.0, 0.0];
							newLineToVertexH = transformMatrix.multiplyVect(lineToVertexH);

							newD = newD + ' H ' + newLineToVertexH[0] + ',' + newLineToVertexH[1];
						}
						else if (type === 'V')
						{
							var lineToVertexVArray = commandArray[0].split(',');
							var lineToVertexV = [parseFloat(lineToVertexVArray[0]), parseFloat(lineToVertexVArray[1]), 1.0, 0.0];
							newLineToVertexV = transformMatrix.multiplyVect(lineToVertexV);

							newD = newD + ' H ' + newLineToVertexV[0] + ',' + newLineToVertexV[1];
						}
						else if (type === 'A')
						{
							var rx = parseFloat(commandArray[0]);
							var ry = parseFloat(commandArray[1]);
							var param1 = parseFloat(commandArray[2]);
							var param2 = parseFloat(commandArray[3]);
							var param3 = parseFloat(commandArray[4]);
							var endVertexArray = commandArray[5].split(',');
							var endVertex = [parseFloat(endVertexArray[0]), parseFloat(endVertexArray[1]), 1.0, 0.0];
							var newEndVertex = transformMatrix.multiplyVect(endVertex);
							
							var originalOnCircleX = [endVertex[0] + rx, endVertex[1], 1.0, 0.0];
							var originalOnCircleY = [endVertex[0], endVertex[1] + ry, 1.0, 0.0];
							
							var newOnCircleX = transformMatrix.multiplyVect(originalOnCircleX);
							var newOnCircleY = transformMatrix.multiplyVect(originalOnCircleY);
							var newRX = Math.sqrt((newOnCircleX[0]-newEndVertex[0])*(newOnCircleX[0]-newEndVertex[0]) + (newOnCircleX[1]-newEndVertex[1])*(newOnCircleX[1]-newEndVertex[1]));
							var newRY = Math.sqrt((newOnCircleY[0]-newEndVertex[0])*(newOnCircleY[0]-newEndVertex[0]) + (newOnCircleY[1]-newEndVertex[1])*(newOnCircleY[1]-newEndVertex[1]));
			
							newD = newD + ' A ' + newRX + ' ' + newRY + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + newEndVertex[0] + ',' + newEndVertex[1];
						}
						else if (type === 'T')
						{
							var vertex1Array = commandArray[0].split(',');
							var vertex1 = [parseFloat(vertex1Array[0]), parseFloat(vertex1Array[1]), 1.0, 0.0];
							var newVertex1 = transformMatrix.multiplyVect(vertex1);

							newD = newD + ' T ' + newVertex1[0] + ',' + newVertex1[1];
						}
						else if (type === 'Q')
						{
							var vertex1Array = commandArray[0].split(',');
							var vertex1 = [parseFloat(vertex1Array[0]), parseFloat(vertex1Array[1]), 1.0, 0.0];
							var newVertex1 = transformMatrix.multiplyVect(vertex1);
							
							var vertex2Array = commandArray[1].split(',');
							var vertex2 = [parseFloat(vertex2Array[0]), parseFloat(vertex2Array[1]), 1.0, 0.0];
							var newVertex2 = transformMatrix.multiplyVect(vertex2);

							newD = newD + ' Q ' + newVertex1[0] + ',' + newVertex1[1] + ' ' + newVertex2[0] + ',' + newVertex2[1];
						}
						else if (type === 'S')
						{
							var vertex1Array = commandArray[0].split(',');
							var vertex1 = [parseFloat(vertex1Array[0]), parseFloat(vertex1Array[1]), 1.0, 0.0];
							var newVertex1 = transformMatrix.multiplyVect(vertex1);
							
							var vertex2Array = commandArray[1].split(',');
							var vertex2 = [parseFloat(vertex2Array[0]), parseFloat(vertex2Array[1]), 1.0, 0.0];
							var newVertex2 = transformMatrix.multiplyVect(vertex2);
							
							newD = newD + ' S ' + newVertex1[0] + ',' + newVertex1[1] + ' ' + newVertex2[0] + ',' + newVertex2[1];
						}
						else if (type === 'C')
						{
							var vertex1Array = commandArray[0].split(',');
							var vertex1 = [parseFloat(vertex1Array[0]), parseFloat(vertex1Array[1]), 1.0, 0.0];
							var newVertex1 = transformMatrix.multiplyVect(vertex1);
							
							var vertex2Array = commandArray[1].split(',');
							var vertex2 = [parseFloat(vertex2Array[0]), parseFloat(vertex2Array[1]), 1.0, 0.0];
							var newVertex2 = transformMatrix.multiplyVect(vertex2);
							
							var vertex3Array = commandArray[2].split(',');
							var vertex3 = [parseFloat(vertex3Array[0]), parseFloat(vertex3Array[1]), 1.0, 0.0];
							var newVertex3 = transformMatrix.multiplyVect(vertex3);
							
							newD = newD + ' C ' + newVertex1[0] + ',' + newVertex1[1] + ' ' + newVertex2[0] + ',' + newVertex2[1] + ' ' + newVertex3[0] + ',' + newVertex3[1];
						}
						//*/
					}
				}
				else
					newD = d;

				nodesList.push({ id: id, code: '<path id="' + id + '" d="' + newD + '" style="' + style + '" />' });
			}
			else if (originalSVGnode.tagName === 'g')
			{
				var childrenList = originalSVGnode.childNodes;

				for (var i = 0; i < childrenList.length; i++)
				{
					var gNodeList = VectorUtils.computeSVGnode(childrenList[i], transformMatrix);

					for (var j = 0; j < gNodeList.length; j++)
						nodesList.push(gNodeList[j]);
				}
			}
		}

		return nodesList;
	},

	flatSVGtree: function($b64svgData)
	{
		VectorUtils.countID = 0;
		var nodesList = [];

		var base64Data = $b64svgData.replace('data:image/svg+xml;base64,', '');
		var decodedData = atob(base64Data);
		var originalSVGdata = decodedData.replace(/<\?xml [^<]*>/, '').replace(/<!DOCTYPE [^<]*>/, '');
		var originalSVGDOM = new Component(originalSVGdata);

		var transformMatrix = new Matrix(); 
		transformMatrix.identity();

		console.log(originalSVGDOM);
		var childrenList = originalSVGDOM.childNodes;

		for (var i = 0; i < childrenList.length; i++)
		{
			var childNodeList = VectorUtils.computeSVGnode(childrenList[i], transformMatrix);

			for (var j = 0; j < childNodeList.length; j++)
				nodesList.push(childNodeList[j]);
		}

		return nodesList;
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("vectorUtils");