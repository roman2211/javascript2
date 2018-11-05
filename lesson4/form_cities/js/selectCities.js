var $select = $('.feedback__cities');


$.ajax({
	type: 'GET',
	url: 'cities.json',
	dataType: 'json',
	success: function(data) {
		var amountCities = data.cities.length;
		for (var i = 0; i < amountCities; i++) {
			var $option = $("<option></option>");
			$option.attr('value', data.cities[i]);
			$option.text(data.cities[i]);
			$select.append($option);
		}
	},
	error: function(error) {
		console.log(error);
	}
});
