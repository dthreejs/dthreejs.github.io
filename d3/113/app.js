var crosswalk_tree = function(target, ent_csv, ref_csv) {

	// Custom Event
	var event_data_loaded = new CustomEvent("EVENT_DATA_LOADED");
	var event_tree_updated = new CustomEvent("EVENT_TREE_UPDATED");

	document.body.addEventListener("EVENT_DATA_LOADED", function(e){
		console.log("EVENT_DATA_LOADED");
		draw_tree();
	}, false);
	document.body.addEventListener("EVENT_TREE_UPDATED", function(e){
		console.log("EVENT_TREE_UPDATED");
		draw_link();
	}, false);

	// Graph Helper
	var margin 	= {top: 50, right: 50, bottom: 50, left: 50};
		width 	= $(`#${target}`).width() - margin.left - margin.right,
		ent_w = width/2,
		ent_h = 1,
		ref_w = width/2,
		ref_h = 1,
		tooltip = d3.select(`#${target}`).append("div").attr("class", "tooltip hidden");
	// Data Helper
	var ent_data,
		ent_tree,
		ref_data,
		ref_tree;

	// Initialize
	init();

	// Functions

	function init() {
		data_load();
	}

	function data_load() {
		d3.csv(ent_csv, function(csv) { 
			ent_data = ent_data_parse(csv);
			d3.csv(ref_csv, function(csv) { 
				ref_data = ref_data_parse(csv);
				document.body.dispatchEvent(event_data_loaded);
			});
		});
	}

	function ent_data_parse(csv){
		var code_helper = ["L1_Code", "L2_Code", "L3_Code", "L4_Code", "L5_Code"];
		var name_helper = ["L1_Name", "L2_Name", "L3_Name", "L4_Name", "L5_Name"];
		var path_helper = {
			0 : null,
			1 : null,
			2 : null,
			3 : null,
			4 : null,
			depth : 0
		}
		var root = {
			view : "Entity",
			name : "Entity",
			children : []
		}
		var index = 0;
		csv.forEach(function(d){
			for (var i = 4; i >= 0; i--) {
				if(d[code_helper[i]]){
					if(i == 0){
						var t = {
							index : index,
							code : d["code"],
							name : d[name_helper[0]]
						};
						root["children"].push(t);
						path_helper[0] = t;
						path_helper.depth = 0;
					} else {
						if(d["code"] == ""){
							d["code"] = d[code_helper[i]];
						}
						var t = {
							index : index,
							code : d["code"],
							name : d[name_helper[i]]
						}
						path_helper[i] = t;
						if(i > path_helper.depth) {
							path_helper[i-1]["children"] = [t];
						} else {
							path_helper[i-1]["children"].push(t);
						}
						path_helper.depth = i;
					}
					index ++;
					break;
				}
			}
		});
		return root;
	}

	function ref_data_parse(csv){
		var name_helper = ["L1_Name", "L2_Name", "L3_Name"];
		var path_helper = {
			0 : null,
			1 : null,
			2 : null,
			depth : 0
		}
		var root = {
			view : "Reference",
			name : "Reference",
			children : []
		}
		var index = 0;
		csv.forEach(function(d){
			for (var i = 4; i >= 0; i--) {
				if(d[name_helper[i]]){
					if(i == 0){
						var t = {
							index: index,
							code : d["OG Ref CoA"],
							name : d[name_helper[0]]
						};
						root["children"].push(t);
						path_helper[0] = t;
						path_helper.depth = 0;
					} else {
						var t = {
							index: index,
							code : d["OG Ref CoA"],
							name : d[name_helper[i]]
						}
						path_helper[i] = t;
						if(i > path_helper.depth) {
							path_helper[i-1]["children"] = [t];
						} else {
							path_helper[i-1]["children"].push(t);
						}
						path_helper.depth = i;
					}
					index ++;
					break;
				}
			}
		});
		return root;
	}

	function draw_tree() {
		draw_ent_graph(ent_data);
		draw_ref_graph(ref_data);
		draw_link();
	}

	function draw_ent_graph(data) {

		var svg_container = d3.select(`#${target} svg`)
			.attr("width", width + margin.right + margin.left)
			.attr("height", ent_h + margin.top + margin.bottom)
		var svg = svg_container.append("g")
			.attr("class","entity")
			.attr("transform", "translate("+ margin.left + "," + margin.top + ")");

		var i = 0, duration = 750, root;

		// Assigns parent, children, height, depth
		root = d3.hierarchy(data, function(d) { return d.children });
		root.x0 = 0;
		root.y0 = 0;

		// Collapse after the second level
		root.children.forEach(collapse);

		// Collapse the node and all it's children
		function collapse(d) {
			if(d.children) {
				d._children = d.children
				d._children.forEach(collapse)
				d.children = null
			}
		}

		function update(source) {
			// declares a tree layout and assigns the size
			var treemap = d3.tree().nodeSize([50,0]);

			// Assigns the x and y position for the nodes
			var treeData = treemap(root);

			// Compute the new tree layout.
			var nodes = treeData.descendants(),
				links = treeData.descendants().slice(1);

			ent_h = d3.max(nodes, function(d){return d.x})-d3.min(nodes, function(d){return d.x});
			if (ent_h > ref_h) {
				svg_container.attr("height", ent_h + margin.top + margin.bottom);
			} else {
				svg_container.attr("height", ref_h + margin.top + margin.bottom);
			}

			// declares a tree layout and assigns the size
			treemap = d3.tree().size([ent_h, width]);
			treeData = treemap(root);
			nodes = treeData.descendants();
			links = treeData.descendants().slice(1);

			// Normalize for fixed-depth.
			nodes.forEach(function(d){ d.y = d.depth * 60});

			// ****************** Nodes section ***************************

			// Update the nodes...
			var node = svg.selectAll('g.node').data(nodes, function(d, i) {
				return d.data.index
			});

			// Enter any new modes at the parent's previous position.
			var nodeEnter = node.enter().append('g')
				.attr('class', 'node')
				.attr("transform", "translate(" + source.y0 + "," + source.x0 + ")")
				.on('click', click)
				.on('mousemove', mousemove)
				.on('mouseout', mouseout);

			// Add Circle for the nodes
			nodeEnter.append('circle')
				.attr('class', 'node')
				.attr('r', 1e-6)
				.style("fill", function(d) {
					return d._children ? "lightsteelblue" : "#fff";
				});

			// Add labels for the nodes
			nodeEnter.append('text')
				.attr("dx", ".35em")
				.attr("x", -17)
				.attr("text-anchor", "end")
				.text(function(d) {return d.data.code });

			// UPDATE
			var nodeUpdate = nodeEnter.merge(node);

			// Transition to the proper position for the node
			nodeUpdate.transition()
				.duration(duration)
				.attr("transform", function(d) { 
					return "translate(" + d.y + "," + d.x + ")";
				});

			// Update the node attributes and style
			nodeUpdate.select('circle.node')
				.attr('r', 10)
				.style("fill", function(d) {
					return d._children ? "lightsteelblue" : "#fff";
				})
				.attr('cursor', 'pointer');


			// Remove any exiting nodes
			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function(d) {
					return "translate(" + source.y + "," + source.x + ")";
				})
				.remove();

			// On exit reduce the node circles size to 0
			nodeExit.select('circle')
				.attr('r', 1e-6);

			// On exit reduce the opacity of text labels
			nodeExit.select('text')
				.style('fill-opacity', 1e-6);

			// ****************** links section ***************************

			// Update the links...
			var link = svg.selectAll('path.link')
				.data(links, function(d) { 
					return d.data.index
				});

			// Enter any new links at the parent's previous position.
			var linkEnter = link.enter().insert('path', "g")
				.attr("class", "link")
				.attr('d', function(d){
					var o = {x: source.x0, y: source.y0}
					return diagonal(o, o)
				});

			// UPDATE
			var linkUpdate = linkEnter.merge(link);

			// Transition back to the parent element position
			linkUpdate.transition()
				.duration(duration)
				.attr('d', function(d){ return diagonal(d, d.parent) });

			// Remove any exiting links
			var linkExit = link.exit().transition()
				.duration(duration)
				.attr('d', function(d) {
					var o = {x: source.x, y: source.y}
					return diagonal(o, o)
				})
				.remove();

			// Store the old positions for transition.
			nodes.forEach(function(d){
				d.x0 = d.x;
				d.y0 = d.y;
			});
			ent_tree = nodes;

			// Creates a curved (diagonal) path from parent to the child nodes
			function diagonal(s, d) {
				path = `M ${s.y} ${s.x}
					C ${(s.y + d.y) / 2} ${s.x},
					${(s.y + d.y) / 2} ${d.x},
					${d.y} ${d.x}`
				return path
			}

			// Toggle children on click.
			function click(d) {
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else {
					d.children = d._children;
					d._children = null;
				}
				update(d);
				document.body.dispatchEvent(event_tree_updated);
			}

			function mousemove(d) {
				tooltip.classed("hidden", false)
					.style("opacity", 1)
					.style("left", (d3.event.pageX+20) + "px")
					.style("top", d3.event.pageY + "px")
					.html(d.data.name);
			}
			function mouseout(d) {
				tooltip.classed("hidden", true).style("opacity", 0);
			}
		}

		update(root);
	}

	function draw_ref_graph(data) {

		var svg_container = d3.select(`#${target} svg`);
		var svg = svg_container.append("g")
			.attr("class","reference")
			.attr("transform", "translate("+ (margin.left + width/2) + "," + margin.top + ")");

		var i = 0, duration = 750, root;

		// Assigns parent, children, height, depth
		root = d3.hierarchy(data, function(d) { return d.children; });
		root.x0 = 0;
		root.y0 = 0;

		// Collapse after the second level
		root.children.forEach(collapse);

		// Collapse the node and all it's children
		function collapse(d) {
			if(d.children) {
				d._children = d.children
				d._children.forEach(collapse)
				d.children = null
			}
		}

		function update(source) {

			// declares a tree layout and assigns the size
			var treemap = d3.tree().nodeSize([50,0]);

			// Assigns the x and y position for the nodes
			var treeData = treemap(root);

			// Compute the new tree layout.
			var nodes = treeData.descendants(),
				links = treeData.descendants().slice(1);

			ref_h = d3.max(nodes, function(d){return d.x})-d3.min(nodes, function(d){return d.x});
			if(ref_h > ent_h){
				svg_container.attr("height", ref_h + margin.top + margin.bottom);
			} else {
				svg_container.attr("height", ent_h + margin.top + margin.bottom);
			}

			// declares a tree layout and assigns the size
			treemap = d3.tree().size([ref_h, width]);
			treeData = treemap(root);
			nodes = treeData.descendants();
			links = treeData.descendants().slice(1);

			// Normalize for fixed-depth.
			nodes.forEach(function(d){ d.y = d.depth * 60});

			// ****************** Nodes section ***************************

			// Update the nodes...
			var node = svg.selectAll('g.node').data(nodes, function(d, i) { return d.data.index });

			// Enter any new modes at the parent's previous position.
			var nodeEnter = node.enter().append('g')
				.attr('class', 'node')
				.attr("transform", "translate(" + (width/2 -source.y0) + "," + source.x0 + ")")
				.on('click', click)
				.on('mousemove', mousemove)
				.on('mouseout', mouseout);

			// Add Circle for the nodes
			nodeEnter.append('circle')
				.attr('class', 'node')
				.attr('r', 1e-6)
				.style("fill", function(d) {
					return d._children ? "lightsteelblue" : "#fff";
				});

			// Add labels for the nodes
			nodeEnter.append('text')
				.attr("dx", ".35em")
				.attr("x", -17)
				.attr("text-anchor", "end")
				.text(function(d) {return d.data.code });

			// UPDATE
			var nodeUpdate = nodeEnter.merge(node);

			// Transition to the proper position for the node
			nodeUpdate.transition()
				.duration(duration)
				.attr("transform", function(d) { 
					return "translate(" + (width/2 - d.y) + "," + d.x + ")";
				});

			// Update the node attributes and style
			nodeUpdate.select('circle.node')
				.attr('r', 10)
				.style("fill", function(d) {
					return d._children ? "lightsteelblue" : "#fff";
				})
				.attr('cursor', 'pointer');


			// Remove any exiting nodes
			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function(d) {
					return "translate(" + (width/2 - source.y) + "," + source.x + ")";
				})
				.remove();

			// On exit reduce the node circles size to 0
			nodeExit.select('circle')
				.attr('r', 1e-6);

			// On exit reduce the opacity of text labels
			nodeExit.select('text')
				.style('fill-opacity', 1e-6);

			// ****************** links section ***************************

			// Update the links...
			var link = svg.selectAll('path.link')
				.data(links, function(d) { return d.data.index });

			// Enter any new links at the parent's previous position.
			var linkEnter = link.enter().insert('path', "g")
				.attr("class", "link")
				.attr('d', function(d){
					var o = {x: source.x0, y: source.y0}
					return diagonal(o, o)
				});

			// UPDATE
			var linkUpdate = linkEnter.merge(link);

			// Transition back to the parent element position
			linkUpdate.transition()
				.duration(duration)
				.attr('d', function(d){ return diagonal(d, d.parent) });

			// Remove any exiting links
			var linkExit = link.exit().transition()
				.duration(duration)
				.attr('d', function(d) {
					var o = {x: source.x, y: source.y}
					return diagonal(o, o)
				})
				.remove();

			// Store the old positions for transition.
			nodes.forEach(function(d){
				d.x0 = d.x;
				d.y0 = d.y;
			});
			ref_tree = nodes;

			// Creates a curved (diagonal) path from parent to the child nodes
			function diagonal(s, d) {
				path = `M ${width/2 - s.y} ${s.x}
					C ${(width - s.y - d.y) / 2} ${s.x},
					${(width - s.y - d.y) / 2} ${d.x},
					${width/2 - d.y} ${d.x}`
				return path
			}
			// Toggle children on click.
			function click(d) {
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else {
					d.children = d._children;
					d._children = null;
				}
				update(d);
				document.body.dispatchEvent(event_tree_updated);
			}
			function mousemove(d) {
				tooltip.classed("hidden", false)
					.style("opacity", 1)
					.style("top", d3.event.pageY + "px")
					.html(d.data.name);
				var tooltip_w = $(`#${target} .tooltip`).outerWidth();
				tooltip.style("left", (d3.event.pageX - 10 - tooltip_w) + "px")
			}
			function mouseout(d) {
				tooltip.classed("hidden", true).style("opacity", 0);
			}
		}
		update(root);
	}
	function draw_link() {
		console.log(ent_tree);
		console.log(ref_tree);
	}
}

var coa_tree = new crosswalk_tree("crosswalk-chart", "OG.csv", "MA.csv");