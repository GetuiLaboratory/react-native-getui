# cloneReferencedElement for React [![Tests](https://github.com/ide/react-clone-referenced-element/actions/workflows/tests.yaml/badge.svg)](https://github.com/ide/react-clone-referenced-element/actions/workflows/tests.yaml) [![codecov](https://codecov.io/gh/ide/react-clone-referenced-element/branch/main/graph/badge.svg?token=FwQSK9uKF7)](https://codecov.io/gh/ide/react-clone-referenced-element)


This is a version of `React.cloneElement` that preserves the original element's callback ref even if you specify a new callback ref for the clone.

This library is written for components that use callback refs.

## Installation

Install this module from npm:
```sh
npm install --save react-clone-referenced-element
```

This library is written in ES2018. Your JavaScript runtime must support [trailing commas in function calls](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas#trailing_commas_in_functions) and [object spread properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals). All modern browsers since 2018 support these features.

You will also need to transform or define a global variable named `__DEV__`.

## Usage

The signature of `cloneReferencedElement` is the same as that of `React.cloneElement`. However, when using callback refs, it will preserve the ref on the original component if there is one.

```js
const original =
  <Component ref={component => {
    console.log('Running the original ref handler');
  }} />;
const clone = cloneReferencedElement(original, {
  ref(component) {
    console.log('Running the clone ref handler');
  },
});
```

When the component is mounted, the console will display:
```
Running the clone ref handler
Running the original ref handler
```
