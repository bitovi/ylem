import canDiff from 'can-diff';

function controlled(nextProps) {
	// always use the latest props, overwiting existing data
	return nextProps;
}

function uncontrolled(nextProps, lastProps) {
	// use props on initial render (when lastProps is null)
	if (lastProps === null) {
		return nextProps;
	}

	// otherwise do nothing
	return null;
}

function changes(nextProps, lastProps) {
	// use props on initial render (when lastProps is null)
	if (lastProps === null) {
		return nextProps;
	}

	const patches = canDiff.map(lastProps, nextProps);
	if (!patches.length) {
		return null;
	}

	const diff = {};
	for (const { key, type, value } of patches) {
		if (type === 'set' || type === 'add') {
			diff[key] = value;
		}
	}

	return diff;
}

export {
	controlled,
	uncontrolled,
	changes,
};
