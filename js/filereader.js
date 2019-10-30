function loadFileAsText(){
  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
      var textFromFileLoaded = fileLoadedEvent.target.result;
      document.getElementById("filetext").value = textFromFileLoaded;
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}