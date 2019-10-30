var shouldKeepLooping = true;
var interval = 10;
var objects = [];
var g = 0.00001;

function start(canvas) {
	var ctx = canvas.getContext("2d");
	init();
	loop(ctx);
}

function init() {
	for(var i = 0; i < 500; i++) {
		var position = new Vector(750, 450);
		var angle = Math.floor(Math.random() * 360) * 2 * Math.PI / 360;
		var initialSpeed = 2.5;
		var speed = new Vector(initialSpeed * Math.cos(angle), initialSpeed * Math.sin(angle));
		var acceleration = new Vector(0, 0);
		var mass = 1;
		objects.push(new Thing(position, speed, acceleration, mass));
	}
}

function Vector(x, y) {
	return {
		"x": x,
		"y": y,
		"add": function add(vector) {
			return new Vector(this.x + vector.x, this.y + vector.y);
		},
		"sub": function sub(vector) {
			return new Vector(this.x - vector.x, this.y - vector.y);
		},
		"mul": function sub(num) {
			return new Vector(this.x * num, this.y * num);
		},
		"dot": function sub(vector) {
			return this.x * vector.x + this.y * vector.y;
		},
		"abs": function abs() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	}
}

function Thing(position, speed, acceleration, mass) {
	return {
		"position": position,
		"speed": speed,
		"acceleration": acceleration,
		"mass": mass
	}
}

function loop(ctx) {
	update();
	render(ctx);

	if (shouldKeepLooping) {
		setTimeout(function(){ loop(ctx); }, interval);
	}
}

function update() {

	for (var i = 0; i < objects.length; i++) {
		var force = new Vector(0, 0);
		for (var j = 0; j < objects.length; j++) {
			if (objects[i] && objects[j] && i != j) {
				var pos1 = objects[i].position;
				var pos2 = objects[j].position;
				var distance = pos2.sub(pos1).abs();

				if (distance <= (objects[i].mass + objects[j].mass)) {
					var position = new Vector(objects[i].position.x, objects[i].position.y);
					var speed = new Vector(0, 0);
					var acceleration = new Vector(0, 0);
					var mass = objects[i] + objects[j];
/*
					objects[j].speed = new Vector(0, 0);
					objects[j].acceleration = new Vector(0, 0);
					objects[j].mass = objects[j].mass + objects[i].mass;
					objects.splice(i, 1);
*/
				}
			}
		}
	};

	for (var i = 0; i < objects.length; i++) {
		var force = new Vector(0, 0);
		for (var j = 0; j < objects.length; j++) {
			if (i != j) {
				var pos1 = objects[i].position;
				var pos2 = objects[j].position;
				var distance = pos2.sub(pos1).abs();
				if (distance != 0) {
					var c = g * objects[j].mass / (distance * distance);
					force = force.add(pos2.sub(pos1).mul(c));
				}
			}
		}
		objects[i].acceleration = objects[i].acceleration.add(force);
	};

	for (var i = 0; i < objects.length; i++) {
		objects[i].speed = objects[i].speed.add(objects[i].acceleration);
		objects[i].position = objects[i].position.add(objects[i].speed);
	};
}

function render(ctx) {
	ctx.clearRect(0, 0, 1500, 900);
	for(var i = 0; i < objects.length; i++) {
		circle(ctx, objects[i].position.x, objects[i].position.y, objects[i].mass);
//		ctx.font = "10px Arial";
//		ctx.fillText(objects[i].mass, objects[i].position.x, objects[i].position.y);
	};
}

function circle(ctx, x, y, d) {
	ctx.beginPath();
	ctx.arc(x, y, d, 0, 2 * Math.PI);
	ctx.stroke();
}
