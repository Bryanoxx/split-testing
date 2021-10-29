# SplitTesting.js

This library allows you to implement split testing to your website, in a multi-variant way (A/B, A/B/C, etc...).
It's fully written in TypeScript with a functional programming and declarative  paradigm in mind.

Goals of this library :
- Lightweight
- Easy to use
- Secure


## Installation

SplitTesting.js is available on [npm](https://www.npmjs.com/package/split-testing) and can
be installed by running:

```
npm install split-testing
```

## Usage

This is how you would use SplitTesting.js in ES6 to create an experiment:

```javascript
import * as SplitTesting from 'split-testing';

// Configuration of the experiment 
const experimentName = 'test1'
const variants = [
  { name: 'control' },
  { name: 'test' }
]

// Setting up of the experiment
SplitTesting.setExperiment({
  name: experimentName,
  variants,
  onSetLocalVariant: (variant) => {
    // Callback when the variant is first picked for the user
    console.log(`Variant ${variant.name}`)
  }
})
```

If no variant is detected in `localStorage`,  one will be randomly picked (same chance for all the variants), which will trigger the `onSetLocalVariant` method, and make the persistant variant accessible like so :
```javascript
import { getLocalVariantName } from 'split-testing';
const localVariantName = getLocalVariantName(experimentName)
```

## Advance Usage

For more persistance, you can add a `seed` during the experiment, it will have for effect to always return the same variant : 

```javascript
SplitTesting.setExperiment({
  name: 'test2',
  variants: [
    { name: 'control' },
    { name: 'test' } // ALWAYS PICKED
  ],
  seed: 'a constant string'
})
```

**You can for example put the ID of a user as a seed, thus : the variant will be persitent whatever the device used by the user.**

## CDN source

If you don't use NodeJS at all, you can add SplitTesting.js to your website using this line in your HTML :
```html
<script src="https://unpkg.com/split-testing/dist/bundle.js"></script>
```
You will then have a global variable `SplitTesting` available, containing all the methods you need.

## Todo

- Adding `weight` to variants for changing their probability to be picked
- Adding a test library for validating the methods and the randomness
