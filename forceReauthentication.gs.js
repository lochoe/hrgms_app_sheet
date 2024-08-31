function forceReauthentication() {
  // Just access a single folder to trigger reauthentication
  var folder = DriveApp.getRootFolder();
  Logger.log('Reauthentication triggered.');
}