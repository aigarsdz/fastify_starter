const path = require('path')
const fs = require('fs')
const pluralize = require('pluralize')

if (process.argv.length > 2) {
  const resourceName = process.argv[2]
  const resourceFileName = resourceName.replace(/\.?([A-Z]+)/g, (a, b) => '_' + b.toLowerCase()).replace(/^_/, '')
  const controllerDirectoryPath = path.resolve(__dirname, '..', 'src', 'controllers')
  const viewDirectoryPath = path.resolve(__dirname, '..', 'src', 'views', resourceFileName)
  const modelDirectoryPath = path.resolve(__dirname, '..', 'src', 'models')

  try {
    let controllerContent = fs.readFileSync(path.join(__dirname, 'templates', 'controller.js')).toString()
    let indexViewContent = fs.readFileSync(path.join(__dirname, 'templates', 'index.liquid')).toString()
    let modelContent = fs.readFileSync(path.join(__dirname, 'templates', 'model.js')).toString()

    if (!fs.existsSync(viewDirectoryPath)){
      fs.mkdirSync(viewDirectoryPath)
    }

    if (!fs.existsSync(modelDirectoryPath)){
      fs.mkdirSync(modelDirectoryPath)
    }

    controllerContent = controllerContent.replaceAll('ControllerName', resourceName).replace('controller_view_directory', resourceFileName)
    indexViewContent = indexViewContent.replace('ControllerName', resourceName)
    modelContent = modelContent.replaceAll('ModelName', resourceName).replaceAll('model_table', pluralize(resourceFileName))

    fs.writeFileSync(path.join(modelDirectoryPath, `${resourceFileName}.js`), modelContent)
    console.log(`\tCREATE src/models/${resourceFileName}.js`)

    fs.writeFileSync(path.join(viewDirectoryPath, 'index.ejs'), indexViewContent)
    console.log(`\tCREATE src/views/${resourceFileName}/index.ejs`)

    fs.writeFileSync(path.join(controllerDirectoryPath, `${resourceFileName}.js`), controllerContent)
    console.log(`\tCREATE src/controllers/${resourceFileName}.js\n`)
  } catch (error) {
    console.error(error)
  }
} else {
  console.error("The resource name is missing\n")
}
