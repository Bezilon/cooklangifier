# Cooklangifier

A simple script that transcribes Nextcloud Recipes into cooklang

# Implementation

Feature|NextCloud Recipe (JSON)
-------|-----------------------
Instructions|✅
Ingredients|❌
Nutrition Info|❌

# Usage
Install the required packages with `npm i`

Then you can run the transscriber:
```npx tsc && node dist/main.js --S "absolute/path/to/source/folder" --O "absolute/path/to/output/folder"```