const fs = require('fs');
const path = require('path');
const groupingData = require('./functions/activity-functions/groupActivityFunction');

const dataFile = './data/countrydetails.json'; // JSON file path

// Read the config.json file and parse it
const configPath = path.resolve(__dirname, './config/config.json'); // Ensure correct path to config.json
const configFile = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Extract grouping methods from config.json
const groupingMethods = configFile.config[0].metaData.groupingmethods;

// Call groupingData with the extracted grouping methods
groupingData(dataFile, groupingMethods);
