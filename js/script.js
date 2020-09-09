// JavaScript Document
jQuery(document).ready(function ($) {
	var $side_menu_trigger = $("#nav-trigger"),
		$content_wrapper = $(".main-content"),
		$navigation = $("header");

	//open-close lateral menu clicking on the menu icon
	$side_menu_trigger.on("click", function (event) {
		event.preventDefault();

		$side_menu_trigger.toggleClass("is-clicked");
		$navigation.toggleClass("menu-open");
		$content_wrapper
			.toggleClass("menu-open")
			.one(
				"webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
				function () {
					// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
					$("body").toggleClass("overflow-hidden");
				}
			);
		$("#side-nav").toggleClass("menu-open");

		//check if transitions are not supported - i.e. in IE9
		if ($("html").hasClass("no-csstransitions")) {
			$("body").toggleClass("overflow-hidden");
		}
	});

	//close lateral menu clicking outside the menu itself
	$content_wrapper.on("click", function (event) {
		if (!$(event.target).is("#menu-trigger, #menu-trigger span")) {
			$side_menu_trigger.removeClass("is-clicked");
			$navigation.removeClass("menu-open");
			$content_wrapper
				.removeClass("menu-open")
				.one(
					"webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
					function () {
						$("body").removeClass("overflow-hidden");
					}
				);
			$("#side-nav").removeClass("menu-open");
			//check if transitions are not supported
			if ($("html").hasClass("no-csstransitions")) {
				$("body").removeClass("overflow-hidden");
			}
		}
	});

	//open (or close) submenu items in the lateral menu. Close all the other open submenu items.
	$(".item-has-children")
		.children("a")
		.on("click", function (event) {
			event.preventDefault();
			$(this)
				.toggleClass("submenu-open")
				.next(".sub-menu")
				.slideToggle(200)
				.end()
				.parent(".item-has-children")
				.siblings(".item-has-children")
				.children("a")
				.removeClass("submenu-open")
				.next(".sub-menu")
				.slideUp(200);
		});
});

$(function () {

	var $window = $(window),
		win_height_padded = $window.height() * 1.1,
		isTouch = Modernizr.touch;

	if (isTouch) {
		$('.revealOnScroll').addClass('animated');
	}

	$window.on('scroll', revealOnScroll);

	function revealOnScroll() {
		var scrolled = $window.scrollTop(),
			win_height_padded = $window.height() * 1.1;

		// Showed...
		$(".revealOnScroll:not(.animated)").each(function () {
			var $this = $(this),
				offsetTop = $this.offset().top;

			if (scrolled + win_height_padded > offsetTop) {
				if ($this.data('timeout')) {
					window.setTimeout(function () {
						$this.addClass('animated ' + $this.data('animation'));
					}, parseInt($this.data('timeout'), 10));
				} else {
					$this.addClass('animated ' + $this.data('animation'));
				}
			}
		});
		// Hidden...
		$(".revealOnScroll.animated").each(function (index) {
			var $this = $(this),
				offsetTop = $this.offset().top;
			if (scrolled + win_height_padded < offsetTop) {
				$(this).removeClass('animated fadeInUp flipInX lightSpeedIn')
			}
		});
	}

	revealOnScroll();
});
var cnt = document.getElementById("count");

var percent = cnt.innerText;
var interval;
interval = setInterval(function () {
	percent++;
	cnt.innerHTML = percent;
	if (percent == 70) {
		clearInterval(interval);
	}
}, 60);
var Gallery = function () {
	var perRow = 4,
		items = document.querySelectorAll(".item"),
		leftOver = items.length % perRow,
		lb = document.querySelector(".gallery-lightbox"),
		lbContent = document.querySelector(".gallery-lightbox .col-12"),
		lbClose = document.querySelector(".gallery-lightbox .close"),
		next = document.querySelector(".gallery-lightbox .next"),
		previous = document.querySelector(".gallery-lightbox .previous"),
		currentImgNum = document.querySelector(".gallery-lightbox .current-image"),
		totalImgNum = document.querySelector(".gallery-lightbox .total-images"),
		galleryIndex = 0;

	var replaceImage = function (img) {
		while (lbContent.lastChild) {
			lbContent.removeChild(lbContent.lastChild);
		}
		lbContent.appendChild(img);
	};

	var getImages = function () {
		var images = [];

		for (var i = 0; i < items.length; i++) {
			images.push(items[i].children[0]);
		}

		return images;
	};

	var switchImage = function (next) {
		var images = getImages(),
			img = document.createElement("img");

		if (next) {
			// next
			if (galleryIndex + 1 > images.length - 1) {
				galleryIndex = 0;
			} else {
				galleryIndex = galleryIndex + 1;
			}
		} else {
			// previous
			if (galleryIndex - 1 < 0) {
				galleryIndex = images.length - 1;
			} else {
				galleryIndex = galleryIndex - 1;
			}
		}

		img.setAttribute("src", images[galleryIndex].getAttribute("src"));
		replaceImage(img);
		currentImgNum.innerText = galleryIndex + 1;
	};

	var closeGallery = function (e) {
		if (e.keyCode === 27 || this.nodeType === 1) {
			lb.classList.remove("active");
			window.removeEventListener("keydown", closeGallery);
		}
	};

	var handleArrowClick = function (e) {
		if (this === next) {
			switchImage(true);
		} else {
			switchImage(false);
		}
	};

	var handleKeydown = function (e) {
		if (e.keyCode === 27) {
			lb.classList.remove("active");
			window.removeEventListener("keydown", closeGallery);
		} else if (e.keyCode === 37) {
			// Previous
			switchImage(false);
		} else if (e.keyCode === 39) {
			// Next
			switchImage(true);
		}
	};

	var openGallery = function (e) {
		e.preventDefault();
		lb.classList.toggle("active");
		window.addEventListener("keydown", handleKeydown);

		for (var i = 0; i < items.length; i++) {
			if (items[i] === this) {
				galleryIndex = i;
				break;
			}
		}

		var img = document.createElement("img"),
			imgSrc = this.children[0].getAttribute("src");

		img.setAttribute("src", imgSrc);
		replaceImage(img);
		currentImgNum.innerText = galleryIndex + 1;
	};

	var sizeImages = function () {
		var spaceAvailable = document.querySelector(".gallery-wrapper").offsetWidth,
			imgWidth;

		if (spaceAvailable < 1024) {
			perRow = 2;
		}

		imgWidth = Math.floor(spaceAvailable / perRow);

		for (var i = 0; i < items.length; i++) {
			if (leftOver >= 0) {
				if (i >= items.length - leftOver) {
					items[i].style.width = spaceAvailable / leftOver + "px";
				} else {
					items[i].style.width = imgWidth + "px";
				}
			} else {
				items[i].style.width = imgWidth + "px";
			}

			items[i].onclick = openGallery;
		}
	};

	sizeImages();
	window.addEventListener("resize", sizeImages);
	next.onclick = handleArrowClick;
	previous.onclick = handleArrowClick;
	currentImgNum.innerText = galleryIndex + 1;
	totalImgNum.innerText = items.length;

	lbClose.onclick = closeGallery;
};

Gallery();



$(".button--bubble").each(function () {
  var $circlesTopLeft = $(this).parent().find(".circle.top-left");
  var $circlesBottomRight = $(this).parent().find(".circle.bottom-right");

  var tl = new TimelineLite();
  var tl2 = new TimelineLite();

  var btTl = new TimelineLite({ paused: true });

  tl.to($circlesTopLeft, 1.2, {
    x: -25,
    y: -25,
    scaleY: 2,
    ease: SlowMo.ease.config(0.1, 0.7, false)
  });
  tl.to($circlesTopLeft.eq(0), 0.1, { scale: 0.2, x: "+=6", y: "-=2" });
  tl.to(
    $circlesTopLeft.eq(1),
    0.1,
    { scaleX: 1, scaleY: 0.8, x: "-=10", y: "-=7" },
    "-=0.1"
  );
  tl.to(
    $circlesTopLeft.eq(2),
    0.1,
    { scale: 0.2, x: "-=15", y: "+=6" },
    "-=0.1"
  );
  tl.to($circlesTopLeft.eq(0), 1, {
    scale: 0,
    x: "-=5",
    y: "-=15",
    opacity: 0
  });
  tl.to(
    $circlesTopLeft.eq(1),
    1,
    { scaleX: 0.4, scaleY: 0.4, x: "-=10", y: "-=10", opacity: 0 },
    "-=1"
  );
  tl.to(
    $circlesTopLeft.eq(2),
    1,
    { scale: 0, x: "-=15", y: "+=5", opacity: 0 },
    "-=1"
  );

  var tlBt1 = new TimelineLite();
  var tlBt2 = new TimelineLite();

  tlBt1.set($circlesTopLeft, { x: 0, y: 0, rotation: -45 });
  tlBt1.add(tl);

  tl2.set($circlesBottomRight, { x: 0, y: 0 });
  tl2.to($circlesBottomRight, 1.1, {
    x: 30,
    y: 30,
    ease: SlowMo.ease.config(0.1, 0.7, false)
  });
  tl2.to($circlesBottomRight.eq(0), 0.1, { scale: 0.2, x: "-=6", y: "+=3" });
  tl2.to(
    $circlesBottomRight.eq(1),
    0.1,
    { scale: 0.8, x: "+=7", y: "+=3" },
    "-=0.1"
  );
  tl2.to(
    $circlesBottomRight.eq(2),
    0.1,
    { scale: 0.2, x: "+=15", y: "-=6" },
    "-=0.2"
  );
  tl2.to($circlesBottomRight.eq(0), 1, {
    scale: 0,
    x: "+=5",
    y: "+=15",
    opacity: 0
  });
  tl2.to(
    $circlesBottomRight.eq(1),
    1,
    { scale: 0.4, x: "+=7", y: "+=7", opacity: 0 },
    "-=1"
  );
  tl2.to(
    $circlesBottomRight.eq(2),
    1,
    { scale: 0, x: "+=15", y: "-=5", opacity: 0 },
    "-=1"
  );

  tlBt2.set($circlesBottomRight, { x: 0, y: 0, rotation: 45 });
  tlBt2.add(tl2);

  btTl.add(tlBt1);
  btTl.to(
    $(this).parent().find(".button.effect-button"),
    0.8,
    { scaleY: 1.1 },
    0.1
  );
  btTl.add(tlBt2, 0.2);
  btTl.to(
    $(this).parent().find(".button.effect-button"),
    1.8,
    { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) },
    1.2
  );

  btTl.timeScale(2.6);

  $(this).on("mouseover", function () {
    btTl.restart();
  });
});





























