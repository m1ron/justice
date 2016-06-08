/*jslint nomen: true, regexp: true, unparam: true, sloppy: true, white: true, node: true */
/*global window, console, document, $, jQuery, google */


/** Global Settings */
window.duration = {
  animation: 3000,
  bar: 2000,
  page: 1000
};


/** Fastclick */
FastClick.attach(document.body);


/** Hammer.js Settings */
var hammertime = new Hammer(document, {
  recognizers: [
    [Hammer.Swipe, {
      direction: Hammer.DIRECTION_ALL
    }]
  ]
});


/** Magnific Popup Settings */
$.extend(true, $.magnificPopup.defaults, {
  closeMarkup: '<span title="%title%" class="mfp-close">x</span>',
  gallery: {
    arrowMarkup: '<div title="%title%" class="mfp-arrow mfp-arrow-%dir%"></div>'
  },
  settings: {
    cache: false
  },
  mainClass: 'mfp-zoom-in',
  removalDelay: 600,
  midClick: true,
  autoFocusLast: false
});


/** On document ready */
$(document).ready(function() {

  /** Fullpage.js */
  $('.page').each(function() {
    function enable() {
      this.addClass('enabled');
      if ($('body').hasClass('pace-done')) {
        //console.log('Scrolling enabled');
        $.fn.fullpage.setAllowScrolling(true);
      }
    }

    function disable() {
      //console.log('Scrolling disabled');
      $.fn.fullpage.setAllowScrolling(false);
    }

    function onIn(index) {
      function wheel(event) {
        if (event.deltaY < 0) {
          that.addClass('animated');
          animated.trigger('animate');
          setTimeout(function() {
            enable.call(that);
          }, +that.data('duration'));
        } else if (event.deltaY > 0) {
          $.fn.fullpage.moveSectionUp();
        }
        html.off('mousewheel', wheel);
        hammertime.off('swipe', wheel);
        event.preventDefault();
      }

      var that = this,
        animated;
      disable();
      //console.log('Delay ' + that.data('duration') + 'ms');
      //console.log(that.data('duration'));
      setTimeout(function() {
        if (that.hasClass('paused')) {
          animated = $('.with-animation', that).eq(0);
          html.on('mousewheel', wheel);
          hammertime.on('swipe', wheel);
        } else {
          enable.call(that);
        }
      }, duration.animation);
    }

    function onOut(index) {
      var that = this;
      $.fn.fullpage.setAllowScrolling(false);
      that.removeClass('enabled').removeClass('animated');
      setTimeout(function() {
        $('.with-animation', that).trigger('reset');
      }, duration.page);
    }

    var doc = $(document),
      that = $(this),
      html = $('html'),
      sections = $('.section', this);
    that.fullpage({
      css3: true,
      easingcss3: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
      scrollingSpeed: duration.page,
      touchSensitivity: 10,
      afterLoad: function(anchorLink, index) {
        onIn.call(sections.eq(index - 1), index);
      },
      onLeave: function(index, nextIndex, direction) {
        onOut.call(sections.eq(index - 1), index);
      }
    });
    disable();
    $('.down', this).on('click', function(event) {
      $.fn.fullpage.moveSectionDown();
      event.preventDefault();
    });
  });


  /** Bars */
  $('.bars').each(function() {
    function animateBar() {
      this.css({
        "transform": "translate3d(0, " + (this.data('to') - this.data('from')) + "%, 0)"
      });
      this.addClass('animated');
    }

    function animateValue() {
      var that = this,
        current = from = this.data('from'),
        to = this.data('to'),
        range = to - from,
        increment = to > from ? 1 : -1,
        step = Math.abs(Math.floor(duration.bar / range));
      var timer = setInterval(function() {
        current += increment;
        that.text(current);
        if (current === to) {
          clearInterval(timer);
        }
      }, step);
    }

    var that = $(this),
      numbers = $('.n', that),
      bars = $('.bar .b', that),
      years = $('.year', that);
    that.off('animate').on('animate', function() {
      numbers.each(function(i) {
        setTimeout(animateValue.bind($(this)), +(i * duration.bar * .75));
      });
      bars.each(function(i) {
        setTimeout(animateBar.bind($(this)), +(i * duration.bar * .75));
      });
      years.each(function(i) {
        setTimeout(animateValue.bind($(this)), +(i * duration.bar * .75));
      });
      return false;
    }).off('reset').on('reset', function() {
      bars.removeClass('animated').removeAttr('style');
      numbers.add(years).each(function() {
        $(this).text($(this).data('from'));
      });
    });
  });


  /** System */
  $('.system').each(function() {
    var that = $(this);
    $('.start, .finish', that).each(function() {
      $('<span/>').addClass('arrow').appendTo(this);
    });
    $('.list .item', that).each(function() {
      $('<span/>').addClass('lines').appendTo(this);
      $('<span/>').addClass('outside').appendTo(this);
    });
    that.off('animate').on('animate', function() {
      that.addClass('animated');
      return false;
    }).off('reset').on('reset', function() {
      that.removeClass('animated');
    });
  });


  /** Graph */
  $('.graph').each(function() {
    var that = $(this),
      y = $('.axis-y', that),
      x = $('.axis-x', that);
    $('<span/>').addClass('legend').text(y.data('legend')).appendTo(y);
    for (i = +y.data('from'); i >= +y.data('to'); i = i - 1000) {
      $('<span/>').addClass('number').text(i).appendTo(y);
    }
    for (i = +x.data('from'); i <= +x.data('to'); i = i + 1) {
      $('<span/>').addClass('year').text(i).appendTo(x);
    }
    that.off('animate').on('animate', function() {
      that.addClass('animated');
      return false;
    }).off('reset').on('reset', function() {
      that.removeClass('animated');
    });
  });


  /** POPUP IMAGES */
  $('.js-popup').magnificPopup({
    callbacks: {
      beforeOpen: function() {
        $.fn.fullpage.setAllowScrolling(false);
      },
      afterClose: function() {
        $.fn.fullpage.setAllowScrolling(true);
      }
    }
  });


  /** Pace Loader */
  (function() {
    var body = $('body');
    if (body.hasClass('loading')) {
      var preloader = $('.preloader'),
        pace = $('.pace'),
        progress = $('.pace-progress');
      Pace.on('start', function() {
        progress.html('');
        preloader.clone().appendTo('.pace-progress');
        preloader.remove();
      });
      Pace.on('done', function() {
        setTimeout(function() {
          body.removeClass('loading');
          pace.remove();
          //$.fn.fullpage.setAllowScrolling(true);
        }, 410);
      });
      Pace.start();
    }
  })();
});
