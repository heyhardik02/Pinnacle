/**
 * Pinnacle Open Mic - Google Apps Script
 * This script connects your HTML form directly to a Google Sheet.
 * 
 * Setup Instructions:
 * 1. Go to Google Sheets (https://sheets.google.com) and create a new sheet.
 * 2. Rename it to "Pinnacle Registrations" (optional).
 * 3. In the top menu, click Extension -> Apps Script.
 * 4. Delete any code in the editor and paste this code.
 * 5. Click the "Save" (floppy disk) icon.
 * 6. Click the "Deploy" button at the top-right -> "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set the fields:
 *    - Description: "Pinnacle Registration Endpoint"
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone" (This is crucial, otherwise submissions will fail).
 * 9. Click "Deploy". Authorize permissions if prompted (Click Advanced -> Go to Untitled Project -> Allow).
 * 10. Copy the "Web app URL" (it will end with "/exec").
 * 11. Paste this URL into your pinnacle.html script section (replace sheetUrl).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Set headers if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Age", "Phone Number", "Instagram ID"]);
    }
    
    var timestamp = new Date();
    var name = "";
    var age = "";
    var phone = "";
    var instagram = "";
    
    // Support both application/json and application/x-www-form-urlencoded payloads
    if (e.postData && e.postData.contents) {
      try {
        var data = JSON.parse(e.postData.contents);
        name = data.name || "";
        age = data.age || "";
        phone = data.phone || "";
        instagram = data.instagram || "";
      } catch (err) {
        // Fallback to query/parameter parsing if not valid JSON
        name = e.parameter.name || "";
        age = e.parameter.age || "";
        phone = e.parameter.phone || "";
        instagram = e.parameter.instagram || "";
      }
    } else {
      name = e.parameter.name || "";
      age = e.parameter.age || "";
      phone = e.parameter.phone || "";
      instagram = e.parameter.instagram || "";
    }
    
    sheet.appendRow([timestamp, name, age, phone, instagram]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Successfully claimed spotlight!"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
