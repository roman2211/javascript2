(function ($) {
  $(function () {
    //command for json-server
    // F:\GIT\Coursework\JSON_server>json-server db.json -w -d 1500
    var endPoint = 'http://localhost:3000/cart';
    //get cart on page load
    $.get({
      url: endPoint,
      beforeSend: function () {
        //add loader
        if ($('.showcase')) {
          $('.gooditem').addClass('showcase__loading');
        }
      }
    }).done(function (cart) {
      //hide loader
      $('.shp_cart__loading').hide();
      //refresh items in showcase
      refreshShowcase(cart);
      //render items in cart
      renderCart(cart);
    });
    //add item to the cart by click on "add to cart" button
    if ($('.showcase')) {
      $('.addtocart_button').click(function () {
        var button = $(this);
        if (!button.parent().hasClass('incart')) {
          //send data to json-server
          $.post({
            url: endPoint,
            beforeSend: function () {
              button.parent().toggleClass('showcase__loading');
            },
            data: {
              productId: button.parent().attr('productId'),
              price: button.next().children('.item_cost').text(),
              imgURL: button.prev().css('background-image'),
              productName: button.next().children(':first').text()
            }
          }).done(function () {
            button.parent().addClass('incart').toggleClass('showcase__loading');
            refreshCart();
          });
        }
      });
    }

    //render function
    function renderCart(cart) {
      //if cart has items
      if (cart.length) {
        var totalCost = 0;
        //create items elements
        for (var i = 0; i < cart.length; i++) {
          var itemInCart = $('<div />')
              .addClass('gooditem_incart')
              .attr({
                productId: cart[i].productId,
                id: cart[i].id
              }),
            img = $('<div />')
              .addClass('image')
              .css('background-image', cart[i].imgURL),
            //remove item by click on cross
            cross = $('<div />')
              .addClass('item_cross')
              .click(deleteItem),
            name = $('<div />').text(cart[i].productName),
            itemCost = $('<p />').addClass('item_cost').text(cart[i].price),
            a = $('<a href=# />').append(name, itemCost, $('<div >'));
          itemInCart.append(img, cross, a);
          $('.shp_cart__list').append(itemInCart);
          //calculate total cost
          totalCost += parseInt(cart[i].price);
        }
        $('.shp_cart__empty').hide();
        $('.shp_cart__total').show().children('span').text(totalCost);
        //additional buttons are visible
        $('.shp_cart__checkout, .shp_cart__gotocart').show();
        //number of items indicator
        $('.items_number').show().text(cart.length);
      } else {
        $('.shp_cart__empty').show();
        $('.shp_cart__checkout, .shp_cart__gotocart').hide();
        $('.items_number').hide();
        $('.shp_cart__total').hide();
      }
    }

    //refresh cart then deleting or adding items
    function refreshCart() {
      $.get({
        url: endPoint
      }).done(function (cart) {
        $('.shp_cart__list').empty();
        //render items in cart
        renderCart(cart);
        refreshShowcase(cart);
        $('.shp_cart__list').removeClass('cart__list_loading');
      });
    }

    function refreshShowcase(cart) {
      if ($('.showcase')) {
        $('.gooditem').removeClass('showcase__loading incart');
        //if item is in cart, marking it
        Object.keys(cart).forEach(function (value) {
          $('.gooditem[productId="' + this[value].productId + '"]').addClass('incart');
        }, cart);
      }
    }

    //delete item in cart
    function deleteItem() {
      $.ajax({
        method: 'DELETE',
        url: endPoint + '/' + $(this).parent().attr('id'),
        beforeSend: function () {
          $('.shp_cart__list').addClass('cart__list_loading');
        }
      }).done(function () {
          refreshCart();
        }
      );
    }

  });  //end of jQuery
})(jQuery);