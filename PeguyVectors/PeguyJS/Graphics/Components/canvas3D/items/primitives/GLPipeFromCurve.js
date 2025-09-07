function GLPipeFromCurve($verticesList, $profile, $width)
{
	///////////////
	// Attributs //
	///////////////

	var glBuffer = new GLBuffer();

	var verticesList = $verticesList;
	var tmpList = [];
	var tmpWidth = [];
	var profile = $profile;

	//*
	for (var i = 0; i < profile.length; i++)
	{
		//profile[i] = [ profile[i][0], 0.0, profile[i][1] ];
		profile[i][2] = 0.0;
	}
	//*/

	var profilePolygon = new MathPolygon(profile);

	//*
	var width = $width;

	if (!utils.isset(width))
		width = 1.0;

	if (!Array.isArray(width))
	{
		width = Math.abs(width);

		if (width > 1.0)
			width = 1.0;
	}
	else
	{
		if (width.length < verticesList.length)
        {
            var lastWidth = width[width.length-1];

            for (var i = width.length; i < verticesList.length; i++)
                width.push(lastWidth);
        }

		var minWidth = 1000000000.0;
		var maxWidth = -1000000000.0;

		for (var i = 0; i < width.length; i++)
		{
			if (width[i] < minWidth)
				minWidth = width[i];
			else if (width[i] > maxWidth)
				maxWidth = width[i];
		}

		for (var i = 0; i < width.length; i++)
		{
			width[i] = Math.abs(width[i] - minWidth)/Math.abs(maxWidth - minWidth);

			if (width[i] < Math.pow(10, -PEGUY.glPrecision))
				width[i] = Math.pow(10, -PEGUY.glPrecision);
		}
	}

	//*/

	var polygonVertices = [];

	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		//console.log(verticesList);

		//var profilePolygon = new MathPolygon(profile);

		var bandData = $this.computeBandData(0.0);

		glBuffer.setVertices(bandData.vertices);
		glBuffer.setNormals(bandData.normals);
		glBuffer.setTangentsX(bandData.tangentsX);
		glBuffer.setTangentsY(bandData.tangentsY);
		glBuffer.setTexture(bandData.texture);
		glBuffer.setColors(bandData.colors);
		glBuffer.setIndices(bandData.indices);
	};

	this.computeBandData = function($z)
	{
		var computedVertices = $this.computeVertices();
		var angles = computedVertices[2];
		var tmpVertices = computedVertices[3];

		console.log("COMPUTE DATA");
		console.log(computedVertices);

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var texture = [];
		var colors = [];
		var indices = [];
		var polygonVertices1 = [];
		var polygonVertices2 = [];
		polygonVertices = [];

		var offsetIndices = 0;

		for (var i = 0; i < computedVertices[0][0].length-1; i++)
		{
			for (var j = 0; j < computedVertices[0].length-1; j++)
			{
				var cur1Vertex = computedVertices[0][j][i];
				var cur2Vertex = computedVertices[0][j+1][i];
				var next1Vertex = computedVertices[0][j][i+1];
				var next2Vertex = computedVertices[0][j+1][i+1];

				/*
				console.log("VERTICES " + i + ', ' + j);
				console.log(computedVertices[0][j]);
				console.log(computedVertices[0][j+1]);
				console.log(cur1Vertex);
				console.log(cur2Vertex);
				console.log(next1Vertex);
				console.log(next2Vertex);
				//*/

				var axis1 = Vectors.delta(new Vector([cur1Vertex[0], cur1Vertex[1], cur1Vertex[2]]), new Vector([cur2Vertex[0], cur2Vertex[1], cur2Vertex[2]]));
				var axis2 = Vectors.delta(new Vector([cur1Vertex[0], cur1Vertex[1], cur1Vertex[2]]), new Vector([next1Vertex[0], next1Vertex[1], next1Vertex[2]]));

				//console.log(axis1);
				//console.log(axis2);

				var normal = Vectors.crossProduct(axis1, axis2).opposite().normalize();

				//console.log(normal);

				vertices.push(cur1Vertex[0]);
				vertices.push(cur1Vertex[1]);
				vertices.push(cur1Vertex[2]);
				vertices.push(cur2Vertex[0]);
				vertices.push(cur2Vertex[1]);
				vertices.push(cur2Vertex[2]);
				vertices.push(next1Vertex[0]);
				vertices.push(next1Vertex[1]);
				vertices.push(next1Vertex[2]);
				vertices.push(next2Vertex[0]);
				vertices.push(next2Vertex[1]);
				vertices.push(next2Vertex[2]);

				texture.push(j/computedVertices.length);
				texture.push(verticesList[i]);
				texture.push((j+1)/computedVertices.length);
				texture.push(verticesList[i]);
				texture.push(j/computedVertices.length);
				texture.push(verticesList[i+1]);
				texture.push((j+1)/computedVertices.length);
				texture.push(verticesList[i+1]);

				for (var k = 0; k < 4; k++)
				{
					normals.push(normal.x);
					normals.push(normal.y);
					normals.push(normal.z);

					tangentsX.push(1.0);
					tangentsX.push(0.0);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					tangentsY.push(0.0);
				}

				/*
				indices.push(offsetIndices + 4*j);
				indices.push(offsetIndices + 4*j + 1);
				indices.push(offsetIndices + 4*j + 2);
				indices.push(offsetIndices + 4*j + 1);
				indices.push(offsetIndices + 4*j + 3);
				indices.push(offsetIndices + 4*j + 2);
				//*/

				indices.push(offsetIndices);
				indices.push(offsetIndices + 1);
				indices.push(offsetIndices + 2);
				indices.push(offsetIndices + 1);
				indices.push(offsetIndices + 3);
				indices.push(offsetIndices + 2);

				offsetIndices = offsetIndices + 4;
			}

			//offsetIndices = offsetIndices + 4*computedVertices[0].length;
		}

		/*
		for (var i = 0; i < polygonVertices1.length; i++)
			polygonVertices.push(polygonVertices1[i]);

		for (var i = polygonVertices2.length-1; i >= 0; i--)
			polygonVertices.push(polygonVertices2[i]);
		//*/
		
		for (var i = 0; i < vertices.length/3; i++)
		{
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
		}

		/*
		console.log(vertices);
		console.log(normals);
		console.log(tangentsX);
		console.log(tangentsY);
		console.log(texture);
		console.log(colors);
		console.log(indices);
		//*/

		var output = 
		{ 
			'vertices': vertices, 
			'normals': normals, 
			'tangentsX': tangentsX, 
			'tangentsY': tangentsY, 
			//'textureTangentsX': textureTangentsX, 
			//'textureTangentsY': textureTangentsY, 
			//'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices,
			'polygonVertices': polygonVertices
		};
		
		return output;
	};

	this.computeVertices = function()
	{
		var prevWidth = width;
		var curWidth = width;
		var nextWidth = width;

		var profileRadius = profilePolygon.getMaxRadius();

		var sortByAngle = [];

		for (var i = 0; i < verticesList.length; i++)
		{
			verticesList[i].index = i;
			sortByAngle.push(verticesList[i]);
		}

		for (var i = 0; i < sortByAngle.length; i++)
		{
			for (var j = i; j < sortByAngle.length; j++)
			{
				if (Math.abs(sortByAngle[i].angle) > Math.abs(sortByAngle[j].angle))
				{
					var tmp = sortByAngle[i];
					sortByAngle[i] = sortByAngle[j];
					sortByAngle[j] = tmp;
				}
			}
		}

		//console.log("SORTED");
		//console.log(sortByAngle);

		for (var i = 0; i < sortByAngle.length; i++)
		{
			if (!utils.isset(verticesList[sortByAngle[i].index].deleted))
			{
				for (var j = 1; j < verticesList.length-1; j++)
				{
					if (j !== sortByAngle[i].index)
					{
						if (Array.isArray(width))
							curWidth = width[sortByAngle[i].index];

						var dist = Vectors.distance(sortByAngle[i].point, verticesList[j].point);

						if (dist < 2.0*profileRadius*curWidth)
						{
							var dot = Vectors.dotProduct(sortByAngle[i].tangent, verticesList[j].tangent);
							var angle = Vectors.angle(sortByAngle[i].tangent, verticesList[j].tangent);

							if (sortByAngle[i].index !== 0 && sortByAngle[i].index !== verticesList.length-1)
							{
								if (j < sortByAngle[i].index)
								{
									dot = Vectors.dotProduct(Vectors.delta(sortByAngle[i].point, verticesList[j].point).normalize(), 
																Vectors.delta(sortByAngle[i].point, verticesList[sortByAngle[i].index+1].point).normalize());
									
									angle = Vectors.angle(Vectors.delta(sortByAngle[i].point, verticesList[j].point).normalize(), 
																Vectors.delta(sortByAngle[i].point, verticesList[sortByAngle[i].index+1].point).normalize());
								}
								else
								{
									dot = Vectors.dotProduct(Vectors.delta(sortByAngle[i].point, verticesList[j].point).normalize(), 
																Vectors.delta(sortByAngle[i].point, verticesList[sortByAngle[i].index-1].point).normalize());

									angle = Vectors.angle(Vectors.delta(sortByAngle[i].point, verticesList[j].point).normalize(), 
																Vectors.delta(sortByAngle[i].point, verticesList[sortByAngle[i].index-1].point).normalize());
								}
							}

							//console.log("Dist : " + dist);
							//console.log("Radius : " + profileRadius);
							//console.log("Dot : " + dot);
							//console.log("Angle : " + (angle/Math.PI*180.0));

							if (dot < -0.55)
							{
								if ((1.0-Math.abs(dot))*profileRadius*curWidth*1.5 >= dist)
									verticesList[j].deleted = true;
							}
							else
							{
								if (profileRadius*curWidth*1.5 >= dist)
									verticesList[j].deleted = true;
							}
						}
					}
				}
			}
		}

		tmpList = [];

		for (var i = 0; i < verticesList.length; i++)
		{
			if (i === 0 || i === verticesList.length-1)
			{
				tmpList.push(verticesList[i]);
				tmpWidth.push(width[i]);
			}
			else if (!utils.isset(verticesList[i].deleted))
			{
				tmpList.push(verticesList[i]);
				tmpWidth.push(width[i]);
			}

			/*
			if (tmpList.length >= 3)
				i = verticesList.length;
			//*/
		}

		var vertices = [];

		for (var i = 0; i < profile.length; i++)
			vertices.push([]);

		var angles = [];
		var tmpVertices = [];

        for (var i = 0; i < tmpList.length; i++)
        {
            if (i === 0)
            {
				if (Array.isArray(width))
					curWidth = tmpWidth[0];

				var vertex = tmpList[0].point;
				var tangent = tmpList[0].tangent;
				var normal = tmpList[0].normal;

				var zAxis = new Vector(tmpList[0].tangent);
				var xAxis = new Vector(tmpList[0].normal);
				var yAxis = Vectors.crossProduct(zAxis, xAxis);

				var tmpVertices2 = Vectors.alignTo(Vectors.scale(profile, curWidth), [xAxis, yAxis, zAxis]);

				for (var j = 0; j < tmpVertices2.length; j++)
				{
					tmpVertices2[j] = [tmpVertices2[j].x + vertex[0], tmpVertices2[j].y + vertex[1], tmpVertices2[j].z + vertex[2]];
					vertices[j].push(tmpVertices2[j]);
				}

				angles.push(360.0);
				tmpVertices.push(tmpVertices2);

				lastIndex = 0;
            }
			else if (i === tmpList.length-1)
            {
				if (Array.isArray(width))
					curWidth = tmpWidth[tmpWidth.length-1];

				var vertex = tmpList[tmpList.length-1].point;
				var tangent = tmpList[tmpList.length-1].tangent;
				var normal = tmpList[tmpList.length-1].normal;

				var zAxis = new Vector(tangent);
				var xAxis = new Vector(normal);
				var yAxis = Vectors.crossProduct(zAxis, xAxis);

				var tmpVertices2 = Vectors.alignTo(Vectors.scale(profile, curWidth), [xAxis, yAxis, zAxis]);

				for (var j = 0; j < tmpVertices2.length; j++)
				{
					tmpVertices2[j] = [tmpVertices2[j].x + vertex[0], tmpVertices2[j].y + vertex[1], tmpVertices2[j].z + vertex[2]];
					vertices[j].push(tmpVertices2[j]);
				}

				angles.push(360.0);
				tmpVertices.push(tmpVertices2);
            }
            else
            {
				var join = getPathJoin(i);

				if (join[0].length > 0)
				{
					for (var j = 0; j < profile.length; j++)
						vertices[j].push([join[0][j].x, join[0][j].y, join[0][j].z]);

					angles.push(join[1]);
					tmpVertices.push(join[2]);
				}
            }
        }

		if (Vectors.equal(tmpList[0].point, tmpList[tmpList.length-1].point, Math.pow(10, -PEGUY.glPrecision)))
		{
			var join = getPathJoin(tmpList.length-1);

			for (var j = 0; j < profile.length; j++)
			{
				vertices[j][0] = [join[0][j].x, join[0][j].y, join[0][j].z];
				vertices[j][vertices[j].length-1] = [join[0][j].x, join[0][j].y, join[0][j].z];
			}

            angles[0] = join[1];
            angles[angles.length-1] = join[1];
			tmpVertices[0] = join[2];
			tmpVertices[tmpVertices.length-1] = join[2];
		}

		return [vertices, angles, tmpVertices];
	};

	var getPathJoin = function($index)
    {
		//console.log("JOIN : " + $index);

		var prevWidth = width;
		var curWidth = width;
		var nextWidth = width;

		if (Array.isArray(width))
		{
			prevWidth = tmpWidth[$index-1];
			curWidth = tmpWidth[$index];
			nextWidth = tmpWidth[$index+1];
		}

		var outputPoints = [];
		var curPoints = [];

		var prevVertex = tmpList[$index-1];
		var vertex = tmpList[$index];
		var nextVertex = tmpList[$index+1];

		if ($index === tmpList.length-1)
		{
			if (Array.isArray(width))
			{
				prevWidth = tmpWidth[verticesList.length-2];
				curWidth = tmpWidth[0];
				nextWidth = tmpWidth[1];
			}

			prevVertex = tmpList[tmpList.length-2];
			vertex = tmpList[0];
			nextVertex = tmpList[1];
		}

		/*
		console.log(prevVertex);
		console.log(vertex);
		console.log(nextVertex);
		console.log("");
		//*/

		var prev = Vectors.delta(vertex.point, prevVertex.point);
		var next = Vectors.delta(vertex.point, nextVertex.point);

		/*
		console.log(prev);
		console.log(next);
		console.log("");
		//*/

		var angle = Vectors.angle(next, prev);
		var degAngle = angle/Math.PI*180.0;

		var oldDot = 0.0;
		var newDot = 0.0;

		if ($index > 1)
			oldDot = Vectors.dotProduct(vertex.tangent, tmpList[$index-2].tangent);

		if ($index < tmpList.length-2)
			newDot = Vectors.dotProduct(vertex.tangent, tmpList[$index+2].tangent);

		var prevDot = Vectors.dotProduct(vertex.tangent, prevVertex.tangent);
		var nextDot = Vectors.dotProduct(vertex.tangent, nextVertex.tangent);

		/*
		console.log(prevVertex.tangent);
		console.log(nextVertex.tangent);
		console.log(degAngle);
		console.log(oldDot);
		console.log(newDot);
		console.log(prevDot);
		console.log(nextDot);
		//console.log("");
		//*/

		// Construction des repères

		//*
		var localXaxis = prev.normalize();
		var localZaxis = Vectors.crossProduct(localXaxis, next).normalize();
		var localYaxis = Vectors.crossProduct(localZaxis, localXaxis).normalize();
		//*/

		/*
		var localXaxis = (new Vector(prevVertex.tangent)).normalize();
		var localZaxis = Vectors.crossProduct(localXaxis, new Vector(nextVertex.tangent)).normalize();
		var localYaxis = Vectors.crossProduct(localZaxis, localXaxis).normalize();
		//*/

		var localReference = [localXaxis, localYaxis, localZaxis];

		var globalXaxis = Vectors.changeReference(new Vector([1.0, 0.0, 0.0]), localReference);
		var globalYaxis = Vectors.changeReference(new Vector([0.0, 1.0, 0.0]), localReference);
		var globalZaxis = Vectors.changeReference(new Vector([0.0, 0.0, 1.0]), localReference);

		var globalReference = [globalXaxis, globalYaxis, globalZaxis];

		// Repérage de l'intersection des 2 tangentes

		var prevSigma = Vectors.sum([new Vector(prevVertex.point), new Vector(prevVertex.tangent)]);
		var nextSigma = Vectors.sum([new Vector(nextVertex.point), new Vector(nextVertex.tangent)]);

		var localPrevVertex = Vectors.changeReference(new Vector(prevVertex.point), localReference);
		var localPrevSigma = Vectors.changeReference(prevSigma, localReference);

		var localNextVertex = Vectors.changeReference(new Vector(nextVertex.point), localReference);
		var localNextSigma = Vectors.changeReference(nextSigma, localReference);

		var prevF = new LinearFunction();
		prevF.coefFromPoints([localPrevVertex.values(), localPrevSigma.values()]);
		var nextF = new LinearFunction();
		nextF.coefFromPoints([localNextVertex.values(), localNextSigma.values()]);
		var localIntersection = Polynomials.linearIntersection(prevF, nextF);

		if (localIntersection.length <= 0)
			localIntersection = vertex.point;
		else
			localIntersection.push(0.0);

		var globalIntersection = Vectors.changeReference(new Vector(localIntersection), globalReference);

		//console.log(globalIntersection);

		// Déplacement du profile au niveau des points

		var xAxis = new Vector(vertex.normal).normalize();
		var zAxis = new Vector(vertex.tangent).normalize();
		var yAxis = Vectors.crossProduct(zAxis, xAxis).normalize();

		/*
		if (degAngle > 177.5)
			zAxis = Vectors.delta(prevVertex.point, nextVertex.point).normalize();
		//*/

		var prevXAxis = new Vector(prevVertex.normal).normalize();
		var prevZAxis = new Vector(prevVertex.tangent).normalize();
		var prevYAxis = Vectors.crossProduct(prevZAxis, prevXAxis).normalize();

		var nextXAxis = new Vector(nextVertex.normal).normalize();
		var nextZAxis = new Vector(nextVertex.tangent).normalize();
		var nextYAxis = Vectors.crossProduct(nextZAxis, nextXAxis).normalize();

		var prevProfile = Vectors.alignTo(Vectors.scale(profile, prevWidth), [prevXAxis, prevYAxis, prevZAxis]);
		var curProfile = Vectors.alignTo(Vectors.scale(profile, curWidth), [xAxis, yAxis, zAxis]);
		var nextProfile = Vectors.alignTo(Vectors.scale(profile, nextWidth), [nextXAxis, nextYAxis, nextZAxis]);

		/*
		console.log(prevProfile);
		console.log(curProfile);
		console.log(nextProfile);
		console.log("");
		//*/

		if (oldDot < 1.0 || nextDot < 1.0)
		{
			if (degAngle > 140)
			{
				for (var i = 0; i < profile.length; i++)
				{
					var curVertexI = Vectors.sum([curProfile[i], new Vector(vertex.point)]);
					var cur1VertexI = Vectors.sum([prevProfile[i], new Vector(vertex.point)]);
					var cur2VertexI = Vectors.sum([nextProfile[i], new Vector(vertex.point)]);

					outputPoints.push(curVertexI);
					curPoints.push([cur1VertexI, cur2VertexI]);
				}
			}
			else
			{
				for (var i = 0; i < profile.length; i++)
				{
					//console.log("JOIN " + i);

					/*
					console.log(prevProfile[i]);
					console.log(curProfile[i]);
					console.log(nextProfile[i]);
					console.log(prevProfile[i]);
					console.log(nextProfile[i]);
					console.log("");
					//*/

					// globalIntersection

					//*
					var prevVertexI = Vectors.sum([prevProfile[i], new Vector(prevVertex.point)]);
					var curVertexI = Vectors.sum([curProfile[i], new Vector(vertex.point)]);
					var nextVertexI = Vectors.sum([nextProfile[i], new Vector(nextVertex.point)]);
					var cur1VertexI = Vectors.sum([prevProfile[i], new Vector(vertex.point)]);
					var cur2VertexI = Vectors.sum([nextProfile[i], new Vector(vertex.point)]);
					//*/

					//if (prevDot <= 0.0 || nextDot <= 0.0)
					//if (prevDot <= 0.0)
					if (nextDot < 0.0)
					{
						curVertexI = Vectors.sum([curProfile[i], new Vector(globalIntersection)]);
						cur1VertexI = Vectors.sum([prevProfile[i], new Vector(globalIntersection)]);
						cur2VertexI = Vectors.sum([nextProfile[i], new Vector(globalIntersection)]);
					}

					/*
					console.log(prevVertexI);
					console.log(curVertexI);
					console.log(nextVertexI);
					console.log(cur1VertexI);
					console.log(cur2VertexI);
					console.log("");
					//*/

					var localPrevVertex = Vectors.changeReference(prevVertexI, localReference);
					var localCurVertex = Vectors.changeReference(curVertexI, localReference);
					var localNextVertex = Vectors.changeReference(nextVertexI, localReference);
					var localCur1Vertex = Vectors.changeReference(cur1VertexI, localReference);
					var localCur2Vertex = Vectors.changeReference(cur2VertexI, localReference);

					/*
					console.log(localPrevVertex);
					console.log(localCurVertex);
					console.log(localNextVertex);
					console.log(localCur1Vertex);
					console.log(localCur2Vertex);
					console.log("");
					//*/

					var prevFI = new LinearFunction();
					prevFI.coefFromPoints([localPrevVertex.values(), localCur1Vertex.values()]);
					var nextFI = new LinearFunction();
					nextFI.coefFromPoints([localCur2Vertex.values(), localNextVertex.values()]);
					var localVertex = Polynomials.linearIntersection(prevFI, nextFI);

					if (localVertex.length <= 0)
						localVertex = localCurVertex.values();
					else
						localVertex.push(localCurVertex.z);

					/*
					console.log(localVertex);
					console.log("");
					//*/

					var globalVertex = Vectors.changeReference(new Vector(localVertex), globalReference).round(PEGUY.glPrecision);

					/*
					console.log(globalVertex);
					console.log("");
					//*/

					outputPoints.push(globalVertex);

					curPoints.push([cur1VertexI, cur2VertexI]);
				}
			}
		}

		/*
		console.log(outputPoints);
		console.log("");
		//*/

        var output = [outputPoints, angle, curPoints];

        return output;
    };

	var getProfileReference = function($zAxis)
	{
		var xAxis = new Vector([$zAxis.z, $zAxis.y, -$zAxis.x]);
		var yAxis = new Vector([$zAxis.x, $zAxis.z, -$zAxis.y]);
		return [xAxis, yAxis, $zAxis];
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getPolygonVertices = function() { return polygonVertices; };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(glBuffer, this);
	init();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-pipe-from-curve");