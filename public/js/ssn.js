$( document ).ready(function() {
  console.log('ssn.js is linked');
  function required() {
    var empt = document.forms["form1"]["text1"].value;
    if (empt == "")
    {
      alert("Please input value");
      return false;
    } else {
      alert('Code has accepted : you can try another');
      return true;
    }
  }
});
