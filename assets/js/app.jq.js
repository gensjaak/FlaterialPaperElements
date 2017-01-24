"use strict";

(function ($) {
	var fset = {
		cri: 0
	};

	var loadSettings = function () {
		return (JSON.parse($.jStorage.get("fset", null)) || {});
	};

	var saveSettings = function () {
		$.jStorage.set("fset", JSON.stringify(fset));
	};

	var __routes = ["popups", "datetimepicker", "buttons"];
	var __cri = loadSettings().cri;

	var route = function (route) {
		if (route && window.location.hash !== ("#" + route)) {
			window.location.hash = "#" + route;

			fset.cri = __routes.indexOf(route);
			saveSettings();
		} else if (!route) return window.location.hash.replace("#", "");

		updateUI();
	};

	var isOriginalEvent = function (e) {
		return (e && e.hasOwnProperty("originalEvent") && e.originalEvent.isTrusted);
	};

	var resolveEvents = function ($elt) {
		if ('length' in $elt)
			$elt.each(function (i, el, $el = $(el)) {
				$el.off('click'), $el.on('click', function (e) {
					if (isOriginalEvent(e)) {
						try {
							route(__routes[$el.attr("fhref")]);
						} catch(e) {
							route(__routes[0]);
						}
					}
				});
			});
	};

	var updateUI = function () {
		var index = __routes.indexOf(route());

		$('li.item').removeClass('active');
		$('a[fhref=' + index + ']').parent("li.item").addClass('active');

		$('section[fid]').fadeOut("fast");
		$('section[fid=' + index + ']').attr('fid-bind', __routes[index]).fadeIn("slow");
	};

	$(document).ready(function (e) {
		var $fhref = $('a[fhref]');

		resolveEvents($fhref);
		route(__routes[__cri]);
	});

}) (jQuery);