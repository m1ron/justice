/*jslint nomen: true, regexp: true, unparam: true, sloppy: true, white: true, node: true */
/*global window, console, document, $, jQuery, google */



/* Animation global settings */
window.duration = {
	animation: 3000,
	bar: 2000,
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


	/** FULLPAGE */
	$('.page').each(function () {

		// ENABLE
		function enable() {
			this.addClass('enabled');
			if ($('body').hasClass('pace-done')) {
				//console.log('Scrolling enabled');
				$.fn.fullpage.setAllowScrolling(true);
			}
		}

		// DISABLE
		function disable() {
			//console.log('Scrolling disabled');
			$.fn.fullpage.setAllowScrolling(false);
		}

		/** On section entry */
		function onIn(index) {
			function wheel(event) {
				if (event.deltaY < 0) {
					that.addClass('animated');
					animated.trigger('animate');
					setTimeout(function () {
						enable.call(that);
					}, +that.data('duration'));
				} else if (event.deltaY > 0) {
					$.fn.fullpage.moveSectionUp();
				}
				html.off('mousewheel', wheel);
				hammertime.off('swipe', wheel);
				event.preventDefault();
			}

			var that = this, animated;

			disable();
			//console.log('Delay ' + that.data('duration') + 'ms');

			setTimeout(function () {
				if (that.hasClass('paused')) {
					animated = $('.with-animation', that).eq(0);
					html.on('mousewheel', wheel);
					hammertime.on('swipe', wheel);
				} else {
					enable.call(that);
				}
			}, that.data('duration'));
		}


		/** On section leave */
		function onOut(index) {
			var that = this;

			$.fn.fullpage.setAllowScrolling(false);
			that.removeClass('enabled').removeClass('animated');

			setTimeout(function () {
				$('.with-animation', that).trigger('reset');
			}, duration.page);
		}

		var doc = $(document), that = $(this), html = $('html'), sections = $('.section', this);
		that.fullpage({
			css3: true,
			easingcss3: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
			scrollingSpeed: duration.page,
			touchSensitivity: 10,
			afterLoad: function (anchorLink, index) {
				onIn.call(sections.eq(index - 1), index);
			},
			onLeave: function (index, nextIndex, direction) {
				onOut.call(sections.eq(index - 1), index);
			}
		});
		disable();

		$('.down', this).on('click', function (event) {
			$.fn.fullpage.moveSectionDown();
			event.preventDefault();
		});
	});


	/** BARS */
	$('.bars').each(function () {
		/* Animate bars */
		function animateBar() {
			this.css({"transform": "translate3d(0, " + (this.data('to') - this.data('from')) + "%, 0)"});
			this.addClass('animated');
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
				}
			}, step);
		}

		var that = $(this), numbers = $('.n', that), bars = $('.bar .b', that), years = $('.year', that);
		that.off('animate').on('animate', function () {
			numbers.each(function (i) {
				setTimeout(animateValue.bind($(this)), +(i * duration.bar * .75));
			});
			bars.each(function (i) {
				setTimeout(animateBar.bind($(this)), +(i * duration.bar * .75));
			});
			years.each(function (i) {
				setTimeout(animateValue.bind($(this)), +(i * duration.bar * .75));
			});
			return false;
		}).off('reset').on('reset', function () {
			bars.removeClass('animated').removeAttr('style');
			numbers.add(years).each(function () {
				$(this).text($(this).data('from'));
			});
		});
	});


	/** SYSTEM */
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
			return false;
		}).off('reset').on('reset', function () {
			that.removeClass('animated');
		});
	});


	/** GRAPH */
	$('.graph').each(function () {
		var that = $(this), y = $('.axis-y', that), x = $('.axis-x', that);
		$('<span/>').addClass('legend').text(y.data('legend')).appendTo(y);
		for (i = +y.data('from'); i >= +y.data('to'); i = i - 1000) {
			$('<span/>').addClass('number').text(i).appendTo(y);
		}
		for (i = +x.data('from'); i <= +x.data('to'); i = i + 1) {
			$('<span/>').addClass('year').text(i).appendTo(x);
		}
		that.off('animate').on('animate', function () {
			that.addClass('animated');
			return false;
		}).off('reset').on('reset', function () {
			that.removeClass('animated');
		});
	});


	/** LOADER */
	(function () {
		var body = $('body');
		if (body.hasClass('loading')) {
			var preloader = $('.preloader'), pace = $('.pace'), progress = $('.pace-progress');
			Pace.on('start', function () {
				progress.html('');
				preloader.clone().appendTo('.pace-progress');
				preloader.remove();
			});
			Pace.on('done', function () {
				setTimeout(function () {
					pace.remove();
					body.removeClass('loading pace-done');
					$.fn.fullpage.setAllowScrolling(true);
				}, 310);
			});
			Pace.start();
		}
	})();

});