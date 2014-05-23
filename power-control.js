
var PowerControlWidget = function(settings){
	
	this.container = settings.container || undefined ;
	this.width = settings.width || 300;
	this._info_width = settings.info_width || 130;
	this._line_width = this.width - this._info_width;
	this.height = settings.height || 24;
	
	this.starting_percent = settings.starting_percent|| 0;
	this.end_percent = settings.end_percent || 1; 
	this._range = this.end_percent - this.starting_percent 
	
	
	this._percent_value = settings.initial_percent_value || 0;
	this.progress_value = settings.progress_value || 0;
	this.onslide = settings.slide  || function(value, pval){};
	this.onchange = settings.change  || function(value, pval){};

	this.border_color = settings.border_color || "#115";
	this.below_z_color = settings.below_z_color || "#00F";
	this.upper_1_color    = settings.upper_1_color || "#F00";
	this.background_color = settings.background_color || "#FFF";
	this.cursor_color = settings.cursor_color || "#115";
	
	// this.upper_zero_color    = settings.lower_color || "#0F0";
	// this.p_lower_zero_color    = settings.lower_color || "#0F0";

	this._mouse_down = false;
	
	this.canvas = document.createElement('CANVAS');
    this.canvas.height = this.height;
    this.canvas.width = this.width;
	
	this.container.appendChild(this.canvas);
	
	this.ctx = this.canvas.getContext('2d');
	
	this.padding_top_bottom = 4;
	this.padding_left_right = (this.height )/2;
	
	var self = this;
	
	this._get_percent = function(x){
		
		var a = this.padding_left_right;
		var w = this._line_width - (2*a);
		return ((x - a) * this._range/ w)+this.starting_percent ;
	};
	this._get_x = function(p){
		
		var a = this.padding_left_right;
		var w = this._line_width - (2*a);
		return a+ (p - this.starting_percent) * w / this._range;
		
		
		
	};
	
	this.set_value = function(value){
		this.value = this._get_x(value);
		this.redraw();
	}
	this.set_progress_value = function(value){
		this.progress_value = value;
		this.redraw();
	}
	this.canvas.addEventListener("mousedown", function(event){
		self.mouse_down = true;
		
		self.value = event.offsetX;
		
		if(event.offsetX < self.padding_left_right){
			self.value = self.padding_left_right;
		}
		if(event.offsetX > self._line_width - self.padding_left_right){
			self.value = self._line_width - self.padding_left_right;
		}
		
		self._percent_value = self._get_percent(self.value);
		self.redraw();
		self.onchange(self._percent_value, self.progress_value);
	})
	this.canvas.addEventListener("mouseup", function(event){
		self.mouse_down = false;
		
		self._percent_value = self._get_percent(self.value);
		self.redraw();
		
		self.onchange(self._percent_value, self.progress_value);
		
		
	})

	
	this.canvas.addEventListener("mousemove", function(event){
		if (self.mouse_down){
			self.value = event.offsetX;

			if(event.offsetX < self.padding_left_right){
				self.value = self.padding_left_right;
			}
			if(event.offsetX > self._line_width - self.padding_left_right){
				self.value = self._line_width - self.padding_left_right;
			}
			
			self._percent_value = self._get_percent(self.value);
			
			self.redraw();
			self.onslide(self._percent_value, self.progress_value);
			
		}
	})
	this._draw_inner_bg = function(){
		var b = this.padding_top_bottom;
		var a = this.padding_left_right;
		var w = this._line_width - ( 2 * a );
		var h =  this.height - (2*b);
		
		this.ctx.beginPath();
		this.ctx.bezierCurveTo(a+(w/2), b, w-(w/2)+a, b, a+w, b );
		this.ctx.bezierCurveTo(a+w+a, b, a+a+w, b+h, a+w, b+h );
		this.ctx.bezierCurveTo( w/2+a, b+h, w/2+a,b+h, a, b+h);
		this.ctx.bezierCurveTo( 0, b+h, 0,b, a,b);
		this.ctx.fillStyle = this.background_color;
		this.ctx.fill();
		this.ctx.closePath();
	
		if(this.starting_percent < 0){
			this.ctx.save();
			var zero = this._get_x(0);
			this.ctx.beginPath();
			
			this.ctx.rect(0,0, zero, this.height);
			this.ctx.clip();
			this.ctx.beginPath();
			this.ctx.bezierCurveTo(a+(w/2), b, w-(w/2)+a, b, a+w, b );
			this.ctx.bezierCurveTo(a+w+a, b, a+a+w, b+h, a+w, b+h );
			this.ctx.bezierCurveTo( w/2+a, b+h, w/2+a,b+h, a, b+h);
			this.ctx.bezierCurveTo( 0, b+h, 0,b, a,b);
			this.ctx.fillStyle = this.below_z_color;
			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.restore();
			
		}
		if(this.end_percent > 1){
			this.ctx.save();
			var one = this._get_x(1);
			this.ctx.beginPath();
			
			this.ctx.rect(one,0, this._line_width - one, this.height);
			this.ctx.clip();
			this.ctx.beginPath();
			this.ctx.bezierCurveTo(a+(w/2), b, w-(w/2)+a, b, a+w, b );
			this.ctx.bezierCurveTo(a+w+a, b, a+a+w, b+h, a+w, b+h );
			this.ctx.bezierCurveTo( w/2+a, b+h, w/2+a,b+h, a, b+h);
			this.ctx.bezierCurveTo( 0, b+h, 0,b, a,b);
			this.ctx.fillStyle = this.upper_1_color;
			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.restore();
			
		}
		
		
	}
	
	this._draw_border = function(){
		var b = this.padding_top_bottom;
		var a = this.padding_left_right;
		var w = this._line_width - ( 2 * a );
		var h =  this.height - (2*b);
		
		
		this.ctx.beginPath();
		this.ctx.moveTo(a,b);
		
		this.ctx.bezierCurveTo(a+(w/2), b, w-(w/2)+a, b, a+w, b );
		this.ctx.bezierCurveTo(a+w+a, b, a+a+w, b+h, a+w, b+h );
		this.ctx.bezierCurveTo( w/2+a, b+h, w/2+a,b+h, a, b+h);
		this.ctx.bezierCurveTo( 0, b+h, 0,b, a,b);
		
		this.ctx.closePath();
		this.ctx.strokeStyle = this.border_color;
		this.ctx.stroke();
		
	};
	this._draw_cursor = function(){
		var point_rad = (this.height - this.padding_top_bottom*2)/2;
		
	    this.ctx.save();
	    this.ctx.translate(this.value, this.height/2);
	    this.ctx.beginPath();
	    this.ctx.arc(0, 0, point_rad, 0, 2*Math.PI, 0);
	    this.ctx.closePath()
	    this.ctx.lineWidth = 2;
	    this.ctx.strokeStyle = this.cursor_color;
	    this.ctx.stroke();
	    this.ctx.restore();
	}
	this._draw_progress = function(){
		var val = this.progress_value;

		var x = this._get_x(val);
		var b = this.padding_top_bottom;
		var a = this.padding_left_right;
		var w = this._line_width - ( 2 * a );
		var h =  this.height - (2*b);
		var fs = Color(this.background_color).darken(0.4);
		if(val < 0){
			//console.log(">>", fs);
			
			fs = Color(this.below_z_color).darken(0.4);
			// console.log(">>", fs);
		
		}
		if(val >1){
			fs = Color(this.upper_1_color).darken(0.4);
			
		}
		
		this.ctx.save();
		this.ctx.beginPath();
		
		this.ctx.rect(0,0, x, this.height);
		this.ctx.clip();
		this.ctx.beginPath();
		this.ctx.bezierCurveTo(a+(w/2), b, w-(w/2)+a, b, a+w, b );
		this.ctx.bezierCurveTo(a+w+a, b, a+a+w, b+h, a+w, b+h );
		this.ctx.bezierCurveTo( w/2+a, b+h, w/2+a,b+h, a, b+h);
		this.ctx.bezierCurveTo( 0, b+h, 0,b, a,b);
		fs.alpha(0.9);
		this.ctx.fillStyle = fs.hslString();
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.restore();
		
	}
	this._draw_values = function(){
		var base_font_size = this.height - (this.padding_top_bottom*2) ;
		var add_font_size = Math.floor(base_font_size / 2);
		var base_marg = base_font_size *2;
		
		
		// Нарисовали процент
		this.ctx.save()
		this.ctx.translate(this._line_width+ this.padding_top_bottom,  this.height-this.padding_top_bottom);
		this.ctx.fillStyle = "#000";
		this.ctx.font = base_font_size + "pt Arial";
		//this.ctx.font = "italic 8pt Arial";
		
		var val = this._percent_value * 100
		var int = Math.floor(val);
		var frac = Math.floor((val - int)*100);
		this.ctx.textAlign = "end";
		this.ctx.fillText("" + (int), base_marg,0 )
		
		this.ctx.textAlign = "center";
		this.ctx.font = (base_font_size -2) + "pt Arial";
		
		this.ctx.fillText(",", base_marg+1,0 )
		
		this.ctx.font = add_font_size + "pt Arial";
		this.ctx.textAlign = "start";
		
		this.ctx.fillText("" + (frac), base_marg+3, 0 )
		
		
		this.ctx.restore();
		
		
		this.ctx.save()
		this.ctx.translate(this._line_width+ this.padding_top_bottom + (base_marg*1.1) + base_font_size, this.height-this.padding_top_bottom );
		this.ctx.fillStyle = "#000";
		this.ctx.font = base_font_size + "pt Arial";
		//this.ctx.font = "italic 8pt Arial";
		
		var val = this.progress_value * 100
		var int = Math.floor(val);
		var frac = Math.floor((val - int)*100);
		this.ctx.textAlign = "end";
		this.ctx.fillText("" + (int), base_marg,0 )
		
		this.ctx.textAlign = "center";
		this.ctx.font = (base_font_size -2) + "pt Arial";
		this.ctx.fillText(",", base_marg+1,0 )
		
		this.ctx.font = add_font_size + "pt Arial";
		this.ctx.textAlign = "start";
		
		this.ctx.fillText("" + (frac), base_marg+3, 0 )
		
		this.ctx.restore();
		
	
	}
	this._draw = function(){
		
		this._draw_border();
		this._draw_inner_bg();
		this._draw_progress();
		this._draw_cursor();
		this._draw_values();
		
		
	}
	this._clear = function(){
		this.ctx.clearRect(0,0,this.width, this.height);
	}
	this.redraw = function(){
		this._clear();
		this._draw()
	}
	
	this.set_value(0);
	this.redraw()
	
}