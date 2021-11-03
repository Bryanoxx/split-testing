# SplitTesting.js

This library allows you to easily implement split testing to your website, it's fully written in TypeScript with a functional programming and declarative  paradigm in mind.

Features :
- Variant saved in localStorage
- Multiple variants (A/B, A/B/C, etc...)
- Weighted variants for defining the chance of being picked
- Seed option for cross-device consistency (ex: userID as a seed)


## Installation

SplitTesting.js is available on [npm](https://www.npmjs.com/package/split-testing) and can
be installed by running:

```
npm install split-testing
```

## Basic Usage

This is how you would use SplitTesting.js in ES6 to create an experiment:

```javascript
import { setExperiment, getPickedVariant } from 'split-testing';

// Configuration of the experiment 
const experimentName = 'abtest-basic'
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

### 1) Seeded variant

For more persistance, you can add a `seed` property, it will have for effect to always return the same variant.

```javascript
SplitTesting.setExperiment({
  name: 'abtest-seed',
  variants: [
    { name: 'control' },
    { name: 'test' } // ALWAYS PICKED
  ],
  seed: 'a constant string'
})
```

**For example, by putting the userID as the seed: the variant will be persitent whatever the device used by the user.**

### 2) Weighted variant

By default all variants have the same probability of being picked at first load, but you can change that with the `weight` property :

```javascript
SplitTesting.setExperiment({
  name: 'abtest-weighted',
  variants: [
    { name: 'control', weight: 0.50 }, // 50% chance
    { name: 'test1', weight: 0.25 }, // 25% chance
    { name: 'test2', weight: 0.25 } // 25% chance
  ]
})
```

**Warning** - The weight values will be reseted to the default ones if :
- The total of all weight is not equal to 1
- Some variants have a weight property and others no

In those cases, a warning will be present in the console.

## Debug mode

The debug mode will log various messages of information into the console, allowing you to better understand what the library is doing.

To activate it, simply add `debug: true` to the experiment options :
```javascript
SplitTesting.setExperiment({
  name: experimentName,
  variants,
  debug: true
})
```

## CDN source

If you don't use NodeJS at all, you can add SplitTesting.js to your website using this line in your HTML :
```html
<script defer src="https://unpkg.com/split-testing@0.3.0/dist/bundle.js"></script>
<!-- Check and take the latest version -->
```
You will then have a global variable `SplitTesting` available, containing all the methods you need.

## Todo

- Having 0 dependency
- Option for allowing or not the _seed conflict check_
- Adding a test library for validating the methods and the randomness