var svg;
var WIDTH = 800, HEIGHT = 600;

var mouseX, mouseY;
var mouseOffsetX, mouseOffsetY;
var polygons = [];
var currentPolygon;
var dragged = false;
var KEY_CODE_I = 73, KEY_CODE_S = 83, KEY_CODE_U = 85;

function mouseClick()
{
	var mousePosition = d3.mouse(this);
	mouseX = mousePosition[0];
	mouseY = mousePosition[1];
 dragged = true;
 if(polygons.length >= 2)polygons[polygons.length - 2].attr("class","");
 var points = [mouseX, mouseY, mouseX, mouseY, mouseX, mouseY, mouseX, mouseY];
 currentPolygon = svg.append("polygon").attr("class","top").attr("points", points);
}

function mouseMove()
{
	if(dragged)
	{
		var mousePosition = d3.mouse(this);
		var newMouseX  = mousePosition[0], newMouseY = mousePosition[1];
		var width = Math.abs(newMouseX - mouseX), height = Math.abs(newMouseY - mouseY);
		var x0, y0, x1, y1, x2, y2, x3, y3;

		x0 = Math.min(mouseX, newMouseX);
		y0 = Math.min(mouseY, newMouseY);
		x1 = x0; y1 = y0 + height;
		x2 = x0 + width; y2 = y1;
		x3 = x2; y3 = y0;

	  var points = [x0, y0, x1, y1, x2, y2, x3, y3];
		currentPolygon.attr("points", points);
  }
}

function mouseUp()
{
	dragged = false;
	polygons.push(currentPolygon);
}

function intersection(){console.log('Intersection');}
function subtraction(){console.log('Subtraction');}
function union(){console.log('Union');}

function init()
{
	svg = d3.select("body").append("svg").attr("width",WIDTH).attr("height",HEIGHT)
	      .on("mousedown",mouseClick)
				.on("mousemove",mouseMove)
				.on("mouseup",mouseUp)
				.on("keydown",union);				
}
