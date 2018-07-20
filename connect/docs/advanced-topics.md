## Advanced Topics

### [Easy Testing](./easy-testing.md)
With the separation of View and Store provided by ylem, testing follows the same pattern and becomes much easier: your views and stores can be tested in isolation without regard for each other.

### [Using `observe()` for Extra Rendering Efficiency](./observe.md)
Even when not connecting a store to your component, ylem can still be used to increase efficiency by observing sub-component renders.

### [Resolving Prop Name Conflicts with `deriveUpdates`](./derive-updates.md)
There are a number of reasons to rename props as they come into your store. Perhaps you want to provide a simple external api but need to move and modify those prior to use. Perhaps you want to modify the values provided by the user while still maintaining access to the original values. Either way, ylem's `deriveUpdates` can help.

### [Backend Services](./backend-services.md)
Inevitably, you will need to access backend services. This is exceedingly simple with ylem: any api that uses promises (including `fetch`) will seamlessly integrate. Use [can-realtime-rest-model](https://canjs.com/doc/can-realtime-rest-model.html) for more advanced models.

### [Use with the Recompose library](./recompose.md)
Like higher-order components? Seamlessly create enhancers for recompose using `withStore`, an alias of `connect`.
