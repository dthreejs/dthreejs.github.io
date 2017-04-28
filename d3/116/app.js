$(document).ready(function(){

	var filter = {
		duration : 6, // meaning 6 month
		compared : "self"
	}

	var data = [];

	var keys = {
		"start": "2016-04-23T18:25:43.511Z",
		"end": "2016-08-23T18:25:43.511Z",
		"keywords": [
			"neat",
			"available",
			"rude",
			"smart",
			"caring"
		]
	}

	init();

	function init() {

		d3.json("data.json", function(err, res){
			data = res;
			updateOverallGraph(data);
			updateOverallTips(data, keys);
			initDomainButtonAction();

			d3.select(window).on('resize', function(){
				updateOverallGraph(data);
				updateOverallTips(data, keys);
				initDomainButtonAction();
			});
		});
	}

	// Overall Performance Related
	
	function updateOverallGraph(data) {

		// Data Extract
		const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		const COLOR = [
			"#06527e", // Communication Quality
			"#00b8c0", // Overall Doctor Rating
			"#de9b22", // Recommend Practice
			"#18ac5c", // Access to Care
			"#e44935"  // Care Coordination
		];

		var months = [],
			values = [[],[],[],[],[]],
			emptyValues = [[],[],[],[],[]];

		data.forEach(function(d){
			months.push(parseInt(d.month)-1);

			if (filter.compared == "self") {
				values[0].push(d.domains[1].topboxscore); // Communication Quality 	0 - 1
				values[1].push(d.domains[2].topboxscore); // Overall Doctor Rating 	1 - 2
				values[2].push(d.domains[3].topboxscore); // Recommend Practice 	2 - 3
				values[3].push(d.domains[0].topboxscore); // Access to Care 		3 - 0
				values[4].push(d.domains[4].topboxscore); // Care Coordination 		4 - 4
			} else {
				values[0].push(d.domains[1].comparisons[filter.compared]); // Communication Quality 	0 - 1
				values[1].push(d.domains[2].comparisons[filter.compared]); // Overall Doctor Rating 	1 - 2
				values[2].push(d.domains[3].comparisons[filter.compared]); // Recommend Practice 		2 - 3
				values[3].push(d.domains[0].comparisons[filter.compared]); // Access to Care 			3 - 0
				values[4].push(d.domains[4].comparisons[filter.compared]); // Care Coordination 		4 - 4
			}

			for (i = 0 ; i < 5 ; i ++) {
				emptyValues[i].push(60);
			}
		});

		// Graph

		$(".domain-graph").empty();
		$(".domain-specs").hide();
		$(".quiz-graph").empty();
		$(".domain-specs-info").empty();

		var tooltip = d3.select(".domain-graph").append("div").attr("class", "overall-tooltip hidden");

		var margin = {top: 10, left: 70, bottom: 100, right: 20},
			w = $(".domain-graph").width(),
			h = $(".domain-graph").height(),
			width = w - margin.left - margin.right,
			height = h - margin.top - margin.bottom;
		var svg = d3.select(".domain-graph").append("svg")
			.attr("class", "overall")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var x = d3.scaleLinear()
			.range([0, width])
			.domain([0, months.length-1]);
		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([60, 100]).nice();
		var xAxis = d3.axisBottom()
			.scale(x)
			.tickSizeInner(0)
			.tickSizeOuter(0)
			.tickPadding(20)
			.ticks(months.length-1)
			.tickFormat(function(d, i){
				return MONTH[months[i]]
			});
		var yAxis = d3.axisLeft()
			.scale(y)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
			.ticks(5)
			.tickPadding(30);
		var xaxis_g = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		var yaxis_g = svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		var area = d3.area()
			.x(function(d, i) { return x(i) })
			.y0(y(60))
			.y1(function(d) { return y(d) });
		var domains = svg.append("g")
			.attr("class", "domains")
			.selectAll("path")
			.data(emptyValues)
			.enter().append("path")
			.attr("class", "domain")
			.attr("d", area)
			.style("opacity", 0.7)
			.style("fill", function(d, i){
				return COLOR[i]
			})
			.data(values)
			.transition()
			.duration(1000)
			.attr("d", area);

		var overlay =  svg.append("rect")
			.attr("class", "overlay")
			.attr("width", width)
			.attr("height", height)
			.on("mousemove", function() {
				var i = Math.round(x.invert(d3.mouse(this)[0]));

				lineHelper.style("opacity", 1)
					.attr("x1", x(i))
					.attr("x2", x(i));

				var html = ' \
					<ul class="domain-name"> \
						<li>Communication Quality</li> \
						<li>Overall Doctor Rating</li> \
						<li>Recommend Practice</li> \
						<li>Access to Care</li> \
						<li>Care Coordination</li> \
					</ul> \
					<ul class="domain-score"> \
						<li>'+values[0][i]+'</li> \
						<li>'+values[1][i]+'</li> \
						<li>'+values[2][i]+'</li> \
						<li>'+values[3][i]+'</li> \
						<li>'+values[4][i]+'</li> \
					</ul> \
				';

				var arrowLeft = '<div class="arrow-left"></div>';
				var arrowRight = '<div class="arrow-right"></div>';

				tooltip.classed("hidden", false)
					.style("opacity", 1)
					.style("left", "0px")
					.style("top", "100px")
					.html(html);

				var tooltipWidth = $(".overall-tooltip").outerWidth() + 30;

				if (x(i) + tooltipWidth > width) {
					tooltip.html(html + arrowRight)
						.style("left", (x(i) - tooltipWidth + margin.left) + "px")
				} else {
					tooltip.html(html + arrowLeft)
						.style("left", (x(i) + 30 + margin.left) + "px")
				}
			})
			.on("mouseout", function() {
				lineHelper.style("opacity", 0);
				tooltip.classed("hidden", true).style("opacity", 0);
			})
		var lineHelper = svg.append("line")
			.attr("class", "line-helper")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", height)
			.style("opacity", 0);
	}

	function updateOverallTips(data, keys) {

		var overallAvg = 0;

		data.forEach(function(d){
			var monthScore = 0;
			d["domains"].forEach(function(d){
				if (filter.compared == "self") {
					monthScore += d["topboxscore"];
				} else {
					monthScore += d["comparisons"][filter.compared];
				}
			});
			monthScore /= 5;
			overallAvg += monthScore;
		})
		
		overallAvg = (overallAvg/5).toFixed(1);

		var len 	 = keys["keywords"].length;
		var last_key = keys["keywords"][len-1];
		var keywords = keys["keywords"].slice(0, len-1).join(', ') + " and " + last_key;

		$(".doctor-tips .tips-big").html("Congratulations! Your average overall performance is " + overallAvg + "%");
		$(".doctor-tips .tips-small").html('based on the five domains outlined above. Patients describe you as "' + keywords + '" Click on a domain for more details and tips for improvement.');
		$(".doctor-tips .tips-readmore").html('');
	}

	function initDomainButtonAction() {
		$(".sub-wrapper .domain-buttons a").on("click", function(){
			if ($(this).hasClass("select")) {

				// Returned to Overall
				$(".sub-wrapper .domain-buttons a").removeClass("deselect");
				$(".sub-wrapper .domain-buttons a").removeClass("select");
				$(this).removeClass("deselect");
				$(this).removeClass("select");

				updateOverallGraph(data);
				updateOverallTips(data, keys);
			} else {

				// Specific Domain Selected
				$(".sub-wrapper .domain-buttons a").addClass("deselect");
				$(".sub-wrapper .domain-buttons a").removeClass("select");
				$(this).removeClass("deselect");
				$(this).addClass("select");

				var domain = 0;
				switch($(this).index()) {
					case 0:
						domain = 1;
						break;
					case 1:
						domain = 2;
						break;
					case 2:
						domain = 3;
						break;
					case 3:
						domain = 0;
						break;
					case 4:
						domain = 4;
						break;
				}

				updateDomainGraph(data, domain);
				updateDomainSpecs(data, domain);
				updateDomainTips(data, keys);
				d3.select(window).on('resize', function(){
					updateDomainSpecs(data, domain);
				});
			}	
		})
	}

	// Domain Specific

	function updateDomainGraph(data, domainIndex) {
		const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		const COLOR = [
			"#18ac5c", // Access to Care
			"#06527e", // Communication Quality
			"#00b8c0", // Overall Doctor Rating
			"#de9b22", // Recommend Practice
			"#e44935"  // Care Coordination
		];

		var months = [],
			values = [[]],
			emptyValues = [[]],
			threshold = [];

		data.forEach(function(d){
			months.push(parseInt(d.month)-1);

			if (filter.compared == "self") {
				values[0].push(d.domains[domainIndex].topboxscore);
			} else {
				values[0].push(d.domains[domainIndex].comparisons[filter.compared]);
			}
			emptyValues[0].push(60);
			threshold.push(d.domains[domainIndex]["threshold"]);
		});

		// Graph

		$(".domain-graph").empty();

		var margin = {top: 10, left: 70, bottom: 100, right: 20},
			w = $(".domain-graph").width(),
			h = $(".domain-graph").height(),
			width = w - margin.left - margin.right,
			height = h - margin.top - margin.bottom;
		var svg = d3.select(".domain-graph").append("svg")
			.attr("class", "domain")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var tooltip = d3.select(".domain-graph").append("div").attr("class", "domain-tooltip hidden");

		var x = d3.scaleLinear()
			.range([0, width])
			.domain([0, months.length-1]);
		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([60, 100]).nice();
		var xAxis = d3.axisBottom()
			.scale(x)
			.tickSizeInner(0)
			.tickSizeOuter(0)
			.tickPadding(20)
			.ticks(months.length-1)
			.tickFormat(function(d, i){
				return MONTH[months[i]]
			});
		var yAxis = d3.axisLeft()
			.scale(y)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
			.ticks(5)
			.tickPadding(30);
		var xaxis_g = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		var yaxis_g = svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		var area = d3.area()
			.x(function(d, i) { return x(i) })
			.y0(y(60))
			.y1(function(d) { return y(d) });
		var domains = svg.append("g")
			.attr("class", "domains")
			.selectAll("path")
			.data(emptyValues)
			.enter().append("path")
			.attr("class", "domain")
			.attr("d", area)
			.style("opacity", 0.7)
			.style("fill", COLOR[domainIndex])
			.data(values)
			.transition()
			.duration(1000)
			.attr("d", area);
			
		var line = d3.line()
			.x(function(d, i) { return x(i) })
			.y(function(d) { return y(d) });

		var thresholdLine = svg.append("path")
			.attr("class", "threshold-line")
			.datum(threshold)
			.attr("d", line);

		var overlay =  svg.append("rect")
			.attr("class", "overlay")
			.attr("width", width)
			.attr("height", height)
			.on("mousemove", function() {
				var i = Math.round(x.invert(d3.mouse(this)[0]));

				var html = " \
					<div class=\"percent\">"+threshold[i]+"<span>%</span></div> \
					<ul> \
						<li>Hospital's</li> \
						<li>50th percentile</li> \
						<li>threshold</li> \
					</ul> \
				";

				var arrow = ["arrow"];

				tooltip.classed("hidden", false)
					.style("opacity", 1)
					.html(html);

				var tooltipHeight = $(".domain-tooltip").outerHeight() + 30;
				var tooltipWidth = $(".domain-tooltip").outerWidth();

				if ( y(threshold[i]) < tooltipHeight) {
					arrow.push("up");
					tooltip.html(html + '<div class="arrow-up-center"></div>')
						.style("top", (margin.top + y(threshold[i]) + 30) + "px")
				} else {
					arrow.push("down");
					tooltip.html(html + '<div class="arrow-down-center"></div>')
						.style("top", (margin.top + y(threshold[i]) - tooltipHeight) + "px")
				}

				tooltip.style("left", (margin.left + x(i)) + "px");
				if (x(i) - tooltipWidth/2 < 0) {
					arrow.push("left");
					tooltip.style("left", margin.left + "px");
				} else if (x(i) + tooltipWidth/2 > width) {
					arrow.push("right");
					tooltip.style("left", (margin.left + width - tooltipWidth) + "px");
				} else {
					arrow.push("center");
					tooltip.style("left", (margin.left + x(i) - tooltipWidth/2) + "px");
				}
				tooltip.html(html + '<div class="'+arrow.join("-")+'"></div>');
			})
			.on("mouseout", function() {
				tooltip.classed("hidden", true).style("opacity", 0);
			})
	}

	function updateDomainSpecs(data, domainIndex) {

		// data extract
		const INDEX = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const DOMNAME = ["Access To Care", "Communication Quality", "Overall Doctor Rating", "Recommend Practice", "Care Coordination"];
		var colorScale = d3.scaleOrdinal(d3["schemeCategory20b"]);

		var quizLen = data[0]["domains"][domainIndex]["questions"].length;
		var values = new Array(quizLen);
		var avgValue = 0;
		var quizNames = new Array(quizLen);

		data.forEach(function(d){
			d["domains"][domainIndex]["questions"].forEach(function(q, i){
				if (values[i] == undefined) {
					values[i] = q["topboxscore"];
					quizNames[i] = q["question"];
				} else {
					values[i] += q["topboxscore"];
				}
			})
		});
		values.forEach(function(v, i){
			values[i] = v / data.length;
			avgValue += values[i];
		})
		avgValue /= quizLen;

		// Domain info
		var quizOrder = '';
		var quizName = '';
		var quizLink = '';
		for (i = 0 ; i < quizLen ; i ++) {
			quizOrder += '<li style="background:'+colorScale(i)+'">' + INDEX[i] + '</li>';
			quizName += '<li>' + quizNames[i] + '</li>';
			quizLink += '<li><a href="#">&gt;</a></li>';
		}
		$(".domain-specs-info").html('<div class="domain-specs-info-border"> \
			<div class="percentage">' + avgValue.toFixed(0) + '% Average in </div> \
			<div class="domain-name">' + DOMNAME[domainIndex] + '</div> \
			<div class="factors">is based on ' + quizLen + ' factors:</div> \
			<div class="quiz-list"> \
				<ul class="quiz-order">' + quizOrder + '</ul> \
				<ul class="quiz-name">' + quizName + '</ul> \
				<ul class="quiz-link">' + quizLink + '</ul> \
			</div> \
		</div>');

		// Quiz Graph
		$(".domain-specs").show();
		$(".quiz-graph").empty();
		var margin = {top: 10, left: 70, bottom: 50, right: 20},
			w = $(".quiz-graph").width(),
			h = $(".domain-specs-info").height() + 50,
			width = w - margin.left - margin.right,
			height = h - margin.top - margin.bottom;

		if (w < 310) {
			margin = {top: 10, left: 30, bottom:20, right: 10};
			h = $(".domain-specs-info").height() + 20;
			width = w - margin.left - margin.right;
			height = h - margin.top - margin.bottom;
		}

		var svg = d3.select(".quiz-graph").append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var tooltip = d3.select(".quiz-graph").append("div").attr("class", "tooltip hidden");

		var x = d3.scaleBand()
			.range([0, width])
			.domain(values.map(function(d, i){ return INDEX[i] }))
			.padding(0.4);
		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([60, 100]).nice();
		var xAxis = d3.axisBottom()
			.scale(x)
			.tickSizeInner(0)
			.tickSizeOuter(0)
			.ticks(quizLen)
			.tickPadding(20);
		if (w < 310) {
			xAxis.tickPadding(10);
		}
		var yAxis = d3.axisLeft()
			.scale(y)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
			.ticks(5)
			.tickPadding(30);
		if (w < 310) {
			yAxis.tickPadding(10);
		}
		var xaxis_g = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		var yaxis_g = svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		if (w < 310) {
			xaxis_g.selectAll("text").style("font-size", "12px")
			yaxis_g.selectAll("text").style("font-size", "12px");
		}

		svg.append("g")
			.attr("class", "bars")
			.selectAll(".bar")
			.data(values)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d, i) { return x(INDEX[i]); })
			.attr("y", height)
			.attr("width", x.bandwidth())
			.style("fill", function(d, i){
				return colorScale(i);
			})
			.attr("height", 0)
			.transition()
			.duration(1000)
			.attr("y", function(d) { return (y(d)>0)?y(d):0 })
			.attr("height", function(d) { return (height - y(d)>0)?height - y(d):0 })
	}

	function updateDomainTips(data, keys) {

		var overallAvg = 0;

		data.forEach(function(d){
			var monthScore = 0;
			d["domains"].forEach(function(d){
				if (filter.compared == "self") {
					monthScore += d["topboxscore"];
				} else {
					monthScore += d["comparisons"][filter.compared];
				}
			});
			monthScore /= 5;
			overallAvg += monthScore;
		})
		
		overallAvg = (overallAvg/5).toFixed(1);

		var len 	 = keys["keywords"].length;
		var last_key = keys["keywords"][len-1];
		var keywords = keys["keywords"].slice(0, len-1).join(', ') + " and " + last_key;

		$(".doctor-tips .tips-big").html("Nice work!");
		$(".doctor-tips .tips-small").html('In the past six months, patients have described your care coordination as being "' + keywords + '."');
		$(".doctor-tips .tips-readmore").html('<a href="#">Read moro of their comments</a> here to see how you can improve.');
	}
});