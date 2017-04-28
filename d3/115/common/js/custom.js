$(document).ready(function(){

	var $wrapper = $('.manage_survey_wrap');

	$wrapper.find('.dropdown-toggle').click(function(e) {

		e.preventDefault();

		$wrapper.find('.dropdown-toggle').parent().removeClass('show'); /* 13 jan 2017 */

		$('#table-Overlay').removeClass('show');

		$(this).parent().addClass('show');		

	});

	$wrapper.find('#allChk').change(function(e) {

		if($(this).is(':checked')){

			$wrapper.find('.datatable_bar table tbody .custom-checkbox input').attr('checked', true);

			$(this).parents('table').find('tbody tr').addClass('highlight');

		}else{

			$wrapper.find('.datatable-bar table tbody .custom-checkbox input').attr('checked', false);

			$(this).parents('table').find('tbody tr').removeClass('highlight');

		}

	});

	$wrapper.intializeManageSurveyTabs();

	$wrapper.find('.datatable-bar tr').intializeTableRow();

	$wrapper.intializeEditBar();

	$wrapper.find('.folders-panel').intializeFolderActions();

	$wrapper.find('.fetch').fetchSurvey();

	$wrapper.find('.survey-overlay').hide();

	$wrapper.intializeCreateNewSurvey();

});

jQuery.fn.intializeCreateNewSurvey = function(){

	var $wrapper = $(this);

	var $create_new = $wrapper.find('.create_new');

	$(this).find('.new-survey-btn').on('click',function(){

		$('body').addClass('noscroll');

		$wrapper.find('.create_new').fadeIn();

		/* 13 jan 2017 */

		var $wrapperToppadding = parseFloat($('.survey-overlay .wrapper').css('padding-top'));		

		var $H1surveyHeight = $('.survey-overlay h1').outerHeight();		

		var $surveyButtonGroupHeight = $('.survey-overlay .slide2 .button-group').outerHeight();		

		var $surveyBottomPadding = parseFloat($('.survey-overlay .wrapper').css('padding-bottom'));

		var $surveyNotesHeight = $('.survey-overlay .slide2 .right .notes').outerHeight();		

		var $surveyRemainingHeight = $(window).height()-$H1surveyHeight - $surveyButtonGroupHeight-$wrapperToppadding-$surveyBottomPadding;

		$('.survey-overlay .slide2 .left ul').height($surveyRemainingHeight);

		$('.survey-overlay .slide2 .right .existing-list').height($surveyRemainingHeight-$surveyNotesHeight);

	});

	$create_new.find('.select-template').on('click',function(){

		$create_new.find('.select-template.active').removeClass('active');

		var $button_text = $create_new.find('.button_text');

		var $input = $(this).find('input');

		//var val = $create_new.find('input[name=template]:checked').val();;

		var val = $input.val();

		if(val=='new'){

			$button_text.text('Create');

		}else{

			$button_text.text('Next');

		}

		$(this).addClass('active');

	});

	$create_new.find('#next').click(function(e) {

		e.preventDefault();

		var action = $create_new.find('input[name=action]:checked').val();

		if(action == 'new'){

			//alert('new');

			$create_new.find('form').submit();

		}else{

			var $survey_title = $create_new.find('.survey_title');

			var surveyTitle = $create_new.find('input[name=surveyTitle]').val();

			$survey_title.text(surveyTitle);

			$create_new.find('.slide-animation').addClass('su-display-next');

			$create_new.find('.slide1').removeClass('su-current').addClass('fs-hide');

			$survey_title.addClass('showh1Text');

			$create_new.find('.slide2').addClass('su-current fs-show');

			setTimeout(function(){

				$create_new.find('.slide-animation').removeClass('su-display-prev su-display-next');

				$create_new.find('.slide1, .slide2').removeClass('fs-hide fs-show');			

			},1000);

		}

	});

	$create_new.find('.source_identifier').on('click',function(){

		$create_new.find('.source_identifier.active').removeClass('active');

		$(this).addClass('active');

	});

	$create_new.find('.copy_existing').on('click',function(e){

		var id = $create_new.find('.source_identifier.active').closest('li').attr('data-id');

		$create_new.find('input[name=copyFromSurveyId]').val(id);

		$create_new.find('form').submit();

	});
	

	$create_new.find('.pagination li a').click(function(e) {

		e.preventDefault();

		$create_new.find('.slide-animation').addClass('su-display-prev');

		$create_new.find('.slide2').removeClass('su-current').addClass('fs-hide');

		$create_new.find('.survey_title').removeClass('showh1Text');

		$create_new.find('.slide1').addClass('su-current fs-show');

		setTimeout(function(){

			$create_new.find('.slide-animation').removeClass('su-display-prev su-display-next');

			$create_new.find('.slide1, .slide2').removeClass('fs-hide fs-show');			

		},1000);

	});

	$create_new.find('.details-overlay-close').on('click',function(e){

		$('body').removeClass('noscroll');

		$create_new.fadeOut();

		e.stopPropagation();//so that it doesn't call document.click event

	});	

};

jQuery.fn.intializeEditBar = function(){

	var $wrapper = $(this);

	var $edit_bar = $wrapper.find('.edit-bar');

	$edit_bar.find('.open-menu').click(function(e) {

		$wrapper.find('#right-panel').addClass('show');

		e.stopPropagation();// so that it doesn't call document.click event

	});

	$edit_bar.find('.delete').click(function(e) {

		$(this).addClass('active');

	});

}

jQuery.fn.intializeFolderActions = function(){

	var $edit_panel = $(this);

	var $folder_list = $edit_panel.find('.folder-list');

	var h4Height = $edit_panel.find('H4').outerHeight();

	var createButtonHeight = $edit_panel.find('.create-btn').outerHeight(true);

	var folderListHeight = $(window).height()- h4Height - createButtonHeight - 60;//30 is padding below for panel /* 13 jan 2017 */

	$folder_list.css('height',folderListHeight);

	

	

	

	var $edit_folder_overlay = $('.edit-folder-overlay');

	$(this).find('.folder').on('click',function(){

		

		$folder_list.trigger('deselect');

		$(this).find('.folder-icon').addClass('fa-folder-open-o');

		$(this).find('a').addClass('active');

	});

	$folder_list.bind('deselect',function(){

		$(this).find('.fa-folder-open-o').removeClass('fa-folder-open-o');

		$(this).find('.active').removeClass('active');

	});

	

	

	$(this).find('.edit-icon').on('click',function(e){

		$('body').addClass('noscroll');

		var $folder = $(this).closest('.folder');

		var folder_name = $folder.find('.tag_name').text();

		$edit_folder_overlay.attr('data-edit-type','edit');

		$edit_folder_overlay.attr('data-id',$folder.attr('data-id'));

		$edit_folder_overlay.find('.edit_property').show();

		$edit_folder_overlay.find('.add_property').hide();

		var $input = $edit_folder_overlay.find('input');

		$input.val(folder_name);

		$input.focus();

		$edit_folder_overlay.fadeIn();

		e.stopPropagation();

	});

	$edit_panel.find('.new-folder').on('click',function(e){

		$('body').addClass('noscroll');

		$edit_folder_overlay.attr('data-edit-type','add');

		$edit_folder_overlay.removeAttr('data-id');

		$edit_folder_overlay.find('.edit_property').hide();

		$edit_folder_overlay.find('.add_property').show();

		var $input = $edit_folder_overlay.find('input');

		$input.val('');

		$input.focus();

		$edit_folder_overlay.fadeIn();

	});

	

	$edit_folder_overlay.find('.details-overlay-close').on('click',function(e){

		$('body').addClass('noscroll');

		$edit_folder_overlay.fadeOut();

		e.stopPropagation();

	});

	

	

	document.addEventListener( 'click', function(ev) {

		var target = ev.target;

		var $options = $('.open-menu');

		var $edit_overlay = $('.edit-folder-overlay');		

		if( $edit_panel.hasClass('show') && target !== $options[0] && target !== $edit_panel &&  !hasParent( target, $edit_panel[0] ) && !hasParent( target, $edit_overlay[0] )) {

			$edit_panel.removeClass('show');

		}	

		/* 13 jan 2017 */	

		if(!$(target).closest('.table-dropdown').length) {

			$('.table-dropdown').removeClass('show');

		}

		

	} );

}

function hasParent( e, p ) {

	if (!e) return false;

	var el = e.target||e.srcElement||e||false;

	while (el && el != p) {

		el = el.parentNode||false;

	}

	return (el!==false);

};

jQuery.fn.intializeManageSurveyTabs = function(){

	$wrapper = $(this);

	var $tabs = $wrapper.find('.tabs-bar .tabs');

	$tabs.find('.most-recent a').on('click',function(e) {

		$wrapper.find('.datatable-bar table tr').removeClass('highlight');	

		$wrapper.find('.edit-bar a.delete').removeClass('active');

		$wrapper.find('.table-desc').hide();

		$wrapper.find('.tabs-bar .tabs li a').removeClass('active');

		$(this).addClass('active');		

	});

	

	$tabs.find('li.all-survey a').on('click',function(e) {

		$wrapper.find('.edit-bar a.delete').removeClass('active');

		$wrapper.find('.table-desc').hide();

		$wrapper.find('.tabs-bar .tabs li a').removeClass('active');

		$(this).addClass('active');	

	});

	

	/* 13 jan 2017 */

	$tabs.find('li.report-data a').on('click',function(e) {	

		$tabs.find('li.overall-data a').removeClass('active');			
		
		$wrapper.find('.edit-bar').fadeIn();
		
		$wrapper.find('#overall').hide();

		$wrapper.find('#report').fadeIn();

		$(this).addClass('active');	

	});

	

	$tabs.find('li.overall-data a').on('click',function(e) {

		$tabs.find('li.report-data a').removeClass('active');	
		
		$wrapper.find('.edit-bar').fadeOut();	

		$wrapper.find('#report').hide();

		$wrapper.find('#overall').fadeIn();

		$(this).addClass('active');	

	});

}

jQuery.fn.intializeTableRow = function(){

	$(this).each(function(){

		var $table_overlay = undefined;

		document.addEventListener( 'click', function(ev) {

			var target = ev.target;

			if(typeof $table_overlay != 'undefined' && !hasParent( target, $table_overlay[0] )) {

				$table_overlay.slideUp();

				$table_overlay.removeClass('on');

				$table_overlay.find('.push_up').removeClass('on');

			}

		} );

		$(this).find('.custom-checkbox input').click(function(e) {

			$('#allChk').attr('checked', false);

			if($(this).is(':checked')){

				$(this).parents('tr').addClass('highlight');

			}else{

				$(this).parents('tr').removeClass('highlight');

			}

		});

		

		$(this).find('.survey-name').on('click',function(e) {

			var $tr = $(this).closest('tr');

			$table_overlay = $tr.find('.table-overlay');	

			var  $open_details = $('.table-overlay.on');

			$open_details.slideUp();	

			$open_details.find('.push_up').removeClass('on');

			$table_overlay.addClass('on');

			$table_overlay.slideDown();	

			$table_overlay.find('.push_up').addClass('on');

			e.stopPropagation();

		});

		

		$(this).find('.duplicate').on('click',function(e){

			e.stopPropagation();

			var $tbody = $(this).closest('tbody');

			var $tr = $(this).closest('tr');

			var request = new Object();

			request['copyFromSurveyId'] = $tr.attr('data-id');

			var csrfToken = $("#csrfToken").val();

			$.ajax({ 	

				url: "/CyRanaWeb/managesurveyv2/duplicate", 

				type: "POST", 

				headers: { "X-CSRF-TOKEN": csrfToken},

				data : JSON.stringify(request),

				contentType : "application/json",

				success: function(data) {

					var $data = $(data);

					$data.intializeTableRow();

					$data.prependTo($tbody);

					//console.log('Returned data ::: ',data);

				},

				error:function(data,status,er) { 

					alert("error: "+data+" status: "+status+" er:"+er);

				}

			});

		});

		

		

	});

	//var $tr = $(this);

}

jQuery.fn.fetchSurvey = function(){

	$(this).on('click',function(){

		var $manage_survey_wrap = $('.manage_survey_wrap');

		var $tbody = $manage_survey_wrap.find('.datatable-bar tbody');

		//$tbody.empty();

		//$tbody.removeClass('on');

		$manage_survey_wrap.find('.tabs .active').removeClass('active');

		if($(this).hasClass('tab')){

			$(this).find('a').addClass('active');

		}

		var table_desc = $(this).attr('data-table-desc');

		var title = $(this).attr('data-table-title');

		$manage_survey_wrap.find('.table-desc').hide();

		var $table_desc = $manage_survey_wrap.find('.'+table_desc);

		if(typeof title != undefined){

			$table_desc.text(title);

		}

		$table_desc.fadeIn();

		var default_view = $(this).attr('data-default-view');

		if(typeof default_view != undefined && default_view=='most-recent'){

			$manage_survey_wrap.find('#dashboard-cntr').addClass('most-recent');

		}else{

			$manage_survey_wrap.find('#dashboard-cntr').removeClass('most-recent');

		}

	});

}
