import { API, PreSave, Codes } from "./var.js"
import { BackgroundColor, BorderColor } from "./chart.js"

const ddCodes = document.getElementById('ddCodes')
const tBody = document.getElementById('tBody')
const ctx = document.getElementById('chart')
const headers = {
    "Accept": "*/*",
    "Content-Type": "application/json; charset=utf-8"
}

let preSave = JSON.parse(localStorage.getItem('preSave')) || PreSave
let chart = null
let labels = []
let rates = []


window.addEventListener('load', async () => {
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    let codes

    if (preSave.persCodes.length > 0)
        codes = preSave.persCodes
    else {
        codes = Codes
        codes.splice(0, 1)
    }

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
    loadTable()
})

ddCodes.addEventListener('change', () => {
    const code = preSave.codeList.find(code => code[0] == ddCodes.value)

    if (preSave.persCodes.length < 4) {
        preSave.persCodes.push(code)
        localStorage.setItem('preSave', JSON.stringify(preSave))
    }

    labels.push(code[1])
    rates.push(preSave.historical.rates[code[0]])
    chart.update()
    loadDropDownList()
    loadTable()

})

const loadDropDownList = () => {
    validateList()

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

const loadTable = () => {
    tBody.innerHTML = ''
    
    if (labels.length > 0)
        labels.forEach(label => {
            let index = labels.findIndex(labelI => labelI == label)
            let code = ''

            preSave.codeList.forEach(codeL => {
                if (codeL[1] == label)
                    code = codeL[0]
            })
            let tr = document.createElement('tr')
            let tdCode = document.createElement('td')
            tdCode.classList.add('text-center')
            tdCode.innerHTML = code
            let tdName = document.createElement('td')
            tdName.classList.add('text-center')
            tdName.innerHTML = label
            let tdRate = document.createElement('td')
            tdRate.classList.add('text-center')
            tdRate.innerHTML = rates[index]
            let tdButton = document.createElement('td')
            tdButton.classList.add('text-center')
            let i = document.createElement('i')
            i.classList.add('bi')
            i.classList.add('bi-trash3')
            i.onclick = () => deleteCode(label)
            i.classList.add('text-danger')
            tdButton.appendChild(i)
            tr.appendChild(tdCode)
            tr.appendChild(tdName)
            tr.appendChild(tdRate)
            tr.appendChild(tdButton)
            tBody.appendChild(tr)
        })
    else
        tBody.innerHTML = `<tr>
            <td class="table-danger text-center">No codes Selected</td>
        </tr>`
}

const validateList = () => ddCodes.disabled = !(preSave.persCodes.length < 4 || labels.length < 7)

const deleteCode = label => {
    let index

    preSave.persCodes.forEach(code => {
        if (code[1] == label) {
            index = preSave.persCodes.findIndex(code => code[1] == label)
            preSave.persCodes.splice(index, 1)
            localStorage.setItem('preSave', JSON.stringify(preSave))
        }
    })
    index = labels.findIndex(labelI => labelI == label)
    deleteData(index)
    loadDropDownList()
    loadTable()
}

const deleteData = index => {
    labels.splice(index, 1)
    rates.splice(index, 1)
    chart.update()
}