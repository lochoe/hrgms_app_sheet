function appendToLastRow(fileId, fileUrl, ocrText) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found.');
    }
    
    var lastRow = sheet.getLastRow() + 1;
    sheet.getRange(lastRow, 1).setValue(fileId); // File ID in Column A
    sheet.getRange(lastRow, 2).setValue(fileUrl); // File URL in Column B
    sheet.getRange(lastRow, 3).setValue(ocrText); // OCR Text in Column C
    
    Logger.log('Successfully appended to row ' + lastRow + ': ID = ' + fileId + ', URL = ' + fileUrl + ', OCR Text = ' + ocrText);
    
    return 'Successfully appended to row ' + lastRow;
  } catch (error) {
    Logger.log('Error during appendToLastRow: ' + error.message);
    return 'Error: ' + error.message;
  }
}
