import { API, PreSave, Codes } from "./var.js"
import { BackgroundColor, BorderColor } from "./chart.js"

const ddCodes = document.getElementById('ddCodes')
const tBody = document.getElementById('tBody')
const ctx = document.getElementById('chart')

let preSave = JSON.parse(localStorage.getItem('preSave')) || PreSave
let chart = null
let codes = {}
let labels = []
let rates = []

const headers = {
    "Accept": "*/*",
    "Content-Type": "application/json; charset=utf-8"
}

window.addEventListener('load', async () => {
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

    codes = Codes.concat(preSave.persCodes)
    codes.splice(0, 1)

    if (Object.keys(preSave.codeList).length == 0) {
        preSave.codeList = await fetch(`https://v6.exchangerate-api.com/v6/${API}/codes`, { headers: headers })
            .then(res => res.json())
            .then(res => res.supported_codes)
        localStorage.setItem('preSave', JSON.stringify(preSave))
    }

    if (Object.keys(preSave.historical.rates).length == 0 || preSave.historical.last_update != date) {
        preSave.historical.rates = await fetch(`https://v6.exchangerate-api.com/v6/${API}/latest/USD`, { headers: headers })
            .then(res => res.json())
            .then(res => res.conversion_rates)
        preSave.historical.last_update = date
        localStorage.setItem('preSave', JSON.stringify(preSave))
    }

    codes.forEach(code => {
        labels.push(code[1])
        rates.push(preSave.historical.rates[code[0]])
    })

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price per Dollar',
                data: rates,
                backgroundColor: BackgroundColor,
                borderColor: BorderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    })

    loadDropDownList()
})

const loadDropDownList = () => {
    ddCodes.innerHTML = '';
    ddCodes.innerHTML = '<option selected>Choose...</option>'
    preSave.codeList.map(el => {
        let exist = false
        labels.forEach(label => {
            if (el[1] == label)
                exist = true
        })
        if (!exist)
            ddCodes.innerHTML += `<option id="${el[0]}" value="${el[0]}">${el[1]}</option>`
    })
}