function appendToLastRow(extractedData, imageId, imageUrl) {
  try {
    // Log the extracted data for debugging purposes
    Logger.log("Extracted Data: " + JSON.stringify(extractedData));

    // Process dates to ensure both Pajak Date and Expired Date are correctly assigned
    processDates(extractedData);

    // Prepare the row data based on the column order
    const rowData = [
      imageId,
      extractedData["Pajak Gadai Name"] ? extractedData["Pajak Gadai Name"].toString().trim() : "",
      extractedData["Pajak Gadai Address"] ? extractedData["Pajak Gadai Address"].toString().trim() : "",
      extractedData["No Siri"] ? extractedData["No Siri"].toString().trim() : "",
      extractedData["Pajak Gadai User Details"] ? extractedData["Pajak Gadai User Details"].toString().trim() : "",
      extractedData["Loan Amount (RM)"] ? extractedData["Loan Amount (RM)"].toString().trim() : "",
      extractedData["Pajak Date"] ? extractedData["Pajak Date"].toString().trim() : "",
      extractedData["Expired Date"] ? extractedData["Expired Date"].toString().trim() : "",
      extractedData["Total Item Weight (Gram)"] ? extractedData["Total Item Weight (Gram)"].toString().trim() : "",
      extractedData["Amount Monthly Interest (RM)"] ? extractedData["Amount Monthly Interest (RM)"].toString().trim() : "",
      extractedData["Monthly Interest Rate (%)"] ? extractedData["Monthly Interest Rate (%)"].toString().trim() : "",
      extractedData["Nombor Telefon"] ? extractedData["Nombor Telefon"].toString().trim() : "",
      extractedData["Working Hour"] ? extractedData["Working Hour"].toString().trim() : "",
      imageUrl,
      "" // userPhone, left empty for manual input
    ];

    // Log the row data for debugging
    Logger.log("Prepared row data: " + JSON.stringify(rowData));

    // Get the active spreadsheet and the first sheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    // Append the row data to the last row of the sheet
    sheet.appendRow(rowData);

    Logger.log("Successfully appended row: " + JSON.stringify(rowData));
  } catch (error) {
    Logger.log("Error during appendToLastRow: " + error.message);
  }
}

function processDates(extractedData) {
    const dates = [];

    // Collect all possible date fields
    if (extractedData["Pajak Date"]) dates.push(extractedData["Pajak Date"]);
    if (extractedData["Expired Date"]) dates.push(extractedData["Expired Date"]);

    // If we have at least two dates, assign them
    if (dates.length >= 2) {
        extractedData["Pajak Date"] = dates[0];
        extractedData["Expired Date"] = dates[1];
    }
}
