const shown = {};

export default function deprecated(key) {
  if (shown[key]) {
    return;
  }

  shown[key] = true;
  console.warn(`ylem:${key} is deprecated. Please see the updated docs at https://www.npmjs.com/package/ylem`);
}
