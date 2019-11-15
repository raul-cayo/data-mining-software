$(function () {
  $('.input-file').before(
    function () {
      if (!$(this).prev().hasClass('input-ghost')) {
        var element = $("<input id='fileToLoad' type='file' class='input-ghost' style='visibility:hidden; height:0'>");
        element.attr('name', $(this).attr('name'));
        element.change(function () {
          element.next(element).find('input').val((element.val()).split('\\').pop());
        });

        $(this).find('button.btn-choose').click(function () {
          element.click();
        });

        $(this).find('input').css('cursor', 'pointer');
        $(this).find('input').mousedown(function () {
          $(this).parents('.input-file').prev().click();
          return false;
        });
        return element;
      }
    }
  );
});

function showLoading () {
  $('#loading-modal').modal('show');
}

function hideLoading () {
  setTimeout(() => {
    $('#loading-modal').modal('hide');
  }, 300); 
}