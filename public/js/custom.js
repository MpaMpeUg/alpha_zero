(function ($) {
  "use strict";
  jQuery(document).on("ready", function () {
    /* Header Sticky
		========================================================*/
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 70) {
        $(".header-sticky").addClass("is-sticky");
      } else {
        $(".header-sticky").removeClass("is-sticky");
      }
    });

    // Nav Active Code
    /*==============================================================*/
    if ($.fn.getfundNav) {
      $("#listingNav").getfundNav({
        theme: "light",
      });
    }
  });

  // Home Slides
  $(".home-slides").owlCarousel({
    loop: true,
    nav: true,
    dots: false,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>",
    ],
    items: 1,
    smartSpeed: 2000,
    animateOut: "slideOutUp",
    autoplayHoverPause: true,
    animateIn: "fadeInUp",
    autoplay: true,
  });
  $(".home-slides").on("translate.owl.carousel", function () {
    $(".main-banner h1").removeClass("animated fadeInUp").css("opacity", "0");
    $(".main-banner p").removeClass("animated zoomIn").css("opacity", "0");
    $(".main-banner .learn-more-btn")
      .removeClass("animated fadeInDown")
      .css("opacity", "0");
    $(".main-banner .banner-image")
      .removeClass("animated fadeInUp")
      .css("opacity", "0");
  });
  $(".home-slides").on("translated.owl.carousel", function () {
    $(".main-banner h1").addClass("animated fadeInUp").css("opacity", "1");
    $(".main-banner p").addClass("animated zoomIn").css("opacity", "1");
    $(".main-banner .learn-more-btn")
      .addClass("animated fadeInDown")
      .css("opacity", "1");
    $(".main-banner .banner-image")
      .addClass("animated fadeInUp")
      .css("opacity", "1");
  });

  /*------------------------------------------
        = SHOP DETAILS PAGE PRODUCT SLIDER
    -------------------------------------------*/
  if ($(".shop-single-slider").length) {
    $(".slider-for").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: ".slider-nav",
    });
    $(".slider-nav").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: ".slider-for",
      focusOnSelect: true,

      prevArrow: '<i class="fas fa-arrow-left nav-btn nav-btn-lt"></i>',
      nextArrow: '<i class="fas fa-arrow-right nav-btn nav-btn-rt"></i>',

      responsive: [
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  $("#owl-demo3").owlCarousel({
    items: 1,
    itemsDesktop: [1000, 2],
    itemsDesktopSmall: [980, 1],
    itemsTablet: [768, 1],
    pagination: true,
    navigation: true,
    navigationText: ["", ""],
    autoPlay: true,
  });

  // =====================================================
  //      Items slider
  // =====================================================

  var guidesSlider = new Swiper(".guides-slider", {
    slidesPerView: 5,
    spaceBetween: 15,
    loop: true,
    roundLengths: true,
    breakpoints: {
      1200: {
        slidesPerView: 4,
      },
      991: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 2,
      },
      400: {
        slidesPerView: 1,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
  });

  $(".progress-value > span").each(function () {
    $(this)
      .prop("Counter", 0)
      .animate(
        {
          Counter: $(this).text(),
        },
        {
          duration: 1500,
          easing: "swing",
          step: function (now) {
            $(this).text(Math.ceil(now));
          },
        }
      );
  });

  /* Preloader
    ========================================================*/
  jQuery(window).on("load", function () {
    $(".preloader-area").fadeOut();
  });
})(jQuery);



