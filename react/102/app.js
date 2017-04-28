'use strict';

var sample_data = {
	"All": {
		"all": {
			"hillary": 58,
			"trump": 2,
			"gary johnson": 1
		}
	},
	"Affiliation": {
		"fraternity": {
			"hillary": 30,
			"trump": 42,
			"gary johnson": 1
		},
		"sorority": {
			"hillary": 50,
			"trump": 52,
			"gary johnson": 3
		},
		"coed": {
			"hillary": 30,
			"trump": 42,
			"gary johnson": 1
		},
		"none": {
			"hillary": 30,
			"trump": 42,
			"gary johnson": 1
		},
		"other": {
			"hillary": 30,
			"trump": 42,
			"gary johnson": 1
		}
	}
};

class GroupBarChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data : [],
			legends : [],
			multiple : parseInt(this.props.multiple),
			colors : [],
			max : 0,
			groupWidth : "1%",
			groupMargin : "0.1%",
			barWidth : "1%",
			barMargin : "0.1%"
		}
	}

	componentWillMount() {
		this.dataInitialization();
		window.addEventListener("resize", this.render);
	}

	dataInitialization() {
		var scope = this;

		// data restructure
		var data = this.props.data;
		var _data = [];

		for (var prop in data[this.props.category]) {
			scope.state.legends.push(prop);
			var d = data[this.props.category][prop];
			for (var i in d) {
				if (_data[i] == undefined) {
					_data[i] = [d[i]];
				} else {
					_data[i].push(d[i]);
				}
			}
		}

		for (var i in _data) {
			scope.state.data.push({
				name : i,
				values : _data[i]
			})
		};
		
		scope.state.data.forEach(function(d){
			d.values.forEach(function(e){
				if (e > scope.state.max) {
					scope.state.max = e;
				}
			})
		});

		// set colors
		for (var i = 0; i < scope.state.legends.length; i++) {
			scope.state.colors.push(scope.getRandomColor());
		}

		// init state
		scope.state.groupWidth = 90 / scope.state.data.length + "%";
		scope.state.groupMargin = 5 / scope.state.data.length + "%";
		scope.state.barWidth = 90 / scope.state.data[0].values.length + "%";
		scope.state.barMargin = 5 / scope.state.data[0].values.length + "%";
	}

	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	render() {
		var data = this.state.data;
		var legends = this.state.legends;
		var colors = this.state.colors;
		var groupWidth = this.state.groupWidth;
		var groupMargin = this.state.groupMargin;
		var barWidth = this.state.barWidth;
		var barMargin = this.state.barMargin;
		var multiple = this.state.multiple;
		var max_height = this.state.max * multiple;
		return (
			<div className="html-graph">
				<div className="navi">
					<div className="navi-title">
						VIEW BY:
					</div>
					<div className="navi-list">
						<ul>
							<li>All</li>
							<li>Affiliation</li>
							<li>Athlete</li>
							<li>Class Year</li>
							<li>Financial Aid</li>
							<li>Gender</li>
							<li>Highschool</li>
							<li>Hometown</li>
							<li>Legacy</li>
							<li>Major</li>
							<li>Race</li>
						</ul>
					</div>
				</div>
				<div className="legend">
					{
						legends.map(function(d, i){
							return <div className="legend-line" key={i}>
									<div className="legend-box" style={{background : colors[i]}}></div>
									<div className="legend-name">{d}</div>
								</div>
						})
					}
				</div>
				<div className="bars-group">
					{
						data.map(function(d, i){
							return <div key={i} className="bars" style={{width : groupWidth, margin: "0 "+groupMargin}}>
								<div className="rect">
									{
										d.values.map(function(e, i){
											return <div className="bar" key={i} style={{width : barWidth, margin: "0 "+barMargin}}>
												<div className="bar-stick" style={{height: max_height+"px"}}>
													<div className="bar-stick-fill" style={{background: colors[i], height: (e * multiple)+"px"}}></div>
													<div className="value" style={{bottom: e * multiple + "px"}}>{e}</div>
												</div>
											</div>
										})
									}
								</div>
								<div className="name">{d.name}</div>
							</div>
						})
					}
				</div>
			</div>
		);
	}
}

class GroupBarChartSmall extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data : [],
			legends : [],
			colors : [],
			max : 0,
		}
	}

	componentWillMount() {
		this.dataInitialization();
		window.addEventListener("resize", this.render);
	}

	dataInitialization() {
		var scope = this;

		// data restructure
		var data = this.props.data;
		var _data = [];

		for (var prop in data[this.props.category]) {
			scope.state.legends.push(prop);
			var d = data[this.props.category][prop];
			for (var i in d) {
				if (_data[i] == undefined) {
					_data[i] = [d[i]];
				} else {
					_data[i].push(d[i]);
				}
			}
		}

		for (var i in _data) {
			scope.state.data.push({
				name : i,
				values : _data[i]
			})
		};
		
		scope.state.data.forEach(function(d){
			d.values.forEach(function(e){
				if (e > scope.state.max) {
					scope.state.max = e;
				}
			})
		});

		// set colors
		for (var i = 0; i < scope.state.legends.length; i++) {
			scope.state.colors.push(scope.getRandomColor());
		}

		// init state
		scope.state.groupWidth = 90 / scope.state.data.length + "%";
		scope.state.groupMargin = 5 / scope.state.data.length + "%";
		scope.state.barWidth = 90 / scope.state.data[0].values.length + "%";
		scope.state.barMargin = 5 / scope.state.data[0].values.length + "%";
	}

	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	render() {
		var data = this.state.data;
		var legends = this.state.legends;
		var colors = this.state.colors;
		var groupWidth = this.state.groupWidth;
		var groupMargin = this.state.groupMargin;
		var barWidth = this.state.barWidth;
		var barMargin = this.state.barMargin;
		var max_height = this.state.max;
		return (
			<div className="html-graph-small">
				<div className="navi">
					<select>
						<option>All</option>
						<option>Affiliation</option>
						<option>Athlete</option>
						<option>Class Year</option>
						<option>Financial Aid</option>
						<option>Gender</option>
						<option>Highschool</option>
						<option>Hometown</option>
						<option>Legacy</option>
						<option>Major</option>
						<option>Race</option>
					</select>
				</div>
				<div className="legend">
					{
						legends.map(function(d, i){
							return <div className="legend-line" key={i}>
									<div className="legend-box" style={{background : colors[i]}}></div>
									<div className="legend-name">{d}</div>
								</div>
						})
					}
				</div>
				<div className="bars-group">
					{
						data.map(function(d, i){
							return <div key={i} className="bars">
								<div className="name">
									{d.name}
								</div>
								<div className="rect">
									{
										d.values.map(function(e, i){
											return <div key={i} className="bar-stick">
												<div className="bar-stick-fill" style={{background: colors[i], width: e+"px"}}></div>
												<div className="value" style={{left: e + "px"}}>{e}</div>
											</div>
										})
									}
								</div>
							</div>
						})
					}
				</div>
			</div>
		);
	}
}

ReactDOM.render( <GroupBarChart category="Affiliation" data={sample_data} multiple="3"/> , document.getElementById('chart'));
ReactDOM.render( <GroupBarChartSmall category="Affiliation" data={sample_data}/> , document.getElementById('chart-small'));