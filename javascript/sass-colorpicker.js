var SassColorPicker = {
	originalColorScheme: {},
	colorScheme: {},
	supportedProperties: ["color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],

	initialize: function ()
	{
		this.initializeEvents ();
		this.initializeColorScheme ();
	},

	initializeEvents: function ()
	{
		var handler = this;

		document.addEventListener ("keypress", function (e)
		{
			if (e.keyCode == 99)
			{
				handler.toggleColorPicker ();
			}
		});
	},

	initializeColorScheme: function ()
	{
		for (var i in document.styleSheets)
		{
			for (var j in document.styleSheets [i].cssRules)
			{
				var rule = document.styleSheets [i].cssRules [j];
				
				if (rule.selectorText && rule.selectorText.indexOf (".dib-colorscheme") == 0)
				{
					var parts = rule.selectorText.split ("--");
					var colorName = parts [1];

					this.originalColorScheme [colorName] = rule.style.backgroundColor;
					this.colorScheme [colorName] = {color: rule.style.backgroundColor, activeRules: []}
				} else
				{
					if (rule.selectorText && rule.selectorText.indexOf (".dib-") != 0 && rule.style)
					{
						for (var l in this.supportedProperties)
						{
							var prop = this.supportedProperties [l];

							if (rule.style [prop].length > 0)
							{
								var colorName = this.getColorByValue (rule.style [prop]);

								if (colorName)
								{
									this.colorScheme [colorName].activeRules.push ({stylesheet: i, rule: j, property: prop});
								}
							}
						}
					}
				}
			}
		}
	},

	getColorByValue: function (color)
	{
		for (var colorName in this.colorScheme)
		{
			if (this.colorScheme [colorName].color == color)
				return colorName;
		}

		 return false;
	},

	changeColor: function (colorName, value)
	{
		if (!this.colorScheme [colorName])
			return false;

		this.colorScheme [colorName].color = value;

		for (var i in this.colorScheme [colorName].activeRules)
		{
			var ruleInfo = this.colorScheme [colorName].activeRules [i];

			document.styleSheets [ruleInfo.stylesheet].cssRules [ruleInfo.rule].style [ruleInfo.property] = value;
		}

		return true;
	},

	toggleColorPicker: function ()
	{
		var colorPicker = document.querySelector (".dib-colorpicker");

		if (colorPicker)
		{
			document.body.removeChild (colorPicker);
		} else
		{
			var colorPicker = document.createElement ('div');
			colorPicker.classList.add ('dib-colorpicker');
			
			var colorPickerHTML = '';

			for (var colorName in this.colorScheme)
			{
				var colorConverter = document.createElement ('div');

				colorConverter.style.display = 'none';
				colorConverter.style.backgroundColor = this.colorScheme [colorName].color;
				document.body.appendChild (colorConverter);
				
				var styles = window.getComputedStyle (colorConverter);
				var rgbColor = styles.backgroundColor;

				document.body.removeChild (colorConverter);

				var rgbParts = rgbColor.replace ('rgb(', '').replace (')', '').split (', ');
				var hexColor = '#';

				for (var i in rgbParts)
				{
					var hexPart = parseInt (rgbParts [i]);
					hexPart = hexPart.toString (16);

					if (hexPart.length == 1)
						hexPart = '0' + hexPart;

					hexColor += hexPart;
				}

				colorPickerHTML += colorName + ': <input type="color" data-color="' + colorName + '" value="' + hexColor + '"> <span data-color-label="' + colorName + '">' + hexColor + '</span><br>';
			}

			colorPicker.innerHTML = colorPickerHTML;

			document.body.appendChild (colorPicker);

			var colorPickerInputs = document.querySelectorAll ('input[data-color]');

			var handler = this;

			for (var i in colorPickerInputs)
			{
				if (typeof colorPickerInputs [i] == 'object')
				{
					colorPickerInputs [i].addEventListener ('change', function ()
					{
						var label = document.querySelector ('[data-color-label=' + this.getAttribute ('data-color') + ']');
						label.innerHTML = this.value;
						handler.changeColor (this.getAttribute ('data-color'), this.value);
					});
				}
			}
		}
	}
};

SassColorPicker.initialize ();