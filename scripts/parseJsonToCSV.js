import fs from 'fs';

/**
 * Reads a JSON file containing room prices and availability data,
 * parses it, and saves the data to a CSV file.
 * 
 * @param {string} jsonFilePath - Path to the JSON file
 * @param {string} csvFilePath - Path where the CSV file will be saved
 */
function parseJsonToCSV(jsonFilePath, csvFilePath) {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // Prepare CSV header
    const csvHeader = 'Room Type,Room Name,Start Date,End Date,Price\n';
    
    // Process the data
    let csvContent = csvHeader;

    jsonData.forEach(entry => {
        if (entry.rooms && entry.rooms.length > 0) {
          entry.rooms.forEach(room => {
            csvContent += `${room.type},"${room.room}",${entry.start_date},${entry.end_date},${room.price}\n`;
          });
        }
    });
    
    // Write to CSV file
    fs.writeFileSync(csvFilePath, csvContent);
    return true;
  } catch (error) {
    console.error('Error processing JSON to CSV:', error);
    return false;
  }
}

export default parseJsonToCSV;