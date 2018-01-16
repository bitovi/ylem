function getTextFromElement(node) {
	var txt = "";
	node = node.firstChild;
	while(node) {
		if(node.nodeType === 3) {
			txt += node.nodeValue;
		} else {
			txt += getTextFromElement(node);
		}
		node = node.nextSibling;
	}
	return txt;
}

const supportsFunctionName = (function() {
	function foo(){}
	return foo.name === 'foo';
})();

export { getTextFromElement, supportsFunctionName };
