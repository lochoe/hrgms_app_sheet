function doGet() {
  return HtmlService.createHtmlOutputFromFile('index'); // Serve the HTML form
}

function processImageUpload(base64Data, fileName) {
  var uploadResult = uploadToDrive(base64Data, fileName);

  if (uploadResult.error) {
    return 'Error during upload: ' + uploadResult.error;
  }

  var ocrText = extractTextFromImage(uploadResult.fileId);

  if (ocrText.startsWith('Error')) {
    return ocrText;
  }

  var extractedData = callChatGptApi(ocrText, false);

  if (!extractedData || !extractedData.choices || !extractedData.choices[0].message.content) {
    return 'Error: Could not extract data using ChatGPT API.';
  }

  // Parse the ChatGPT response content to ensure it's a valid JSON
  let extractedJson;
  try {
    extractedJson = JSON.parse(extractedData.choices[0].message.content);
  } catch (error) {
    Logger.log("Failed to parse ChatGPT response as JSON: " + extractedData.choices[0].message.content);
    return 'Error: Failed to parse data from ChatGPT response.';
  }

  appendToLastRow(extractedJson, uploadResult.fileId, uploadResult.fileUrl);

  return 'File uploaded and OCR completed successfully.';
}
