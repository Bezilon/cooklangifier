const fs = require('fs')
const path = require('path')

const argv = require('minimist')(process.argv.slice(2));

if (!argv?.S && !argv.sourceFolder) {
    console.error("A source folder is required")
}

if (!argv?.O && !argv.outFolder) {
    console.error("An output folder is required")
}

const sourceFolder = (argv?.S ?? argv?.sourceFolder).replace(/\/$/i, '')
const outFolder = (argv?.O ?? argv?.outFolder).replace(/\/$/i, '')

if (!fs.existsSync(outFolder)) {
    fs.mkdirSync(outFolder, { recursive: true })
}

const recipes:any[] = []

const isoDurationToHuman = (duration:string) => {
    duration.replace(/^PT/, '')
    duration.replace(/0[HMS]/, '')
    duration.replace(/(\d+)H/, "$1 hours ")
    duration.replace(/(\d+)M/, "$1 minutes ")
    duration.replace(/(\d+)S/, "$1 seconds ")
    duration.replace(/(1 hour|1 minute|1 second)s/, "$1")
    return duration.trim()
}

fs.readdirSync(path.resolve(sourceFolder)).forEach(file => {
    const folderPath = `${sourceFolder}/${file}`
    const fileStat = fs.statSync(folderPath)

    if (!fileStat.isDirectory()) {
        return
    }

    const recipePath = `${folderPath}/recipe.json`
    const imagePath = `${folderPath}/full.jpg`

    if (!fs.existsSync(recipePath)) {
        return
    }

    const recipeJSON = fs.readFileSync(recipePath)

    const recipe = JSON.parse(recipeJSON)

    const cooklangRecipe =
`---
title: ${recipe.name}
tags:
  ${recipe.keywords?.map(keyword => `  - ${keyword}`)?.join('\n')}
source.url: ${recipe?.url}
servings: ${recipe.recipeYield}
time: ${isoDurationToHuman(recipe.totalTime)}
---

= Description
${recipe.description}

= Ingredients
${recipe.recipeIngredient?.join('\n')}

= Preparation
${recipe.recipeInstructions}
`

    fs.writeFileSync(`${outFolder}/${recipe.name}.cook`, cooklangRecipe)

    if (fs.existsSync(imagePath)) {
        fs.copyFileSync(imagePath, `${outFolder}/${recipe.name}.jpg`)
    }
});

console.log(`${recipes.length} recipes transscribed`)
