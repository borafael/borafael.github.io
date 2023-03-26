// Imports
import {Vector} from './vector.js';

var shouldKeepLooping = true;
var running = true;
var interval = 0.001;
var objects = [];
var g = 0.0000001;
var ticksPerLoop = 0.1;
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

function init() {
	// for(var i = 0; i < 10000; i++) {
	// 	var position = new Vector(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
	// 	//var speed = getTangentSpeed(position).mul(2 / center.sub(position).abs());
	// 	var speed = new Vector(0, 0);
	// 	objects.push(new Thing(position, speed, new Vector(0, 0), 2));
	// }

	for(var i = 0; i < 1000; i++) {
		var angle = Math.PI * 2 * Math.random();
		var distance = 3;
		var position = center.add(new Vector(distance * Math.cos(angle), distance * Math.sin(angle)));
		var speed = position.sub(center).mul(Math.random() * 7 / position.sub(center).abs());
		objects.push(new Thing(position, speed, new Vector(0, 0), 2));
	}

}

function Thing(position, speed, acceleration, mass) {
	this.position = position;
	this.speed = speed;
	this.acceleration = acceleration;
	this.mass = mass;
}

function loop(ctx) {

	if (running) {
		update();
		render(ctx);
	}

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
		if (attractor.position.sub(objects[i].position).abs() < 3) {
			objects.splice(i, 1);
		}
	}

	if (objects.length == 0) {
		running = false;
		setTimeout(function ()  {
			init();
			running = true;
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

start(document.getElementById('myCanvas'));
