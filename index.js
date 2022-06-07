const xlsx = require('xlsx');
const helper = require('dynamify-json-object');

// Read the file into memory
const wb = xlsx.readFile('iRecycle.xlsx');

// Get first sheet
const ws = wb.Sheets['Sheet1'];

// Convert the sheet to a json object
const json = xlsx.utils.sheet_to_json(ws);

// Convert the json object to a dynamodb object
helper.dynamifyObject(json, function (dynamoDbJson) {
    console.log(dynamoDbJson);
});