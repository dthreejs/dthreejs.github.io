$(document).ready(function(){

	var graph_state = {
		"deployment_graph" : {},
		"heatmap_graph" : {},
		"geomap_graph" : {
			zoom : 1
		},
		"device_graph" : {},
		"dataSrc" : 1,
		"filterby" : ""
	}

	init();

	function init() {
		d3.json("common/data/data1.json", function(err, data){
			initHeatmap(data.heatmap);
			initDeploymentGraph(data.deployment);
			initGeoMap(data.geomap);
			initDeviceGraph(data.device);
		})
	}

	function update() {
		if (graph_state.dataSrc == 1) {
			graph_state.dataSrc = 2;
			d3.json("common/data/data"+graph_state.dataSrc+".json", function(err, data){
				if (graph_state.filterby != "heatmap") {
					updateHeatmap(data.heatmap);
				}
				if (graph_state.filterby != "deployment") {
					updateDeploymentGraph(data.deployment);
				}
				if (graph_state.filterby != "geomap") {
					updateGeoMap(data.geomap);
				}
				if (graph_state.filterby != "device") {
					updateDeviceGraph(data.device);
				}
			});
		} else {
			graph_state.dataSrc = 1;
			d3.json("common/data/data"+graph_state.dataSrc+".json", function(err, data){
				if (graph_state.filterby != "heatmap") {
					updateHeatmap(data.heatmap);
				}
				if (graph_state.filterby != "deployment") {
					updateDeploymentGraph(data.deployment);
				}
				if (graph_state.filterby != "geomap") {
					updateGeoMap(data.geomap);
				}
				if (graph_state.filterby != "device") {
					updateDeviceGraph(data.device);
				}
			});
		}
	}

	// Init Graph

	function initDeploymentGraph(data) {

		$("#deployment-graph").empty();

		var margin = {top: 30, left: 50, bottom: 100, right: 20},
			_width = $("#deployment-graph").innerWidth(),
			_height =  $("#heatmap-graph").innerHeight(),
			width = _width - margin.left - margin.right,
			height = _height - margin.top - margin.bottom;

		var svg_container = d3.select("#deployment-graph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		var svg = svg_container.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Axis Format
		var x = d3.scaleBand()
			.rangeRound([0, width])
			.padding(0.3)
			.domain(data.map(function(d) { return d.collectortype }));
		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(data, function(d) { return d.value })]).nice();

		var xAxis = d3.axisBottom()
			.scale(x)
			.tickSizeInner(-height)
			.tickSizeOuter(0);
		var yAxis = d3.axisLeft()
			.scale(y)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
			.ticks(4);

		var xaxis_g = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		xaxis_g.selectAll('.tick')
			.append("circle")
			.attr("cy", 15)
			.attr("r", 1.5);
		xaxis_g.selectAll('text').attr("transform", "translate(0, 20)rotate(35)");
		var yaxis_g = svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		yaxis_g.selectAll('.tick')
			.append("circle")
			.attr("cx", -10)
			.attr("r", 1.5);
		yaxis_g.selectAll('text').attr("x", -20);

		// Bars
		var bars = svg.append("g")
			.attr("class", "bars")
			.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.collectortype) })
			.attr("y", function(d) { return y(d.value) })
			.attr("width", x.bandwidth())
			.attr("height", function(d) { return height - y(d.value) })
			.on("mouseenter", function(d, i) {
				var pos = $("#deployment-graph svg .bars").position();
				var tooltip  = d3.select("#deployment-graph").append("div").attr("class", "tooltip hidden");
				tooltip.classed("hidden", false)
					.style("left", (pos.left + x(d.collectortype)) + "px")
					.style("top", (pos.top + y(d.value) - 40) + "px")
					.html(d.value)
					.transition()
					.style("opacity", 0)
					.delay(300)
					.duration(300)
					.style("opacity", 1);
			})
			.on("mouseout",  function(d,i) {
				$("#deployment-graph .tooltip").remove();
			})
			.on("click", function(){
				d3.selectAll("#deployment-graph svg .bars .bar").attr("class", "bar");
				d3.select(this).attr("class", "bar selected");
				deploymentFilter();
			});

		graph_state.deployment_graph["svg_container"] = svg_container;
		graph_state.deployment_graph["svg"] = svg;	
	}

	function initHeatmap(data) {

		// data regen
		var cardData = [];
		data.forEach(function(d, i){
			var day = i;
			d.data.forEach(function(d, i){
				cardData.push({
					day : day,
					hour : i,
					value : d.value
				})
			})
		});
		var formatDay = d3.timeFormat("%a, %m/%d");

		$("#heatmap-graph").empty();

		var margin 	= { top: 50, left: 100,  bottom: 10, right: 10},
			_width 	= $("#heatmap-graph").innerWidth(),
			width 	= _width - margin.left - margin.right,
			grid_s 	= width / 24,
			_height = grid_s * 9 + margin.top + margin.bottom,
			height 	= _height - margin.top - margin.bottom,
			colors 	= ["#ECE6F1","#CEBEE1","#CDBEDE","#A489C0","#845BAE","#724999","#654385","#5E3C7C","#2E1F3D"],
			buckets = 9,
			lg_w 	= width / buckets,
			times 	= ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
			days 	= data.map(function(x){ return x.day });
			
		var svg_container = d3.select("#heatmap-graph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		var svg = svg_container.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dayLabels = svg.append("g")
			.attr("class", "day-labels")
			.selectAll(".dayLabel")
			.data(days)
			.enter().append("g")
			.attr("class", "dayLabel")
			.attr("transform", function(d, i){
				return  "translate(0," + (i * grid_s) + ")"
			});
		dayLabels.append("text")
			.text(function (d) {
				return formatDay(new Date(d))
			})
			.style("text-anchor", "end")
			.attr("x", -20)
			.attr("y", 20);
		dayLabels.append("circle")
			.attr("r", 2)
			.attr("cx", -10)
			.attr("cy", grid_s/2);

		var timeLabels = svg.append("g")
			.attr("class", "time-labels")
			.selectAll(".timeLabel")
			.data(times)
			.enter().append("g")
			.attr("class", "timeLabel")
			.attr("transform", function(d, i){
				return  "translate(" + i * grid_s + ", 0)"
			})
		timeLabels.append("text")
			.text(function(d) { return d })
			.attr("x", grid_s/2)
			.attr("y", -15)
			.style("text-anchor", "middle")
		timeLabels.append("circle")
			.attr("r", 2)
			.attr("cx", grid_s/2)
			.attr("cy", -5);

		var colorScale = d3.scaleQuantile()
			.domain([0, buckets - 1, d3.max(data, function (d) { return d3.max(d.data, function(d){ return d.value }) })])
			.range(colors);

		var cards = svg.append("g")
			.attr("class", "cards")
			.selectAll(".hour")
			.data(cardData, function(d) { return d.day+':'+d.hour })
			.enter().append("rect")
			.attr("class", "hour")
			.attr("x", function(d) { return d.hour * grid_s })
			.attr("y", function(d) { return d.day * grid_s })
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("class", "hour bordered")
			.attr("width", grid_s-1)
			.attr("height", grid_s-1)
			.style("fill", colors[0])
			.on("click",heatmapFilter)
			.on("mouseenter", function(d, i) {
				var pos = $("#heatmap-graph svg .cards").position();
				var tooltip = d3.select("#heatmap-graph").append("div").attr("class", "tooltip hidden");
				tooltip.classed("hidden", false)
					.style("left", (margin.left + d.hour * grid_s + grid_s * 0.5) + "px")
					.style("top", (margin.top + d.day * grid_s - grid_s * 0.5 - 10) + "px")
					.html(d.value)
					.transition()
					.style("opacity", 0)
					.delay(300)
					.duration(300)
					.style("opacity", 1);
			})
			.on("mouseout",  function(d,i) {
				$("#heatmap-graph .tooltip").remove();
			})
			.transition().duration(1000)
			.style("fill", function(d) { return colorScale(d.value) })
			
		var legend = svg_container.append("g")
			.attr("class", "legends")
			.attr("transform", "translate(" + margin.left + ", " + (_height - 50) + ")")
			.selectAll(".legend")
			.data([0].concat(colorScale.quantiles()), function(d) { return d })
			.enter().append("g")
			.attr("class", "legend");

		legend.append("rect")
			.attr("x", function(d, i) { return lg_w * i; })
			.attr("width", lg_w)
			.attr("height", grid_s / 2)
			.style("fill", function(d, i) { return colors[i] });

		legend.append("text")
			.attr("class", "mono")
			.text(function(d) { return "≥ " + d.toFixed(1) })
			.attr("x", function(d, i) { return lg_w * i })
			.attr("y", grid_s);

		legend.exit().remove();

		graph_state.heatmap_graph["svg_container"] = svg_container;
		graph_state.heatmap_graph["svg"] = svg;
	}

	function initGeoMap(data) {

		drawWorldMap(data);

		d3.select(window).on("resize", function(){
			drawWorldMap(data);
		})
	}

	function initDeviceGraph(data) {
		var total = 0;
		data.forEach(function(d){
			total += d.value;
		})
		data.forEach(function(d){
			d.percent = parseFloat((100 * d.value / total).toFixed(0)).toString();
		});

		$("#device-graph").empty();

		var margin 	= {top: 20, right: 20, bottom: 20, left: 20},
			_width 	= $("#device-graph").innerWidth(),
			_height = _width,
			width 	= _width - margin.left - margin.right,
			height 	= _height - margin.top - margin.bottom;

		var c20 = d3.scaleOrdinal(d3.schemeCategory20);

		var svg_container = d3.select("#device-graph")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		var svg = svg_container.append("g").attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + width/2) + ")");

		var pie = d3.pie().sort(null).value(function(d) { return d.value });
					
		var arc = d3.arc()
			.outerRadius(width/2)
			.innerRadius(0);
		var arcOver = d3.arc()
			.outerRadius(width/2 + 10)
			.innerRadius(0);
		var arcText = d3.arc()
			.outerRadius(width)
			.innerRadius(0);

		var arcs = svg.append("g")
			.attr("class", "arcs")
			.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");
		arcs.append("path")
			.attr("d", arc)
			.style("fill", function(d, i) { return c20(i) })
			.on("mouseenter", function(d, i){

				var html = '<div>'+d.data.device+'</div><div>'+d.data.percent+'%</div>';

				var tooltip = d3.select("#device-graph").append("div").attr("class", "tooltip hidden");

				var cx = width/2 + arcText.centroid(d)[0];
				var cy = width/2 + arcText.centroid(d)[1];
				tooltip.classed("hidden", false)
					.style("left", cx+"px")
					.style("top", cy+"px")
					.html(html)
					.style("opacity", 0)
					.transition()
					.delay(300)
					.duration(300)
					.style("opacity", 1);
				d3.select(this)
					.transition()
					.duration(300)
					.attr("d", arcOver)
			})
			.on("mouseout", function(d, i){
				$("#device-graph .tooltip").remove();
				d3.select(this)
					.transition()
					.duration(300)
					.attr("d", arc)
			})
			.on("click", deviceFilter);

		graph_state.device_graph["svg_container"] = svg_container;
		graph_state.device_graph["svg"] = svg;
	}

	// Update Graph

	function updateDeploymentGraph(data) {

		var svg_container = graph_state.deployment_graph.svg_container;
		var svg = graph_state.deployment_graph.svg;

		var margin = {top: 30, left: 50, bottom: 100, right: 20},
			_width = $("#deployment-graph").innerWidth(),
			_height =  $("#heatmap-graph").innerHeight(),
			width = _width - margin.left - margin.right,
			height = _height - margin.top - margin.bottom;

		// svg_container.attr("width", width + margin.left + margin.right)
		// 	.attr("height", height + margin.top + margin.bottom);
		// svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Axis Format
		var x = d3.scaleBand()
			.rangeRound([0, width])
			.padding(0.3)
			.domain(data.map(function(d) { return d.collectortype }));
		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(data, function(d) { return d.value })]).nice();
		var xAxis = d3.axisBottom()
			.scale(x)
			.tickSizeInner(-height)
			.tickSizeOuter(0);
		var yAxis = d3.axisLeft()
			.scale(y)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
			.ticks(4);

		var xaxis_g = svg.select("g.x.axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		xaxis_g.selectAll("circle").remove();
		xaxis_g.selectAll('.tick')
			.append("circle")
			.attr("cy", 15)
			.attr("r", 1.5);
		xaxis_g.selectAll('text').attr("transform", "translate(0, 20)rotate(35)");
		var yaxis_g = svg.select("g.y.axis")
			.call(yAxis);
		yaxis_g.selectAll('circle').remove();
		yaxis_g.selectAll('.tick')
			.append("circle")
			.attr("cx", -10)
			.attr("r", 1.5);
		yaxis_g.selectAll('text').attr("x", -20);

		// Bars
		var bars = svg.select("g.bars")
			.selectAll(".bar")
			.data(data)
			.on("mouseenter", function(d, i) {
				var pos = $("#deployment-graph svg .bars").position();
				var tooltip = d3.select("#deployment-graph").append("div").attr("class", "tooltip hidden");
				tooltip.classed("hidden", false)
					.style("left", (pos.left + x(d.collectortype)) + "px")
					.style("top", (pos.top + y(d.value) - 40) + "px")
					.html(d.value)
					.style("opacity", 0)
					.transition()
					.delay(300)
					.duration(300)
					.style("opacity", 1);
			})
			.on("mouseout",  function(d,i) {
				$("#deployment-graph .tooltip").remove();
			})
			.on("click", deploymentFilter)
			.transition()
			.duration(1000)
			.attr("x", function(d) { return x(d.collectortype) })
			.attr("y", function(d) { return y(d.value) })
			.attr("width", x.bandwidth())
			.attr("height", function(d) { return height - y(d.value) });		
	}

	function updateHeatmap(data) {

		// data regen
		var cardData = [];
		data.forEach(function(d, i){
			var day = i;
			d.data.forEach(function(d, i){
				cardData.push({
					day : day,
					hour : i,
					value : d.value
				})
			})
		});

		var svg_container = graph_state.heatmap_graph.svg_container;
		var svg = graph_state.heatmap_graph.svg;
		var tooltip = graph_state.heatmap_graph.tooltip;

		var margin 	= { top: 50, left: 100,  bottom: 10, right: 10},
			_width 	= $("#heatmap-graph").innerWidth(),
			width 	= _width - margin.left - margin.right,
			grid_s 	= width / 24,
			_height = grid_s * 9 + margin.top + margin.bottom,
			height 	= _height - margin.top - margin.bottom,
			colors 	= ["#ECE6F1","#CEBEE1","#CDBEDE","#A489C0","#845BAE","#724999","#654385","#5E3C7C","#2E1F3D"],
			buckets = 9,
			lg_w 	= width / buckets,
			times 	= ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
			days 	= data.map(function(x){ return x.day });
			
		// svg_container.attr("width", width + margin.left + margin.right)
		// 	.attr("height", height + margin.top + margin.bottom);
		// svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dayLabels = svg.select(".day-labels");
		dayLabels.selectAll(".dayLabel").remove();
		var dayLabel = dayLabels.selectAll(".dayLabel")
			.data(days)
			.enter().append("g")
			.attr("class", "dayLabel")
			.attr("transform", function(d, i){
				return  "translate(0," + (i * grid_s) + ")"
			});
		dayLabel.append("text")
			.text(function (d) { return d })
			.style("text-anchor", "end")
			.attr("x", -20)
			.attr("y", 20);
		dayLabel.append("circle")
			.attr("r", 2)
			.attr("cx", -10)
			.attr("cy", grid_s/2);

		var timeLabels = svg.select(".time-labels");
		timeLabels.selectAll(".timeLabel").remove();
		var timeLabel = timeLabels.selectAll(".timeLabel")
			.data(times)
			.enter().append("g")
			.attr("class", "timeLabel")
			.attr("transform", function(d, i){
				return  "translate(" + i * grid_s + ", 0)"
			})
		timeLabel.append("text")
			.text(function(d) { return d })
			.attr("x", grid_s/2)
			.attr("y", -15)
			.style("text-anchor", "middle")
		timeLabel.append("circle")
			.attr("r", 2)
			.attr("cx", grid_s/2)
			.attr("cy", -5);

		var colorScale = d3.scaleQuantile()
			.domain([0, buckets - 1, d3.max(data, function (d) { return d3.max(d.data, function(d){ return d.value }) })])
			.range(colors);

		var cards = svg.select(".cards");
		cards.selectAll(".hour").remove();
		cards.selectAll(".hour")
			.data(cardData, function(d) { return d.day+':'+d.hour })
			.enter().append("rect")
			.attr("x", function(d) { return d.hour * grid_s })
			.attr("y", function(d) { return d.day * grid_s })
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("class", "hour bordered")
			.attr("width", grid_s-1)
			.attr("height", grid_s-1)
			.style("fill", colors[0])
			.on("click",heatmapFilter)
			.transition().duration(1000)
			.style("fill", function(d) { return colorScale(d.value) });

		var legends = svg_container.select(".legends")
			.attr("transform", "translate(" + margin.left + ", " + (_height - grid_s) + ")");
		legends.selectAll(".legend").remove();
		var legend = legends.selectAll(".legend")
			.data([0].concat(colorScale.quantiles()), function(d) { return d })
			.enter().append("g")
			.attr("class", "legend");

		legend.append("rect")
			.attr("x", function(d, i) { return lg_w * i; })
			.attr("width", lg_w)
			.attr("height", grid_s / 2)
			.style("fill", function(d, i) { return colors[i] });

		legend.append("text")
			.attr("class", "mono")
			.text(function(d) { return "≥ " + d.toFixed(1) })
			.attr("x", function(d, i) { return lg_w * i })
			.attr("y", grid_s);

		legend.exit().remove();
	}

	function updateGeoMap(data) {

		drawWorldMap(data);
		d3.select(window).on("resize", function(){
			drawWorldMap(data);
		})
	}

	function updateDeviceGraph(data) {

		var svg_container = graph_state.device_graph.svg_container;
		var svg = graph_state.device_graph.svg;

		var total = 0;
		data.forEach(function(d){
			total += d.value;
		})
		data.forEach(function(d){
			d.percent = parseFloat((100 * d.value / total).toFixed(0)).toString();
		});

		var margin 	= {top: 20, right: 20, bottom: 20, left: 20},
			_width 	= $("#device-graph").innerWidth(),
			_height = _width,
			width 	= _width - margin.left - margin.right,
			height 	= _height - margin.top - margin.bottom;

		var c20 = d3.scaleOrdinal(d3.schemeCategory20);

		svg_container.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		svg.attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + width/2) + ")");

		var pie = d3.pie().sort(null).value(function(d) { return d.value });
					
		var arc = d3.arc()
			.outerRadius(width/2)
			.innerRadius(0);
		var arcOver = d3.arc()
			.outerRadius(width/2 + 10)
			.innerRadius(0);
		var arcText = d3.arc()
			.outerRadius(width)
			.innerRadius(0);

		var arcs = svg.select(".arcs")
			.selectAll("path")
			.data(pie(data))
			.on("mouseenter", function(d, i){

				var tooltip = d3.select("#device-graph").append("div").attr("class", "tooltip hidden");

				var cx = width/2 + arcText.centroid(d)[0];
				var cy = width/2 + arcText.centroid(d)[1];
				tooltip.classed("hidden", false)
					.style("left", cx+"px")
					.style("top", cy+"px")
					.html(d.data.percent + "%")
					.style("opacity", 0)
					.transition()
					.delay(300)
					.duration(100)
					.style("opacity", 1);
				d3.select(this)
					.transition()
					.duration(300)
					.attr("d", arcOver)
			})
			.on("mouseout", function(d, i){
				$("#device-graph .tooltip").remove();
				d3.select(this)
					.transition()
					.duration(300)
					.attr("d", arc)
			})
			.on("click", deviceFilter)
			.transition()
			.duration(1000)
			.attr("d", arc);
	}

	// Map

	function drawWorldMap(data) {

		var values = {};
		var map_legends = [
			{
				name : "Complete",
				value : 0
			},
			{
				name : "Process",
				value : 0
			},
			{
				name : "Incomplete",
				value : 0
			}
		];
		data.forEach(function(d){
			if (values[d.country] == undefined) {
				values[d.country] = parseInt(d.value);
			} else {
				values[d.country] += parseInt(d.value);
			}
			switch(d.status) {
				case "complete":
					map_legends[0].value ++;
					break;
				case "process":
					map_legends[1].value ++;
					break;
				case "incomplete":
					map_legends[2].value ++;
					break;
			}
		});

		var map_source = "common/chart_asset/mapdata/world.geo.json";

		d3.json(map_source, function(error, mapData) {

			// Map data refresh
			var scale = mapData["hc-transform"]["default"]["scale"];

			var jsonres = mapData["hc-transform"]["default"]["jsonres"];
			var jsonmarginX = mapData["hc-transform"]["default"]["jsonmarginX"];
			var jsonmarginY = mapData["hc-transform"]["default"]["jsonmarginY"];
			var crs = mapData["hc-transform"]["default"]["crs"];
			mapData.features.forEach(function(d, i){
				switch(d.geometry.type) {
					case "Polygon":
						d.geometry.coordinates.forEach(function(e, i){
							e.forEach(function(f, i){
								var normalized = {
									x : (f[0] - jsonmarginX) / jsonres,
									y : (-f[1] - jsonmarginY) / jsonres
								};
								var projected = window.proj4(crs, 'WGS84', normalized);
								f[0] = projected.x;
								f[1] = -projected.y;
								e[i] = f;
							});
							d[i] = e;
						});
						mapData.features[i] = d;
						break;
					case "MultiPolygon":
						d.geometry.coordinates.forEach(function(e, i){
							e.forEach(function(f, i){
								f.forEach(function(g, i){
									var normalized = {
										x : (g[0] - jsonmarginX) / jsonres,
										y : (-g[1] - jsonmarginY) / jsonres
									};
									var projected = window.proj4(crs, 'WGS84', normalized);
									g[0] = projected.x;
									g[1] = -projected.y;
									f[i] = g;
								})
							});
							d[i] = e;
						});
						mapData.features[i] = d;
						break;
				}
			});

			$("#geomap-graph").empty();

			var width = $("#geomap-graph").innerWidth(),
				height = width * 0.4,
				map_width = width;
			var svg = d3.select("#geomap-graph")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
			var projection = d3.geoMercator()
				.translate([0, 0])
				.scale(1)
			var path = d3.geoPath().projection(projection);
			var mapArea = svg.append("g")
				.attr("class", "map-area")
				.attr("transform", "translate(0,0)scale(1)");
			var points = svg.append("g").attr("class", "points");
			var b = path.bounds(mapData),
				s = 1 / Math.max((b[1][0] - b[0][0]) / map_width, (b[1][1] - b[0][1]) / height),
				t = [(map_width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
			projection.scale(s).translate(t);

			//Bind data and create one path per GeoJSON feature
			mapArea.selectAll("path")
				.data(mapData.features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", function(d){
					var mx = d.properties["hc-middle-x"];
					var my = d.properties["hc-middle-y"];
					var box = d3.select(this).node().getBBox();
					var center_x = box.x + box.width * mx;
					var center_y = box.y + box.height * my;
					if (values[d.properties["hc-key"]] != undefined) {
						points.append("circle")
							.attr("cx", center_x)
							.attr("cy", center_y)
							.attr("r", 4)
							.attr("class", d.properties["hc-key"])
							.style("fill","#fff")
							.style("stroke", "#8A54C6")
							.style("stroke-width", 2)
					}
					return d.properties["hc-key"];
				})
				.on("mouseenter", function(d, i){
					var mx = d.properties["hc-middle-x"];
					var my = d.properties["hc-middle-y"];
					var box = d3.select(this).node().getBBox();
					var center_x = box.x + box.width * mx;
					var center_y = box.y + box.height * my - 14;

					var tooltip = d3.select("#geomap-graph").append("div").attr("class", "tooltip hidden");
					if (values[d.properties["hc-key"]] != undefined) {
						var html = ' \
							<div>' + d.properties["name"] + '</div> \
							<div>' + values[d.properties["hc-key"]] + '</div> \
						';
						tooltip.classed("hidden", false)
							.style("left", center_x + "px")
							.html(html);
					} else {
						var html = '<div>' + d.properties["name"] + '</div>';
						tooltip.classed("hidden", false)
							.style("left", center_x + "px")
							.html(html);
					}
					var y_off = $("#geomap-graph .tooltip").outerHeight();
					tooltip.style("top", (center_y - y_off - 6) + "px")
						.style("opacity", 0)
						.transition()
						.delay(300)
						.duration(300)
						.style("opacity", 1)
					d3.select(this)
						.transition()
						.delay(300)
						.duration(300)
						.style("fill", "green")
				})
				.on("mouseout", function(d, i){
					$("#geomap-graph .tooltip").remove();
					d3.select(this)
						.transition()
						.duration(100)
						.style("fill", "#8893af")
				})
				.on("click", function(d, i){
					drawCountryMap({
						country_key : d.properties["hc-key"],
						country_name : d.properties["name"],
						data : data
					});
					d3.select(window).on("resize", function(){
						drawCountryMap({
							country_key : d.properties["hc-key"],
							country_name : d.properties["name"],
							data : data
						});
					})
					geomapFilter(d.properties["hc-key"], "", "", values[d.properties["hc-key"]]);
				});

			// Zooming button
			
			var zoom = d3.zoom()
				.scaleExtent([1, 16])
				.translateExtent([[0, 0], [width, height]])
				.on("zoom", zoomed);
			mapArea.call(zoom)
				.on("wheel.zoom", null)
				.on("mousewheel.zoom", null)
				.on("MozMousePixelScroll.zoom", null);

			function zoomed() {
				var transform = d3.event.transform;
				mapArea.attr("transform", transform);
				points.attr("transform", transform);
				points.selectAll("circle")
					.attr("r", 4 / transform.k)
					.style("stroke-width", 2 / transform.k);
				mapArea.selectAll("path")
					.on("mouseenter", function(d, i){
						var mx = d.properties["hc-middle-x"];
						var my = d.properties["hc-middle-y"];
						var box = d3.select(this).node().getBBox();
						var center_x = box.x + box.width * mx;
						var center_y = box.y + box.height * my - 14;

						center_x = transform.k * center_x + transform.x;
						center_y = transform.k * center_y + transform.y;

						var tooltip = d3.select("#geomap-graph").append("div").attr("class", "tooltip hidden");
						if (values[d.properties["hc-key"]] != undefined) {
							var html = ' \
								<div>' + d.properties["name"] + '</div> \
								<div>' + values[d.properties["hc-key"]] + '</div> \
							';
							tooltip.classed("hidden", false)
								.style("left", center_x + "px")
								.html(html);
						} else {
							var html = '<div>' + d.properties["name"] + '</div>';
							tooltip.classed("hidden", false)
								.style("left", center_x + "px")
								.html(html);
						}
						var y_off = $("#geomap-graph .tooltip").outerHeight();
						tooltip.style("top", (center_y - y_off - 6) + "px")
							.style("opacity", 0)
							.transition()
							.delay(300)
							.duration(300)
							.style("opacity", 1)
						d3.select(this)
							.transition()
							.delay(300)
							.duration(300)
							.style("fill", "green")
					})
			}

			$("#geomap-graph").append(' \
				<button class="zoom zoom-in">+</button> \
				<button class="zoom zoom-out">-</button> \
			');

			$("#geomap-graph .zoom-in").on("click", function(){
				zoom.scaleBy(mapArea,1.25);
			});
			$("#geomap-graph .zoom-out").on("click", function(){
				zoom.scaleBy(mapArea,0.8);
			});			
		});
	}

	function drawCountryMap(country_info) {

		var country_key = country_info.country_key;
		var data = country_info.data;

		var values = {};
		var map_legends = [
			{
				name : "Complete",
				value : 0
			},
			{
				name : "Process",
				value : 0
			},
			{
				name : "Incomplete",
				value : 0
			}
		];
		data.forEach(function(d){
			if (d.country == country_key) {
				if (values[d.state] == undefined) {
					values[d.state] = parseInt(d.value);
				} else {
					values[d.state] += parseInt(d.value);
				}
				switch(d.status) {
					case "complete":
						map_legends[0].value ++;
						break;
					case "process":
						map_legends[1].value ++;
						break;
					case "incomplete":
						map_legends[2].value ++;
						break;
				}
			}
		});

		var map_source = "common/chart_asset/mapdata/"+country_key+"-all.geo.json";

		d3.json(map_source, function(error, json) {

			// Map data refresh
			var scale = json["hc-transform"]["default"]["scale"];

			mapData = {
				title 		: json["title"],
				type 		: "FeatureCollection",
				features 	: []
			}
			json.features.forEach(function(d, i){
				switch(d.geometry.type) {
					case "Polygon":
						d.geometry.coordinates.forEach(function(e, i){
							e.forEach(function(f, i){
								f.forEach(function(g, i){
									f[i] = parseFloat((parseInt(g) * scale).toFixed(5));
								});
								e[i] = f;
							});
							d[i] = e;
						});
						mapData.features.push(d);
						break;
					case "MultiPolygon":
						d.geometry.coordinates.forEach(function(e, i){
							e.forEach(function(f, i){
								f.forEach(function(g, i){
									g.forEach(function(h, i){
										g[i] = parseFloat((parseInt(h) * scale).toFixed(5));
									});
									f[i] = g;
								})
							});
							d[i] = e;
						});
						mapData.features.push(d);
						break;
				}
			});

			$("#geomap-graph").empty();

			var width = $("#geomap-graph").innerWidth(),
				height = width * 0.4,
				map_width = width;
			var svg = d3.select("#geomap-graph")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
			var projection = d3.geoMercator()
				.translate([0, 0])
				.scale(1)
			var path = d3.geoPath().projection(projection);
			var mapArea = svg.append("g")
				.attr("class", "map-area")
				.attr("transform", "translate(0,0)scale(1)");
			var points = svg.append("g").attr("class", "points")
			var b = path.bounds(mapData),
				s = 1 / Math.max((b[1][0] - b[0][0]) / map_width, (b[1][1] - b[0][1]) / height),
				t = [(map_width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
			projection.scale(s).translate(t);

			//Bind data and create one path per GeoJSON feature
			mapArea.selectAll("path")
				.data(mapData.features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", function(d){
					var mx = d.properties["hc-middle-x"];
					var my = d.properties["hc-middle-y"];
					var box = d3.select(this).node().getBBox();
					var center_x = box.x + box.width * mx;
					var center_y = box.y + box.height * my;
					if (values[d.properties["hc-key"]] != undefined) {
						points.append("circle")
							.attr("cx", center_x)
							.attr("cy", center_y)
							.attr("r", 4)
							.attr("class", d.properties["hc-key"])
							.style("fill","#fff")
							.style("stroke", "#8A54C6")
							.style("stroke-width", "2px")
					}
					return d.properties["hc-key"];
				})
				.on("mouseenter", function(d, i){
					var mx = d.properties["hc-middle-x"];
					var my = d.properties["hc-middle-y"];
					var box = d3.select(this).node().getBBox();
					var center_x = box.x + box.width * mx;
					var center_y = box.y + box.height * my - 14;
					var tooltip = d3.select("#geomap-graph").append("div").attr("class", "tooltip hidden");
					if (values[d.properties["hc-key"]] != undefined) {
						var html = ' \
							<div>' + d.properties["name"] + '</div> \
							<div>' + values[d.properties["hc-key"]] + '</div> \
						';
						tooltip.classed("hidden", false)
							.style("left", center_x + "px")
							.html(html);
						var y_off = $("#geomap-graph .tooltip").outerHeight();
						tooltip.style("top", (center_y - y_off - 6) + "px")
							.style("opacity", 0)
							.transition()
							.delay(300)
							.duration(300)
							.style("opacity", 1)
					} else {
						var html = '<div>' + d.properties["name"] + '</div>';
						tooltip.classed("hidden", false)
							.style("left", center_x + "px")
							.html(html);
						var y_off = $("#geomap-graph .tooltip").outerHeight();
						tooltip.style("top", (center_y - y_off - 6) + "px")
							.style("opacity", 0)
							.transition()
							.delay(300)
							.duration(300)
							.style("opacity", 1)
					}
					d3.select(this)
						.transition()
						.delay(300)
						.duration(300)
						.style("fill", "green")
				})
				.on("mouseout", function(d, i){
					$("#geomap-graph .tooltip").remove();
					d3.select(this)
						.transition()
						.duration(100)
						.style("fill", "#8893af")
				})
				.on("click", function(d, i){
					country_info["state"] = d.properties["hc-key"];
					drawStateMap(country_info);
					d3.select(window).on("resize", function(){
						drawStateMap(country_info);
					})
					geomapFilter(country_key, d.properties["hc-key"], "", values[d.properties["hc-key"]]);
				});

			var zoom = d3.zoom()
				.scaleExtent([1, 10])
				.translateExtent([[0, 0], [width, height]])
				.on("zoom", zoomed);
			mapArea.call(zoom)
				.on("wheel.zoom", null)
				.on("mousewheel.zoom", null)
				.on("MozMousePixelScroll.zoom", null);
			function zoomed() {
				var transform = d3.event.transform;
				mapArea.attr("transform", transform);
				points.attr("transform", transform);
				points.selectAll("circle")
					.attr("r", 4 / transform.k)
					.style("stroke-width", 2 / transform.k);
				mapArea.selectAll("path")
					.on("mouseenter", function(d, i){
						var mx = d.properties["hc-middle-x"];
						var my = d.properties["hc-middle-y"];
						var box = d3.select(this).node().getBBox();
						var center_x = box.x + box.width * mx;
						var center_y = box.y + box.height * my - 14;

						center_x = center_x * transform.k + transform.x;
						center_y = center_y * transform.k + transform.y;

						var tooltip = d3.select("#geomap-graph").append("div").attr("class", "tooltip hidden");
						if (values[d.properties["hc-key"]] != undefined) {
							var html = ' \
								<div>' + d.properties["name"] + '</div> \
								<div>' + values[d.properties["hc-key"]] + '</div> \
							';
							tooltip.classed("hidden", false)
								.style("left", center_x + "px")
								.html(html);
							var y_off = $("#geomap-graph .tooltip").outerHeight();
							tooltip.style("top", (center_y - y_off - 6) + "px")
								.style("opacity", 0)
								.transition()
								.delay(300)
								.duration(300)
								.style("opacity", 1)
						} else {
							var html = '<div>' + d.properties["name"] + '</div>';
							tooltip.classed("hidden", false)
								.style("left", center_x + "px")
								.html(html);
							var y_off = $("#geomap-graph .tooltip").outerHeight();
							tooltip.style("top", (center_y - y_off - 6) + "px")
								.style("opacity", 0)
								.transition()
								.delay(300)
								.duration(300)
								.style("opacity", 1)
						}
						d3.select(this)
							.transition()
							.delay(300)
							.duration(300)
							.style("fill", "green")
					})
			}

			$("#geomap-graph").append(' \
				<button class="zoom zoom-in">+</button> \
				<button class="zoom zoom-out">-</button> \
			');

			$("#geomap-graph .zoom-in").on("click", function(){
				zoom.scaleBy(mapArea,1.25);
			});
			$("#geomap-graph .zoom-out").on("click", function(){
				zoom.scaleBy(mapArea,0.8);
			});

			var back_to = svg.append("g")
				.attr("class", "back-to-world")
				.attr("transform", "translate(10,10)")
				.on("click", function(d, i){
					d3.select(this)
						.transition()
						.duration(100)
						.style("opacity", 0)
						.remove();
					setTimeout(function(){
						drawWorldMap(data);
					}, 100);
				});
			back_to.append("text")
				.attr("x", 5)
				.attr("y", 20)
				.text("< back to World")
		});
	}

	function drawStateMap(state_info) {

		var country_key = state_info.country_key;
		var country_name = state_info.country_name;
		var state = state_info.state;
		var data = state_info.data;

		var values = {};
		var status = {};
		data.forEach(function(d){
			if (d.country == country_key && d.state == state) {
				values[d.city] = parseInt(d.value);
				status[d.city] = d.status;
			}
		});

		var map_source = "common/chart_asset/mapdata/"+country_key+"-all2.geo.json";

		d3.json(map_source, function(error, json) {

			// Map data refresh
			var scale = json["hc-transform"]["default"]["scale"];

			mapData = {
				title 		: json["title"],
				type 		: "FeatureCollection",
				features 	: []
			}

			json.features.forEach(function(d, i){
				if (String(d.properties["hc-key"]).includes(state + "-")) {
					switch(d.geometry.type) {
						case "Polygon":
							d.geometry.coordinates.forEach(function(e, i){
								e.forEach(function(f, i){
									f.forEach(function(g, i){
										f[i] = parseFloat((parseInt(g) * scale).toFixed(5));
									});
									e[i] = f;
								});
								d[i] = e;
							});
							mapData.features.push(d);
							break;
						case "MultiPolygon":
							d.geometry.coordinates.forEach(function(e, i){
								e.forEach(function(f, i){
									f.forEach(function(g, i){
										g.forEach(function(h, i){
											g[i] = parseFloat((parseInt(h) * scale).toFixed(5));
										});
										f[i] = g;
									})
								});
								d[i] = e;
							});
							mapData.features.push(d);
							break;
						case "MultiLineString":
							d.geometry.coordinates.forEach(function(e, i){
								e.forEach(function(f, i){
									f.forEach(function(g, i){
										f[i] = parseFloat((parseInt(g) * scale).toFixed(5));
									});
									e[i] = f;
								});
								d[i] = e;
							});
							mapData.features.push(d);
							break;
					}
				}				
			});

			$("#geomap-graph").empty();

			var width = $("#geomap-graph").innerWidth(),
				height = width * 0.4,
				map_width = width;
			var svg = d3.select("#geomap-graph")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
			var filter = svg.append("defs")
				.append("filter")
				.attr("id", "blur")
				.append("feGaussianBlur")
				.attr("stdDeviation", 2);
			var projection = d3.geoMercator()
				.translate([0, 0])
				.scale(1)
			var path = d3.geoPath().projection(projection);
			var mapArea = svg.append("g")
				.attr("class", "map-area")
			var points = svg.append("g").attr("class", "points");
			var b = path.bounds(mapData),
				s = 1 / Math.max((b[1][0] - b[0][0]) / map_width, (b[1][1] - b[0][1]) / height),
				t = [(map_width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
			projection.scale(s).translate(t);

			//Bind data and create one path per GeoJSON feature
			mapArea.selectAll("path")
				.data(mapData.features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", function(d){
					var mx = d.properties["hc-middle-x"];
					var my = d.properties["hc-middle-y"];
					var box = d3.select(this).node().getBBox();
					var center_x = box.x + box.width * mx;
					var center_y = box.y + box.height * my;
					if (values[d.properties["hc-key"]] != undefined) {
						var st = status[d.properties["hc-key"]];
						var circle = points.append("circle")
							.attr("cx", center_x)
							.attr("cy", center_y)
							.attr("r", function(){
								if (st == "process") {
									return 8
								} else {
									return 4
								}
							})
							.attr("class", d.properties["hc-key"] + " " + st)
							.attr("filter", function(){
								if (st == "process") {
									return "url(#blur)"
								} else {
									return ""
								}
							})
							.style("fill", function(){
								switch(st){
									case "incomplete":
										return "#fff"
										break;
									case "complete":
										return "#f00"
										break;
									case "process":
										return "#f00"
										break;
								}
							})
							.style("stroke", function(){
								if (st == "incomplete") {
									return "#8A54C6"
								} else {
									return "none"
								}
							})
							.style("stroke-width", "2px")
							.style("opacity", function(){
								if (st == "process") {
									return 1
								} else {
									return 1
								}
							})
						if (st == "process") {
							circle.style("opacity", 1)
								.transition().duration(1000)
								.style("opacity", 0)
								.transition().duration(1000)
								.style("opacity", 1)
						}
					}
					return d.properties["hc-key"];
				})
				.on("mouseenter", function(d, i){
					var mx = d.properties["hc-middle-x"];
					var my = d.properties["hc-middle-y"];
					var box = d3.select(this).node().getBBox();
					var center_x = box.x + box.width * mx;
					var center_y = box.y + box.height * my - 14;
					var tooltip = d3.select("#geomap-graph").append("div").attr("class", "tooltip hidden");
					if (values[d.properties["hc-key"]] != undefined) {
						var html = ' \
							<div>' + d.properties["name"] + '</div> \
							<div>' + values[d.properties["hc-key"]] + '</div> \
							<div style="color : red">' + status[d.properties["hc-key"]] +'</div> \
						';
						tooltip.classed("hidden", false)
							.style("left", center_x + "px")
							.html(html);
						var y_off = $("#geomap-graph .tooltip").outerHeight();
						tooltip.style("top", (center_y - y_off - 6) + "px")
							.style("opacity", 0)
							.transition()
							.delay(300)
							.duration(300)
							.style("opacity", 1);
					} else {
						var html = '<div>' + d.properties["name"] + '</div>';
						tooltip.classed("hidden", false)
							.style("left", center_x + "px")
							.html(html);
						var y_off = $("#geomap-graph .tooltip").outerHeight();
						tooltip.style("top", (center_y - y_off - 6) + "px")
							.style("opacity", 0)
							.transition()
							.delay(300)
							.duration(300)
							.style("opacity", 1)
					}
					d3.select(this)
						.transition()
						.delay(300)
						.duration(300)
						.style("fill", "green")
				})
				.on("mouseout", function(d, i){
					$("#geomap-graph .tooltip").remove();
					d3.select(this)
						.transition()
						.duration(100)
						.style("fill", "#8893af")
				})
				.on("click", function(d, i){
					geomapFilter(country_key, state, d.properties["hc-key"], values[d.properties["hc-key"]]);
				})

			var zoom = d3.zoom()
				.scaleExtent([1, 10])
				.translateExtent([[0, 0], [width, height]])
				.on("zoom", zoomed);
			mapArea.call(zoom)
				.on("wheel.zoom", null)
				.on("mousewheel.zoom", null)
				.on("MozMousePixelScroll.zoom", null);
			function zoomed() {
				var transform = d3.event.transform;
				mapArea.attr("transform", transform);
				points.attr("transform", transform);
				points.selectAll("circle")
					.attr("r", 4 / transform.k)
					.style("stroke-width", 2 / transform.k);
				mapArea.selectAll("path")
					.on("mouseenter", function(d, i){
						var mx = d.properties["hc-middle-x"];
						var my = d.properties["hc-middle-y"];
						var box = d3.select(this).node().getBBox();
						var center_x = box.x + box.width * mx;
						var center_y = box.y + box.height * my - 14;

						center_x = center_x * transform.k + transform.x;
						center_y = center_y * transform.k + transform.y;

						var tooltip = d3.select("#geomap-graph").append("div").attr("class", "tooltip hidden");
						if (values[d.properties["hc-key"]] != undefined) {
							var html = ' \
								<div>' + d.properties["name"] + '</div> \
								<div>' + values[d.properties["hc-key"]] + '</div> \
							';
							tooltip.classed("hidden", false)
								.style("left", center_x + "px")
								.html(html);
							var y_off = $("#geomap-graph .tooltip").outerHeight();
							tooltip.style("top", (center_y - y_off - 6) + "px")
								.style("opacity", 0)
								.transition()
								.delay(300)
								.duration(300)
								.style("opacity", 1);
						} else {
							var html = '<div>' + d.properties["name"] + '</div>';
							tooltip.classed("hidden", false)
								.style("left", center_x + "px")
								.html(html);
							var y_off = $("#geomap-graph .tooltip").outerHeight();
							tooltip.style("top", (center_y - y_off - 6) + "px")
								.style("opacity", 0)
								.transition()
								.delay(300)
								.duration(300)
								.style("opacity", 1)
						}
						d3.select(this)
							.transition()
							.delay(300)
							.duration(300)
							.style("fill", "green")
					})
			}
			
			setInterval(function(){
				points.selectAll(".process")
					.style("opacity", 1)
					.transition().duration(1000)
					.style("opacity", 0)
					.transition().duration(1000)
					.style("opacity", 1)
			}, 2000);

			$("#geomap-graph").append(' \
				<button class="zoom zoom-in">+</button> \
				<button class="zoom zoom-out">-</button> \
			');

			$("#geomap-graph .zoom-in").on("click", function(){
				zoom.scaleBy(mapArea,1.25);
			});
			$("#geomap-graph .zoom-out").on("click", function(){
				zoom.scaleBy(mapArea,0.8);
			});

			var back_to = svg.append("g")
				.attr("class", "back-to-world")
				.attr("transform", "translate(10,10)")
				.on("click", function(d, i){
					d3.select(this)
						.transition()
						.duration(100)
						.style("opacity", 0)
						.remove();
					setTimeout(function(){
						drawCountryMap(state_info);
					}, 100);
				});
			back_to.append("text")
				.attr("x", 5)
				.attr("y", 20)
				.text("< back to " + country_name)
		});
	}

	// Filtering

	function deploymentFilter(d) {
		console.log("deployment", d);
		graph_state.filterby = "deployment";
		update();
	}

	function heatmapFilter(d) {
		console.log("heatmap", d);
		graph_state.filterby = "heatmap";
		update();
	}

	function geomapFilter(country_key, state_key, city_key, d) {
		console.log("geomap", country_key, state_key, city_key, d||0);
		graph_state.filterby = "geomap";
		update();
	}

	function deviceFilter(d) {
		console.log("device", d.data);
		graph_state.filterby = "device";
		update();
	}

	// Helper

	function decompose(a, b, c, d, e, f) {
		var degrees = 180 / Math.PI;
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
	    translateX: e,
	    translateY: f,
	    rotate: Math.atan2(b, a) * degrees,
	    skewX: Math.atan(skewX) * degrees,
	    scaleX: scaleX,
	    scaleY: scaleY
	  };
	}

	function parseSvg(value) {
	  if (value == null) return identity;
	  svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
	  value = value.matrix;
	  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	}
});