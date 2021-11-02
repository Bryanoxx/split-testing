import { setExperiment, getPickedVariant } from '../src/index.ts'

// Configuration of the experiment
const experimentName = 'test1'
const variants = [
  { name: 'control', data: 'Super title (control)' },
  { name: 'test', data: 'Great title (test)' }
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

// Get the picked variant saved in localstorage
const pickedVariant = getPickedVariant({ experimentName, variants })

// Define the title of the page depending on the picked variant
document.body.querySelector('[data-variant]').textContent = pickedVariant.data
