# SplitTesting.js

<p>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/dm/split-testing" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/v/split-testing" alt="Version"></a>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/types/split-testing" alt="Types"></a>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/license/split-testing" alt="License"></a>
</p>

This library allows you to easily implement split testing to your website in only 3.0kb (size of the bundle.js file).

It's fully written in TypeScript with a functional programming and declarative  paradigm in mind.

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

Or through a CDN for having a global variable `SplitTesting` containing all the methods :
```html
<script defer src="https://unpkg.com/split-testing@0.4.2/dist/bundle.js"></script>
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
    // Callback when this experiment had no variant saved in localStorage yet
    // Example of action: sending an event to analytics with the variant picked
  }
})

// Getting the variant of the user
const pickedVariant = getPickedVariant({ experimentName, variants })

/* Execute your code here with the pickedVariant.data variable */
```

There is only two options mandatory for setting up the experiment : `name` and `variants`.

During the set up method, if no variant is detected in localStorage, one will be randomly picked (same chance for all the variants if no weight provided), which will trigger the `onVariantPicked` method if present in the options.

The code is fully [declarative](https://www.freecodecamp.org/news/imperative-vs-declarative-programming-difference/), so the library is using the name of the experiment for saving the variant (and the seed if provided) in localStorage, that's why we need to pass the `experimentName` or `variants` in the method `pickedVariant` for example.

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

For example, by putting the userID as the seed: **the variant will be consistent whatever the device used by the user.**

**To know**: If a variant is already set (seeded or not) and a different seed from the variant's one is detected, then the variant will change for respecting the new seed.
You can disallow this behavior by putting `resolveSeedConflict: false` in the options of `setExperiment` (not recommended). 

### 2) Weighted variant

By default all variants have the same probability of being picked at first load, but you can change that with the `weight` property :

```javascript
SplitTesting.setExperiment({
  name: 'abtest-weighted',
  variants: [
    { name: 'control', weight: 0.50 }, // 50% chance of being picked
    { name: 'test1', weight: 0.25 }, // 25% chance of being picked
    { name: 'test2', weight: 0.25 } // 25% chance of being picked
  ]
})
```

**To know** - The weight values will be reseted to the default ones if :
- The total of all weight is not equal to 1
- Some variants have a weight property and others no

In those cases, a warning will be present in the console.

## Error-free code

If there is a problem with the seed of with the weights of the variants, SplitTesting.js will automatically resolve it and warn you about it in the console.

However, errors can still happen if one of these conditions is met :
- At least one of the mandatory options in `setExperiment` is not given
- A variant saved in localStorage is no more present in the `variants` given

**If your split test is at least tested once without errors, and no change happen in the `variants` variable, then no error should ever occur**

In case you really don't want any error for sure, the `setExperiment` method returns a boolean making an error-free code and fully secure experiment possible.

Of course, you can still use a try/catch instead and put your default code in the catch part.

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

## Todo
 
- Adding a test library for having a more secure library