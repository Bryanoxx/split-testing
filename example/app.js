import { setExperiment } from '../src/index.ts'

// Configuration of the experiment
const experimentName = 'test1'
const variants = [
  { name: 'control', weight: 0.75, data: 'Super title (control)' },
  { name: 'test', weight: 0.25, data: 'Great title (test)' }
]

try {
  // Setting up the experiment
  const pickedVariant = setExperiment({
    name: experimentName,
    variants,
    isDebugMode: true,
    onFirstPicking: (pickedVariant) => {
      // When the variant is first picked for the user (= first-load of the page)
      console.log(`Variant picked, named "${pickedVariant.name}"`)
    }
  })

  // Define the title of the page depending on the picked variant
  document.body.querySelector('[data-variant]').textContent = pickedVariant.data
} catch (e) {
  // If the experiment is not set up, we can't get the picked variant
  document.body.querySelector('[data-variant]').textContent = variants[0].data + ' (error)'
}
