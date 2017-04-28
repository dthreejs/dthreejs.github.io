function stext() {
	var container = '',
		width = 0,
		height = 0,
		svg = null,
		text = null,
		rawText = '',
		textAlgin = 'start',
		rowCount = 1,
		rowSpacing = 0.4,
		rowSpaceCount = 0,
		fontRT = 1
		margin = {
			top : 10,
			bottom : 10,
			left : 10,
			right : 10
		},
		fontColor = "#000";

	this.init = function(id) {
		container = "#" + id;

		width 	= $(container).innerWidth() - margin.left - margin.right;
		height 	= $(container).innerHeight() - margin.top - margin.bottom;

		svg 	= d3.select(container).append('svg');
		text 	= svg.append('text');
		text 	= svg.append('text').text('a').style('font-size', '1000pt');
		fontRT 	= 1000 / text.node().getBBox().height;
		text.text('');

		return this;
	}

	this.text = function(string) {
		rawText = string;
		draw();
		window.addEventListener("resize", draw);
		return this;
	}

	this.align = function(anchor) {
		textAlgin = anchor;
		draw(rawText);
		return this;
	}

	this.color = function(color) {
		fontColor = color;
		draw(rawText);
		return this;
	}

	this.resize = function() {

		draw();

		window.addEventListener("resize", draw);
	}

	function draw() {

		width 	= $(container).innerWidth() - margin.left - margin.right;
		height 	= $(container).innerHeight() - margin.top - margin.bottom;
		
		// Estimated row count
		var rowCount = rawText.split(".").length || 1;
		var rowSpaceCount = rawText.split(".").length - 1 || 0;

		var lines = [];
		
		var count_state = null;
		var first_match = true;
		var match_end = false;
		
		while(!match_end){

			var result = get_lines(height * fontRT / rowCount);

			lines = result[0];
			count = result[1];
			paragraphPoint = result[2];
			if(count == rowCount) {
				match_end = true;
			}
			if (count < rowCount) {
				match_end = true;
			}
			if (count > rowCount) {
				rowCount ++;
			}
		}

		draw_text(lines, rowCount, paragraphPoint);
	}

	function get_lines(font_size) {
		var cur_row = 0,
			chars = rawText.split(''),
			lines = [''],
			paragraphPoint = [];

		text.style('font-size', font_size + 'pt');

		$.each(chars, function(i, d){
			text.selectAll("tspan").remove();
			text.append("tspan").text(lines[cur_row] + d);

			var line_width = text.node().getBBox().width;

			if(line_width >= width){
				if(d != ' ') {
					var p = lines[cur_row].split(' ');
					if (p.length == 1) {
						lines.push(d);
					} else {
						lines.push(p[p.length-1] + d);
						p.pop()
						lines[cur_row] = p.join(' ');
					}
				} else {
					lines.push('');
				}
				cur_row ++;
			} else {
				lines[cur_row] += d;
				if(d  == '.') {
					if(i != chars.length-1){
						paragraphPoint.push(cur_row+1);
						cur_row ++;
						lines.push('');
					}
				}
			}
		});
		
		return [lines, cur_row + 1, paragraphPoint];
	}

	function draw_text(lines, rowCount, paragraphPoint) {

		var p = 0;
		var fontSize = fontRT * height / (rowCount);
		var fontHeight = height / rowCount;
		text.selectAll("tspan").remove();
		text.style('font-size', fontSize + 'pt');
		lines.forEach(function(d, i){
			if(i == paragraphPoint[p]) {
				p ++;
			}
			text.append('tspan')
				.text(d)
				.attr('dy', '0.88em')
				.attr('x', 0)
				.attr('y', i * fontHeight + p * fontSize * rowSpacing);
		});

		// Adjust font-size to fit height

		var size = text.node().getBBox();

		if (size.height > height) {
			p = 0;
			fontSize = fontSize * height / size.height;
			fontHeight = fontHeight * height / size.height;
			text.style('font-size', fontSize + 'pt');
			text.selectAll("tspan").remove();
			lines.forEach(function(d, i){
				if(i == paragraphPoint[p]) {
					p ++;
				}
				text.append('tspan')
					.text(d)
					.attr('dy', '0.88em')
					.attr('x', 0)
					.attr('y', i * fontHeight + p * fontSize * rowSpacing)
			});
		}
		
		// Adjust font-size to fit width

		size = text.node().getBBox();

		if (size.width > width) {
			p = 0;
			fontSize = fontSize * width / size.width;
			fontHeight = fontHeight * width / size.width;
			text.style('font-size', fontSize + 'pt');
			text.selectAll("tspan").remove();
			lines.forEach(function(d, i){
				if(i == paragraphPoint[p]) {
					p ++;
				}
				text.append('tspan')
					.text(d)
					.attr('dy', '0.88em')
					.attr('x', 0)
					.attr('y',  i * fontHeight + p * fontSize * rowSpacing)
			});
		}

		// Positioning to middle

		size = text.node().getBBox();

		var w_off = margin.left + (width - size.width) / 2;
		var h_off = margin.top + (height - size.height) / 2;

		text.selectAll("tspan").remove();
		p = 0;
		lines.forEach(function(d, i){
			if(i == paragraphPoint[p]) {
				p ++;
			}
			text.append('tspan')
				.text(d)
				.attr('dy', '0.88em')
				.attr('x', w_off)
				.attr('y', i * fontHeight + p * fontSize * rowSpacing + h_off)
		});

		// Apply align

		switch(textAlgin){
			case "center":
				text.selectAll("tspan")
					.attr("x", margin.left + width/2)
					.style("text-anchor", "middle");
				break;
			case "right":
				text.selectAll("tspan")
					.attr("x", width - margin.right)
					.style("text-anchor", "end");
				break;
		}

		// Apply color

		text.selectAll("tspan").style("fill", fontColor);
	}
}

var test = new stext();
test.init("container")
	.text("Antidisestablishmentarianism")
	.align("center")
	.color("#f00");