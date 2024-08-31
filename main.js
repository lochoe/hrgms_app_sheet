function doGet() {
  return HtmlService.createHtmlOutputFromFile('index'); // Serve the HTML form
}

function processImageUpload(base64Data, fileName) {
  var uploadResult = uploadToDrive(base64Data, fileName);

  if (uploadResult.error) {
    return 'Error during upload: ' + uploadResult.error;
  }

  var ocrText = extractTextFromImage(uploadResult.fileId); // Pass fileId instead of fileUrl

  if (ocrText.startsWith('Error')) {
    return ocrText;
  }

  var appendResult = appendToLastRow(uploadResult.fileId, uploadResult.fileUrl, ocrText);

  if (appendResult.startsWith('Error')) {
    return appendResult;
  }

  return 'File uploaded and OCR completed successfully. ' + appendResult;
}


function extractTextFromImage(fileId) {
  try {
    var visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + VISION_API_KEY;
    
    // Get the image blob from Google Drive using the file ID
    var file = DriveApp.getFileById(fileId);
    var imageBlob = file.getBlob();
    var imageBytes = imageBlob.getBytes();
    
    var requestBody = {
      "requests": [
        {
          "image": {
            "content": Utilities.base64Encode(imageBytes)
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    };
    
    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(requestBody),
      'muteHttpExceptions': true
    };
    
    var response = UrlFetchApp.fetch(visionApiUrl, options);
    var json = JSON.parse(response.getContentText());

    // Log the entire response for debugging
    Logger.log('Vision API Response: ' + JSON.stringify(json));

    if (!json.responses || !json.responses[0] || json.responses[0].error) {
      Logger.log('Error in Vision API: ' + JSON.stringify(json.responses[0].error));
      return 'Error: ' + (json.responses[0].error ? json.responses[0].error.message : 'No text found or invalid response from Vision API.');
    }
    
    var ocrText = json.responses[0].fullTextAnnotation.text;
    Logger.log('Extracted Text: ' + ocrText);
    
    return ocrText;
  } catch (error) {
    Logger.log('Error during OCR: ' + error.message);
    return 'Error: ' + error.message;
  }
}




