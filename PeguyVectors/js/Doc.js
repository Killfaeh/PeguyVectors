Doc = 
{
    width: 1000,
    height: 1000,
    centerX: 500,
    centerY: 500,

    setWidth: function($width)
    {
        Doc.width = $width;
        Doc.centerX = Math.round(Doc.width/2.0);
    },

    setHeight: function($height)
    {
        Doc.height = $height;
        Doc.centerY = Math.round(Doc.height/2.0);
    },

    elementsList: [],
    transformList: [],

    add: function($input)
    {
        if (Array.isArray($input))
        {
            for (var i = 0; i < $input.length; i++)
                Doc.add($input[i]);
        }
        else
        {
            var type = $input.getType();

            if (type === 'object')
                Doc.elementsList.push($input);
            else if (type === 'transform')
                Doc.transformList.push($input);
        }
    },

    insertInto: function($input, $index)
    {
        var type = $input.getType();

        if (type === 'object')
            Doc.elementsList.splice($index, 0, $input);
        else if (type === 'transform')
            Doc.transformList.splice($index, 0, $input);
    },

    remove: function($input)
    {
        var type = $input.getType();

        if (type === 'object')
        {
            var index = Doc.elementsList.indexOf($input);
            
            if (index > -1)
                Doc.elementsList.splice(index, 1);
        }
        else if (type === 'transform')
        {
            var index = Doc.transformList.indexOf($input);
            
            if (index > -1)
                Doc.transformList.splice(index, 1);
        }
    },

    empty: function($element)
    {
        Doc.elementsList = [];
        Doc.transformList = [];
        Doc.width = 1000;
        Doc.height = 1000;
        Doc.centerX = 500;
        Doc.centerY = 500;
    },

    transform: function()
    {
        var transformCommand = '';

        for (var i = 0; i < Doc.transformList.length; i++)
            transformCommand = transformCommand + Doc.transformList[i].transform();
        
        return transformCommand;
    }
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("doc");