function bs_input_file() {
  $(".input-file").before(
    function () {
      if (!$(this).prev().hasClass('input-ghost')) {
        var element = $("<input id='fileToLoad' type='file' class='input-ghost' style='visibility:hidden; height:0'>");
        element.attr("name", $(this).attr("name"));
        element.change(function () {
          element.next(element).find('input').val((element.val()).split('\\').pop());
        });

        $(this).find("button.btn-choose").click(function () {
          element.click();
        });

        $(this).find("button.btn-submit").click(function () {
          var fileToLoad = document.getElementById("fileToLoad").files[0];
          var fileReader = new FileReader();
          fileReader.onload = function (fileLoadedEvent) {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            document.getElementById("filetext").value = textFromFileLoaded;
          };
          fileReader.readAsText(fileToLoad, "UTF-8");
        });

        $(this).find('input').css("cursor", "pointer");
        $(this).find('input').mousedown(function () {
          $(this).parents('.input-file').prev().click();
          return false;
        });
        return element;
      }
    }
  );
}

$(function () {
  bs_input_file();
});