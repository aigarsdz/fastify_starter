const path = require('path')
const fs = require('fs')
const pluralize = require('pluralize')

if (process.argv.length > 2) {
  const modelName = process.argv[2]
  const modelFileName = modelName.replace(/\.?([A-Z]+)/g, (a, b) => '_' + b.toLowerCase()).replace(/^_/, '')
  const modelTableName = pluralize(modelFileName)
  const modelDirectoryPath = path.resolve(__dirname, '..', 'src', 'models')

  try {
    let modelContent = fs.readFileSync(path.join(__dirname, 'templates', 'model.js')).toString()

    if (!fs.existsSync(modelDirectoryPath)){
      fs.mkdirSync(modelDirectoryPath)
    }

    modelContent = modelContent.replaceAll('ModelName', modelName).replaceAll('model_table', modelTableName)

    fs.writeFileSync(path.join(modelDirectoryPath, `${modelFileName}.js`), modelContent)
    console.log(`\tCREATE src/models/${modelFileName}.js\n`)
  } catch (error) {
    console.error(error)
  }
} else {
  console.error("The model name is missing\n")
}
