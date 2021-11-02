# SplitTesting.js

This library allows you to easily implement split testing to your website, in a multi-variant way (A/B, A/B/C, etc...).
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
import { setExperiment, getPickedVariant } from 'split-testing';

// Configuration of the experiment 
const experimentName = 'test1'
const variants = [
  { name: 'control', data: {} },
  { name: 'test', data: {} }
]

// Setting up the experiment
setExperiment({
  name: experimentName,
  variants,
  onVariantPicked: (pickedVariant) => {
    // When the variant is first picked for the user (= first-load of the page)
    console.log(`Variant picked, named "${pickedVariant.name}"`)
  }
})
```

If no variant is detected in `localStorage`,  one will be randomly picked (same chance for all the variants), which will trigger the `onVariantPicked` method if provided.

The code is synchrone, so after the execution of `setExperiment` you can directly access the persistant variant like so :
```javascript
const pickedVariant = getPickedVariant({ experimentName, variants })
```

The name of the experiment is used in the property name of the localStorage, that's why we need to pass it in the different methods for getting the saved variant.

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
<script defer src="https://unpkg.com/split-testing/dist/bundle.js"></script>
```
You will then have a global variable `SplitTesting` available, containing all the methods you need.

## Todo

- Documenting the _debug mode_
- Option for allowing or not the _seed conflict check_
- Adding `weight` to variants for changing their probability to be picked
- Adding a test library for validating the methods and the randomness
