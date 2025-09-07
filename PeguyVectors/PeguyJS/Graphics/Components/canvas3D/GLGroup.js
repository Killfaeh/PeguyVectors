
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLGroup()
{
	///////////////
	// Attributs //
	///////////////

	var init = false;

	var type = 'group';

	var instancesList = [];
	
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

	this.linkShaders = function($context)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].linkShaders($context);
	};

	this.init = function($context) {};

	this.updateBoundingBox = function()
	{
		var tmpMove = moved;
		var parentGroups = [];
		var parentGroup = $this.parentGroup;

		while (utils.isset(parentGroup))
		{
			if (parentGroup.isMoved() === true)
			{
				parentGroups.push(parentGroup);
				tmpMove = true;
			}

			parentGroup = parentGroup.parentGroup;
		}

		if (!utils.isset(boundingBox) || moved === true)
		{
			boundingBox = 
			{
				minX: 1000000000.0, minY: 1000000000.0, minZ: 1000000000.0,
				maxX: -1000000000.0, maxY: -1000000000.0, maxZ: -1000000000.0,
				widthX: 0.0, widthY: 0.0, widthZ: 0.0,
				centerX: 0.0, centerY: 0.0, centerZ: 0.0,
				radiusX: 0.0, radiusY: 0.0, radiusZ: 0.0,
				radius: 0.0, weight: 0.0, diag: 0.0
			};

			for (var i = 0; i < instancesList.length; i++)
			{
				var subBoundingBox = instancesList[i].getBoundingBox();

				if (subBoundingBox.minX < boundingBox.minX)
					boundingBox.minX = subBoundingBox.minX;
						
				if (subBoundingBox.maxX > boundingBox.maxX)
					boundingBox.maxX = subBoundingBox.maxX;

				if (subBoundingBox.minY < boundingBox.minY)
					boundingBox.minY = subBoundingBox.minY;
						
				if (subBoundingBox.maxY > boundingBox.maxY)
					boundingBox.maxY = subBoundingBox.maxY;

				if (subBoundingBox.minZ < boundingBox.minZ)
					boundingBox.minZ = subBoundingBox.minZ;
						
				if (subBoundingBox.maxZ > boundingBox.maxZ)
					boundingBox.maxZ = subBoundingBox.maxZ;
			}

			boundingBox.widthX = boundingBox.maxX - boundingBox.minX;
			boundingBox.widthY = boundingBox.maxY - boundingBox.minY;
			boundingBox.widthZ = boundingBox.maxZ - boundingBox.minZ;
			boundingBox.diag = Math.sqrt(boundingBox.widthX*boundingBox.widthX + boundingBox.widthY*boundingBox.widthY + boundingBox.widthZ*boundingBox.widthZ);

			// Imprécis mais rapide à calculer
			boundingBox.radius = boundingBox.diag/2.0;
			boundingBox.radiusX = Math.sqrt(boundingBox.widthY*boundingBox.widthY + boundingBox.widthZ*boundingBox.widthZ)/2.0;
			boundingBox.radiusY = Math.sqrt(boundingBox.widthX*boundingBox.widthX + boundingBox.widthZ*boundingBox.widthZ)/2.0;
			boundingBox.radiusZ = Math.sqrt(boundingBox.widthX*boundingBox.widthX + boundingBox.widthY*boundingBox.widthY)/2.0;
			boundingBox.centerX = (boundingBox.maxX - boundingBox.minX)/2.0;
			boundingBox.centerY = (boundingBox.maxY - boundingBox.minY)/2.0;
			boundingBox.centerZ = (boundingBox.maxZ - boundingBox.minZ)/2.0;

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
	};

	this.update = function($context)
	{
		$this.init($context);

		for (var i = 0; i < instancesList.length; i++)
		{
			var type = instancesList[i].getType();

			if (type === 'object')
			{
				instancesList[i] = new GLInstance(instancesList[i]);
				instancesList[i].parentGroup = $this;
			}

			instancesList[i].update($context);
		}

		$this.updateBoundingBox();
	};
	
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
				{
					displayed = true;

					if (Math.abs(projBoundingBox.centerX) <=  1.0 - projBoundingBox.widthX/2.0 && Math.abs(projBoundingBox.centerY) <= 1.0 - projBoundingBox.widthY/2.0)
						$this.displayWithNoCheck(true);
				}
				else
					displayed = false;
			};

			if (dist < boundingBox.radius)
			{
				displayed = true;
				$this.displayWithNoCheck(true);
			}
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
			// Affichage des objets (il faudra ajouter un gestionnaire d'ordre d'affichage)
			
			for (var i = 0; i < instancesList.length; i++)
			{
				instancesList[i].render($context);
				$context.bindTexture($context.TEXTURE_2D, null);
			}
		}

		displayWithNoCheck = false;
		init = true;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getType = function() { return type; };
	this.getInstancesList = function() { return instancesList; };

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

	this.getBoundingBox = function() { return boundingBox; };

	this.getRawData = function()
	{
		var rawData = { v: [], vn: [], vt: [], f: [], materials: [] };

		var offsetIndex = 0;

		for (var i = 0; i < instancesList.length; i++)
		{
			var instanceRawData = instancesList[i].getRawData();

			var mvMatrix = $this.getMvMatrix();
			var vertices = instanceRawData.v;
			var nbVertices = vertices.length/3;

			for (var j = 0; j < nbVertices; j++)
			{
				var x = vertices[j*3];
				var y = vertices[j*3+1];
				var z = vertices[j*3+2];
				var outputVector = mvMatrix.multiplyVect([x, y, z, 1.0]);
				rawData.v.push(outputVector[0]);
				rawData.v.push(outputVector[1]);
				rawData.v.push(outputVector[2]);
			}

			var nMvMatrix = $this.getNMvMatrix();
			var normals = instanceRawData.vn;
			//nbVertices = normals.length/3;

			for (var j = 0; j < nbVertices; j++)
			{
				var x = normals[j*3];
				var y = normals[j*3+1];
				var z = normals[j*3+2];
				var outputVector = new Vector(nMvMatrix.multiplyVect([x, y, z, 1.0]));
				outputVector = outputVector.normalize();
				rawData.vn.push(outputVector.values()[0]);
				rawData.vn.push(outputVector.values()[1]);
				rawData.vn.push(outputVector.values()[2]);
			}

			for (var j = 0; j < instanceRawData.vt.length; j++)
				rawData.vt.push(instanceRawData.vt[j]);

			for (var j = 0; j < instanceRawData.f.length; j++)
				rawData.f.push(instanceRawData.f[j] + offsetIndex);

			for (var j = 0; j < instanceRawData.materials.length; j++)
				rawData.materials.push(instanceRawData.materials[j]);

			offsetIndex = offsetIndex + instanceRawData.v.length/3;
		}

		//console.log("Group : ");
		//console.log(rawData);

		return rawData;
	};

	this.getCOLLADAdata = function()
	{
		var colladaInstanceList = [];

		for (var i = 0; i < instancesList.length; i++)
		{
			var colladaInstanceSubList = instancesList[i].getCOLLADAdata();

			//console.log(colladaInstanceSubList);

			for (var j = 0; j < colladaInstanceSubList.length; j++)
			{
				var groupMVmatrix = $this.getMvMatrix();

				var colladaData = {};

				colladaData.meshID = colladaInstanceSubList[j].meshID;
				colladaData.transformMatrix = groupMVmatrix.multiplyLeft(colladaInstanceSubList[j].transformMatrix);
				colladaData.materialName = colladaInstanceSubList[j].materialName;

				colladaInstanceList.push(colladaData);
			}
		}

		return colladaInstanceList;
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
		
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].reinitMoved();
	};

	this.displayWithNoCheck = function($displayWithNoCheck)
	{
		displayWithNoCheck = $displayWithNoCheck;

		for (var i = 0; i < instancesList.length; i++)
		{
			if (utils.isset(instancesList[i].displayWithNoCheck))
				instancesList[i].displayWithNoCheck($displayWithNoCheck);
		}
	};

	this.setParamValue = function($name, $value)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].setParamValue($name, $value);
	};

	this.setOutline = function($param)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].setOutline($param);
	};

	this.addInstance = function($instance)
	{
		var index = instancesList.indexOf($instance);
		
		if (index < 0)
		{
			instancesList.push($instance);
			$instance.parentGroup = $this;
			moved = true;
		}
	};
	
	this.removeInstance = function($instance)
	{
		var index = instancesList.indexOf($instance);
		
		if (index >= 0)
		{
			instancesList.splice(index, 1);
			$instance.parentGroup = null;
			moved = true;
		}
	};
	
	this.removeAllInstances = function()
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].parentGroup = null;

		instancesList = [];
		moved = true;
	};

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-group");