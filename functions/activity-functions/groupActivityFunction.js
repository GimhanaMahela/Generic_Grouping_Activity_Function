// using filtering

// // Directly use countrydetails.json file 

// const fs = require('fs');
// const path = require('path');

// // Function to group data based on a provided method and path
// function groupData(data, groupingMethod) {
//     const groupedData = {};

//     // Helper function to recursively search for the grouping key within nested objects and arrays
//     function findAndGroup(items, keyPath) {
//         items.forEach(item => {
//             let key = item;
//             for (let path of keyPath) {
//                 if (Array.isArray(key)) {
//                     key = key.map(subItem => subItem[path]).flat();
//                 } else {
//                     key = key && key[path];
//                 }
//             }

//             // Filter to include only specific fields
//             const filteredItem = filterFields(item);

//             if (Array.isArray(key)) {
//                 key.forEach(k => {
//                     if (k) {
//                         if (!groupedData[k]) {
//                             groupedData[k] = [];
//                         }
//                         groupedData[k].push(filteredItem);
//                     }
//                 });
//             } else if (key) {
//                 if (!groupedData[key]) {
//                     groupedData[key] = [];
//                 }
//                 groupedData[key].push(filteredItem);
//             } else {
//                 console.warn(`Warning: Grouping key '${keyPath.join('.')}' not found in some items.`);
//             }
//         });
//     }

//     if (!Array.isArray(data)) {
//         throw new TypeError("Data is not an array. Please check your data structure.");
//     }

//     // Define the path to the grouping method
//     const keyPath = groupingMethod.split('.');
//     findAndGroup(data, keyPath);

//     return groupedData;
// }

// function filterFields(item) {
//     const allowedFields = ['region', 'subRegions', 'countries', 'languages', 'currency', 'area', 'flag', 'population', 'timezones'];
//     const filteredItem = {};

//     Object.keys(item).forEach(key => {
//         if (allowedFields.includes(key)) {
//             filteredItem[key] = item[key];
//         }
//     });

//     // Recursively filter subRegions and countries if present
//     if (filteredItem.subRegions && Array.isArray(filteredItem.subRegions)) {
//         filteredItem.subRegions = filteredItem.subRegions.map(subRegion => ({
//             name: subRegion.name,
//             countries: subRegion.countries.map(country => ({
//                 name: country.name,
//                 languages: country.languages,
//                 currency: country.currency,
//                 area: country.area,
//                 flag: country.flag,
//                 population: country.population,
//                 timezones: country.timezones
//             }))
//         }));
//     }

//     return filteredItem;
// }

// // Main function to engage with data and grouping methods directly
// function groupingData(configfile, groupingmethods) {
//     if (!configfile || !groupingmethods) {
//         throw new Error("Missing required parameters: configfile and groupingmethods.");
//     }

//     const rawData = JSON.parse(fs.readFileSync(configfile, 'utf8'));
//     const data = Array.isArray(rawData) ? rawData : rawData.DataObject || [];

//     // Define the output folder path
//     const outputFolderPath = path.join(__dirname, 'output');

//     // Create output folder if it does not exist
//     if (!fs.existsSync(outputFolderPath)) {
//         fs.mkdirSync(outputFolderPath);
//         console.log("Output folder created successfully.");
//     }

//     groupingmethods.forEach(method => {
//         const result = groupData(data, method);

//         // Set the output path for the JSON file
//         const filename = `grouped_by_${method.replace('.', '_')}.json`;
//         const outputPath = path.join(outputFolderPath, filename);
        
//         // Write to output file
//         fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

//         console.log(`Grouped data for method '${method}' saved to ${outputPath}`);
//     });
// }

// module.exports = groupingData;

// =============================================================================================

// Without using filtering 
const fs = require('fs');
const path = require('path');

// Function to group data based on a provided method and path
function groupData(data, groupingMethod) {
    const groupedData = {};

    // Helper function to recursively search for the grouping key within nested objects and arrays
    function findAndGroup(items, keyPath) {
        items.forEach(item => {
            let key = item;
            for (let path of keyPath) {
                if (Array.isArray(key)) {
                    key = key.map(subItem => subItem[path]).flat();
                } else {
                    key = key && key[path];
                }
            }

            if (Array.isArray(key)) {
                key.forEach(k => {
                    if (k) {
                        if (!groupedData[k]) {
                            groupedData[k] = [];
                        }
                        groupedData[k].push(item); 
                    }
                });
            } else if (key) {
                if (!groupedData[key]) {
                    groupedData[key] = [];
                }
                groupedData[key].push(item); 
            } else {
                console.warn(`Warning: Grouping key '${keyPath.join('.')}' not found in some items.`);
            }
        });
    }

    if (!Array.isArray(data)) {
        throw new TypeError("Data is not an array. Please check your data structure.");
    }

    
    const keyPath = groupingMethod.split('.');
    findAndGroup(data, keyPath);

    return groupedData;
}

// Main function to engage with data and grouping methods directly
function groupingData(configfile, groupingmethods) {
    if (!configfile || !groupingmethods) {
        throw new Error("Missing required parameters: configfile and groupingmethods.");
    }

    const rawData = JSON.parse(fs.readFileSync(configfile, 'utf8'));
    const data = Array.isArray(rawData) ? rawData : rawData.DataObject || [];

    // Output folder path
    const outputFolderPath = path.join(__dirname, 'output');

    // Create output folder if it does not exist
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
        console.log("Output folder created successfully.");
    }

    groupingmethods.forEach(method => {
        const result = groupData(data, method);

        // Set the output path for the JSON file
        const filename = `grouped_by_${method.replace('.', '_')}.json`;
        const outputPath = path.join(outputFolderPath, filename);
        
        // Write to output file
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

        console.log(`Grouped data for method '${method}' saved to ${outputPath}`);
    });
}

module.exports = groupingData;
