$(document).ready(function(){

	var user = {
		id : 500,
		score : 8
	}

	initChart("#chart");

	function initChart(chartID) {
		d3.json("data.json", function(err, data){
			initChartSVG("#chart", data);
			d3.select(window).on("resize", function(){
				updateChartSVG("#chart", data);
			});
		})
	}

	function initChartSVG(chartID, raw) {

		// -- Data structure
		var chart_title = "Where are you?";
		var cat_title 	= ["category1", "category2", "category3", "category4", "category5", "category6"];

		var data 		= [];
		var max 		= 0;
		for (i in raw.data) {
			data.push(raw.data[i]);
			if (max < raw.data[i]) {
				max = raw.data[i];
			}
		}

		var prev_index 	= Math.floor(user.score / 5);
		var next_index 	= Math.ceil(user.score / 5);
		var current_user_data = {
			x : user.score / 5,
			y : data[prev_index] + (data[next_index] - data[prev_index]) * (user.score/5 - prev_index)
		}

		//-- DOM structure
		$(chartID).empty();
		$(chartID).addClass("splice-area-chart");
		var margin 	= {top: 40, left: 40, bottom: 20, right: 40},
			_width 	= $(chartID).innerWidth(),
			_height = $(chartID).innerWidth() * 0.3,
			width 	= _width - margin.left - margin.right,
			height 	= _height - margin.top - margin.bottom;
		$(chartID).html(' \
			<div class="title">'+chart_title+'</div> \
			<div class="graph-body"> \
				<svg></svg> \
				<div class="tooltip1"> \
					<div>This is where you rank when</div> \
					<div> \
						Compared to \
						<select class="filterby"> \
							<option value="all">EVERYONE</option> \
							<option value="0">Filter1</option> \
							<option value="1">Filter2</option> \
							<option value="2">Filter3</option> \
						</select> \
					</div> \
					<div class="arrow-top"></div> \
				</div> \
				<div class="tooltip2"> \
				</div> \
			</div> \
		');

		//-- SVG structure
		var svg_container = d3.select(chartID + " svg")
			.attr("width", _width)
			.attr("height", _height);
		var svg = svg_container.append("g")
			.attr("class", "main-board")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//-- Axis
		var x = d3.scaleLinear()
			.rangeRound([0, width])
			.domain([0, 12]);
		var y = d3.scaleLinear()
			.rangeRound([height, 0])
			.domain([0, max]);
		var xAxis = d3.axisBottom(x)
			.tickSizeInner(-height)
			.tickSizeOuter(0);

		//-- clip path
		var area = d3.area()
		    .x(function(d, i) { return x(i) })
		    .y1(function(d) { return y(d) })
		    .y0(y(0))
		    .curve (d3.curveCardinal);
		var clip = svg.append("clipPath")
		    .attr("id", "clip")
		    .append("path")
		    .attr("class", "clip-area")
		    .datum(data)
      		.attr("d", area);

		//-- background
		svg.append("rect")
			.attr("class", "lower-back")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", x(current_user_data.x))
			.attr("height", height)
			.style("fill", "#48c1ae")
			.attr("clip-path", function(d,i) { return "url(#clip)"; });
		svg.append("rect")
			.attr("class", "higher-back")
			.attr("x", x(current_user_data.x))
			.attr("y", 0)
			.attr("width", width - x(current_user_data.x))
			.attr("height", height)
			.style("fill", "#2d9f85")
			.attr("clip-path", function(d,i) { return "url(#clip)"; });

      	//-- dotted vertical line
		var gxAxis = svg.append("g")
			.attr("class", "vertical-line")
			.attr("transform", "translate(0, "+height+")")
			.call(xAxis)
		gxAxis.select(".domain").remove();
		gxAxis.selectAll("text").remove();
		gxAxis.selectAll(".tick").style("opacity", function(d, i){ return (i%2)?0:1 })

		//-- Category title
		svg.append("g")
			.attr("class", "category-title")
			.selectAll("text")
			.data(cat_title)
			.enter().append("text")
			.text(function(d){ return d })
			.attr("x", function(d, i){ return x(i * 2 + 1) })
			.attr("y", -10);

		//-- Separator
		svg.append("line")
			.attr("class", "separator")
			.attr("x1", x(current_user_data.x))
			.attr("y1", 0)
			.attr("x2", x(current_user_data.x))
			.attr("y2", height)
			.attr("clip-path", function(d,i) { return "url(#clip)"; });

		//-- Font size
		var sTitle 		= 40;
		var sCategory 	= 20;
		var sTooltip 	= 20;

		if (_width < 1200) {
			sTitle = 36;
			sCategory = 16;
			sTooltip = 16;
		}
		if (_width < 1000) {
			sTitle = 34;
			sCategory = 16;
			sTooltip = 16;
		}
		if (_width < 800) {
			sTitle = 32;
			sCategory = 12;
			sTooltip = 12;
		}

		d3.select(chartID + " .title").style("font-size", sTitle+"px");
		d3.selectAll(chartID + " .category-title text").style("font-size", sCategory+"px");
		d3.select(chartID + " .tooltip1").style("font-size", sTooltip+"px");
		d3.select(chartID + " .tooltip1 .filterby").style("font-size", sTooltip+"px");
		d3.select(chartID + " .tooltip2").style("font-size", sTooltip+"px");

		//-- Tooltip

		var tip1   		= d3.select(chartID + " .tooltip1");
		var tip1_arr 	= d3.select(chartID + " .tooltip1 .arrow-top");
		var tip1_w 		= $(chartID + " .tooltip1").outerWidth();
		var separator_x = x(current_user_data.x);

		var tip1_x 		= (separator_x + tip1_w/2 < width + 30)?(separator_x - tip1_w/2):(width + 30 - tip1_w);
		var arr_x  		= (separator_x + tip1_w/2 < width + 30)?(tip1_w/2):(x(higher_data[0].x) - width - 30 + tip1_w);

		var tip1_x 		= (separator_x - tip1_w/2 > -30)?(separator_x - tip1_w/2):-30;
		var arr_x  		= (separator_x - tip1_w/2 > -30)?(tip1_w/2):(separator_x + 30);

		tip1.style("left", (margin.left + tip1_x) + "px")
			.style("top", (margin.top + height + 25) + "px");
		tip1_arr.style("left", (arr_x - 20) + "px");

		var tip2 = d3.select(chartID + " .tooltip2")
			.html(' \
				<div>' + raw.analysis.fact + '</div> \
				<div class="arrow-top"></div> \
			');
		var tip2_w = $(chartID + " .tooltip2").outerWidth();
		if (raw.analysis.stats.cases_less < raw.analysis.stats.cases_greater) {
			if (tip1_x + tip1_w + tip2_w + 10 < width + margin.right) {
				tip2.style("left", (margin.left + tip1_x + tip1_w + 5) + "px");
			} else {
				tip2.style("display", "none");
			}
		} else {
			if (tip1_x - 10 - tip2_w > -margin.left) {
				tip2.style("left", (margin.left + tip1_x - tip2_w - 5) + "px");
			} else {
				tip2.style("display", "none");
			}
		}
	}

	function updateChartSVG(chartID, raw) {

		// -- Data structure
		var chart_title = "Where are you?";
		var cat_title 	= ["category1", "category2", "category3", "category4", "category5", "category6"];

		var data 		= [];
		var max 		= 0;
		for (i in raw.data) {
			data.push(raw.data[i]);
			if (max < raw.data[i]) {
				max = raw.data[i];
			}
		}

		var prev_index 	= Math.floor(user.score / 5);
		var next_index 	= Math.ceil(user.score / 5);
		var current_user_data = {
			x : user.score / 5,
			y : data[prev_index] + (data[next_index] - data[prev_index]) * (user.score/5 - prev_index)
		}

		//-- DOM structure
		var margin 	= {top: 40, left: 40, bottom: 20, right: 40},
			_width 	= $(chartID).innerWidth(),
			_height = $(chartID).innerWidth() * 0.3,
			width 	= _width - margin.left - margin.right,
			height 	= _height - margin.top - margin.bottom;

		//-- SVG structure
		var svg_container = d3.select(chartID + " svg")
			.attr("width", _width)
			.attr("height", _height);
		var svg = svg_container.select(".main-board").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//-- Axis
		var x = d3.scaleLinear()
			.rangeRound([0, width])
			.domain([0, 12]);
		var y = d3.scaleLinear()
			.rangeRound([height, 0])
			.domain([0, max]);
		var xAxis = d3.axisBottom(x)
			.tickSizeInner(-height)
			.tickSizeOuter(0);

		//-- clip path
		var area = d3.area()
		    .x(function(d, i) { return x(i) })
		    .y1(function(d) { return y(d) })
		    .y0(y(0))
		    .curve (d3.curveBasis);
		var clip = svg.select(".clip-area")
		    .datum(data)
      		.attr("d", area);

      	//-- background
		svg.select(".lower-back")
			.attr("width", x(current_user_data.x))
			.attr("height", height)
			.attr("clip-path", function(d,i) { return "url(#clip)"; });
		svg.select(".higher-back")
			.attr("x", x(current_user_data.x))
			.attr("width", width - x(current_user_data.x))
			.attr("height", height)
			.attr("clip-path", function(d,i) { return "url(#clip)"; });

      	//-- dotted vertical line
		var gxAxis = svg.select(".vertical-line")
			.attr("transform", "translate(0, "+height+")")
			.call(xAxis)
		gxAxis.select(".domain").remove();
		gxAxis.selectAll("text").remove();
		gxAxis.selectAll(".tick").style("opacity", function(d, i){ return (i%2)?0:1 })

		//-- Category title
		svg.select(".category-title")
			.selectAll("text")
			.remove();
		svg.select(".category-title")
			.selectAll("text")
			.data(cat_title)
			.enter().append("text")
			.text(function(d){ return d })
			.attr("x", function(d, i){ return x(i * 2 + 1) })
			.attr("y", -10);

		//-- Separator
		svg.select(".separator")
			.attr("x1", x(current_user_data.x))
			.attr("x2", x(current_user_data.x))
			.attr("y2", height)
			.attr("clip-path", function(d,i) { return "url(#clip)"; });

		//-- Font size
		var sTitle 		= 40;
		var sCategory 	= 20;
		var sTooltip 	= 20;

		if (_width < 1200) {
			sTitle = 36;
			sCategory = 16;
			sTooltip = 16;
		}
		if (_width < 1000) {
			sTitle = 34;
			sCategory = 16;
			sTooltip = 16;
		}
		if (_width < 800) {
			sTitle = 32;
			sCategory = 12;
			sTooltip = 12;
		}

		d3.select(chartID + " .title").style("font-size", sTitle+"px");
		d3.selectAll(chartID + " .category-title text").style("font-size", sCategory+"px");
		d3.select(chartID + " .tooltip1").style("font-size", sTooltip+"px");
		d3.select(chartID + " .tooltip1 .filterby").style("font-size", sTooltip+"px");
		d3.select(chartID + " .tooltip2").style("font-size", sTooltip+"px");

		var tip1   		= d3.select(chartID + " .tooltip1");
		var tip1_arr 	= d3.select(chartID + " .tooltip1 .arrow-top");
		var tip1_w 		= $(chartID + " .tooltip1").outerWidth();
		var separator_x = x(current_user_data.x);

		var tip1_x 		= (separator_x + tip1_w/2 < width + 30)?(separator_x - tip1_w/2):(width + 30 - tip1_w);
		var arr_x  		= (separator_x + tip1_w/2 < width + 30)?(tip1_w/2):(x(higher_data[0].x) - width - 30 + tip1_w);

		var tip1_x 		= (separator_x - tip1_w/2 > -30)?(separator_x - tip1_w/2):-30;
		var arr_x  		= (separator_x - tip1_w/2 > -30)?(tip1_w/2):(separator_x + 30);

		tip1.style("left", (margin.left + tip1_x) + "px").style("top", (margin.top + height + 25) + "px");
		tip1_arr.style("left", (arr_x - 20) + "px");

		var tip2  = d3.select(chartID + " .tooltip2")
			.style("display", "unset")
			.html(' \
				<div>' + raw.analysis.fact + '</div> \
				<div class="arrow-top"></div> \
			');
		var tip2_w = $(chartID + " .tooltip2").outerWidth();
		if (raw.analysis.stats.cases_less < raw.analysis.stats.cases_greater) {
			if (tip1_x + tip1_w + tip2_w + 10 < width + margin.right) {
				tip2.style("left", (margin.left + tip1_x + tip1_w + 5) + "px");
			} else {
				tip2.style("display", "none");
			}
		} else {
			if (tip1_x - 10 - tip2_w > -margin.left) {
				tip2.style("left", (margin.left + tip1_x - tip2_w - 5) + "px");
			} else {
				tip2.style("display", "none");
			}
		}
	}
});