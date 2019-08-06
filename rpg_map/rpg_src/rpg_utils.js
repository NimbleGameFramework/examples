//Measures window size to allow proper draw and defines a character location to ensure proper draw
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var hight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

function getFile(url, type, callbackfunction) {
  return $.ajax({
    type: "GET",
    url: url,
    dataType: type,
    success: function(data) {
      callbackfunction(data);
    }
  });
};
