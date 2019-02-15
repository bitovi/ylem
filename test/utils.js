/* eslint-disable no-param-reassign */

function extractText(node) {
  let txt = '';

  node = node.firstChild;
  while (node) {
    if (node.nodeType === 3) {
      txt += node.nodeValue;
    }
    else {
      txt += extractText(node);
    }

    node = node.nextSibling;
  }

  return txt;
}

export { extractText };
