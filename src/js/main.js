/*jslint nomen: true, regexp: true, unparam: true, sloppy: true, white: true, node: true */
/*global window, console, document, $, jQuery, google */



/* Animation global settings */
window.duration = {
	animation: 3000,
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
					animated = $('.bars', current).eq(0);
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
			var _this = this;
			$.fn.fullpage.setAllowScrolling(false);
			console.log('scroll disabled');
			_this.removeClass('enabled').removeClass('animated');
			setTimeout(function () {
				$('.bar', _this).trigger('reset');
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
		}

		/* Animate values */
		function animateValue() {
			var _this = this, current = from = this.data('from'),
				to = this.data('to'),
				range = to - from,
				increment = to > from ? 1 : -1, step = Math.abs(Math.floor(duration.animation / range));
			var timer = setInterval(function () {
				current += increment;
				_this.text(current);
				if (current === to) {
					clearInterval(timer);
					console.log('animation stopped');
				}
			}, step);
		}

		var _this = $(this), numbers = $('.n', _this), bars = $('.bar .b', _this), years = $('.year', _this);
		_this.off('animate').on('animate', function () {
			console.log('animation started');
			bars.each(function () {
				animateBar.call($(this));
			});
			numbers.add(years).each(function () {
				animateValue.call($(this));
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
		$('.start, .finish', this).each(function () {
			$('<span/>').addClass('arrow').appendTo(this);
		});
		$('.list .item', this).each(function () {
			$('<span/>').addClass('lines').appendTo(this);
			$('<span/>').addClass('outside').appendTo(this);
		});
	});

});