const API = '72069b46d38681f54c3c8c5b'

const PreSave = {
    codeList: {},
    persCodes: [],
    historical: {
        last_update: null,
        rates: {}
    }
}

const Codes = [
    ["USD", "United States Dollar"],
    ["MXN", "Mexican Peso"],
    ["CAD", "Canadian Dollar"],
    ["EUR", "Euro"]
]

export { API, PreSave, Codes }