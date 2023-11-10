import { API, PreSave, Codes } from "./var.js"

const ddCodes = document.getElementById('ddCodes')
const tBody = document.getElementById('tBody')

let preSave = JSON.parse(localStorage.getItem('preSave')) || PreSave

const headers = {
    "Accept": "*/*",
    "Content-Type": "application/json; charset=utf-8"
}

window.addEventListener('load', async () => {
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

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
})