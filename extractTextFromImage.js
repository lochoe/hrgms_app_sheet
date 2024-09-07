function extractTextFromImage(fileId) {
  try {
    var visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + VISION_API_KEY;
    
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

    if (!json.responses || !json.responses[0] || json.responses[0].error) {
      return 'Error: ' + (json.responses[0].error ? json.responses[0].error.message : 'No text found or invalid response from Vision API.');
    }
    
    return json.responses[0].fullTextAnnotation.text;
  } catch (error) {
    return 'Error: ' + error.message;
  }
}
