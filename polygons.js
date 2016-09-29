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

function weilerAthertonAlgorithm(operation)
{
  operation = (operation === undefined)? "UNION" : operation;

	var RADIUS = 5;
	var polyA = polygons[polygons.length - 2], polyB = polygons[polygons.length - 1];
	var verticesListA = polyA.attr("points").split(",").map(Number);
	var verticesListB = polyB.attr("points").split(",").map(Number);
	polygons = polygons.slice(0,polygons.length - 2);

	var intersections = [];
	var auxVerticesPolyA = [], auxVerticesPolyB = [];
	var segmentsPolyA = [], segmentsPolyB = [];

	for(var i = 1; i < verticesListA.length; i += 2) auxVerticesPolyA.push(new Vertex(verticesListA[i -1], verticesListA[i]));
  for(var i = 1; i < verticesListB.length; i += 2) auxVerticesPolyB.push(new Vertex(verticesListB[i -1], verticesListB[i]));

	for(var i = 1; i < auxVerticesPolyA.length; i++) segmentsPolyA.push([auxVerticesPolyA[i - 1], auxVerticesPolyA[i]]);
	for(var i = 1; i < auxVerticesPolyB.length; i++) segmentsPolyB.push([auxVerticesPolyB[i - 1], auxVerticesPolyB[i]]);

	segmentsPolyA.push([auxVerticesPolyA[auxVerticesPolyA.length - 1], auxVerticesPolyA[0]]);
	segmentsPolyB.push([auxVerticesPolyB[auxVerticesPolyB.length - 1], auxVerticesPolyB[0]]);

  /* Getting intersection points */
  for(var i = 0; i < segmentsPolyA.length; i++)
	{
		for(var j = 0; j < segmentsPolyB.length; j++)
		{
			var intersectionPoint = calculateIntercection(segmentsPolyA[i], segmentsPolyB[j]);

			if(intersectionPoint.x !== -1 && intersectionPoint.y !== -1) intersections.push(intersectionPoint);
		}
	}
	/*******************************/

	/*Inserting intersections on the polygon A list and sorting in counterclockwise order*/
	verticesListA = auxVerticesPolyA.concat(intersections);
	verticesListA = sortCounterclockwise(verticesListA);
	/***********************************************/

	/*Inserting intersections on the polygon B list and sorting in counterclockwise order*/
	verticesListB = auxVerticesPolyB.concat(intersections);
	verticesListB = sortCounterclockwise(verticesListB);
	/***********************************************/
	/*polyA.remove();
	polyB.remove();*/
	if(operation === "UNION")
	{
		var resultPoints = [];
		var lists = [verticesListA, verticesListB];
		var listIndex = 0;
		var activeList = verticesListA;
		var currentIndex = 0;
		var currentPoint = activeList[currentIndex];
		var firstPoint = currentPoint;
		var inc = 0;
		do
		{
			resultPoints.push(currentPoint.x, currentPoint.y);

			currentIndex = (currentIndex + 1)%activeList.length;
			currentPoint = activeList[currentIndex];

			if(currentPoint.isIntersection === true)
			{
				if(currentPoint.isEntering === true)
				{
					listIndex = 0;
					drawCircle(svg, currentPoint.x, currentPoint.y, RADIUS + (inc++),"in");
				}
				else
				{
					listIndex = 1;
					drawCircle(svg, currentPoint.x, currentPoint.y, RADIUS + (inc++),"out");
				}
				activeList = lists[listIndex];
				currentIndex = activeList.indexOf(currentPoint);
			}
		}
		while(inc < intersections.length)
		polygons.push(svg.append("polygon").attr("class","result").attr("points", resultPoints));
	}
	else if(operation == "INTERSECTION")
	{

			var resultPoints = [];
			var lists = [verticesListA, verticesListB];
			var listIndex = 0;
			var activeList = verticesListA;
			var currentIndex = activeList.indexOf(intersections[0]);
			var currentPoint = activeList[currentIndex];
			var firstPoint = currentPoint;
			var inc = 0;
			do
			{
				resultPoints.push(currentPoint.x, currentPoint.y);

				currentIndex = (currentIndex + 1)%activeList.length;
				currentPoint = activeList[currentIndex];

				if(currentPoint.isIntersection === true)
				{
					if(currentPoint.isEntering === true) listIndex = 0;
					else listIndex = 1;
					activeList = lists[listIndex];
					currentIndex = activeList.indexOf(currentPoint);
				}
			}
			while(firstPoint != currentPoint)
			polygons.push(svg.append("polygon").attr("class","result").attr("points", resultPoints));
	}
}

function init()
{
	svg = d3.select("body").append("svg").attr("width",WIDTH).attr("height",HEIGHT)
	      /*.on("mousedown",mouseClick)
				.on("mousemove",mouseMove)
				.on("mouseup",mouseUp)*/;
  var polyA = [300, 240, 240, 420, 450, 570, 570, 390, 540, 270];
	var polyB = [360, 210, 240, 360, 330, 420, 600, 330];

  /*var polyA = [450, 500, 560, 200, 640, 230, 700, 200, 660, 480];
	var polyB = [300, 240, 600, 220, 580, 440, 320, 440];*/
	polygons.push(svg.append("polygon").attr("points", polyA));
	polygons.push(svg.append("polygon").attr("class","top").attr("points", polyB));

	weilerAthertonAlgorithm();

  //d3.select(window).on('keydown',keyBoardHandler);
}
