var svg;
var WIDTH = 800, HEIGHT = 600;

var mouseX, mouseY;
var mouseOffsetX, mouseOffsetY;
var polygons = [];
var currentRect;
var dragged = false;

function mouseClick()
{
	var mousePosition = d3.mouse(this);
	mouseX = mousePosition[0];
	mouseY = mousePosition[1];
 dragged = true;
	currentRect = svg.append("rect").attr("x", mouseX).attr("y", mouseY);
}

function mouseMove()
{
	if(dragged)
	{
		var mousePosition = d3.mouse(this);
		var width = Math.abs(mousePosition[0] - mouseX), height = Math.abs(mousePosition[1] - mouseY);

		currentRect.attr("width",width).attr("height", height);
		if(mousePosition[0] < mouseX) currentRect.attr("x", mouseX - width);
		if(mousePosition[1] < mouseY) currentRect.attr("y", mouseY - height);
  }
}

function mouseUp()
{
	dragged = false;
	polygons.push(currentRect);
}

function init()
{
	svg = d3.select("body").append("svg").attr("width",WIDTH).attr("height",HEIGHT)
	      .on("mousedown",mouseClick)
				.on("mousemove",mouseMove)
				.on("mouseup",mouseUp);
}
