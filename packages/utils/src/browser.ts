export function isIE() {
	return navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1
}
export function isIE11() {
	return navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf('rv:11.0') > -1
}
export function isEdge() {
	return navigator.userAgent.indexOf('Edge') > -1 && !isIE()
}
export function isFirefox() {
	return navigator.userAgent.indexOf("Firefox") > -1
}
export function isOpera() {
	return navigator.userAgent.indexOf("Opera")>-1 || navigator.userAgent.indexOf("OPR")>-1
}
export function isChrome() {
	return navigator.userAgent.indexOf("Chrome")>-1 && navigator.userAgent.indexOf("Safari")>-1 && navigator.userAgent.indexOf("Edge")==-1 && navigator.userAgent.indexOf("OPR")==-1
}
export function isSafari() {
	return navigator.userAgent.indexOf("Safari")>-1 && navigator.userAgent.indexOf("Chrome")==-1 && navigator.userAgent.indexOf("Edge")==-1 && navigator.userAgent.indexOf("OPR")==-1
}
export function isSupportsWebGL() {
	try {
		let canvas = document.createElement('canvas');
		return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
	} catch (e) {
		return false;
	}
}

export function getBrowserVersion() {
	let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
	if(isIE()) {
		let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		let fIEVersion = parseFloat(RegExp["$1"]);
		if(fIEVersion == 7) {
			return 'IE7';
		} else if(fIEVersion == 8) {
			return 'IE8';
		} else if(fIEVersion == 9) {
			return 'IE9';
		} else if(fIEVersion == 10) {
			return 'IE10';
		} else {
			return 'IE6';//IE版本<7
		}
	} else if(isIE11()) {
		return 'IE11';
	} else if(isEdge()) {
		return 'Edge'+userAgent.split('Edge/')[1].split('.')[0];
	} else if(isFirefox()) {
		return 'Firefox'+userAgent.split('Firefox/')[1].split('.')[0];
	} else if(isOpera()) {
		return 'Opera'+userAgent.split('OPR/')[1].split('.')[0];
	} else if(isChrome()) {
		return 'Chrome'+userAgent.split('Chrome/')[1].split('.')[0];
	} else if(isSafari()) {
		return 'Safari'+userAgent.split('Safari/')[1].split('.')[0];
	} else{
		return -1;
	}
}


