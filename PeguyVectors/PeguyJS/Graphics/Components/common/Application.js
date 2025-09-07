function Application($html)
{
	///////////////
	// Attributs //
	///////////////

	var html = $html;

	if (!utils.isset(html))
		html = '';
	
	var component = new Component('<div class="application" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;" >' + html + '</div>');

	var views = [];
	var currentView = null;

	//////////////
	// Méthodes //
	//////////////

	// A surcharger
	this.init = function() {};
	this.update = function() {};
	this.resize = function() {};

	this.changeView = function($view)
	{
		var tmpView = $view;

		if (typeof $view === 'string' || $view instanceof String)
		{
			tmpView = null;

			for (var i = 0; i < views.length; i++)
			{
				var name = views[i].getName();

				if ($view === name)
				{
					tmpView = views[i];
					i = views.length;
				}
			}
		}
		else if (Number.isInteger($view))
		{
			if ($view >= 0 && $view < views.length)
				tmpView = views[$view];
			else
				tmpView = null;
		}

		if (utils.isset(tmpView) && tmpView !== currentView && views.indexOf(tmpView) >= 0)
		{
			currentView = tmpView;
			component.empty();
			component.appendChild(currentView);
			currentView.update();
		}
	};

	this.addView = function($view)
	{
		var index = views.indexOf($view);
		
		if (index < 0)
			views.push($view);
	};
	
	this.removeView = function($view)
	{
		var index = views.indexOf($view);
		
		if (index >= 0)
		{
			views.splice(index, 1);
			
			if (currentView === $view)
			{
				component.empty();
				currentView = null;
			}
		}
	};
	
	this.removeAllViews = function()
	{
		views = [];
		component.empty();
		currentView = null;
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("application");