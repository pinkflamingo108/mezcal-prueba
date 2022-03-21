/**
 * site.js
 * Base logic, feel free to replace with your own and/or use the libraries of your choice
 */
Site = Class.extend({
	init: function(options) {
		var obj = this,
			opts = _.defaults(options, {
				// Add options here
			});
		jQuery(document).ready(function($) {

			// Button and spanish text + valign wrapper
			$.extend(true, $.alert.defaults, {
				markup: '<div class="alert-overlay"><div class="valign-wrapper"><div class="valign"><div class="alert"><div class="alert-message">{message}</div><div class="alert-buttons"></div></div></div></div></div>',
				buttonMarkup: '<button class="button button-primary"></button>',
				buttons: [
					{ text: 'Aceptar', action: $.alert.close }
				]
			});

			obj.onDomReady($);
		});
	},
	onDomReady: function($) {
		var obj = this;

		AOS.init();

		if(!store.get('legal')) {

			$.magnificPopup.open({
				modal: true,
				fixedContentPos: true,
				items: { src: '#legal' },
				type: 'inline'
			});
		} else {
			if($('#popup').length) $.magnificPopup.open({ items: { src: '#popup' }, type: 'inline' });
		}

		$('.js-close-legal').on('click', function(event) {
			event.preventDefault();
			$.magnificPopup.close();
			store.set('legal', true);

			setTimeout(function() {
				if($('#popup').length) $.magnificPopup.open({ items: { src: '#popup' }, type: 'inline' });
			}, 500);

		});

		$('.hamburger').on('click', function(event) {
			event.preventDefault();
			var el = $(this);
			el.toggleClass('is-active');
			$('.primary-navigation').toggleClass('is-open');
		});

		$('.easy-slick').slick({
			autoplay: true,
			autoplaySpeed: 2000,
			arrows: false
		});

		$('.block-proceso .js-slick').slick({
			dots: true,
			arrows: false,
			infinite: false,
			speed: 300,
			slidesToShow: 5,
			centerMode: true,
			customPaging : function(slider, i) {
				return '<a class="slick-dot">' + (i+1) + '</a>';
			},
			responsive: [
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						infinite: true,
					}
				}
			]
		});

		$('.block-proceso-slick .slick-slider').slick({
			dots: false,
			prevArrow: $('.arrow-left'),
			nextArrow: $('.arrow-right'),
			infinite: true,
			speed: 300,
			slidesToShow: 1
		});

		$('.block-cocteles .slick-slider').slick({
			dots: false,
			prevArrow: $('.arrow-left'),
			nextArrow: $('.arrow-right'),
			infinite: true,
			speed: 300,
			autoplay: true,
			autoplaySpeed: 2000,
			slidesToShow: 1
		});

		$('.block-splash .splash-slick').slick({
			arrows: false,
			dots: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			customPaging : function(slider, i) {
				return '<a class="slick-dot">' + (i+1) + '</a>';
			},
		});

		var waypoints = $('.header-waypoints').waypoint({
			handler: function(direction) {
				if(direction == 'down') {
					$('body').addClass('has-small-header');
				} else {
					$('body').removeClass('has-small-header');
				}
			}
		});

		$('[data-popup=ajax]').magnificPopup({ type: 'ajax' });
		$('[data-popup=image]').magnificPopup({ type: 'image' });
		$('[data-popup=inline]').magnificPopup({ type: 'inline' });
		$('[data-popup=iframe]').magnificPopup({ type: 'iframe' });
		$('[data-popup=gallery]').magnificPopup({ type: 'image', gallery: { enabled: true } });

		$('form[data-submit=ajax]').each(function() {
			var form = $(this);
			form.ajaxForm({
				dataType: 'json',
				beforeSubmit: function() {
					return form.validate({
						callbacks: {
							fail: function(field, type, message) {
								field.closest('.form-group').addClass('has-error');
								field.on('focus', function() {
									field.closest('.form-group').removeClass('has-error');
									field.off('focus');
								});
							},
							success: function() {
								form.find('input, select').prop({ disabled: true });
								form.find('button[type=submit]').prop({ disabled: true }).loading({ text: 'Enviando...' });
							},
							error: function(fields) {
								$.alert('Por favor llena todos los campos requeridos');
							}
						}
					});
				},
				success: function(response) {
					form.clearForm();
					form.find('input, select').prop({ disabled: false });
					form.find('button[type=submit]').prop({ disabled: false }).loading('done');
					if (response && response.result == 'success') {
						$.alert(response.message || 'Gracias por tus comentarios');
					} else {
						$.alert(response.message || 'Ha ocurrido un error');
					}
				}
			});
		});

		$('form[data-submit=validate]').on('submit', function() {
			var form = $(this);
			return form.validate({
				callbacks: {
					fail: function(field, type, message) {
						field.closest('.form-group').addClass('has-error');
						field.on('focus', function() {
							field.closest('.form-group').removeClass('has-error');
							field.off('focus');
						});
					},
					error: function(fields) {
						$.alert('Por favor llena todos los campos requeridos');
					}
				}
			});
		});
	}
});

var site = new Site();