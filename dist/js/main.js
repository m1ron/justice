/*jslint nomen: true, regexp: true, unparam: true, sloppy: true, white: true, node: true */
/*global window, console, document, $, jQuery, google */



/* Animation global settings */
window.duration = {
	animation: 3000,
	bar: 1500,
	page: 1000
};

/** Fastclick */
FastClick.attach(document.body);

/** Hammer */
var hammertime = new Hammer(document, {
	recognizers: [[Hammer.Swipe, {direction: Hammer.DIRECTION_ALL}]]
});


/**
 * On document ready
 */
$(document).ready(function () {


	/** Fullpage */
	$('.page').each(function () {

		/** On section entry */
		function onIn(index) {
			function wheel(event) {
				if (event.deltaY < 0) {
					current.addClass('animated');
					animated.trigger('animate');
					setTimeout(function () {
						enable();
					}, duration.animation);
				} else if (event.deltaY > 0) {
					$.fn.fullpage.moveSectionUp();
				}
				html.off('mousewheel', wheel);
				hammertime.off('swipe', wheel);
				event.preventDefault();
			}

			function enable() {
				current.addClass('enabled');
				console.log('scroll enabled');
				$.fn.fullpage.setAllowScrolling(true);
			}

			console.log('onIn');
			var current = this, animated;
			setTimeout(function () {
				if (current.hasClass('paused')) {
					console.log('scroll paused');
					animated = $('.with-animation', current).eq(0);
					html.on('mousewheel', wheel);
					hammertime.on('swipe', wheel);
				} else {
					enable();
				}
			}, 2000);
		}


		/** On section leave */
		function onOut(index) {
			console.log('onOut');
			var that = this;
			$.fn.fullpage.setAllowScrolling(false);
			console.log('scroll disabled');
			that.removeClass('enabled').removeClass('animated');
			setTimeout(function () {
				$('.with-animation', that).trigger('reset');
			}, duration.page);
		}


		var sections = $('.section', this), html = $('html'), doc = $(document);
		$(this).fullpage({
			css3: true,
			easingcss3: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
			scrollingSpeed: duration.page,
			touchSensitivity: 10,
			onLeave: function (index, nextIndex, direction) {
				onOut.call(sections.eq(index - 1), index);
			},
			afterLoad: function (anchorLink, index) {
				onIn.call(sections.eq(index - 1), index);
			}
			/*
			 scrollOverflow: true,
			 keyboardScrolling: false,
			 animateAnchor: false,
			 recordHistory: false,
			 verticalCentered: true,
			 resize: false,
			 */
		});
		/*
		 $('.down', this).on('click', function (event) {
		 $.fn.fullpage.moveSectionDown();
		 event.preventDefault();
		 });
		 */
		console.log('scroll disabled init');
		$.fn.fullpage.setAllowScrolling(false);
	});


	/** Bars */
	$('.bars').each(function () {
		/* Animate bars */
		function animateBar() {
			this.css({"transform": "translate3d(0, " + (this.data('to') - this.data('from')) + "%, 0)"});
			this.addClass('animated');
			console.log('animateBar');
		}

		/* Animate values */
		function animateValue() {
			var that = this, current = from = this.data('from'),
				to = this.data('to'),
				range = to - from,
				increment = to > from ? 1 : -1, step = Math.abs(Math.floor(duration.bar / range));
			var timer = setInterval(function () {
				current += increment;
				that.text(current);
				if (current === to) {
					clearInterval(timer);
					console.log('animation stopped');
				}
			}, step);
		}

		var that = $(this), numbers = $('.n', that), bars = $('.bar .b', that), years = $('.year', that);
		that.off('animate').on('animate', function () {
			console.log('animation started');
			numbers.each(function (i) {
				setTimeout(animateValue.bind($(this)), +(i * duration.bar));
			});
			bars.each(function (i) {
				setTimeout(animateBar.bind($(this)), +(i * duration.bar));
			});
			years.each(function (i) {
				setTimeout(animateValue.bind($(this)), +(i * duration.bar));
			});
			return false;
		}).off('reset').on('reset', function () {
			bars.removeClass('animated').removeAttr('style');
			numbers.add(years).each(function () {
				$(this).text($(this).data('from'));
			});
		});
	});


	/** System */
	$('.system').each(function () {
		var that = $(this);
		$('.start, .finish', that).each(function () {
			$('<span/>').addClass('arrow').appendTo(this);
		});
		$('.list .item', that).each(function () {
			$('<span/>').addClass('lines').appendTo(this);
			$('<span/>').addClass('outside').appendTo(this);
		});
		that.off('animate').on('animate', function () {
			that.addClass('animated');
			console.log('animation started');
			return false;
		}).off('reset').on('reset', function () {
			that.removeClass('animated');
		});
	});


	/** System */
	$('.graph').each(function () {
		var that = $(this), y = $('.axis-y', that), x = $('.axis-x', that);
		$('<span/>').addClass('title').text(y.data('legend')).appendTo(y);
		for (i = +y.data('from'); i >= +y.data('to'); i = i - 1000) {
			$('<span/>').addClass('number').text(i).appendTo(y);
		}
		for (i = +x.data('from'); i <= +x.data('to'); i = i + 1) {
			$('<span/>').addClass('year').text(i).appendTo(x);
		}
		that.off('animate').on('animate', function () {
			that.addClass('animated');
			console.log('animation started');
			return false;
		}).off('reset').on('reset', function () {
			that.removeClass('animated');
		});
	});
});