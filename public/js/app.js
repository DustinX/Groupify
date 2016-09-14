//input field javascript
$( document ).ready(function() {
  //max amount of fields you can input
  var max_fields = 12;
  var wrapper = $('.input_fields_wrap');
  var add_button = $(".add_field_button");

  var x = 1;
  $(add_button).click(function(e) {
    e.preventDefault();
    if (x < max_fields) {
      x++;
      $(wrapper).append('<div><input type="text" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>');
    } else {
      alert("You've reached the max amount of fields that can be entered");
    }
  });

  $(wrapper).on('click','.remove_field', function(e) {
    e.preventDefault(); $(this).parent('div').remove(); x--;
  })
});
