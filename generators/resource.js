const path = require('path')
const fs = require('fs')

if (process.argv.length > 2) {
  const resourceName = process.argv[2]
  const resourceFileName = resourceName.replace(/\.?([A-Z]+)/g, (a, b) => '_' + b.toLowerCase()).replace(/^_/, '')
  const controllerDirectoryPath = path.resolve(__dirname, '..', 'src', 'controllers')
  const viewDirectoryPath = path.resolve(__dirname, '..', 'src', 'views', resourceFileName)

  try {
    let controllerContent = fs.readFileSync(path.join(__dirname, 'templates', 'controller.js')).toString()
    let indexViewContent = fs.readFileSync(path.join(__dirname, 'templates', 'index.ejs')).toString()

    if (!fs.existsSync(viewDirectoryPath)){
      fs.mkdirSync(viewDirectoryPath)
    }

    controllerContent = controllerContent.replaceAll('ControllerName', resourceName).replace('controller_view_directory', resourceFileName)
    indexViewContent = indexViewContent.replace('ControllerName', resourceName)

    fs.writeFileSync(path.join(controllerDirectoryPath, `${resourceFileName}.js`), controllerContent)
    console.log(`\tCREATE src/controllers/${resourceFileName}.js`)
    fs.writeFileSync(path.join(viewDirectoryPath, 'index.ejs'), indexViewContent)
    console.log(`\tCREATE src/views/${resourceFileName}/index.ejs\n`)
  } catch (error) {
    console.error(error)
  }
} else {
  console.error("The resource name is missing\n")
}
