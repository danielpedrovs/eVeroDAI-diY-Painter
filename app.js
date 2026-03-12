function generateSolution() {

const problem = document.getElementById("problem").value
const width = document.getElementById("width").value
const height = document.getElementById("height").value

const area = width * height

const paintCoverage = 10
const paintNeeded = (area / paintCoverage).toFixed(2)

const data = problems[problem]

let html = "<h3>Materials</h3><ul>"

data.materials.forEach(m => {
html += `<li>${m}</li>`
})

html += "</ul>"

html += "<h3>Steps</h3><ol>"

data.steps.forEach(s => {
html += `<li>${s}</li>`
})

html += "</ol>"

html += `<h3>Paint Needed</h3>

<p>${paintNeeded} litres per coat</p>`

document.getElementById("output").innerHTML = html

}
