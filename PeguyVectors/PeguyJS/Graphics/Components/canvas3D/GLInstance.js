
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

var NB_GL_INSTANCES = 0;

function GLInstance($object)
{
	///////////////
	// Attributs //
	///////////////

	var type = 'instance';

	var object = $object;
	
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	
	var theta = 0.0;
	var phi = 0.0;
	var omega = 0.0;
	
	var scaleX = 1.0;
	var scaleY = 1.0;
	var scaleZ = 1.0;

	var alignMatrix = new Matrix();
	alignMatrix.identity();

	var mvMatrix = null;
	var moved = false;

	var boundingBox = null;
	var displayWithNoCheck = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function() {};

	this.linkShaders = function($context)
	{
		object.linkShaders($context);
	};

	this.updateMvMatrix = function()
	{
		var parentGroups = [];
		var parentGroup = $this.parentGroup;

		while (utils.isset(parentGroup))
		{
			if (parentGroup.isMoved() === true)
			{
				//console.log(parentGroup);
				parentGroups.push(parentGroup);
				moved = true;
			}

			parentGroup = parentGroup.parentGroup;
		}

		if (!utils.isset(mvMatrix) || moved === true)
		{
			//console.log("Update MV matrix");

			mvMatrix = new Matrix();
			mvMatrix.identity();

			// Remonte les groupes parents

			for (var i = parentGroups.length-1; i >= 0; i--)
			{
				var group = parentGroups[i];

				if (group.getX() !== 0.0 || group.getY() !== 0.0 || group.getZ() !== 0.0)
				{
					var translateMatrix = new TranslateMatrix(group.getX(), group.getY(), group.getZ());
					mvMatrix.multiplyLeft(translateMatrix);
				}
				
				if (group.getTheta() !== 0.0)
				{
					var rotateMatrixTheta = new RotateMatrix(0, 0, 1, group.getTheta());
					mvMatrix.multiplyLeft(rotateMatrixTheta);
				}
				
				if (group.getPhi() !== 0.0)
				{
					var rotateMatrixPhi = new RotateMatrix(0, 1, 0, group.getPhi());
					mvMatrix.multiplyLeft(rotateMatrixPhi);
				}
				
				if (group.getOmega() !== 0.0)
				{
					var rotateMatrixOmega = new RotateMatrix(1, 0, 0, group.getOmega());
					mvMatrix.multiplyLeft(rotateMatrixOmega);
				}
				
				if (group.getScaleX() !== 1.0 || group.getScaleY() !== 1.0 || group.getScaleZ() !== 1.0)
				{
					var scaleMatrix = new ScaleMatrix(group.getScaleX(), group.getScaleY(), group.getScaleZ());
					mvMatrix.multiplyLeft(scaleMatrix);
				}

				if (!group.getAlignMatrix().isIdentity())
					mvMatrix.multiplyLeft(group.getAlignMatrix());
			}

			if (x !== 0.0 || y !== 0.0 || z !== 0.0)
			{
				var translateMatrix = new TranslateMatrix(x, y, z);
				mvMatrix.multiplyLeft(translateMatrix);
			}
				
			if (theta !== 0.0)
			{
				var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
				mvMatrix.multiplyLeft(rotateMatrixTheta);
			}
				
			if (phi !== 0.0)
			{
				var rotateMatrixPhi = new RotateMatrix(0, 1, 0, phi);
				mvMatrix.multiplyLeft(rotateMatrixPhi);
			}
				
			if (omega !== 0.0)
			{
				var rotateMatrixOmega = new RotateMatrix(1, 0, 0, omega);
				mvMatrix.multiplyLeft(rotateMatrixOmega);
			}
				
			if (scaleX !== 1.0 || scaleY !== 1.0 || scaleZ !== 1.0)
			{
				var scaleMatrix = new ScaleMatrix(scaleX, scaleY, scaleZ);
				mvMatrix.multiplyLeft(scaleMatrix);
			}

			if (!alignMatrix.isIdentity())
				mvMatrix.multiplyLeft(alignMatrix);
		}

		//console.log(mvMatrix.getTable());
		//console.log((new Error()).stack);
	};

	this.updateBoundingBox = function()
	{
		if (!utils.isset(boundingBox) || moved === true)
		{
			boundingBox = 
			{
				minX: 1000000000.0, minY: 1000000000.0, minZ: 1000000000.0,
				maxX: -1000000000.0, maxY: -1000000000.0, maxZ: -1000000000.0,
				widthX: 0.0, widthY: 0.0, widthZ: 0.0,
				centerX: 0.0, centerY: 0.0, centerZ: 0.0,
				radiusX: 0.0, radiusY: 0.0, radiusZ: 0.0,
				radius: 0.0, weight: 1.0, diag: 0.0
			};

			//console.log(object.getTransformedVertices);
			//console.log(mvMatrix.getMatrix());

			if (object.getTransformedVertices && !mvMatrix.isIdentity())
			{
				var transVertices = object.getTransformedVertices();
				nbVertices = transVertices.length/3;

				boundingBox.weight = nbVertices;
				
				var tmpVertices = [];

				for (var i = 0; i < nbVertices; i++)
				{
					var x = transVertices[i*3];
					var y = transVertices[i*3+1];
					var z = transVertices[i*3+2];
					var outputVector = mvMatrix.multiplyVect([x, y, z, 1.0]);
					x = outputVector[0];
					y = outputVector[1];
					z = outputVector[2];
					tmpVertices.push(x);
					tmpVertices.push(y);
					tmpVertices.push(z);

					boundingBox.centerX = boundingBox.centerX + x;
					boundingBox.centerY = boundingBox.centerY + y;
					boundingBox.centerZ = boundingBox.centerZ + z;
				}

				boundingBox.centerX = boundingBox.centerX/nbVertices;
				boundingBox.centerY = boundingBox.centerY/nbVertices;
				boundingBox.centerZ = boundingBox.centerZ/nbVertices;

				// Calcul de la bounding box
				for (var i = 0; i < nbVertices; i++)
				{
					var x = tmpVertices[i*3];
					var y = tmpVertices[i*3+1];
					var z = tmpVertices[i*3+2];
					var dist = Math.sqrt((x-boundingBox.centerX)*(x-boundingBox.centerX) + (y-boundingBox.centerY)*(y-boundingBox.centerY) + (z-boundingBox.centerZ)*(z-boundingBox.centerZ));
					var distX = Math.sqrt((y-boundingBox.centerY)*(y-boundingBox.centerY) + (z-boundingBox.centerZ)*(z-boundingBox.centerZ));
					var distY = Math.sqrt((x-boundingBox.centerX)*(x-boundingBox.centerX) + (z-boundingBox.centerZ)*(z-boundingBox.centerZ));
					var distZ = Math.sqrt((x-boundingBox.centerX)*(x-boundingBox.centerX) + (y-boundingBox.centerY)*(y-boundingBox.centerY));

					if (x < boundingBox.minX)
						boundingBox.minX = x;
					
					if (x > boundingBox.maxX)
						boundingBox.maxX = x;

					if (y < boundingBox.minY)
						boundingBox.minY = y;
					
					if (y > boundingBox.maxY)
						boundingBox.maxY = y;

					if (z < boundingBox.minZ)
						boundingBox.minZ = z;
					
					if (z > boundingBox.maxZ)
						boundingBox.maxZ = z;

					if (dist > boundingBox.radius)
						boundingBox.radius = dist;

					if (distX > boundingBox.radiusX)
						boundingBox.radiusX = distX;

					if (distY > boundingBox.radiusY)
						boundingBox.radiusY = distY;

					if (distZ > boundingBox.radiusZ)
						boundingBox.radiusZ = distZ;
				}

				boundingBox.widthX = boundingBox.maxX - boundingBox.minX;
				boundingBox.widthY = boundingBox.maxY - boundingBox.minY;
				boundingBox.widthZ = boundingBox.maxZ - boundingBox.minZ;
				boundingBox.diag = Math.sqrt(boundingBox.widthX*boundingBox.widthX + boundingBox.widthY*boundingBox.widthY + boundingBox.widthZ*boundingBox.widthZ);

				boundingBox.vertices = 
				[
					[boundingBox.minX, boundingBox.minY, boundingBox.minZ, 1.0],
					[boundingBox.minX, -boundingBox.minY, boundingBox.minZ, 1.0],
					[-boundingBox.minX, -boundingBox.minY, boundingBox.minZ, 1.0],
					[-boundingBox.minX, boundingBox.minY, boundingBox.minZ, 1.0],
					[boundingBox.minX, boundingBox.minY, -boundingBox.minZ, 1.0],
					[boundingBox.minX, -boundingBox.minY, -boundingBox.minZ, 1.0],
					[-boundingBox.minX, -boundingBox.minY, -boundingBox.minZ, 1.0],
					[-boundingBox.minX, boundingBox.minY, -boundingBox.minZ, 1.0]
				];
			}
			else
				boundingBox = object.getBoundingBox();

			//console.log(boundingBox);
			//console.log((new Error()).stack);
		}
	};

	this.update = function($context)
	{
		if (utils.isset(object.update))
			object.update($context);

		$this.updateMvMatrix();
		$this.updateBoundingBox();
	};
	
	// Contrôler si on peu afficher ou non
	// Si la bounding box est entièrement à l'intérieur ou entièrement à l'extérieur de l'écran on ne teste pas les sous items
	// Si la bounding box est au bord de l'écran on teste les sous items
	
	// Contrôle d'affichage sur la distance
	// Calculer une distance maximale d'affichage en fonction de la taille de la bounding box
	// Définir une taille d'affichage minimale de la bounding box en projection 2D (nombre de pixels)
	
	this.render = function($context)
	{
		var displayed = true;

		//*
		if (displayWithNoCheck === false)
		{
			var camera = $context.camera;
			var deltaX = boundingBox.centerX-camera.getX();
			var deltaY = boundingBox.centerY-camera.getY();
			var deltaZ = boundingBox.centerZ-camera.getZ();
			var dist = Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);

			var testProjection = function()
			{
				var projCenter = $context.projMatrix.multiplyVect([boundingBox.centerX, boundingBox.centerY, boundingBox.centerZ, 1.0]);
				projCenter = [projCenter[0]/projCenter[3], projCenter[1]/projCenter[3], projCenter[2]/projCenter[3], projCenter[3]];
					
				if (projCenter[0] >= -1.0 && projCenter[0] <= 1.0 && projCenter[2] >= -1.0 && projCenter[2] <= 1.0)
					displayed = true;
				else
				{
					var projBoundingBox =
					{
						minX: 1000000000.0, minY: 1000000000.0, maxX: -1000000000.0, maxY: -1000000000.0,
						widthX: 0.0, widthY: 0.0, centerX: 0.0, centerY: 0.0
					};

					for (var i = 0; i < boundingBox.vertices.length; i++)
					{
						var projVertex = $context.projMatrix.multiplyVect(boundingBox.vertices[i]);

						if (projVertex[0] < projBoundingBox.minX)
							projBoundingBox.minX = projVertex[0];

						if (projVertex[0] > projBoundingBox.maxX)
							projBoundingBox.maxX = projVertex[0];

						if (projVertex[1] < projBoundingBox.minY)
							projBoundingBox.minY = projVertex[1];

						if (projVertex[1] > projBoundingBox.maxY)
							projBoundingBox.maxY = projVertex[1];
					}

					projBoundingBox.widthX = projBoundingBox.maxX - projBoundingBox.minX;
					projBoundingBox.widthY = projBoundingBox.maxY - projBoundingBox.minY;
					projBoundingBox.centerX = (projBoundingBox.maxX + projBoundingBox.minX)/2.0;
					projBoundingBox.centerY = (projBoundingBox.maxY + projBoundingBox.minY)/2.0;

					if (Math.abs(projBoundingBox.centerX) <= projBoundingBox.widthX/2.0 + 1.0 && Math.abs(projBoundingBox.centerY) <= projBoundingBox.widthY/2.0 + 1.0)
						displayed = true;
					else
						displayed = false;
				}
			};

			if (dist < boundingBox.radius)
				displayed = true;
			else
			{
				var dotCamera = Vectors.dotProduct(new Vector([deltaX, deltaY, deltaZ]), camera.getViewVector());

				if (dotCamera > 0.0)
					testProjection();
				else
				{
					var distToPlane = camera.getPlane().getDistance(new Vector([boundingBox.centerX, boundingBox.centerY, boundingBox.centerZ]));

					if (distToPlane <= dist)
						testProjection();
					else
						displayed = false;
				}
			}
		}
		//*/

		if (displayed)
		{
			object.setParamValue('uMVMatrix', mvMatrix.getTable());
		
			object.render($context);
		}

		var type = object.getType();

		if (type === 'object')
		{
			NB_GL_TRIANGLES = NB_GL_TRIANGLES + Math.floor(object.getIndices().length/3);
			NB_GL_VERTICES = NB_GL_VERTICES + object.getNbVertices();
		}

		displayWithNoCheck = false;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getType = function() { return type; };
	this.getObject = function() { return object; };

	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getZ = function() { return z; };
	
	this.getTheta = function() { return theta; };
	this.getPhi = function() { return phi; };
	this.getOmega = function() { return omega; };
	
	this.getScaleX = function() { return scaleX; };
	this.getScaleY = function() { return scaleY; };
	this.getScaleZ = function() { return scaleZ; };

	this.getAlignMatrix = function() { return alignMatrix; };

	this.isMoved = function() { return moved; };

	this.getMvMatrix = function()
	{
		var mvMatrix = new Matrix();
		mvMatrix.identity();

		if (x !== 0.0 || y !== 0.0 || z !== 0.0)
		{
			var translateMatrix = new TranslateMatrix(x, y, z);
			mvMatrix.multiplyLeft(translateMatrix);
		}

		if (theta !== 0.0)
		{
			var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
			mvMatrix.multiplyLeft(rotateMatrixTheta);
		}

		if (phi !== 0.0)
		{
			var rotateMatrixPhi = new RotateMatrix(0, 1, 0, phi);
			mvMatrix.multiplyLeft(rotateMatrixPhi);
		}

		if (omega !== 0.0)
		{
			var rotateMatrixOmega = new RotateMatrix(1, 0, 0, omega);
			mvMatrix.multiplyLeft(rotateMatrixOmega);
		}

		if (scaleX !== 1.0 || scaleY !== 1.0 || scaleZ !== 1.0)
		{
			var scaleMatrix = new ScaleMatrix(scaleX, scaleY, scaleZ);
			mvMatrix.multiplyLeft(scaleMatrix);
		}

		if (!alignMatrix.isIdentity())
			mvMatrix.multiplyLeft(alignMatrix);

		return mvMatrix;
	};

	this.getNMvMatrix = function()
	{
		var mvMatrix = new Matrix();
		mvMatrix.identity();

		var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
		var rotateMatrixPhi = new RotateMatrix(0, 1, 0, phi);
		var rotateMatrixOmega = new RotateMatrix(1, 0, 0, omega);

		var scaleMatrix = null;

		if (scaleX === 0.0)
			scaleMatrix = new ScaleMatrix(1.0, 0.0, 0.0);
		else if (scaleY === 0.0)
			scaleMatrix = new ScaleMatrix(0.0, 1.0, 0.0);
		else if (scaleZ === 0.0)
			scaleMatrix = new ScaleMatrix(0.0, 0.0, 1.0);
		else
			scaleMatrix = new ScaleMatrix(1.0/scaleX, 1.0/scaleY, 1.0/scaleZ);

		mvMatrix.multiplyLeft(rotateMatrixTheta);
		mvMatrix.multiplyLeft(rotateMatrixPhi);
		mvMatrix.multiplyLeft(rotateMatrixOmega);
		mvMatrix.multiplyLeft(scaleMatrix);
		mvMatrix.multiplyLeft(alignMatrix);

		return mvMatrix;
	};

	this.getTransformedVertices = function()
	{
		var tmpVertices = [];
		var mvMatrix = $this.getMvMatrix();
		var vertices = object.getTransformedVertices();
		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
			var x = vertices[i*3];
			var y = vertices[i*3+1];
			var z = vertices[i*3+2];
			var outputVector = mvMatrix.multiplyVect([x, y, z, 1.0]);
			tmpVertices.push(outputVector[0]);
			tmpVertices.push(outputVector[1]);
			tmpVertices.push(outputVector[2]);
		}

		return tmpVertices;
	};

	this.getTransformedNormals = function()
	{
		var tmpNormals = [];
		var nMvMatrix = $this.getNMvMatrix();
		var normals = object.getTransformedNormals();
		var nbVertices = normals.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
			var x = normals[i*3];
			var y = normals[i*3+1];
			var z = normals[i*3+2];
			var outputVector = new Vector(nMvMatrix.multiplyVect([x, y, z, 1.0]));
			outputVector = outputVector.normalize();
			tmpNormals.push(outputVector.values()[0]);
			tmpNormals.push(outputVector.values()[1]);
			tmpNormals.push(outputVector.values()[2]);
		}

		return tmpNormals;
	};

	this.getBoundingBox = function()
	{
		return boundingBox;
	};

	this.getRawData = function()
	{
		var rawData =
		{ 
			v: $this.getTransformedVertices(), 
			vn: $this.getTransformedNormals(), 
			vt: object.getTexture(), 
			f: object.getIndices(),
			materials: []
		};

		for (var i = 0; i < rawData.v.length/3; i++)
			rawData.materials.push(object.getMaterial().getName());

		console.log("Instance : ");
		console.log(rawData);

		return rawData;
	};

	this.getCOLLADAdata = function()
	{
		var colladaData = {};

		var objectCOLLADAdata = object.getCOLLADAdata();

		var instanceMVmatrix = $this.getMvMatrix();

		colladaData.meshID = objectCOLLADAdata.meshID;
		colladaData.transformMatrix = instanceMVmatrix.multiplyLeft(objectCOLLADAdata.transformMatrix);
		colladaData.materialName = objectCOLLADAdata.materialName;

		return [colladaData];
	};
	
	// SET
	
	this.setX = function($x)
	{
		x = $x;
		moved = true;
	};

	this.setY = function($y)
	{
		y = $y;
		moved = true;
	};

	this.setZ = function($z)
	{ 
		z = $z; 
		moved = true;
	};
	
	this.setTheta = function($theta)
	{
		theta = $theta;
		moved = true;
	};

	this.setPhi = function($phi)
	{
		phi = $phi;
		moved = true;
	};

	this.setOmega = function($omega)
	{
		omega = $omega;
		moved = true;
	};
	
	this.setScaleX = function($scaleX)
	{
		scaleX = $scaleX;
		moved = true;
	};

	this.setScaleY = function($scaleY)
	{
		scaleY = $scaleY;
		moved = true;
	};

	this.setScaleZ = function($scaleZ)
	{
		scaleZ = $scaleZ;
		moved = true;
	};

	this.setScale = function($scale)
	{
		scaleX = $scale;
		scaleY = $scale;
		scaleZ = $scale;
		moved = true;
	};

	this.setAlignMatrix = function($alignMatrix)
	{
		alignMatrix = $alignMatrix;
		alignMatrix.setItemMatrix(0, 3, 0.0);
		alignMatrix.setItemMatrix(1, 3, 0.0);
		alignMatrix.setItemMatrix(2, 3, 0.0);
		moved = true;
	};

	this.setMoved = function($moved) { moved = $moved; };

	this.reinitMoved = function()
	{
		moved = false;
		object.setMoved(false);
	};

	this.displayWithNoCheck = function($displayWithNoCheck) { displayWithNoCheck = $displayWithNoCheck; };

	this.setParamValue = function($name, $value) { object.setParamValue($name, $value); };

	this.setOutline = function($param)
	{
		if (utils.isset(object.isOutlined))
		{
			var isOutlined = object.isOutlined();

			if (isOutlined !== true)
			{
				object.setOutline($param.enable);
				object.setOutlineWidth($param.width);
				object.setOutlineColor($param.color);
			}
		}
	};

	NB_GL_INSTANCES++;
	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-instance");