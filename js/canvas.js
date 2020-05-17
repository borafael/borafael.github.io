var shouldKeepLooping = true;
var interval = 10;
var objects = [];
var g = 0.0000001;
var ticksPerLoop = 1;
var width = 1500;
var height = 900;
var center = new Vector(width / 2, height / 2);
var attractor = new Thing(new Vector(center.x, center.y), new Vector(0, 0), new Vector(0, 0), 100000);

function start(canvas) {
	var ctx = canvas.getContext("2d");
	canvas.addEventListener('mousemove', function(event) {
		//attractor.position = new Vector(event.x, event.y);
	});

	init();
	loop(ctx);
}

function getTangentSpeed(position) {
	var speed = attractor.position.sub(position).normal();

	if (position.y > center.y) {
		return speed.mul(-1);
	} else {
		return speed;
	}
}

function init() {
	for(var i = 0; i < 10000; i++) {
		var position = new Vector(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
		//var speed = getTangentSpeed(position).mul(2 / center.sub(position).abs());
		var speed = new Vector(0, 0);
		objects.push(new Thing(position, speed, new Vector(0, 0), 2));
	}
}

function Vector(x, y) {
	this.x = x;
	this.y = y;
	this.add = function add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	};
	this.sub = function sub(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	};
	this.mul = function sub(num) {
		return new Vector(this.x * num, this.y * num);
	};
	this.dot = function sub(vector) {
		return this.x * vector.x + this.y * vector.y;
	};
	this.abs = function abs() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	this.normal = function normal() {
		return new Vector(1, -(this.x / this.y));
	}
}

function Thing(position, speed, acceleration, mass) {
	this.position = position;
	this.speed = speed;
	this.acceleration = acceleration;
	this.mass = mass;
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
		var pos = objects[i].position;
		var distance = attractor.position.sub(pos).abs();
		if (distance != 0) {
			var c = g * attractor.mass / (distance * distance);
			force = force.add(attractor.position.sub(pos).mul(c));
		}
		objects[i].acceleration = objects[i].acceleration.add(force);
		objects[i].speed = objects[i].speed.add(objects[i].acceleration.mul(ticksPerLoop));
		objects[i].position = objects[i].position.add(objects[i].speed.mul(ticksPerLoop));
	};

	for (var i = 0; i < objects.length; i++) {
		if (attractor.position.sub(objects[i].position).abs() < 10) {
			objects.splice(i, 1);
		}
	}

	if (objects.length == 0) {
		setTimeout(function ()  {
			for(var i = 0; i < 10; i++) {
				var angle = Math.PI * 2 * Math.random();
				var distance = 15;
				var position = center.add(new Vector(distance * Math.cos(angle), distance * Math.sin(angle)));
				var speed = position.sub(center).mul(3 / position.sub(center).abs());
				objects.push(new Thing(position, speed, new Vector(0, 0), 2));
			}
		}, 1000);
	}
}

function render(ctx) {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
	for(var i = 0; i < objects.length; i++) {
		circle(ctx, objects[i].position.x, objects[i].position.y, Math.log(objects[i].mass));
	};
}

function circle(ctx, x, y, d) {
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.arc(x, y, d, 0, 2 * Math.PI);
	ctx.fill();
}
