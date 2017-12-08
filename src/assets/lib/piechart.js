function circleGraphic(ref1) {
	var ref = ref1[0];
	var defaults = {
		color: '#00dd33',
		startAngle: 0,

	};

	var opts = $.extend({}, defaults);

	var percentage;

	var ID = "c" + Math.random();

	ref.innerHTML += "<canvas  id='" + ID + "'></canvas>"

	sessionStorage.setItem("canvasId", ID);

	var canvas = document.getElementById(ID),
		context = canvas.getContext('2d');
	var Width = ref.offsetWidth;
	Width = "320";//$(".circleGraphic1").width();
	//console.log("width-->"+Width);
	var Height = ref.offsetHeight;
	Height = "200"; //$(".circleGraphic1").height();
	//console.log("Height-->"+Height);

	canvas.width = Width;
	canvas.height = Height;
	var result = window.sessionStorage.getItem("resultEntiQuiz");
	var startAngle = opts.startAngle,
		endAngle = result / 100,
		angle = startAngle,
		radius = Width * 0.25;

	function drawTrackArc() {
		context.beginPath();
		context.strokeStyle = '#ECECEC';
		context.lineWidth = 5;
		context.arc(Width / 2, Height / 2, radius, (Math.PI / 180) * (startAngle * 360 - 90), (Math.PI / 180) * (endAngle * 360 + 270), false);
		context.stroke();
		context.closePath();

	}

	function drawOuterArc(_angle, _color) {
		var angle = _angle;
		var color = _color;
		context.beginPath();
		context.strokeStyle = color;
		context.lineWidth = 10;
		context.arc(Width / 2, Height / 2, radius, (Math.PI / 180) * (startAngle * 360 - 90), (Math.PI / 180) * (angle * 360 - 90), false);
		context.stroke();
		context.closePath();
	}

	function numOfPercentage(_angle, _color) {
		var angle = Math.floor(_angle * 100) + 1;
		var color = _color;
		context.font = "50px fantasy";
		context.fillStyle = color;
		var metrics = context.measureText(angle);
		var textWidth = metrics.width;
		var xPos = Width / 2 - textWidth / 2,
			yPos = Height / 2 + textWidth / 2;
		//console.log("numOfPercentage angle:"+angle+" xpos:"+xPos+" ypos:"+yPos);
		if (angle < 100) {

			context.fillText(angle + "", xPos, yPos - 10);
		} else {
			context.fillText(angle + "", xPos, yPos - 20);
		}

	}

	function draw() {
		var loop = setInterval(function () {
			context.clearRect(0, 0, Width, Height);
			drawTrackArc();
			drawOuterArc(angle, opts.color);
			numOfPercentage(angle, opts.color);
			angle += 0.001;
			if (angle > endAngle) {
				clearInterval(loop);
			}

		}, 100 / 60);
	}
	draw();
	return this;
}
