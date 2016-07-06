var svg;
var WIDTH = 800, HEIGHT = 600;

var mouseX, mouseY;
var mouseOffsetX, mouseOffsetY;
var polygons = [];
var currentPolygon;
var dragged = false;
var KEY_CODE_I = 73, KEY_CODE_S = 83, KEY_CODE_U = 85;

function Vertex(x, y)
{
	return {x:x, y:y};
}

function mouseClick()
{
	var mousePosition = d3.mouse(this);
	mouseX = mousePosition[0];
	mouseY = mousePosition[1];
  dragged = true;
  if(polygons.length >= 2) polygons[polygons.length - 2].attr("class","");
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

function union()
{
	if(polygons.length >= 2)
	{
	  var verticesListA = polygons[polygons.length - 2].attr("points").split(",").map(Number);
		var verticesListB = polygons[polygons.length - 1].attr("points").split(",").map(Number);
		polygons = polygons.slice(0,polygons.length - 2);

		var verticesA = [], verticesB = [];
		for(var i = 0; i < verticesListA.length; i+=2)
		{
			var x = verticesListA[i], y = verticesListA[i + 1];
			verticesA.push(Vertex(x, y));
		}
		for(var i = 0; i < verticesListB.length; i+=2)
		{
			var x = verticesListB[i], y = verticesListB[i + 1];
			verticesB.push(Vertex(x, y));
		}
  }
}

function keyBoardHandler()
{
  if(d3.event.keyCode == KEY_CODE_I) intersection();
	if(d3.event.keyCode == KEY_CODE_S) subtraction();
	if(d3.event.keyCode == KEY_CODE_U) union();
}

function init()
{
	svg = d3.select("body").append("svg").attr("width",WIDTH).attr("height",HEIGHT)
	      .on("mousedown",mouseClick)
				.on("mousemove",mouseMove)
				.on("mouseup",mouseUp);
  d3.select(window).on('keydown',keyBoardHandler);
}
