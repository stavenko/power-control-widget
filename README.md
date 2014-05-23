# Power-control widget

This widget combines functionality of a slider - like http://jqueryui.com/slider/ and progress bar, which value could be installed separately

##Usage

Basic usage:

		var PCC = $('#here-we-put-demos').css({ /* whatever */});
		var pc = new PowerControlWidget({container:PCC[0], starting_percent:-0.5, end_percent:1.5,progress_value:1.2,
			slide:function(val, progress_val){
				// here you can use slider values
				
			},
			change: function(val, progress_val){
				// TODO use values;
			}
			
		});
		
# Important settings

* progress_value - initial value for progress bar
* starting_percent - in case, when you need below zero percentage
* end_percent - in case when you need above 100 percent values
* slide  - onSlide callback function, takes two arguments - current value of slider and progressbar;
* change - onChange callback function, takestwo arguments - current value of slider and progressbar;
* width - full width of canvas object
* info_width - width of window, where would be textual values drawn;
* height - The height of canvas object;

There are also a bunch of color settings:

	this.border_color = settings.border_color || "#115";
	this.below_z_color = settings.below_z_color || "#00F";
	this.upper_1_color    = settings.upper_1_color || "#F00";
	this.background_color = settings.background_color || "#FFF";
	this.cursor_color = settings.cursor_color || "#115";
	

## Functions
* PowerControlWidget.get_value() - Returns current slider value;

* PowerControlWidget.set_value(float_val) - setup slider value - set it to certain percentage float value should be in [starting_percent, end_percent] range
* PowerControlWidget.set_progress_value(float_val) - same, but for setting up progressbar

## Dependencies

PowerControlWidget uses https://github.com/harthur/color for color manipulations. 
