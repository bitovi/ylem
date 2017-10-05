if (typeof window.Map === 'undefined') {
	window.Map = require('can-cid/map/map');
}

if (typeof window.Set === 'undefined') {
	window.Set = require('can-cid/set/set');
}

if (typeof window.requestAnimationFrame === 'undefined') {
	window.requestAnimationFrame = function(callback) {
		setTimeout(callback, 0);
	};
}
