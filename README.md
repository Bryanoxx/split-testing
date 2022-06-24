# SplitTesting.js

<p>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/dm/split-testing" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/v/split-testing" alt="Version"></a>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/types/split-testing" alt="Types"></a>
  <a href="https://www.npmjs.com/package/split-testing"><img src="https://badgen.net/npm/license/split-testing" alt="License"></a>
</p>

This library allows you to easily implement split testing to your website in only 3.5kb (size of the bundle.js file).

It's fully written in TypeScript and here are the features you benefit :
- Custom storage of the variant (SSR-friendly)
- Multiple variants possible (A/B, A/B/C, etc...)
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
<script defer src="https://unpkg.com/split-testing@<VERSION>/dist/bundle.js"></script>
```

## Basic Usage

This is how you would use SplitTesting.js in ES6 to create an experiment:

```javascript
import { setExperiment } from 'split-testing';

const pickedVariant = setExperiment({
  name: 'my-first-ab-test',
  variants: [
    { name: 'control', data: {} },
    { name: 'test', data: {} }
  ]
})
```

There is only two options mandatory for setting up the experiment : `name` and `variants`.

The value returned by `setExperiment` is the variant that has been picked or retrieved in storage.

## Real Usage

### Custom storage

By default the picked variant is saved in `window.localStorage`, but you can change that by defining your own `storage` property (see `/src/types.ts` for type definition).

For example, if you want to save the variant in cookies, you could do :

```javascript
import { setExperiment } from 'split-testing';
import Cookies from 'js-cookie'

const pickedVariant = setExperiment({
  name: 'my-first-ab-test',
  variants: [
    { name: 'control' },
    { name: 'test' }
  ],
  storage: {
    getItem(key) {
      return Cookies.get(key) ?? null
    },
    setItem(key, value) {
      Cookies.set(key, value, { expires: 365 })
    },
    removeItem(key) {
      Cookies.remove(key)
    }
  }
})
```

This custom storage allows proper SSR with your JS framework, for example with NuxtJS 3 :
```javascript
storage: {
  getItem(key) {
    return useCookie(key)?.value ?? null
  },
  setItem(key, value) {
    const currentDate = new Date()
    const oneYearFromNow = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
    let newCookie = useCookie(key, { expires: oneYearFromNow })
    newCookie.value = value
  },
  removeItem(key) {
    let cookie = useCookie(key)
    cookie.value = null
  }
}
```


### Weighted variant

By default all variants have the same probability of being picked at first load, but you can change that with the `weight` property :

```javascript
setExperiment({
  name: 'abtest-weighted',
  variants: [
    { name: 'control', weight: 0.50 }, // 50% chance of being picked
    { name: 'test1', weight: 0.25 }, // 25% chance of being picked
    { name: 'test2', weight: 0.25 } // 25% chance of being picked
  ]
})
```

**To know** - The weight values will be reseted in case of :
- The total of all weight is not equal to 1
- Some variants have a weight property and others no

In those cases, a warning will be logged into the console.


### Seeded variant

For cross-device use, you can add a `seed` property, it will have for effect to always return the same variant.

```javascript
setExperiment({
  name: 'my-first-ab-test',
  variants: [
    { name: 'control' },
    { name: 'test' } // Always picked for the same user
  ],
  seed: user.id
})
```

**Warning**: If a variant is already set (seeded or not) and a different seed from the variant's one is detected, then the variant will change for respecting the new seed. You can disallow this behavior by putting `isResolvingSeedConflictAllowed: false` in the options of `setExperiment`.


### Analytics

If you want to send to your analytics provider the variant that has been picked, and that only one time (not the other times when the variant is simply retrieved from storage), you can use the `onFirstPicking` method.

Here is an example by sending the result of the experiment into Plausible Analytics :

```javascript
setExperiment({
  name: 'my-first-ab-test',
  variants: [
    { name: 'control' },
    { name: 'test' }
  ],
  onFirstPicking: (pickedVariant) => {
    Plausible.trackEvent('My first A/B test', {
      variant: pickedVariant.name
    })
  }
})
```


### Debug mode

The debug mode will log various messages of information into the console, allowing you to better understand what the library is doing.

To activate it, simply add `isDebugMode: true` to the experiment options :
```javascript
setExperiment({
  isDebugMode: true,
  name: 'my-first-ab-test',
  variants: [
    { name: 'control' },
    { name: 'test' }
  ]
})
```


### Error-free code

In case of error (bad configuration of the `name` and `variants` properties), `setExperiment` can purposefully throw errors, so the best is to write it inside a `try / catch`.

If the code doesn't throw an error in development mode, it shouldn't send one in production either.

## Type definition

You can see the types of the library in the file `src/types.ts`.

For importing the types in your code, just do :
```typescript
import type { ExperimentOptions, Variant, Storage } from 'split-testing'
```

## Todo before v1

- ~~**Making a custom storage possible** for having a SSR-friendly library~~
- **Adding the `removeExperiment`** method for clearing the storage
- **Adding tests** for securing to the library