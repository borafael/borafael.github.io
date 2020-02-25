var shouldKeepLooping = true;
var interval = 10;
var objects = [];
var g = 0.0001;
var ticksPerLoop = 1;

function start(canvas) {
	var ctx = canvas.getContext("2d");
	canvas.addEventListener('click', function(event) {
		alert(event);
	});

	init();
	loop(ctx);
}

function init() {
	for(var i = 0; i < 1000; i++) {
		var position = new Vector(Math.floor(Math.random() * 1500), Math.floor(Math.random() * 900));
		var speed = new Vector(0, 0);
		var acceleration = new Vector(0, 0);
		var mass = 2;
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
				var m1 = objects[i].mass;
				var m2 = objects[j].mass;
				var pos1 = objects[i].position;
				var pos2 = objects[j].position;
				var mass1 = objects[i].mass;
				var mass2 = objects[j].mass;
				var speed1 = objects[i].speed;
				var speed2 = objects[j].speed;
				var distance = pos2.sub(pos1).abs();

				if (distance <= (Math.log(objects[i].mass) + Math.log(objects[j].mass))) {
					objects[j].position = pos1.add(pos2).mul(0.5); 
					objects[j].speed = speed1.mul(m1/(m1+m2)).add(speed2.mul(m2/(m1+m2))); 
					objects[j].mass = m1 + m2;
					objects.splice(i, 1);
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
		objects[i].position = objects[i].position.add(objects[i].speed.mul(ticksPerLoop));
		objects[i].speed = objects[i].speed.add(objects[i].acceleration.mul(ticksPerLoop));
	};
}

function render(ctx) {
	ctx.clearRect(0, 0, 1500, 900);
	for(var i = 0; i < objects.length; i++) {
		circle(ctx, objects[i].position.x, objects[i].position.y, Math.log(objects[i].mass));
	};
}

function circle(ctx, x, y, d) {
	ctx.beginPath();
	ctx.arc(x, y, d, 0, 2 * Math.PI);
	ctx.stroke();
}
