import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';

export default DefineMap.extend('DefinedViewModel', {
	// for #91
	childMap1: {
		Type: DefineMap.extend('ChildMap', {}),
	},
	childList1: {
		Type: DefineList.extend('ChildList', {}),
	},
	childMap2: {
		Type: DefineMap,
	},
	childList2: {
		Type: DefineList,
	},

	foo: {
		type: 'string',
		value: 'foo'
	},
	bar: 'string',
	foobar: {
		get() {
			return this.foo + this.bar;
		}
	},

	zzz: {
		set( newVal ) {
			return newVal.toUpperCase();
		}
	},

	interceptedCallbackCalled: 'boolean',
	interceptedCallback: {
		type: 'function',
		get( lastSetValue ) {
			return (...args) => {
				this.interceptedCallbackCalled = true;
				if ( lastSetValue ) {
					return lastSetValue(...args);
				}
			};
		}
	}
});
