/*jslint nomen: true, regexp: true, unparam: true, sloppy: true, white: true, node: true */
/*global window, console, document, $, jQuery, google */


/**
 * On document ready
 */
$(document).ready(function () {

	/** Fastclick */
	FastClick.attach(document.body);

	/** Fullpage */
	$('.page').each(function () {
		$(this).fullpage({
			menu: '#dots',
			css3: true,
			touchSensitivity: 10,
			animateAnchor: false,
			recordHistory: false,
			//scrollOverflow: true,
			resize: false,
			scrollingSpeed: 1000
		});
		/*
		 $('.down', this).on('click', function (event) {
		 $.fn.fullpage.moveSectionDown();
		 event.preventDefault();
		 });
		 */
		//$.fn.fullpage.setAllowScrolling(false);
	});

	/** Bars */

	/** System */
	$('.system').each(function () {
		$('.start, .finish', this).each(function () {
			$('<span/>').addClass('arrow').appendTo(this);
		});
		$('.list .item', this).each(function () {
			$('<span/>').addClass('lines').appendTo(this);
			$('<span/>').addClass('outside').appendTo(this);
		});
	});

});