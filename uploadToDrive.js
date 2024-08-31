function uploadToDrive(base64Data, fileName) {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/jpeg', fileName);
    var file = folder.createFile(blob);
    
    return {
      fileId: file.getId(),
      fileUrl: file.getUrl()
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}
