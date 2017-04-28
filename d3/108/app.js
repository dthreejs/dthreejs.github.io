$(document).ready(function(){

	initChart(".category-bar");

	function initChart(barClass, server) {
		d3.json("data.json", function(err, data){
			drawBarAll(barClass, data);
		})
	}

	function drawBarAll(barClass, data) {
		drawBar(barClass + "-0", data[0], 0);
		drawBar(barClass + "-1", data[1], 1);
		drawBar(barClass + "-2", data[2], 1);
		drawBar(barClass + "-3", data[3], 1);
		drawBar(barClass + "-4", data[4], 1);
		drawBar(barClass + "-5", data[5], 2);

		d3.select(window).on("resize", function(){
			drawBar(barClass + "-0", data[0], 0);
			drawBar(barClass + "-1", data[1], 1);
			drawBar(barClass + "-2", data[2], 1);
			drawBar(barClass + "-3", data[3], 1);
			drawBar(barClass + "-4", data[4], 1);
			drawBar(barClass + "-5", data[5], 2);
		});
	}

	function drawBar(barClass, data, tooltip_position) {

		/*
			:tooltip_position

			0 - left
			1 - middle
			2 - right
		*/

		//-- DOM structure
		$(barClass).empty();
		var bubbletip = d3.select(barClass).append("div").attr("class", "bubble-tooltip");
		var marginTop = 50,
			_width 	= $(barClass).innerWidth(),
			_height = $(barClass).innerHeight(),
			width 	= _width,
			height 	= _height - marginTop;

		//-- SVG structure
		var svg_container = d3.select(barClass)
			.append("svg")
			.attr("width", _width)
			.attr("height", _height);
		var svg = svg_container.append("g")
			.attr("transform", "translate(0, " + marginTop + ")");

      	//-- Bar React
      	svg.append("rect")
      		.attr("x", width * 0.2)
      		.attr("y", 0)
      		.attr("width", width * 0.6)
      		.attr("height", height)
      		.style("fill", "none")
      		.style("stroke", "white")
      		.style("stroke-dasharray", "4,4")
      		.style("opacity", 0.6);
      	svg.append("rect")
      		.attr("x", width * 0.2 - 1)
      		.attr("y", height - height * data.value -1)
      		.attr("width", width * 0.6 + 2)
      		.attr("height", height * data.value)
      		.style("fill", "#5563AA");

      	//-- Bottom line
      	svg.append("line")
      		.attr("x1", 0)
      		.attr("x2", width)
      		.attr("y1", height)
      		.attr("y2", height)
      		.style("stroke", "#5563AA")
      		.style("stroke-width", 2);

      	//-- Bubble tip
      	if (data.show_alert) {
      		if (data.alert_type == 1) {
      			bubbletip.html('<i class="fa fa-check" aria-hidden="true"></i><div class="arrow-down tip1"></div>')
      				.style("top", (height - height * data.value -1) + "px")
      				.style("background-color", "#becc42")
      				.on("mouseenter", function(){
      					var tooltip = d3.select(barClass)
      						.append("div")
      						.attr("class", "bar-tooltip")
      						.html(data.alert_text)
      						.style("background-color", "#becc42");

      					var tooltip_w = $(".bar-tooltip").outerWidth(),
      						tooltip_h = $(".bar-tooltip").outerHeight();

						tooltip.style("top", (height - height * data.value - tooltip_h - 20) + "px")
							.style("left", function(){
								switch(tooltip_position) {
									case 0:
										return "0px";
										break;
									case 1:
										return "calc(50% - " + tooltip_w/2 +"px)"
										break;
									case 2:
										return "calc(100% - " + tooltip_w +"px)"
										break;
								}
							});
							
      				})
      				.on("mouseout", function(){
      					$(".bar-tooltip").remove();
      				});
      		} else {
      			bubbletip.html('!<div class="arrow-down tip2"></div>')
      				.style("top", (height - height * data.value -1) + "px")
      				.style("background-color", "#cd5d2d")
      				.on("mouseenter", function(){
      					var tooltip = d3.select(barClass)
      						.append("div")
      						.attr("class", "bar-tooltip")
      						.html(data.alert_text)
      						.style("background-color", "#cd5d2d");

      					var tooltip_w = $(".bar-tooltip").outerWidth(),
      						tooltip_h = $(".bar-tooltip").outerHeight();

						tooltip.style("top", (height - height * data.value - tooltip_h - 20) + "px")
							.style("left", function(){
								switch(tooltip_position) {
									case 0:
										return "0px"
										break;
									case 1:
										return "calc(50% - " + tooltip_w/2 +"px)"
										break;
									case 2:
										return "calc(100% - " + tooltip_w +"px)"
										break;
								}
							});
      				})
      				.on("mouseout", function(){
      					$(".bar-tooltip").remove();
      				});
      		}
      	} else {
      		bubbletip.style("display", "none");
      	}
	}
});