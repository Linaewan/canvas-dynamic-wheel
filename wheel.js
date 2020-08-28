//debugger;

// TODO : Label of each categories we're about to sort with
var labels = ["Toto", "Tata", "Titi", "Tutu", "Tete", "Tyty"];
var data = [];

function populatedata() {
  for (var i = 0; i < categories; i++) {
    data[i] = segmentWidth;
  }
}

// number of categories
var categories = labels.length;
var fractionCercle = (2 * Math.PI) / categories ;

// one segment represents an hour so divide degrees by categories
var segmentWidth = 360 / categories;

// begin at 0 and end at one segment width
var startAngle = 0; // Or 0 ?
var endAngle = segmentWidth;

// how thick you want a segment
var segmentDepth = 100;

var context;
var canvas;

canvas = document.getElementById('myCanvas');
context = canvas.getContext("2d");

// centre or center for US :) the drawing
var x = canvas.width / 2;
var y = canvas.height / 2;

var rgb;
 
populatedata();
init();

function init() {
	// Clean the Canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Draw
  drawSegments();
}

function drawSegments() {
  var rgb = ColorLuminance("6699CC", 0);
  for (var i = 0; i < categories; i++) {
	  rgb = drawOneSegment(rgb, segmentDepth, false, i);
  }
  
}

function drawOneSegment(rgb, radius, isHover, segment) {
    rgb = ColorLuminance(rgb, 0.1);
    context.beginPath();
    context.arc(x, y, radius, segment * fractionCercle , (segment + 1) *  fractionCercle , false);
    context.lineWidth = segmentDepth;
		if(!isHover) {
		 context.strokeStyle = rgb;
		} else {
		 context.strokeStyle = "pink";
		}
   
    context.stroke();

    // increase per segment        
    startAngle += segmentWidth;
    endAngle += segmentWidth;
		
		drawSegmentLabel(canvas, context, segment);
		return rgb;
}

function ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

function drawSegmentLabel(canvas, context, i) {
   context.save();
    var x = Math.floor(canvas.width / 2);
    var y = Math.floor(canvas.height / 2);
    var angle;
    var angleD = sumTo(data, i);
    var flip = (angleD < 90 || angleD > 270) ? false : true;
		var dx;
    var dy;
		
    context.translate(x, y);
    if (flip) {
        angleD = angleD-180;
        context.textAlign = "left";
        angle = degreesToRadians(angleD);
        context.rotate(angle);
        context.translate(-(x + (canvas.width * 0.5))+15, -(canvas.height * 0.05)-10);
				dx = Math.floor(canvas.width * 0.7) - 10;
    		dy = Math.floor(canvas.height * 0.05);
    }
    else {
        context.textAlign = "right";
        angle = degreesToRadians(angleD);
        context.rotate(angle);
				dx = Math.floor(canvas.width * 0.3) - 10;
    		dy = Math.floor(canvas.height * 0.05);
    }
    var fontSize = Math.floor(canvas.height / 40);
    context.font = fontSize + "pt Helvetica";

    context.fillText(labels[i], dx, dy);

    context.restore();
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function sumTo(a, i) {
  var sum = 0;
  for (var j = 0; j < i; j++) {
    sum += a[j];
  }
  return sum;
}



// ** Handle mouse Events **/
var cursor_x = 0;
var cursor_y = 0;

function move(e) {
  e = e || event;
  // L'axe X vas vers la droite, y vers le bas, l'origine est le coin supérieur gauche
  cursor_x = e.pageX;
  cursor_y = e.pageY;
  if (e.target.id != 'myCanvas')
    init();
}

document.onmousemove = move;
document.getElementById('myCanvas-div').onmousemove = hoverAction;

var canvas_offset_left = canvas.offsetLeft;
var canvas_offset_top = canvas.offsetTop;

function hoverAction() {
  // Passage vers le repère cartésien d'origine le centre de la roue
  var xPosition = cursor_y - canvas_offset_top - y;
  var yPosition = cursor_x - canvas_offset_left - x;
  
 	// Passage vers le repère polaire centré sur la roue
  var cursorDistance = Math.sqrt(Math.pow(xPosition,2)+Math.pow(yPosition,2));
  var cursorAngle = Math.atan2(xPosition, yPosition);

	// Calcul du numéro de section survolé
  var hoveredSectionNumber;
  if (xPosition > 0) {
   	hoveredSectionNumber = Math.trunc(cursorAngle/fractionCercle);
  } else {
    hoveredSectionNumber = Math.trunc(cursorAngle/fractionCercle) + categories - 1;
  }
   
	init();
  // Coloration du bon segment en fonction de sa position
	if ( cursorDistance > segmentDepth/2 && cursorDistance < 3*segmentDepth/2) { // position radiale
   		drawOneSegment(rgb, segmentDepth, true, hoveredSectionNumber);  // position angulaire
  }
}



