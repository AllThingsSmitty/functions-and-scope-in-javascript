//returns the circumference of a circle
var circumference = function (circle) {
  return 2 * Math.PI * circle.radius;
};
//define circle object
var circle = {x: 100, y: 100, radius: 50};

//invoke the function
console.log(circumference(circle)); //314.159