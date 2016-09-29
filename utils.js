function drawCircle(container, x, y, r, c)
{
	var circle = container.append("circle").attr("cx", x).attr("cy", y).attr("r", r);
	circle.classed(c, true);
}

function Vertex(x, y)
{
	return {x:x, y:y, isIntersection:false, isEntering:false, visited:false};
}

function between(value, inf, sup)
{
    return (value >= inf && value <= sup);
}

function triangleArea(a, b, c)
{
	return Math.abs(a.x*(b.y - c.y) + b.x*(c.y - a.y) + c.x*(a.y - b.y))/2
}


function collinear(a, b, c)
{
	return (triangleArea(a, b, c) == 0);
}

function pointInBetween(start, middle, end)
{
  if(!collinear(start, end, middle)) return false;
	else
	{
	  if(start.x != end.x)
		   return (((start.x <= middle.x) && (middle.x <= end.x)) ||
			         ((start.x >= middle.x) && (middle.x >= end.x)));
    else
		   return (((start.y <= middle.y) && (middle.y <= end.y)) ||
			   			((start.y >= middle.y) && (middle.y >= end.y)));
	}
}

function crossProduct(v, w)
{
    return v.x*w.y - v.y*w.x;
}

function add(v, w)
{
	return new Vertex(v.x + w.x, v.y + w.y);
}

function subtract(v, w)
{
	return new Vertex(v.x - w.x, v.y - w.y);
}

function scale(s, v)
{
	return new Vertex(s * v.x, s * v.y);
}

function calculateIntercection(segmentA, segmentB)
{
  var slopeSegA = (segmentA[0].y - segmentA[1].y)/(segmentA[0].x - segmentA[1].x);
  var slopeSegB = (segmentB[0].y - segmentB[1].y)/(segmentB[0].x - segmentB[1].x);

  var intersectionPoint = new Vertex(-1, -1);

  if(slopeSegA == slopeSegB)
  {
     //hasIntercection = false;
  }
  else
  {
     var segADirection = subtract(segmentA[1], segmentA[0]); //r
     var segBDirection = subtract(segmentB[1], segmentB[0]); //s

     var directionsCrossProduct = crossProduct(segADirection, segBDirection);

     var endPointsSubtraction = subtract(segmentB[0], segmentA[0]);
     var segAParameter = crossProduct(endPointsSubtraction, segBDirection)/directionsCrossProduct;
     var segBParameter = crossProduct(endPointsSubtraction, segADirection)/directionsCrossProduct;

     var intersectionVector = scale(segAParameter, segADirection);

   //hasIntercection = true;
   if(directionsCrossProduct != 0 && between(segAParameter,0,1) && between(segBParameter, 0, 1) )
	 {
		 intersectionPoint = add(segmentA[0], intersectionVector);
	 	 intersectionPoint.isIntersection = true;

		 if(directionsCrossProduct > 0) intersectionPoint.isEntering = true;
	 }
   //else hasIntercection = false;
  }

  return intersectionPoint;
}

function findCenterPoint(points)
{
	var x = 0, y = 0;

	for(var i = 0; i < points.length; i++)
	{
		x += points[i].x;
		y += points[i].y;
	}

	return new Vertex(x/points.length, y/points.length);
}



function sortCounterclockwise(points)
{
	var center = findCenterPoint(points);

	points.sort(function(a, b)
  {
		if (a.x - center.x >= 0 && b.x - center.x < 0)
        return -1;
    if (a.x - center.x < 0 && b.x - center.x >= 0)
        return 1;
    if (a.x - center.x == 0 && b.x - center.x == 0)
		{
        if (a.y - center.y >= 0 || b.y - center.y >= 0) return (a.y > b.y)? -1 : 1;
        return (b.y > a.y)? 01 : 1;
    }

    // Compute the cross product of vectors (center -> a) x (center -> b)
    var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
    if (det < 0) return -1;
    if (det > 0) return 1;

    // Points a and b are on the same line from the center
    // Check which point is closer to the center
    var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
    var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
    return (d1 > d2)? -1 : 1;
	});

	return points;
}
