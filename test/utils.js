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

// eslint-disable-next-line import/prefer-default-export
export { extractText };
