(function ($) {
  $(function () {

    function cartDrop() {
      $('.cart').droppable({
        over: function (ev, ui) {
          //add opacity to the item when it over the cart
          ui.draggable.addClass('item_over_cart');
        },
        out: function (ev, ui) {
          //remove opacity
          ui.draggable.removeClass('item_over_cart');
        },
        hoverClass: 'overcart',
        drop: function (ev, ui) {
          //calculating totalSum & totalItems
          totalSum = parseInt($('.total_sum').text(), 10);
          itemSum = parseInt(ui.draggable.find('.item_cost').text(), 10);
          totalItems = parseInt($('.total_items').text(), 10);
          $('.total_items').text(totalItems + 1);
          $('.total_sum').text(itemSum + totalSum);
          ui.draggable.removeClass('item_over_cart');
        }
      })
    }

    function generateItems() {
      //generating items
      var carousel = $('<div \>').addClass('carousel');
      $('.carousel_block').append(carousel);

      for (i = 1; i <= 10; i++) {
        var item = $('<div \>').addClass('item');

        if (i > 3) {
          //hide items over 3 for carousel
          item.attr('visible', false).hide();
        } else {
          item.attr('visible', true);
        }

        item.html('<span>' + 'Item №' + i + '</span>' + '<p>' + 'Cost: ' +
          '<span class="item_cost">' + i * 100 + '</span>' + '</p>');
        item.attr('id', 'item' + i);
        item.draggable({
          revert: true,
          start: function () {
            //add class to the cart
            $('.cart').addClass('drag_to_cart');
          },
          stop: function () {
            $('.cart').removeClass('drag_to_cart');
          }
        });
        carousel.append(item);
      }
    }

    function carousel() {
      var arrow = $('<div \>').addClass('arrow');
      arrow.clone().attr('id', 'arrow_left').prependTo('.carousel_block');
      arrow.clone().attr('id', 'arrow_right').appendTo('.carousel_block');
      //spin carousel to the left
      $('#arrow_right').on('click', function () {
        //first element remove to the end of list
        $('.carousel')
          .children(':first')
          .hide('drop')
          .appendTo('.carousel')
          .attr('visible', false);
        //first hidden element become visible
        $('.carousel')
          .children('[visible=false]:first')
          .effect('slide', {direction: 'right'})
          .attr('visible', true);
      });
      $('#arrow_left').on('click', function () {
        $('.carousel')
          .children('[visible=true]:last')
          .hide('drop', {direction: 'right'})
          .attr('visible', false);
        $('.carousel')
          .children('[visible=false]:last')
          .prependTo('.carousel')
          .attr('visible', true)
          .show('slide');
      });
    }

    generateItems();
    cartDrop();
    carousel();

  });
})(jQuery);
