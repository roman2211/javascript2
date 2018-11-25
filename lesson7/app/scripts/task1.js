//construction for jQuery
(function ($) {
  //starts on document.ready
  $(function () {
    var name = $('#name'),
        date = $('#date'),
        tel = $('#tel'),
        mail = $('#mail'),
        $cityInput = $('#city_input'),
        $divParent = $('#city_input_form'),
        message = $('#text'),
        nameRE = /^[a-zа-яё]{2,}$/i,
        dateRE = /^\d\d[.,]\d\d[.,]\d{4}$/,
        telRE = /\+\d{1,4}\(?\d{3}\)?\d{3}-?\d{4}\b/,
        emailRE = /(^\w+(|(.|-)\w+))(?=@[a-z]{2,}\.[a-z]{2,4}\b)/i,
        messageRE = /\w+|[а-яё]+[,.!?@:;]*/gi,
        $cityRE = /^[а-яё]+$/i;
// При нажатии на кнопку «Отправить» произвести валидацию полей.
    $('input[type="submit"]').on('click', function () {
      //create new div for dialog message
      $('#fieldsetInput').append($('<div id="dialog" \>'));
      //create function dialog
      function dialog(element, text) {
        $('#dialog').append(element).dialog({
          width: '404px',
          buttons: {
            OK: function () {
              $(this).dialog('close');
              $('#dialog').remove();
            }
          },
          modal: true,
          title: text
        });
      }
      var i = 0;
      function classListToggle(re, data) {
        //verification input value
        var test = re.test(data.val());
        if (test) {
          //verification date
          if (data === date) {
            var dateArray = date.val().split(/[,.]/),
                day = dateArray[0],
                month = dateArray[1],
                year = dateArray[2];
            if ((year >= 2010 || year < 1900) || (month > 12 || month < 0) ||
              (day > 31 || day < 0)) {
              date.effect("bounce", {times: 3}, "slow").parent().addClass('wrong_date');
              return;
            }
          }
          //if test is true
          data.removeClass('false').parent().removeClass('wrong_date');
          i++;
          //if all fields is true
          if (i === 6) {
            //simulation of loader
            $('.contacts').addClass('data_transfer')
              .delay(1000)
              .queue(function () {
                $(this).removeClass('data_transfer');
                var successField = $('<div \>').html('Your message successfully send!');
                dialog(successField, 'Success!');
                $('.input_fields input').val('');
                $(this).dequeue();
              });
          }
        } else {
          //if test is false
          data.addClass('false').effect("shake", {times: 3}, "slow");
          //message for dialog window
          var errorField = $('<div />').html('Check out the "' + '<span>' +
                                              data.prev().text() + '</span>'+ '" field');
          dialog(errorField, 'Error!');
        }
      }
      classListToggle(nameRE, name);
      classListToggle(telRE, tel);
      classListToggle(emailRE, mail);
      classListToggle(dateRE, date);
      classListToggle(messageRE, message);
      classListToggle($cityRE, $cityInput);
    });
    //add events on keyup in input field
    $cityInput.on('keyup', function () {
      //if input text according to reg.expr. then
      if ($cityRE.test(this.value)) {
        $divParent.removeClass('wrong_input');
        $divParent.removeClass('wrong_city');
        //refresh list of cities
        $('#city_list').remove();
        //only if number of letters is more than 2 send data to server
        if ($cityInput.val().length > 2) {
          var $citiesArr = [];
          $.ajax({
            url: 'http://api.spacenear.ru/index.php',
            type: 'POST',
            data: {pattern: this.value},
            dataType: 'json',
            success: function (cities) {
              if (cities) {
                $citiesArr = cities.map(function (value) {
                  return value.name;
                });
              }
            },
            error: function () {
              console.log('error!');
            },
            //add progress indicator
            xhr: function () {
              // get the native XmlHttpRequest object
              var xhr = $.ajaxSettings.xhr();
              // set the onprogress event handler
              xhr.upload.onprogress = function () {
                //add loader
                $('.loader').show();
              };
              return xhr;
            }
            //when server response
          }).done(function () {
            $('.loader').hide();
            //if array is non empty and if 'city list' non existing, create it
            if (!$('#city_list').length && $citiesArr.length > 0) {
              //create 'select' element
              var $select = $('<select />').attr({
                id: 'city_list',
                size: function () {
                  if ($citiesArr.length > 2) {
                    return $citiesArr.length;
                  }
                  return 2;
                }
              }).hide();
              for (var i = 0; i < $citiesArr.length; i++) {
                var $option = $('<option />');
                //create list of cities and add events on double click
                $option.attr('value', $citiesArr[i]).text($citiesArr[i]).dblclick(function () {
                  $cityInput.val(this.value);
                  $(this).parent().slideUp(function () {
                    $(this).remove();
                  });
                });
                $select.append($option);
              }
              $divParent.append($select);
              //add animation when select menu appearing (city list)
              $($select).slideDown();
              //if array of cities names is empty then
            } else if ($citiesArr.length === 0) {
              //show message 'No such city'
              $divParent.addClass('wrong_city');
              //remove city list
              $('#city_list').slideUp(function () {
                $(this).remove();
              });
            }
          });
        }
      } else {
        //if input text disaccording with reg.expr. add red border and message
        //'only russian letters!'
        $divParent.addClass('wrong_input');
        //removing city list
        $('#city_list').slideUp(function () {
          $(this).remove();
        });
      }
    });
    //button 'reset' clears all classes 'false'
    $('input[type="reset"]').on('click', function () {
      $('.input_fields input').removeClass('false');
      date.parent().removeClass('wrong_date');
      $divParent.removeClass('wrong_input');
    });
// -------------------------JQuery UI---------------------
    date.datepicker({
      firstDay: 1,
      dateFormat: 'dd.mm.yy',
      monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
                    "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      maxDate: '-8y'
    });
  }); //document.ready
})(jQuery);
