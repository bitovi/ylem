## Resolving Prop Name Conflicts with `deriveUpdates`

Ylem provides a `deriveUpdates` option, allowing you to adjust props before they are passed into your Store.

Often, especially when dealing with form components, you want to allow the user to specify an incoming value and also track internal changes to that value. Further, it is preferable if the incoming prop is something simple like `title`, and for your own sanity that the same simple name of `title` be used internally for tracking changes. This presents a unique problem however, where these two uses of the same name will conflict.

Here we have a `Form` component, which would be rendered as `<Form title="Default Title" />`. How would you implement the reset here though, as the original values have been overwritten.

```js
export class FormStore extends ObserveObject {
  title = ""

  setTitle = (title) => {
    this.title = title;
  }

  submit = () => {
    return fetch(...);
  }

  reset = () => {
    // how?
  }
}

export const Form = ({ title, setTitle, reset }) => (
  <form>
    <input value={title} onChange={(e) => setTitle(e.target.value)} />
  </form>
);

export default connect(FormStore)(Form);
```

We *could* have the user pass in `defaultTitle` (and `defaultName` and `defaultX`...), then add all the logic to connect defaults with current. *Or* you could just rename the incoming `title` to `defaultTitle`, use it to initialize `title`, and re-use it later to reset the values.

```js
export class FormStore extends ObserveObject {
  title = this.defaultTitle

  setTitle = (title) => {
    this.title = title;
  }

  submit = () => {
    return fetch(...);
  }

  reset = () => {
    this.title = this.defaultTitle;
  }
}

export const Form = ({ title, setTitle, reset }) => (
  <form>
    <input value={title} onChange={(e) => setTitle(e.target.value)} />
  </form>
);

export default connect(FormStore, {
  deriveUpdates: ({ title }) => ({ defaultTitle: title}),
})(Form);
```

_Note: Though we are using this with `connect`, it is also available with `ylem` and `createComponent`.
