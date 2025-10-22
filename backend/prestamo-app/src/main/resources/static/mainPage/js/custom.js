$(function () {
	"use strict";
	/* Tooltip
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	
	
	/* Mouseover
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
	$(document).ready(function(){
		$(".main-menu ul li.megamenu").mouseover(function(){
			if (!$(this).parent().hasClass("#wrapper")){
			$("#wrapper").addClass('overlay');
			}
		});
		$(".main-menu ul li.megamenu").mouseleave(function(){
			$("#wrapper").removeClass('overlay');
		});
	});
	
	/* Toggle sidebar
	-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     $(document).ready(function () {
       $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
          $(this).toggleClass('active');
       });
     });

     /* Product slider 
     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
     // optional
     $('#blogCarousel').carousel({
        interval: 5000
     });
});

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function(e) {
		e.preventDefault();

		const targetId = this.getAttribute('href');
		if(targetId === '#') return;

		const targetElement = document.querySelector(targetId);
		if(targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop - 100,
				behavior: 'smooth'
			});
		}
	});
});

// Efecto de carga para imágenes
const lazyLoadImages = () => {
	const images = document.querySelectorAll('img[data-src]');

	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if(entry.isIntersecting) {
				const img = entry.target;
				img.src = img.getAttribute('data-src');
				img.removeAttribute('data-src');
				img.classList.add('fade-in');
				observer.unobserve(img);
			}
		});
	});

	images.forEach(img => imageObserver.observe(img));
};

document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Validación de formulario
const forms = document.querySelectorAll('form');
forms.forEach(form => {
	form.addEventListener('submit', function(e) {
		const inputs = this.querySelectorAll('input[required], select[required]');
		let isValid = true;

		inputs.forEach(input => {
			if(!input.value.trim()) {
				input.classList.add('error');
				isValid = false;
			} else {
				input.classList.remove('error');
			}
		});

		if(!isValid) {
			e.preventDefault();
			this.querySelector('.error')?.focus();
		} else {
			// Mostrar mensaje de éxito
			const successMsg = document.createElement('div');
			successMsg.className = 'alert alert-success mt-3';
			successMsg.textContent = '¡Gracias! Tu solicitud ha sido enviada.';
			this.appendChild(successMsg);

			// Resetear formulario después de 3 segundos
			setTimeout(() => {
				this.reset();
				successMsg.remove();
			}, 3000);
		}
	});
});

// Efecto de escritura para el título principal
const typeWriter = () => {
	const title = document.querySelector('.text-bg h1');
	if(title) {
		const text = title.textContent;
		title.textContent = '';

		let i = 0;
		const speed = 50;

		const type = () => {
			if(i < text.length) {
				title.textContent += text.charAt(i);
				i++;
				setTimeout(type, speed);
			}
		};

		type();
	}
};

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
	typeWriter();

	// Configurar tooltips
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.map(function(tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
});

// --- Scroll-triggered animations for fade-in/zoom-in elements ---
function animateOnScroll() {
  const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .zoom-in');
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('animate');
    }
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// --- Counter animation when visible ---
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;
  counters.forEach(counter => {
    let started = false;
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / speed;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };
    const observer = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        updateCount();
        obs.unobserve(counter);
      }
    });
    observer.observe(counter);
  });
}
window.addEventListener('DOMContentLoaded', animateCounters);