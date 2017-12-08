var customConfig = require('../../env.json');
var myDefault = {"production": false, "api":{}}

export const environment = Object.assign({}, myDefault, customConfig.qa)
