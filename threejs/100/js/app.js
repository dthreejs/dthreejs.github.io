//-------------- Local variables ----------------------
var selected_logo = -1;
var movable_logo  = -1;
var selected_tab  = -1;
var selected_back = false;
var prev_angle = 0;
var prev_mp = 0;
var prev_cx = 0;
//-------------- Local functions ----------------------
window.onload = function (){
	App.init ();
	App.update ();
};
function check_overlap(list,item){
	var res = true;
	$.each(list, function(key, value){
		var x1 = value.bpx;
		var y1 = value.bpy;
		var w1 = value.bcx;
		var h1 = value.bcy;
		var x2 = item.bpx;
		var y2 = item.bpy;
		var w2 = item.bcx;
		var h2 = item.bcy;
		var xMin = Math.max( x1, x2 ),
        	yMin = Math.max( y1, y2 ),
        	xMax = Math.min( x1+w1, x2+w2 ),
        	yMax = Math.min( y1+h1, y2+h2 );
		if ( xMin >= xMax || yMin >= yMax ) {
    	}else{
    		res = false;
    	}
	});
	return res;
}
function check_overlap2(list, index){
	var res = true;
	item = list[index];
	$.each(list, function(key, value){
		if(key != index){
			var x1 = value.bpx;
			var y1 = value.bpy;
			var w1 = value.bcx;
			var h1 = value.bcy;
			var x2 = item.bpx;
			var y2 = item.bpy;
			var w2 = item.bcx;
			var h2 = item.bcy;
			var xMin = Math.max( x1, x2 ),
	        	yMin = Math.max( y1, y2 ),
	        	xMax = Math.min( x1+w1, x2+w2 ),
	        	yMax = Math.min( y1+h1, y2+h2 );
			if ( xMin >= xMax || yMin >= yMax ) {
	    	}else{
	    		res = false;
	    	}
		}
	});
	return res;
}
function is_logo_selected(list, x, y){
	var i = -1;
	$.each(list, function(key, value){
		var x1 = value.px;
		var y1 = value.py;
		var w1 = value.cx;
		var h1 = value.cy;
		var xMin = Math.max( x1, x ),
        	xMax = Math.min( x, x1+w1),
        	yMin = Math.max( y1, y ),
        	yMax = Math.min( y, y1+h1);
        if(xMin == xMax && yMin == yMax){
        	i = key;
        }
	});
	return i;
}
function is_tab_selected(list, x, y){
	var i = -1;
	$.each(list, function(key, value){
		var x1 = value.px;
		var y1 = value.py;
		var w1 = 32;
		var h1 = 32;
		var xMin = Math.max( x1, x ),
        	xMax = Math.min( x, x1+w1),
        	yMin = Math.max( y1, y ),
        	yMax = Math.min( y, y1+h1);
        if(xMin == xMax && yMin == yMax){
        	i = key;
        }
	});
	return i;
}
function rotate_logo(index, angle){
	var res = App.rotatelogo(index,angle);
	return res;
}
function resize_logo(index, value){
	var size = App.resizelogo(index,value);
	return size;
}
function set_ctl_info(info){
	$("#ctl_index").html(info.index);
	$("#size_x").html(info.cx);
	$("#size_y").html(info.cy);
	$("#ctl_img").attr("src",info.url);
	$("#logo-angle").val(info.angle);
	$("#logo-size").val(info.rate);
}
function set_ctl_info2(item){
	$("#size_x").html(item.cx);
	$("#size_y").html(item.cy);
	$("#logo-angle").val(item.angle);
	$("#logo-size").val(item.rate);	
}
function reset_border(item){
	var x = item.px;
	var y = item.py;
	var w = item.cx;
	var h = item.cy;
	var o = Math.PI * item.angle/180;
	var nw = Math.abs(w * Math.cos(o)) + Math.abs(h * Math.sin(o))
	var nh = Math.abs(w * Math.sin(o)) + Math.abs(h * Math.cos(o))
	var nx = x - (nw - w)/2;
	var ny = y - (nh - h)/2;
	item.bpx = nx;
	item.bpy = ny;
	item.bcx = nw;
	item.bcy = nh;
}
function reset_size(item, rate){
	item.cx = parseInt(item.cbx * rate / 100);
	item.cy = parseInt(item.cby * rate / 100);
	item.rate = rate;
}
//-------------- Canvas Functions ---------------------
var App = function () {};
App.init = function (){
	this.window = window;
	// this.width = this.window.innerWidth;
	// this.height = this.window.innerHeight;
	this.width = 710;
	this.height = 600;

	this.inputDown = false;
	this.mouseX = 0;
	this.mouseY = 0;
	this.oldMX = 0;
	this.oldMY = 0;

	//this.canvas = document.createElement ('canvas');
	this.canvas = document.getElementById ('texture-canvas');
	this.canvas.width = 512;
	this.canvas.height = 512;
	this.ctx = this.canvas.getContext ('2d');
	this.texture = new THREE.Texture();
	this.object = null;

	this.scene = new THREE.Scene ();
	this.scene.add (new THREE.AmbientLight (0xFFFFFF));

	this.camera = new THREE.PerspectiveCamera (45, this.width / this.height, 1, 1000);
	this.camera.position.z = -200;
	this.camera.lookAt (this.scene.position);

	this.renderer = new THREE.WebGLRenderer ();
	this.renderer.setClearColor (new THREE.Color (0xFFFFFF, 1.0));
	this.renderer.setSize (this.width, this.height);

	this.container = document.getElementById ('container');
	var canvas = this.container.appendChild (this.renderer.domElement);
	this.top  = canvas.getBoundingClientRect().top;
	this.left = canvas.getBoundingClientRect().left;
	this.raycaster = new THREE.Raycaster();
	this.raycaster.near = 0;
	this.raycaster.far = 1000;

	this.window.addEventListener ('resize', this.onWindowResize.bind(this), false);
	this.container.addEventListener ('mousemove', this.onMouseMove.bind(this), false);
	this.container.addEventListener ('mousedown', this.onMouseDown.bind(this), false);
	this.container.addEventListener ('mouseup', this.onMouseUp.bind(this), false);

	this.logo = [];
	this.tabs = [];
	this.loadBackground();
	this.loadTabs();
};
App.loadBackground = function(){
	this.loadManager = new THREE.LoadingManager ();
	this.imageLoader = new THREE.ImageLoader (this.loadManager);
	this.imageLoader.load ('img/checker.jpg', function (image)
	{
		this.background = image;
		//this.texture.image = image;
		//this.texture.needsUpdate = true;
	}
	.bind(this));
	this.meshLoader = new THREE.OBJLoader (this.loadManager);
	this.meshLoader.load ('test.obj', function (object)
	{
		this.object = object
		this.object.rotateOnAxis (new THREE.Vector3 (0, 0, 1), Math.PI);
		this.object.traverse (function (child)
		{
			if (child instanceof THREE.Mesh)
			{
				child.material.map = this.texture;
			}
		}
		.bind(this));

		this.scene.add (this.object);
	}
	.bind (this));
}
App.loadTabs = function(){
	this.loadManager = new THREE.LoadingManager ();
	this.imageLoader = new THREE.ImageLoader (this.loadManager);
	this.imageLoader.load ('img/resize.png', function (image)
	{
		var ctl = new Object;
		ctl.src = image;
		this.tabs[0] = ctl;
	}
	.bind(this));
	this.imageLoader.load ('img/pin.png', function (image)
	{
		var ctl = new Object;
		ctl.src = image;
		this.tabs[1] = ctl;
	}
	.bind(this));
	this.imageLoader.load ('img/rotate.png', function (image)
	{
		var ctl = new Object;
		ctl.src = image;
		this.tabs[2] = ctl;
	}
	.bind(this));
}
App.addlogo = function (url, px, py, cx, cy){
	this.loadManager = new THREE.LoadingManager ();
	this.imageLoader = new THREE.ImageLoader (this.loadManager);
	this.imageLoader.load (url, function (image)
	{
		var new_logo = new Object;
		new_logo.src = image;
		new_logo.cx = cx;
		new_logo.cy = cy;
		new_logo.px = px - this.left - 220;
		new_logo.py = py - this.top - 178;

		new_logo.cbx = cx;
		new_logo.cby = cy;
		new_logo.ppx = new_logo.px;
		new_logo.ppy = new_logo.py;

		new_logo.bpx = new_logo.px;
		new_logo.bpy = new_logo.py;
		new_logo.bcx = cx;
		new_logo.bcy = cy;

		new_logo.angle  = 0;
		new_logo.rate   = 100;
		if(Math.max(cx, cy) > 250){
			var new_rate = parseInt(25000 / Math.max(cx,cy));
			reset_size(new_logo, new_rate);
			reset_border(new_logo);
		}
		new_logo.locked = false;

		var res = check_overlap(this.logo,new_logo);
		if(res){
			this.logo.push(new_logo);
		}else{
			alert("Logos can't overlapp! Please try again");
		}
	}
	.bind(this));
}
App.rotatelogo = function(index, angle){
	var item = this.logo[index];
	var _angle = item.angle;
	item.angle = angle;
	reset_border(item);
	if(check_overlap2(this.logo, index)){
		var info = new Object;
		info.success = true;
		return info;
	}else{
		item.angle = _angle;
		reset_border(item);
		var info = new Object;
		info.success = false;
		info.angle = _angle;
		return info;
	}
}
App.resizelogo = function(index, value){
	var item = this.logo[index];
	var _rate = item.rate;
	reset_size(item, value);
	reset_border(item);
	if(check_overlap2(this.logo,index)){
		var info = new Object;
		info.success = true;
		info.x = item.cx;
		info.y = item.cy;
		return info;
	}else{
		reset_size(item, _rate);
		reset_border(item);
		var info = new Object;
		info.success = false;
		info.rate = _rate;
		return info;
	}
}
App.update = function (){
	this.window.requestAnimationFrame (this.update.bind(this));

	if (this.background && this.logo)
	{
		var ctx = this.ctx;
		ctx.drawImage (this.background, 0, 0);
		var tabs = this.tabs;
		$.each(this.logo, function(key, value){
			ctx.save();
			ctx.translate(value.px + value.cx/2, value.py + value.cy/2);
			ctx.rotate(Math.PI * value.angle/180);
			ctx.drawImage (value.src, -value.cx/2, -value.cy/2, value.cx, value.cy);
			ctx.restore();
			if(key == selected_logo){
				ctx.strokeRect(value.bpx, value.bpy, value.bcx, value.bcy);
				var x = value.bpx + value.bcx;
				var y = value.bpy + value.bcy - 32;
				var locked = value.locked;
				$.each(tabs, function(key, tab){
					if(locked){
						if(key == 1){
							tab.px = x;
							tab.py = y - 32 * key;
							ctx.drawImage (tab.src, tab.px, tab.py, 32, 32)
						}
					}else{
						tab.px = x;
						tab.py = y - 32 * key;
						ctx.drawImage (tab.src, tab.px, tab.py, 32, 32)
					}
				});
			}
		});
	}

	this.texture.image = this.canvas;
	this.texture.needsUpdate = true;
	this.renderer.render (this.scene, this.camera);
};
App.onWindowResize = function (){
	// this.width = this.window.innerWidth;
	// this.height = this.window.innerHeight;
	this.width = 710;
	this.height = 600;

	this.camera.aspect = this.width / this.height;
	this.camera.updateProjectionMatrix ();

	this.renderer.setSize (this.width, this.height);
};
App.onMouseDown = function (event){
	var point = new THREE.Vector2 (2 * this.mouseX / this.width - 1, 1 - 2 * this.mouseY / this.height);
	this.raycaster.setFromCamera (point, this.camera);
	var intersects = this.raycaster.intersectObjects (this.scene.children, true);
	if($.isEmptyObject(intersects)){
		selected_back = true;
	}else{
		var x = intersects[0].uv.x * 512,
			y = (1 - intersects[0].uv.y) * 512;
		var res = is_logo_selected(this.logo, x, y);
		if(res > -1){
			selected_logo = res;
			movable_logo  = res;
			this.logo[res].ppx = this.logo[res].px;
			this.logo[res].ppy = this.logo[res].py;
			var info = new Object;
			info.index  = res;
			info.cx     = this.logo[res].cx;
			info.cy     = this.logo[res].cy;
			info.url    = this.logo[res].src.currentSrc;
			info.rate   = this.logo[res].rate;
			info.angle  = this.logo[res].angle;
			set_ctl_info(info);
			if(this.logo[res].locked){
				selected_back = true;
			}
		}else{
			var res = is_tab_selected(this.tabs, x, y);
			if(res > -1){
				if(res == 1){
					this.logo[selected_logo].locked = !this.logo[selected_logo].locked;
				}
				selected_tab  = res;
				selected_back = false;
				movable_logo  = -1;
				prev_angle = this.logo[selected_logo].angle;
				prev_cx = this.logo[selected_logo].cx;
				prev_mp = x;
			}else{
				selected_back = true;
				selected_logo = -1;
				movable_logo  = -1;
			}
		}	
	}
};
App.onMouseMove = function (event){
	event.preventDefault ();

	this.oldMX = this.mouseX;
	this.oldMY = this.mouseY;
	this.mouseX = event.offsetX;
	this.mouseY = event.offsetY;
	
	var point = new THREE.Vector2 (2 * this.mouseX / this.width - 1, 1 - 2 * this.mouseY / this.height);
	this.raycaster.setFromCamera (point, this.camera);
	var intersects = this.raycaster.intersectObjects (this.scene.children, true);
	if(movable_logo > -1){
		if (intersects.length){
			var i = movable_logo;
			if(!this.logo[i].locked){
				this.logo[i].px = intersects[0].uv.x * 512 - this.logo[i].cx/2;
				this.logo[i].py = (1 - intersects[0].uv.y) * 512 - this.logo[i].cy/2;
				reset_border(this.logo[i]);
			}
		}
	}
	if(selected_back){
		var dx = this.mouseX - this.oldMX;
		var dy = this.mouseY - this.oldMY;
		var dir = this.camera.position;
		dir.applyAxisAngle (new THREE.Vector3 (0, 1, 0), -0.005 * dx);
		this.camera.position = dir;
		this.camera.lookAt (this.scene.position);
	}
	if(selected_tab > -1){
		if(!this.logo[selected_logo].locked){
			switch(selected_tab){
			case 0:
				var x = intersects[0].uv.x * 512,
					y = (1 - intersects[0].uv.y) * 512;
				var item = this.logo[selected_logo];
				var scale = parseInt(100 * (x - prev_mp + prev_cx)/item.cbx);
				resize_logo(selected_logo, scale);
				set_ctl_info2(item);
				break;
			case 2:
				var x = intersects[0].uv.x * 512,
					y = (1 - intersects[0].uv.y) * 512;
				var item = this.logo[selected_logo];
				var offset = parseInt(x - prev_mp);
				var angle = parseInt(prev_angle) + offset;
				if(angle < 181 && angle > -180){
					rotate_logo(selected_logo, angle);
					set_ctl_info2(item);
				}
				break;
			}
		}
	}
};
App.onMouseUp = function (){
	if(movable_logo > -1){
		var i = movable_logo;
		var res = check_overlap2(this.logo,i);
		if(res){
			this.logo[i].ppx = this.logo[i].ppx;
			this.logo[i].ppy = this.logo[i].ppy;
		}else{
			this.logo[i].px = this.logo[i].ppx;
			this.logo[i].py = this.logo[i].ppy;
		}
		reset_border(this.logo[i]);
	}
	movable_logo = -1;
	selected_tab = -1;
	selected_back = false;
};
