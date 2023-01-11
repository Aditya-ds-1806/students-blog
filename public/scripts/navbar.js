window.addEventListener('scroll', scrollCheck);
window.onload = function() {
	scrollCheck();
};

document.querySelector('.navbar-toggler-icon').addEventListener('click', function() {
	if (window.scrollY <= 20) {
		document.getElementById('nav').classList.toggle('scrolled');
	} else {
		document.getElementById('nav').classList.toggle('bottom-border');
	}
});

function scrollCheck() {
	if (window.scrollY > 20) {
		document.getElementById('nav').classList.add('scrolled');
		document.getElementById('nav').classList.add('bottom-border');
	} else {
		document.getElementById('nav').classList.remove('scrolled');
		document.getElementById('nav').classList.remove('bottom-border');
	}
}