import React from 'react';
import { createNewComponentClass, getConnectedComponent } from './observable-component';

export default function createViewModelComponent( ViewModelClass ) {
	const ViewModelComponent = createNewComponentClass(
		ViewModelClass,
		props => props,
		(viewModel, { component, render, children }) => {
			return render
				? render(viewModel)
				: component
					? React.createElement(getConnectedComponent(component), { _vm: viewModel })
					: children // children come last, always called
						? typeof children === 'function'
							? children(viewModel)
							: children
						: null;
		}
	);

	return ViewModelComponent;
}
