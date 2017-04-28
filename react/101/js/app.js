'use strict';

// widget items
var Button = React.createClass({
	render: function() {
		if(this.props.icon){
			if(this.props.pos == 'before'){
				return ( 
					<button {...this.props} className = {(this.props.className || '') + ' btn'}>
						<img src={this.props.icon} />&nbsp;{this.props.title}
					</button>
				);
			}
			if(this.props.pos == 'after'){
				return ( 
					<button {...this.props} className = {(this.props.className || '') + ' btn'}>
						{this.props.title}&nbsp;<img src={this.props.icon} />
					</button>
				);
			}
		}
		return ( <button {...this.props} className = {(this.props.className || '') + ' btn'}></button> );
	}
});

var RequestForm = React.createClass({
	componentDidMount: function() {
		// When the component is added, turn it into a modal
		$(this.refs.root).modal({
			backdrop: 'static',
			keyboard: false,
			show: false
		});
		$(this.refs.root).on('hidden.bs.modal', this.handleHidden);
	},
	componentWillUnmount: function() {
		$(this.refs.root).off('hidden.bs.modal', this.handleHidden);
	},
	close: function() {
		$(this.refs.root).modal('hide');
		this.clearFields();
	},
	open: function() {
		$(this.refs.root).modal('show');
		this.clearFields();
	},
	onConfirm: function() {
		this.close();
	},
	clearFields: function() {
		$(this.refs.name).val('');
		$(this.refs.email).val('');
		$(this.refs.phone).val('');
		$(this.refs.street).val('');
		$(this.refs.city).val('');
		$(this.refs.province).val('');
		$(this.refs.country).val('');
		$(this.refs.postal).val('');
		$(this.refs.service1).removeAttr('checked');
		$(this.refs.service2).removeAttr('checked');
		$(this.refs.service3).removeAttr('checked');
	},
	render: function() {
		var confirmButton = null;
		var cancelButton = null;
		if (this.props.confirm) {
			confirmButton = ( <Button onClick = {this.onConfirm} className = "btn-primary"> {this.props.confirm} </Button> );
		}
		if (this.props.cancel) {
			cancelButton = ( <Button onClick = {this.close} className = "btn-default" > {this.props.cancel} </Button> );
		}

		// styles
		var container = { 
			padding : '160px 0'
		}
		var modal = { 
			width : '100%' 
		}
		var modalContent = { 
			padding : '30px 60px' 
		}
		var sectionTitle = { 
			color : '#5f8ac7', 
			fontSize : '20px', 
			paddingBottom : '20px' 
		}
		var modalText = { 
			color : '#373a3c', 
			fontSize : '16px', 
			fontWeight : '400' 
		}
		return ( 
			<div className = "modal fade" ref = "root" >
				<div className="container" style={container}>
					<div className="row col-xs-12 col-sm-offset-1 col-sm-10">
						<div className = "modal-dialog" style={modal} >
							<div className = "modal-content" style={modalContent}>
								<div className = "modal-body" >
									<div className="row">
										<div className="col-xs-12 col-sm-4">
											<h4 style={sectionTitle}> Customer </h4>
											<div className="form-group">
												<label for="name" style={modalText}>Name</label>
												<input type="text" className="form-control" id="name" ref="name"/>
											</div>
											<div className="form-group">
												<label for="email" style={modalText}>Email</label>
												<input type="text" className="form-control" id="email" ref="email"/>
											</div>
											<div className="form-group">
												<label for="phone" style={modalText}>Phone</label>
												<input type="text" className="form-control" id="phone" ref="phone"/>
											</div>
										</div>
										<div className="col-xs-12 col-sm-5">
											<h4 style={sectionTitle}> Address </h4>
											<div className="form-group">
												<label for="street" style={modalText}>Street</label>
												<input type="text" className="form-control" id="street" ref="street"/>
											</div>
											<div className="form-group">
												<label for="city" style={modalText}>City</label>
												<input type="text" className="form-control" id="city" ref="city"/>
											</div>
											<div className="form-group">
												<label for="province" style={modalText}>State/Province</label>
												<input type="text" className="form-control" id="province" ref="province"/>
											</div>
											<div className="form-group">
												<label for="country" style={modalText}>Country</label>
												<select name="country" className="form-control" id="country" ref="country">
													<option value="">Country...</option>
													<option value="AU">Australia</option>
													<option value="US">United States</option>
													<option value="GB">United Kingdom</option>
													<option value="AF">Afghanistan</option>
													<option value="AL">Albania</option>
													<option value="DZ">Algeria</option>
													<option value="AS">American Samoa</option>
													<option value="AD">Andorra</option>
													<option value="AG">Angola</option>
													<option value="AI">Anguilla</option>
													<option value="AG">Antigua &amp; Barbuda</option>
													<option value="AR">Argentina</option>
													<option value="AA">Armenia</option>
													<option value="AW">Aruba</option>
													<option value="AT">Austria</option>
													<option value="AZ">Azerbaijan</option>
													<option value="BS">Bahamas</option>
													<option value="BH">Bahrain</option>
													<option value="BD">Bangladesh</option>
													<option value="BB">Barbados</option>
													<option value="BY">Belarus</option>
													<option value="BE">Belgium</option>
													<option value="BZ">Belize</option>
													<option value="BJ">Benin</option>
													<option value="BM">Bermuda</option>
													<option value="BT">Bhutan</option>
													<option value="BO">Bolivia</option>
													<option value="BL">Bonaire</option>
													<option value="BA">Bosnia</option>
													<option value="BW">Botswana</option>
													<option value="BR">Brazil</option>
													<option value="BN">Brunei</option>
													<option value="BG">Bulgaria</option>
													<option value="BF">Burkina Faso</option>
													<option value="BI">Burundi</option>
													<option value="KH">Cambodia</option>
													<option value="CM">Cameroon</option>
													<option value="CA">Canada</option>
													<option value="CF">Central African Republic</option>
													<option value="TD">Chad</option>
													<option value="CL">Chile</option>
													<option value="CN">China</option>
													<option value="CI">Christmas Island</option>
													<option value="CO">Colombia</option>
													<option value="CG">Congo</option>
													<option value="CK">Cook Islands</option>
													<option value="CR">Costa Rica</option>
													<option value="HR">Croatia</option>
													<option value="CU">Cuba</option>
													<option value="CB">Curacao</option>
													<option value="CY">Cyprus</option>
													<option value="CZ">Czech Republic</option>
													<option value="DK">Denmark</option>
													<option value="DJ">Djibouti</option>
													<option value="DM">Dominica</option>
													<option value="DO">Dominican Republic</option>
													<option value="TM">East Timor</option>
													<option value="EC">Ecuador</option>
													<option value="EG">Egypt</option>
													<option value="SV">El Salvador</option>
													<option value="GQ">Equatorial Guinea</option>
													<option value="ER">Eritrea</option>
													<option value="EE">Estonia</option>
													<option value="ET">Ethiopia</option>
													<option value="FO">Faroe Islands</option>
													<option value="FJ">Fiji</option>
													<option value="FI">Finland</option>
													<option value="FR">France</option>
													<option value="GA">Gabon</option>
													<option value="GM">Gambia</option>
													<option value="GE">Georgia</option>
													<option value="DE">Germany</option>
													<option value="GH">Ghana</option>
													<option value="GB">Great Britain</option>
													<option value="GR">Greece</option>
													<option value="GL">Greenland</option>
													<option value="GD">Grenada</option>
													<option value="GP">Guadeloupe</option>
													<option value="GU">Guam</option>
													<option value="GT">Guatemala</option>
													<option value="GN">Guinea</option>
													<option value="GY">Guyana</option>
													<option value="HT">Haiti</option>
													<option value="HW">Hawaii</option>
													<option value="HN">Honduras</option>
													<option value="HK">Hong Kong</option>
													<option value="HU">Hungary</option>
													<option value="IS">Iceland</option>
													<option value="IN">India</option>
													<option value="ID">Indonesia</option>
													<option value="IA">Iran</option>
													<option value="IQ">Iraq</option>
													<option value="IR">Ireland</option>
													<option value="IM">Isle of Man</option>
													<option value="IL">Israel</option>
													<option value="IT">Italy</option>
													<option value="JM">Jamaica</option>
													<option value="JP">Japan</option>
													<option value="JO">Jordan</option>
													<option value="KZ">Kazakhstan</option>
													<option value="KE">Kenya</option>
													<option value="KI">Kiribati</option>
													<option value="NK">Korea North</option>
													<option value="KS">Korea South</option>
													<option value="KW">Kuwait</option>
													<option value="KG">Kyrgyzstan</option>
													<option value="LA">Laos</option>
													<option value="LV">Latvia</option>
													<option value="LB">Lebanon</option>
													<option value="LS">Lesotho</option>
													<option value="LR">Liberia</option>
													<option value="LY">Libya</option>
													<option value="LI">Liechtenstein</option>
													<option value="LT">Lithuania</option>
													<option value="LU">Luxembourg</option>
													<option value="MO">Macau</option>
													<option value="MK">Macedonia</option>
													<option value="MG">Madagascar</option>
													<option value="MY">Malaysia</option>
													<option value="MW">Malawi</option>
													<option value="MV">Maldives</option>
													<option value="ML">Mali</option>
													<option value="MT">Malta</option>
													<option value="MX">Mexico</option>
													<option value="MD">Moldova</option>
													<option value="MC">Monaco</option>
													<option value="MN">Mongolia</option>
													<option value="MS">Montserrat</option>
													<option value="MA">Morocco</option>
													<option value="MZ">Mozambique</option>
													<option value="MM">Myanmar</option>
													<option value="NA">Nambia</option>
													<option value="NU">Nauru</option>
													<option value="NP">Nepal</option>
													<option value="NL">Netherlands</option>
													<option value="NV">Nevis</option>
													<option value="NC">New Caledonia</option>
													<option value="NZ">New Zealand</option>
													<option value="NI">Nicaragua</option>
													<option value="NE">Niger</option>
													<option value="NG">Nigeria</option>
													<option value="NW">Niue</option>
													<option value="NF">Norfolk Island</option>
													<option value="NO">Norway</option>
													<option value="OM">Oman</option>
													<option value="PK">Pakistan</option>
													<option value="PW">Palau Island</option>
													<option value="PS">Palestine</option>
													<option value="PA">Panama</option>
													<option value="PG">Papua New Guinea</option>
													<option value="PY">Paraguay</option>
													<option value="PE">Peru</option>
													<option value="PH">Philippines</option>
													<option value="PO">Pitcairn Island</option>
													<option value="PL">Poland</option>
													<option value="PT">Portugal</option>
													<option value="PR">Puerto Rico</option>
													<option value="QA">Qatar</option>
													<option value="ME">Montenegro</option>
													<option value="RS">Serbia</option>
													<option value="RE">Reunion</option>
													<option value="RO">Romania</option>
													<option value="RU">Russia</option>
													<option value="RW">Rwanda</option>
													<option value="SO">Samoa</option>
													<option value="SA">Saudi Arabia</option>
													<option value="SN">Senegal</option>
													<option value="RS">Serbia</option>
													<option value="SC">Seychelles</option>
													<option value="SL">Sierra Leone</option>
													<option value="SG">Singapore</option>
													<option value="SK">Slovakia</option>
													<option value="SI">Slovenia</option>
													<option value="SB">Solomon Islands</option>
													<option value="OI">Somalia</option>
													<option value="ZA">South Africa</option>
													<option value="ES">Spain</option>
													<option value="LK">Sri Lanka</option>
													<option value="SD">Sudan</option>
													<option value="SR">Suriname</option>
													<option value="SZ">Swaziland</option>
													<option value="SE">Sweden</option>
													<option value="CH">Switzerland</option>
													<option value="TA">Tahiti</option>
													<option value="TW">Taiwan</option>
													<option value="TJ">Tajikistan</option>
													<option value="TZ">Tanzania</option>
													<option value="TH">Thailand</option>
													<option value="TG">Togo</option>
													<option value="TK">Tokelau</option>
													<option value="TO">Tonga</option>
													<option value="TT">Trinidad &amp; Tobago</option>
													<option value="TN">Tunisia</option>
													<option value="TR">Turkey</option>
													<option value="TU">Turkmenistan</option>
													<option value="TV">Tuvalu</option>
													<option value="UG">Uganda</option>
													<option value="UA">Ukraine</option>
													<option value="AE">United Arab Emirates</option>
													<option value="UY">Uruguay</option>
													<option value="UZ">Uzbekistan</option>
													<option value="VU">Vanuatu</option>
													<option value="VS">Vatican City State</option>
													<option value="VE">Venezuela</option>
													<option value="VN">Vietnam</option>
													<option value="VB">Virgin Islands (Brit)</option>
													<option value="VA">Virgin Islands (USA)</option>
													<option value="YE">Yemen</option>
													<option value="ZR">Zaire</option>
													<option value="ZM">Zambia</option>
													<option value="ZW">Zimbabwe</option>
												</select>
											</div>
											<div className="form-group">
												<label for="postal" style={modalText}>Postal</label>
												<input type="text" className="form-control" id="postal" ref="postal"/>
											</div>
										</div>
										<div className="col-xs-12 col-sm-3">
											<h4 style={sectionTitle}> Service </h4>
											<div className="checkbox">
												<label style={modalText}><input type="checkbox" value="" ref="service1"/>Three hour</label>
											</div>
											<div className="checkbox">
												<label style={modalText}><input type="checkbox" value="" ref="service2"/>Twighligh</label>
											</div>
											<div className="checkbox">
												<label style={modalText}><input type="checkbox" value="" ref="service3"/>Next</label>
											</div>
										</div>
									</div>
									<div className="row text-right">
										{cancelButton} {confirmButton}
									</div>
								</div>
							</div> 
						</div> 
					</div>
				</div>  
			</div>
		);
	}
});

var GMap = React.createClass({
	propTypes: {
		server : React.PropTypes.object
	},
	getInitialState: function() {
		return {
			map: null, 
			markers : [],
			truck_icon : null
		};
	},
	componentDidMount: function() {
		this.loadData();
	},
	loadData : function() {
		var state = this.state;
		$.ajax({
			url: this.props.server.url,
			headers: this.props.server.headers,
			dataType: 'json',
			cache: false,
			success: function(data) {
				state.truck_icon = '<div><svg width="64" height="64" viewBox="0 0 520 520" xml:space=preserve xmlns=http://www.w3.org/2000/svg><g transform="translate(130,0)"><g><path d=M44.563,15.715c-9.238,3.802-11.412,9.502-13.043,17.105c-5.435,7.738-7.473,20.566-7.473,33.396c0,5.704,0.951,54.582,0.951,64.352c0,20.092-1.087,73.31-1.087,99.919c0,26.61,1.087,104.265,1.087,133.59c0,29.324-1.086,73.453,1.087,89.202c2.173,15.749,11.956,30.811,15.217,34.612c3.261,3.801,28.19,21.721,90.142,21.721s86.881-17.92,90.142-21.721c3.26-3.802,13.043-18.864,15.216-34.612c2.174-15.748,1.087-59.878,1.087-89.202c0-29.325,1.087-106.979,1.087-133.59c0-26.609-1.087-79.827-1.087-99.919c0-9.771,0.951-58.648,0.951-64.352c0-12.829-2.038-25.658-7.473-33.396c-1.63-7.604-3.805-13.304-13.042-17.105c-9.238-3.802-26.832-10.59-86.881-10.59C71.394,5.125,53.8,11.913,44.563,15.715z fill=#FFFFFF stroke=#231F20 stroke-width=4.5 /><path d=M30.162,461.689c0-13.848-0.563-52.549-5.173-92.458 fill=none stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_1_ x1=21.4616 x2=24.1432 y1=250.8172 y2=250.8172><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M23.926,236.464c-1.701,3.658-2.465,8.805-2.465,13.871c0,6.487,0.824,11.61,2.682,14.836C24.039,254.05,23.957,244.072,23.926,236.464z fill=url(#SVGID_1_) stroke=#231F20 stroke-width=1.9138 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_2_ x1=21.4704 x2=24.192 y1=211.7684 y2=211.7684><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M24.192,197.367c-1.884,3.679-2.722,9.094-2.722,14.413c0,6.205,0.761,11.147,2.45,14.391C23.951,217.979,24.056,207.946,24.192,197.367z fill=url(#SVGID_2_) stroke=#231F20 stroke-width=1.9138 /><path d=M24.999,130.569c0-20.092,4.12-86.546,6.521-97.748 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M28.686,118.781c1.007-23.117,3.18-55.975,4.953-71.319c0.356-3.079,5.488-1.812,6.915,5.925c1.427,7.741,3.872,17.105,3.872,68.628 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M30.304,118.781c1.007-23.117,3.18-55.975,4.953-71.319 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M27.947,341.539c-0.296-34.082-0.908-79.963-0.908-101.004c0-3.681,0.378-5.499,9.848-5.499c5.081,0,6.153,1.46,6.153,1.46 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M32.9,135.453c0,0.98-0.021,1.889-0.021,2.718c0,15.445-0.939,50.462-0.939,77.923c0,1.837,2.811,2.362,8.818,0.208c2.643-0.948,3.749-3.734,3.749-6.211c0-2.478,0-70.357,0-70.357s-1.507-6.11-5.176-6.314c-3.668-0.203-3.668-0.407-4.891-0.407C33.218,133.012,32.9,133.411,32.9,135.453z fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M39.128,376.16c-4.482,0-6.256-9.623-6.27-12.628 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M29.754,138.171 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M19.972,162.744 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M25.199,120.495c3.487-1.714,6.593-2.146,10.669-1.331c4.075,0.814,14.469,1.833,14.469,11.607c0,9.775,0,84.511,0,94.693c0,10.183-1.427,71.683-5.299,94.286c-3.871,22.604-6.521,43.579-19.156,46.023 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M44.63,208.767c0-10.182,0-58.401,0-68.176c0-9.774-10.312-11.608-14.469-11.608c-1.834,0-1.978,2.603-2.038,9.323c-0.217,24.03-0.984,54.273-0.984,82.27c0,2.241,3.023,1.834,8.117,0.001C40.351,218.745,44.63,217.931,44.63,208.767z fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M28.419,354.778v6.968c9.037-6.141,11.684-25.114,13.359-45.049 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M23.912,230.488c8.429-3.789,14.337-4.372,26.425-4.566 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M57.469,39.336c0,9.775,0,175.947,0,186.129c0,10.183-1.427,71.683-5.299,94.286 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M53.393,39.336c0,9.775,0,175.947,0,186.129c0,10.183-1.427,71.683-5.299,94.286 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M60.729,43.816c0,9.775,0,171.467,0,181.649c0,9.983-1.371,69.296-5.073,92.917 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M36.479,455.377c0,0-3.465-55.188-3.465-65.777c0-10.589,2.445-11.811,4.076-18.531c1.63-6.72,7.336-31.158,9.578-44.801 fill=none stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_3_ x1=74.5023 x2=31.53 y1=497.9024 y2=454.9301><stop offset=0 style=stop-color:#8EC5DF /><stop offset=1 style=stop-color:#FFF /></linearGradient><path d=M35.052,461.079c0,4.277,0.611,12.422,5.299,17.309c4.687,4.888,13.042,10.793,19.155,14.051c0,0-0.814,0.408,2.446,2.038c3.26,1.628,9.374,3.664,10.801,3.462c1.426-0.204,0.814-2.444-0.204-5.702c-1.02-3.258-4.279-12.218-7.133-16.902c-2.853-4.684-14.876-16.292-18.545-17.92C43.204,455.784,35.052,452.676,35.052,461.079z fill=url(#SVGID_3_) stroke=#231F20 stroke-width=0.8506 /><line fill=none stroke=#231F20 stroke-width=0.8506 x1=46.872 x2=38.72 y1=457.413 y2=397.339 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_4_ x1=43.6907 x2=58.2496 y1=35.7836 y2=21.2247><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M33.294,32.114l20.1,7.222h4.076c0,0,0-2.968,0-4.146c0-1.178-4.5-9.671-6.295-12.192c-0.876-1.233-2.604-2.938-4.244-4.413C38.914,21.893,35.196,26.077,33.294,32.114z fill=url(#SVGID_4_) stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_5_ x1=124.4479 x2=151.0758 y1=24.8106 y2=24.8106><stop offset=0 style=stop-color:#F59579 /><stop offset=1 style=stop-color:#CD181F /></linearGradient><path d=M150.125,25.761c0.525,0,0.951-0.423,0.951-0.949l0,0c0-0.525-0.426-0.952-0.951-0.952h-24.726c-0.525,0-0.951,0.427-0.951,0.952l0,0c0,0.526,0.426,0.949,0.951,0.949H150.125z fill=url(#SVGID_5_) stroke=#231F20 stroke-width=0.8506 /><path d=M118.469,43.414c-1.901-5.977-3.495-11.186-3.514-15.233c-0.018-4.047,0-15.379,0-15.379 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M232.725,461.689c0-13.848,0.564-52.549,5.173-92.458 fill=none stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_6_ x1=34.4997 x2=228.3874 y1=495.2 y2=495.2><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M221.586,487.891c-3.261,3.801-28.19,21.721-90.142,21.721s-86.881-17.92-90.142-21.721c-1.419-1.656-4.076-5.448-6.802-10.499H34.5c2.183,10.364,8.297,18.917,16.041,22.174c7.743,3.258,37.292,13.441,80.903,13.441c43.61,0,73.159-10.183,80.903-13.441c7.744-3.258,13.857-11.811,16.04-22.174h-0.001C225.661,482.443,223.004,486.236,221.586,487.891z fill=url(#SVGID_6_) stroke=#231F20 stroke-width=1.9138 /><path d=M188.708,494.679c-9.781,2.444-43.406,10.59-57.264,10.59c-13.857,0-47.482-8.146-57.265-10.59 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M197.471,475.334c-9.782,2.444-52.17,12.624-66.027,12.624c-13.857,0-56.245-10.181-66.027-12.624 fill=none stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_7_ x1=238.7438 x2=241.4254 y1=250.8172 y2=250.8172><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M238.962,236.464c1.7,3.658,2.464,8.805,2.464,13.871c0,6.487-0.823,11.61-2.682,14.836C238.849,254.05,238.93,244.072,238.962,236.464z fill=url(#SVGID_7_) stroke=#231F20 stroke-width=1.9138 /><path d=M237.888,130.569c0-20.092-4.12-86.546-6.521-97.748 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M234.94,341.539c0.297-34.082,0.909-79.963,0.909-101.004c0-3.681-0.378-5.499-9.849-5.499c-5.08,0-6.153,1.46-6.153,1.46 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M226.409,52.979c2.547,41.646,3.6,84.363,3.6,85.192c0,15.445,0.938,50.462,0.938,77.923c0,1.837-2.811,2.362-8.818,0.208c-2.643-0.948-3.748-3.835-3.748-6.313 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M223.759,376.16c4.483,0,6.256-9.623,6.27-12.628 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M233.133,138.171 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M242.915,162.744 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M212.55,225.465c0,10.183,1.427,71.683,5.299,94.286c3.872,22.604,6.521,43.579,19.156,46.023 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M234.763,138.306c0.217,24.03,0.984,54.273,0.984,82.27c0,2.241-3.022,1.834-8.116,0.001c-5.095-1.833-9.374-2.647-9.374-11.811c0-10.182,0-58.401,0-68.176l0.203-18.576c0-51.523,2.445-60.888,3.872-68.628c1.427-7.737,6.559-9.004,6.915-5.925c1.773,15.344,3.946,48.203,4.953,71.319L234.763,138.306z fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M234.469,354.778v6.968c-9.038-6.141-11.685-25.114-13.359-45.049 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M238.975,230.488c-8.429-3.789-14.337-4.372-26.425-4.566 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M205.419,39.336c0,9.775,0,175.947,0,186.129c0,10.183,1.426,71.683,5.298,94.286 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M209.494,39.336c0,9.775,0,175.947,0,186.129c0,10.183,1.427,71.683,5.299,94.286 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M202.158,43.816c0,9.775,0,171.467,0,181.649c0,9.983,1.371,69.296,5.074,92.917 fill=none stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_8_ x1=37.894 x2=224.9937 y1=371.675 y2=371.675><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M131.444,327.286c-23.436,0-56.926-4.361-69.491-7.738c-6.252-1.681-11.859-1.201-13.082,5.315c-1.223,6.517-7.457,40.235-9.743,51.297c-1.593,7.712-1.549,12.614-0.407,21.179c0.815,6.109,31.384,27.288,92.724,27.288s91.908-21.179,92.723-27.288c1.143-8.565,1.187-13.466-0.407-21.179c-2.286-11.062-8.521-44.781-9.743-51.297c-1.223-6.516-6.83-6.996-13.081-5.315C188.369,322.925,154.879,327.286,131.444,327.286z fill=url(#SVGID_8_) stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_9_ x1=39.4962 x2=223.577 y1=366.633 y2=366.633><stop offset=0 style=stop-color:#7EA5B8 /><stop offset=0.1953 style=stop-color:#93D8F7 /><stop offset=0.2663 style=stop-color:#CDE1EC /><stop offset=0.3491 style=stop-color:#82BDD7 /><stop offset=1 style=stop-color:#81B1C7 /></linearGradient><path d=M131.444,329.042c-23.159,0-56.255-4.272-68.673-7.581c-6.179-1.646-11.72-1.176-12.929,5.207c-1.208,6.384-7.743,39.345-9.628,50.254c-0.865,5.015-0.883,5.717-0.402,8.956c0.885,5.975,31.014,26.733,91.632,26.733c60.617,0,90.76-20.757,91.632-26.733c0.596-4.088,0.873-2.835-0.403-8.956c-2.258-10.838-8.42-43.871-9.628-50.254c-1.209-6.384-6.75-6.853-12.927-5.207C187.7,324.77,154.604,329.042,131.444,329.042z fill=url(#SVGID_9_) stroke=#231F20 stroke-width=1.9138 /><path d=M226.409,455.377c0,0,3.464-55.188,3.464-65.777c0-10.589-2.445-11.811-4.075-18.531c-1.631-6.72-7.337-31.158-9.578-44.801 fill=none stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_10_ x1=190.1698 x2=226.3408 y1=496.1182 y2=459.9472><stop offset=0 style=stop-color:#8EC5DF /><stop offset=1 style=stop-color:#FFF /></linearGradient><path d=M227.835,461.079c0,4.277-0.611,12.422-5.298,17.309c-4.688,4.888-13.043,10.793-19.156,14.051c0,0,0.815,0.408-2.445,2.038c-3.261,1.628-9.374,3.664-10.801,3.462c-1.427-0.204-0.815-2.444,0.204-5.702c1.019-3.258,4.279-12.218,7.133-16.902c2.853-4.684,14.876-16.292,18.544-17.92C219.683,455.784,227.835,452.676,227.835,461.079z fill=url(#SVGID_10_) stroke=#231F20 stroke-width=0.8506 /><line fill=none stroke=#231F20 stroke-width=0.8506 x1=216.015 x2=224.167 y1=457.413 y2=397.339 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_11_ x1=224.3824 x2=205.67 y1=40.969 y2=22.2566><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M229.594,32.114l-20.101,7.222h-4.075c0,0,0-2.968,0-4.146c0-1.178,4.5-9.671,6.295-12.192c0.875-1.233,2.604-2.938,4.243-4.413C223.973,21.893,227.692,26.077,229.594,32.114z fill=url(#SVGID_11_) stroke=#231F20 stroke-width=0.8506 /><path d=M215.957,18.584c-8.938-1.732-26.418-5.91-84.513-5.91c-58.096,0-75.576,4.178-84.514,5.91 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M206.392,32.614c-10.634-1.949-30.492-4.566-74.948-4.566c-44.456,0-64.315,2.617-74.949,4.566 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M194.981,25.494c-12.243-1.49-31.505-2.846-63.537-2.846c-32.033,0-51.295,1.356-63.537,2.846 fill=none stroke=#231F20 stroke-width=0.8506 /><path d=M203.105,26.369c0,0-1.899,3.194,1.361-2.238c3.261-5.429-4.326-5.601-4.326-5.601c-12.452-1.627-32.837-3.219-68.696-3.219s-56.245,1.592-68.697,3.219c0,0-7.586,0.172-4.325,5.601c3.261,5.432,1.36,2.238,1.36,2.238 fill=none stroke=#231F20 stroke-width=0.8506 /><line fill=none stroke=#231F20 stroke-width=0.8506 x1=57.469 x2=205.419 y1=44.067 y2=44.067 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_12_ x1=3.2614 x2=27.3267 y1=343.3973 y2=343.3973><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M3.261,339.301c0-3.666,0-6.109,3.261-4.887c3.261,1.222,15.867,5.695,17.118,6.72c1.252,1.024,3.057,4.276,3.465,6.312c0.407,2.037,0.814,6.11-4.28,5.092c-5.095-1.019-15.896-6.72-17.729-8.35C3.261,342.56,3.261,340.722,3.261,339.301z fill=url(#SVGID_12_) stroke=#231F20 stroke-width=1.9138 /><path d=M27.105,347.446c0.327,1.638,0.649,4.587-1.884,5.153c0.964,0.744,2.553,1.472,5.144,1.568h1.02c1.426-1.629,2.649-4.887,1.426-8.349l-6.62-0.924C26.618,345.795,26.956,346.702,27.105,347.446z fill=#FFFFFF stroke=#231F20 stroke-width=1.9138 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_13_ x1=3.4909 x2=25.7399 y1=339.0545 y2=339.0545><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M3.491,335.629c4.769,1.978,19.822,8.162,22.249,8.38c-0.671-1.234-1.457-2.349-2.1-2.875c-1.251-1.025-13.857-5.499-17.118-6.72C4.584,333.687,3.809,334.276,3.491,335.629z fill=url(#SVGID_13_) stroke=#231F20 stroke-width=1.9138 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_14_ x1=235.5607 x2=259.6255 y1=343.3973 y2=343.3973><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M259.626,339.301c0-3.666,0-6.109-3.261-4.887c-3.261,1.222-15.866,5.695-17.118,6.72c-1.251,1.024-3.057,4.276-3.464,6.312c-0.408,2.037-0.815,6.11,4.279,5.092c5.095-1.019,15.895-6.72,17.729-8.35C259.626,342.56,259.626,340.722,259.626,339.301z fill=url(#SVGID_14_) stroke=#231F20 stroke-width=1.9138 /><path d=M235.783,347.446c-0.328,1.638-0.65,4.587,1.884,5.153c-0.965,0.744-2.554,1.472-5.145,1.568h-1.02c-1.426-1.629-2.648-4.887-1.426-8.349l6.62-0.924C236.27,345.795,235.931,346.702,235.783,347.446z fill=#FFFFFF stroke=#231F20 stroke-width=1.9138 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_15_ x1=237.1481 x2=259.3961 y1=339.0545 y2=339.0545><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M259.396,335.629c-4.768,1.978-19.822,8.162-22.248,8.38c0.67-1.234,1.457-2.349,2.099-2.875c1.252-1.025,13.857-5.499,17.118-6.72C258.304,333.687,259.078,334.276,259.396,335.629z fill=url(#SVGID_15_) stroke=#231F20 stroke-width=1.9138 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_16_ x1=31.5202 x2=231.3668 y1=18.9727 y2=18.9727><stop offset=0 style=stop-color:#34373A /><stop offset=0.2647 style=stop-color:#868484 /><stop offset=1 style=stop-color:#34373A /></linearGradient><path d=M231.367,32.821c-1.63-7.604-3.805-13.304-13.042-17.105c-9.238-3.802-26.832-10.59-86.881-10.59c-60.05,0-77.644,6.789-86.881,10.59c-9.238,3.802-11.412,9.502-13.043,17.105l1.773-0.707c1.902-6.037,5.62-10.221,13.637-13.529c8.937-1.732,26.418-5.91,84.514-5.91c58.095,0,75.575,4.178,84.513,5.91c0.027,0.004,0.038,0.01,0.039,0.017c7.989,3.306,11.699,7.485,13.599,13.513L231.367,32.821z fill=url(#SVGID_16_) stroke=#231F20 stroke-width=1.9138 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_17_ x1=31.8073 x2=44.4264 y1=289.9906 y2=289.9906><stop offset=0 style=stop-color:#7EA5B8 /><stop offset=0.1953 style=stop-color:#93D8F7 /><stop offset=0.2663 style=stop-color:#CDE1EC /><stop offset=0.3491 style=stop-color:#82BDD7 /><stop offset=1 style=stop-color:#81B1C7 /></linearGradient><path d=M38.062,343.562c1.871-7.84,2.906-17.241,3.716-26.865c1.938-23.078,2.648-64.554,2.648-74.736c0-2.85-1.34-5.94-4.075-5.499c-2.917,0.472-3.766,0.586-7.133,1.63c-1.39,0.431-1.411,0.789-1.411,6.523c0,22.817,0.633,66.039,0.908,98.145L38.062,343.562z fill=url(#SVGID_17_) stroke=#231F20 stroke-width=0.8506 /><linearGradient gradientUnits=userSpaceOnUse id=SVGID_18_ x1=218.4606 x2=231.0797 y1=289.9906 y2=289.9906><stop offset=0 style=stop-color:#7EA5B8 /><stop offset=0.1953 style=stop-color:#93D8F7 /><stop offset=0.2663 style=stop-color:#CDE1EC /><stop offset=0.3491 style=stop-color:#82BDD7 /><stop offset=1 style=stop-color:#81B1C7 /></linearGradient><path d=M224.825,343.562c-1.871-7.84-2.906-17.241-3.715-26.865c-1.939-23.078-2.649-64.554-2.649-74.736c0-2.85,1.34-5.94,4.076-5.499c2.916,0.472,3.765,0.586,7.132,1.63c1.391,0.431,1.411,0.789,1.411,6.523c0,22.817-0.633,66.039-0.907,98.145L224.825,343.562z fill=url(#SVGID_18_) stroke=#231F20 stroke-width=0.8506 /></g></g></svg></div>';
				this.state.tracks = data;
				this.createMap();
				this.createMarker();
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	createMap: function() {
		var styles = [
			{
				"stylers": [
					{
						"hue": "#ff1a00"
					},
					{
						"invert_lightness": true
					},
					{
						"saturation": -100
					},
					{
						"lightness": 33
					},
					{
						"gamma": 0.5
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#2D333C"
					}
				]
			}
		];
		var mapOptions = {
			zoom : 14,
			center: new google.maps.LatLng(this.state.tracks[0].lastLocation.latitude, this.state.tracks[0].lastLocation.longitude),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: styles
		};
		this.state.map = new google.maps.Map(this.refs.map_canvas, mapOptions);
	},
	createMarker: function() { 
		var state = this.state;
		this.state.tracks.forEach( function(item, index) {
			var icon = jQuery.parseHTML(state.truck_icon);
			var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icon[0].innerHTML);
			var markerOptions = {
				position : new google.maps.LatLng(item.lastLocation.latitude, item.lastLocation.longitude),
				map : state.map,
				icon: { 
					url: url, 
					size: new google.maps.Size(100, 100)
				},
				title : item.type,
				id : item.externalId,
			};
			var marker = new google.maps.Marker(markerOptions);
			state.markers.push(marker);
		});
	},
	startAnimation: function() {
		this.state.counter = 0;
		console.log(this.state.markers);
		this.timer = setInterval(this.animate, 100);
	},
	stopAnimation: function() {
		clearInterval(this.timer);
	},
	animate: function() {	
		var state = this.state;	
		if(state.counter == 0){
			console.log("hey")
			// receive data
			var newData = [];
			state.tracks.forEach( function(element, index) {
				var newElement = {lastLocation:{}};
				newElement.externalId = element.externalId;
				newElement.type = element.type;
				if(index == 0){
					newElement.lastLocation.latitude  = element.lastLocation.latitude + 0.005;
					newElement.lastLocation.longitude = element.lastLocation.longitude;
					newElement.lat_off = 0.00005;
					newElement.lng_off = 0;
				}
				if(index == 1){
					newElement.lastLocation.latitude  = element.lastLocation.latitude + 0.005;
					newElement.lastLocation.longitude = element.lastLocation.longitude + 0.005;
					newElement.lat_off = 0.00005;
					newElement.lng_off = 0.00005;
				}
				if(index == 2){
					newElement.lastLocation.latitude  = element.lastLocation.latitude;
					newElement.lastLocation.longitude = element.lastLocation.longitude + 0.005;
					newElement.lat_off = 0;
					newElement.lng_off = 0.00005;
				}
				newData.push(newElement);
			});
			newData.forEach( function(newE, index) {
				var x = newE.lastLocation.longitude - state.tracks[index].lastLocation.longitude;
				var y = newE.lastLocation.latitude - state.tracks[index].lastLocation.latitude;
				var angle = 0;
				if(x == 0 && y > 0){
					angle = 0;
				}
				if(x > 0 && y > 0){
					angle = Math.atan(x/y);
				}
				if(x != 0 && y == 0){
					angle = Math.PI / 2;
				}
				if(x > 0 && y < 0){
					angle = Math.PI - Math.atan(-x/y);
				}
				if(x == 0 && y < 0){
					angle = Math.PI;
				}
				if(x < 0 && y < 0){
					angle = -(Math.PI - Math.atan(-x/y));
				}
				if(x < 0 && y == 0){
					angle = -Math.PI / 2;
				}
				if(x < 0 && y > 0){
					angle = Math.atan(x/y);
				}
				newE.angle = angle;
				var degree = angle / Math.PI * 180 + 180;
				var icon = jQuery.parseHTML(state.truck_icon);
				icon[0].firstChild.firstChild.firstChild.setAttribute("transform","rotate(" + degree + ", 130, 260)");
				state.markers[index].setOptions({
					// icon : {
					// 	path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
					// 	strokeColor: '#fff',
					// 	scale: 10,
					// 	strokeWeight: 2,
					// 	rotation : degree
					// }
					// icon : {
					// 	url: "icons/truck.svg",
					// 	scale: 1,
					// 	rotation : degree
					// },
					icon: {
						url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icon[0].innerHTML)
					},
					rotation : 90
				});
			});
			state.tracks = newData;
		}
		state.markers.forEach( function(marker, index) {
			var y = marker.position.lat();
			var x = marker.position.lng();
			var cy = state.tracks[index].lat_off;
			var cx = state.tracks[index].lng_off;

			marker.setPosition( new google.maps.LatLng(y + cy, x + cx));
		});
		state.counter ++;
		state.counter = state.counter % 100;
	},
	render: function() {
		var map = { 
			width : '100%', 
			height : '100%' 
		}
		return ( 
			<div ref="map_canvas" className="map" style={map}></div>
		);
	}
});

// page sections

var Header = React.createClass({
	render : function(){
		return ( 
			<div className="row">
				<div className="pull-left">
					<img src="icons/logo.png" />
				</div>
				<div className="pull-right">
					<img src="icons/account-box.png" /> John Doe
				</div>
			</div>
		);
	}
});

var Footer = React.createClass({
	propTypes: {
		copyright: React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			copyright: '2016 MileZero. All rights reserved.'
		};
	},
	render : function(){
		return ( 
			<div className="row text-center" style={this.props.style}>&copy; {this.props.copyright}</div>
		);
	}
});

var Simulator = React.createClass({
	getInitialState: function () {
		return {
			animation : false
		};
	},
	openModal: function() {
		this.refs.modal.open();
	},
	switchAnimation: function() {
		this.state.animation = !this.state.animation;
		if(this.state.animation) {
			this.refs.map.startAnimation();
		}else {
			this.refs.map.stopAnimation();
		}
		console.log(this.state.animation);
	},
	show : function(){
		jQuery(this.refs.root).show();
	},
	hide : function(){
		jQuery(this.refs.root).hide();
	},
	render : function(){
		var server = {
			url : 'https://api.milezero.com/v1/vehicle/search',
			headers : {'X-MZ-AUTH-API-KEY':'ProdSimulatorKey'}
		};
		var container_style = {
			padding : '24px 10px',
			backgroundColor : '#f9f9f9',
			border : '1px solid #ccc',
			display : 'none'
		};
		var controlbox_style = {
			marginTop : '60px'
		};
		var controlbox_button = {
			marginTop : '17px'
		}
		var mapbox_style = {
			marginTop : '17px',
			height : '520px',
			padding : '0px'
		};
		return (
			<div className="container" style={container_style} ref="root">
				<div className="col-sm-offset-1 col-sm-10">
					<Header />
					<div className="row controlbox visible-xs-block" style={controlbox_style}>
						<div className="pull-left col-xs-12">
							<Button className="btn-default" pos="before" icon="icons/home.png" style={controlbox_button}/> &nbsp;
							<Button className="btn-default" pos="before" icon="icons/play-arrow.png" title="Simulate" style={controlbox_button}/> &nbsp;
							<Button className="btn-default" pos="before" icon="icons/directionswalk.png" title="Animate" onClick = {this.switchAnimation} style={controlbox_button}/>
						</div>
						<div className="pull-right col-xs-12">
							<Button className="btn-primary" pos="after" icon="icons/add.png" title="Create a request" onClick = {this.openModal} style={controlbox_button}/>
						</div>
					</div>
					<div className="row controlbox hidden-xs" style={controlbox_style}>
						<div className="pull-left">
							<Button className="btn-default" pos="before" icon="icons/home.png" style={controlbox_button}/> &nbsp;
							<Button className="btn-default" pos="before" icon="icons/play-arrow.png" title="Simulate" style={controlbox_button}/> &nbsp;
							<Button className="btn-default" pos="before" icon="icons/directionswalk.png" title="Animate" onClick = {this.switchAnimation} style={controlbox_button}/>
						</div>
						<div className="pull-right">
							<Button className="btn-primary" pos="after" icon="icons/add.png" title="Create a request" onClick = {this.openModal} style={controlbox_button}/>
						</div>
					</div>
					<div className="row well mapbox" style={mapbox_style}>
						<GMap ref = "map" server={server}/>
					</div>
					<Footer />
					<RequestForm ref = "modal" confirm = "Submit" cancel = "Cancel" />
				</div>
			</div>
		);
	}
});

var Login = React.createClass({
	login : function(){
		this.hide();
		this.props.action();
	},
	show : function(){
		jQuery(this.refs.root).show();
	},
	hide : function(){
		jQuery(this.refs.root).hide();
	},
	render : function(){
		var container = { 
			background : '#333', 
			border: '1px solid black', 
			padding : '18px 0' 
		};
		var form = {
			background : 'white', 
			width : '350px', 
			margin: '125px auto', 
			padding: '41px 18px', 
			borderRadius : '5px'
		};
		var logo = {
			width : '150px'
		};
		var text = {
			marginTop : '12px', 
			color : '#333'
		};
		var username = {
			marginTop : '35px'
		};
		var remember = {
			paddingTop : '15px'
		};
		var footer = {
			color : 'white'
		};
		return (
			<div className="container" style={container} ref="root">
				<div style={form}>
					<div className="text-center">
						<img src="icons/logo.png" style={logo}/>
					</div>
					<div className="text-center" style={text}>
						Login to your account
					</div>
					<div className="form-group" style={username}>
						<label for="username">Username</label>
						<input type="text" className="form-control" id="username" ref="username"/>
					</div>
					<div className="form-group">
						<label for="password">Password</label>
						<input type="password" className="form-control" id="password" ref="password"/>
					</div>
					<div style={remember}>
						<label><input type="checkbox" value=""/>Rememmber Me</label>
						<Button className = "btn-primary pull-right" onClick={this.login}> Log in </Button>
					</div>
				</div>
				<Footer style={footer}/>
			</div>
		);
	}
});

var SimulatorModule = React.createClass({
	mouseover : function(){
		jQuery(this.refs.root).css("cursor","pointer");
		jQuery(this.refs.root).css("boxShadow","0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
	},
	mouseout : function(){
		jQuery(this.refs.root).css("cursor","none");
		jQuery(this.refs.root).css("boxShadow","none");
	},
	expand : function() {
		jQuery(this.refs.content).show();
		jQuery(this.refs.title).animate({
			'height' : '320px',
			'margin-top' : '-100px'
		},500);
	},
	render: function() {
		var style1 = {
			width:'400px', 
			minHeight:'400px',
			border:'1px solid #ccc', 
			borderRadius:'3px'
		};
		var style2 = {
			width:'400px', 
			minHeight:'400px',
			border:'1px solid #ccc', 
			borderRadius:'3px',
			overflow: 'hidden'
		};
		var simulation_title = {
			fontSize:'22px'
		};
		var simulation_desc = {
			fontSize:'12px', 
			color:'#888'
		};
		var title = {
			width : '100%',
			height : '400px',
			// position : 'relative',
			background : 'url("images/module_simulator_back.jpg")',
			backgroundRepeat : 'no-repeat'
		}
		var title_content = {
			position : 'relative',
			top : '230px'
		}
		var content = {
			padding : '25px 40px',
			display : 'none'
		}
		var content_button = {
			marginTop : '20px'
		}
		return (
			<div className={this.props.className} style={style2} onMouseOver={this.mouseover} onMouseOut={this.mouseout} ref="root" onClick={this.expand}>
				<div style={title} ref="title">
					<div style={title_content}>
						<div className='text-center' style={simulation_title}>
							Simulation Viewer
						</div>
						<div className='text-center' style={simulation_desc}>
							Provides a complete view of the world for a given customer
						</div>
					</div>
				</div>
				<div className="content" style={content} ref="content">
					<div className="form-group row">
						<label for="cname">Customer name</label>
						<input type="text" className="form-control" id="cname" ref="cname"/>
					</div>
					<div className="form-group row">
						<label for="ckey">Customer key</label>
						<input type="password" className="form-control" id="ckey" ref="ckey"/>
					</div>
					<div className="row" style={content_button}>
						<Button className = "btn-primary pull-right" onClick={this.props.submit}> Submit </Button>
					</div>
				</div>
			</div>
		);
	}
});

var Modules = React.createClass({
	show : function(){
		jQuery(this.refs.root).show();
	},
	hide : function(){
		jQuery(this.refs.root).hide();
	},
	render : function(){
		var container_style = {
			padding : '24px 127px',
			backgroundColor : '#f9f9f9',
			border : '1px solid #ccc',
			display : 'none'
		};
		var title = {
			fontSize : '30px', 
			marginTop : '60px'
		};
		var desciption = {
			color : '#888', 
			fontSize : '16px'
		};
		var row = {
			marginTop : '50px'
		};
		var empty_box = {
			width:'400px', 
			height:'400px',
			border:'1px solid #ccc', 
			borderRadius:'3px'
		};
		var empty_content = {
			position:'relative', 
			top:'40%', 
			left:'40%'
		};
		return (
			<div className="container" style={container_style} ref="root">
				<Header />
				<div>
					<div className="text-center" style={title}>
						Modules
					</div>
					<div className="text-center" style={desciption}>
						Kogi VHS viral quinoa, XOXO tattooed offal fingerstache keytar ennui. Schlitz
					</div>
				</div>
				<div className="row" style={row}>
					<SimulatorModule className="pull-left" submit={this.props.simulator}/>
					<div className="pull-right" style={empty_box}>
						<img src="icons/panorama.svg" style={empty_content}/>
					</div>
				</div>
			</div>
		);
	}
});

var MileZero = React.createClass({
	getInitialState: function() {
		// this.refs.modules.hide();
		// this.refs.simulator.hide();
		return {
			loggedin: false
		};
	},
	showModules : function(){
		this.refs.modules.show();
	},
	showSimulator : function(){
		this.refs.modules.hide();
		this.refs.simulator.show();
	},
	render : function(){
		return (
			<div>
				<Login ref="login" action={this.showModules}/>
				<Modules ref="modules" simulator={this.showSimulator}/>
				<Simulator ref="simulator"/>
			</div>
		);
	}
});

ReactDOM.render( <MileZero /> , document.getElementById('milezero'));