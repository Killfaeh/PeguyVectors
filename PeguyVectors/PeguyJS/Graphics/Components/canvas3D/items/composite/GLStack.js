function GLStack($elements, $axis, $align)
{
	///////////////
	// Attributs //
	///////////////

	this.stack = true;

	var elements = $elements;
	var axis = $axis;
	var align = $align;

    if (!utils.isset(elements))
        elements = [];

	if (!utils.isset(axis))
        axis = 'z';

	if (!utils.isset(align))
        align = 1;

	var init = false;

	var group = new GLGroup();

	//////////////
	// Méthodes //
	//////////////

	this.init = function($context)
	{
		if (init === false)
		{
			group.removeAllInst();

			var alignX = 0.0;
			var alignY = 0.0;
			var alignZ = 0.0;
			var offsetX = 0.0;
			var offsetY = 0.0;
			var offsetZ = 0.0;

			for (var i = 0; i < elements.length; i++)
			{
				if (elements[i].setMoved)
					elements[i].setMoved(true);

				elements[i].update($context);

				//*
				var boundingBox = elements[i].getBoundingBox();
				//console.log(boundingBox);
				//console.log(offsetX + ', ' + offsetY + ', ' + offsetZ);
				//*/

				var subGroup = new GLGroup();
				subGroup.addInstance(elements[i]);

				//*
				if (axis === 'x')
				{
					alignX = -boundingBox.minX;
					alignY = -(boundingBox.minY+boundingBox.maxY)/2.0;
					alignZ = -(boundingBox.minZ+boundingBox.maxZ)/2.0;
				}
				else if (axis === 'y')
				{
					alignX = -(boundingBox.minX+boundingBox.maxX)/2.0;
					alignY = -boundingBox.minY;
					alignZ = -(boundingBox.minZ+boundingBox.maxZ)/2.0;
				}
				else
				{
					alignX = -(boundingBox.minX+boundingBox.maxX)/2.0;
					alignY = -(boundingBox.minY+boundingBox.maxY)/2.0;
					alignZ = -boundingBox.minZ;
				}

				//console.log(alignX + ', ' + alignY + ', ' + alignZ);

				subGroup.setX(offsetX+alignX);
				subGroup.setY(offsetY+alignY);
				subGroup.setZ(offsetZ+alignZ);

				if (axis === 'x')
					offsetX = offsetX + boundingBox.widthX;
				else if (axis === 'y')
					offsetY = offsetY + boundingBox.widthY;
				else
					offsetZ = offsetZ + boundingBox.widthZ;
				//*/

				group.addInst(subGroup);
			}

			//*
			if (align === -1)
			{
				var instances = group.getInstancesList();

				for (var i = 0; i < instances.length; i++)
				{
					if (axis === 'x')
						instances[i].setX(instances[i].getX()-offsetX);
					else if (axis === 'y')
						instances[i].setY(instances[i].getY()-offsetY);
					else
						instances[i].setZ(instances[i].getZ()-offsetZ);
				}
			}
			else if (align === 0)
			{
				var instances = group.getInstancesList();

				for (var i = 0; i < instances.length; i++)
				{
					if (axis === 'x')
						instances[i].setX(instances[i].getX()-offsetX/2.0);
					else if (axis === 'y')
						instances[i].setY(instances[i].getY()-offsetY/2.0);
					else
						instances[i].setZ(instances[i].getZ()-offsetZ/2.0);
				}
			}
			//*/
		}

		init = true;
	};

	/*
	this.update = function($context)
	{
		console.log("UPDATE STACK ! ");

		$this.init($context);

		var instancesList = group.getInstancesList();

		console.log(instancesList);

		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].update($context);

		$this.updateBoundingBox();
	};
	//*/

	/*
	this.update = function($context)
	{
		$this.init($context);
	};
	///*/

	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	// SET

	group.addInst = group.addInstance;

	this.addInstance = function($element)
	{
		var index = elements.indexOf($element);
		
		if (index < 0)
		{
			elements.push($element);
			$element.parentGroup = $this;
			init = false;
		}
	};

	group.removeInst = group.removeInstance;
	
	this.removeInstance = function($element)
	{
		var index = elements.indexOf($element);
		
		if (index >= 0)
		{
			elements.splice(index, 1);
			$element.parentGroup = null;
			init = false;
		}
	};
	
	group.removeAllInst = group.removeAllInstances;

	this.removeAllInstances = function()
	{
		for (var i = 0; i < elements.length; i++)
			elements[i].parentGroup = null;

		elements = [];
		init = false;
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(group, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-stack");