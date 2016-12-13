"use strict";

(function ($) {
	$(document).ready(function (e) {
		// Bloquer la selection et la colle dans le champ de mot de passe
		$('input[type=password]').bind('paste', function(e) {
			e.preventDefault();
		});
		$('input[type=password]').bind('selectstart', function() {
			return false;
		});

		// Fix some sections when scrolling (gg's page)
		if ($(this).scrollTop() >= 488 && window.outerWidth >= 990) {
			$(".scroll-and-fix").addClass('scroll-and-fix-active');
		} else {
			$(".scroll-and-fix").removeClass('scroll-and-fix-active');
		}
		$(this).on('scroll', function (e) {
			// Side infos on profile page
			if ($(this).scrollTop() >= 488 && window.outerWidth >= 990) {
				if ($(".scroll-and-fix")) $(".scroll-and-fix").addClass('scroll-and-fix-active');
			} else {
				if ($(".scroll-and-fix")) $(".scroll-and-fix").removeClass('scroll-and-fix-active');
			}

			// Fix expandable-56 on scroll
			if ($(this).scrollTop() >= 60) {
				if ($('#targetToExpand')) $('#targetToExpand').addClass('fixed-top');
			} else {
				if ($('#targetToExpand')) $('#targetToExpand').removeClass('fixed-top');
			}
		});

		// Mapping some DOMElements
		setTimeout(function () {
			$('img.mapped').on('load', function (e) {
				$('input.hidden[name=' + $(this).attr('id') + ']').attr('value', $(this).attr('src').toString());
			});
		}, 1000);

		var urlB64ToUint8Array = function (base64String) {
			var padding = '='.repeat((4 - base64String.length % 4) % 4);
			var base64 = (base64String + padding)
		    .replace(/\-/g, '+')
		    .replace(/_/g, '/');

		  var rawData = window.atob(base64);
		  var outputArray = new Uint8Array(rawData.length);

		  for (var i = 0; i < rawData.length; ++i) {
		    outputArray[i] = rawData.charCodeAt(i);
		  }
		  return outputArray;
		};

		var updateSubscriptionOnServer = function (subscription) {
			
		};

		if ("serviceWorker" in navigator && 'PushManager' in window) {
			navigator.serviceWorker.register('/gs-sw.js').then(function (swReg) {
				swReg.pushManager.getSubscription().then(function(subscription) {
					var isSubscribed = !(subscription === null);
					if (isSubscribed) {
						updateSubscriptionOnServer(JSON.stringify(subscription));
					} else {
						var applicationServerPublicKey = 'BArhFsNMYgef1uXGeDs0xy9SwaP2zqr3GV7h8_W-1Ea2AMB0u4KCCitvEUANVHQK0b3WfIkr5muwn6nT1soB8N8';
						var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
						swReg.pushManager.subscribe({
							userVisibleOnly: true,
							applicationServerKey: applicationServerKey
						}).then(function(subscription) {
							updateSubscriptionOnServer(JSON.stringify(subscription));
							isSubscribed = true;
						}).catch(function(err) {
							console.log('Failed to subscribe the user: ', err);
						});
					}
				});
				
				if ('showNotification' in ServiceWorkerRegistration.prototype) {
					Notification.requestPermission().then(function (permission) {
						if (permission === 'denied' || permission === 'default') {
							console.warn('Notifications::permissions  non accordée !');
						} else initializePushNotificationService();
					});
				} else console.warn('Les notifications Push ne sont pas supportées !');
			});
		} else console.warn("Votre navigateur ne supporte pas ServiceWorker. Veuillez mettre à jour votre navigateur !");

		function initializePushNotificationService() {
			if (Notification.permission === 'denied') {
				console.warn('The user has blocked notifications.');
				return;
			}

			if (!('PushManager' in window)) {
				console.warn('Push messaging isn\'t supported.');
				return;
			}

			navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
				serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
						if (!subscription) {
							return;
						}
					})
					.catch(function(err) {
						if (Notification.permission === 'denied') console.warn('Permission for Notifications was denied');
						else console.warn('Error during getSubscription()', err);
					});
			});
		}
	});
}) (jQuery);