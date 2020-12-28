// Constants

const WIDTH = 800;
const HEIGHT = 600;
const RADIUS = 10;
const LAPSE = 0.0001;
const ZERO = new Vector(0, 0);
const DELTA = 0.0001;

const PLAYERS = {
	0: new Player(0, 'Vieira'),
	1: new Player(1, 'El Tío'),
	2: new Player(2, 'Sergini'),
	3: new Player(3, 'Grido'),
	4: new Player(4, 'Rafa'),
	5: new Player(5, 'Piotr'),
	6: new Player(6, 'Mausy'),
	7: new Player(7, 'Arielaki'),
	8: new Player(8, 'GREgO'),
	9: new Player(9, 'Dieguito'),
	10: new Player(10, 'Lucardo'),
	11: new Player(11, 'Negra'),
	12: new Player(12, 'Manu'),
	13: new Player(13, 'Cristo'),
	14: new Player(14, 'Mauricio'),
	15: new Player(15, 'Axel'),
	16: new Player(16, 'Wences'),
	17: new Player(17, 'Pablito'),
	18: new Player(18, 'Leander'),
	19: new Player(19, 'Eddie')
}

// Variables

let state = 0;

// Classes

function Player(id, name) {
	this.id = id;
	this.name = name;
	this.pos = ZERO;
	this.color = '#FFFFFF';
	this.speed = ZERO;
	this.acceleration = ZERO;
	this.active = false;
	this.hit = function(player) {
		let direction = player.pos.sub(this.pos)
		direction = direction.mul(1 / direction.abs());
		player.pos = this.pos.add(direction.mul((RADIUS * 2) + 1));
		player.acceleration = direction;
	}
}

function Vector(x, y) {
	this.x = x;
	this.y = y;
	this.add = function (vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	};
	this.sub = function (vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	};
	this.mul = function (num) {
		return new Vector(this.x * num, this.y * num);
	};
	this.dot = function (vector) {
		return this.x * vector.x + this.y * vector.y;
	};
	this.abs = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	this.normal = function () {
		return new Vector(1, -(this.x / this.y));
	}
}

// Functions

function drag(event) {
	event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
	let id = event.dataTransfer.getData('text');
	let element = document.getElementById(id);
	let color = getRandomColor();
	element.style.backgroundColor = color;
	element.draggable = false;
	placePlayer(id, getCanvasCoordinates(getCanvas(), event), color);
	render();
}

function placePlayer(id, pos, color) {
	let player = PLAYERS[id];
	player.pos = pos;
	player.color = color;
	player.active = true;
}

function getRandomColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function getCanvas() {
	return document.getElementById('arenaCanvas');
}

function getCanvasCoordinates(canvas, event) {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	return new Vector(x, y);
}

function start() {
	state = 1;
	loop();
}

function loop() {
	getActivePlayers().map(p => update(p));
	render();

	if (state === 1) {
		setInterval(loop, 1);
	}
}

function update(player) {
	let closestPlayer = getClosestPlayer(player);

	if (inContact(player, closestPlayer)) {
		player.hit(closestPlayer);
	} else {
		updatePosition(player, closestPlayer.pos.sub(player.pos));
	}
}

function updatePosition(player, acceleration) {
	let newPos = player.pos.add(player.speed.mul(LAPSE));

	if (isWithinBoundries(newPos) && !collides(player, newPos)) {
		player.pos = newPos;
		player.speed = player.speed.add(player.acceleration.mul(LAPSE));
	} else {
		player.speed = ZERO;
	}

	player.acceleration = acceleration;
}

function inContact(player1, player2) {
	return player1.pos.sub(player2.pos).abs() <= RADIUS * 2 + DELTA;
}

function isWithinBoundries(pos) {
	return pos.x >= RADIUS
		&& pos.x <= WIDTH - RADIUS
		&& pos.y >= RADIUS
		&& pos.y <= HEIGHT - RADIUS;
}

function collides(player, newPos) {
	return getActivePlayers()
		.filter(p => p !== player)
		.filter(p => p.pos.sub(newPos).abs() <= RADIUS * 2)
		.length > 0;
}

function getClosestPlayer(player) {
	return getActivePlayers()
		.filter(p => p !== player)
		.sort(function (p1, p2) {
			let d1 = p1.pos.sub(player.pos).abs();
			let d2 = p2.pos.sub(player.pos).abs();
			return d1 - d2;
		})[0];
}

function render() {
	let canvas = getCanvas();
	let ctx = canvas.getContext('2d');
	clear(ctx);
	getActivePlayers().map(player => renderPlayer(ctx, player));
}

function getActivePlayers() {
	return Object.values(PLAYERS)
		.filter(p => p.active);
}

function clear(ctx) {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function renderPlayer(ctx, player) {
	ctx.beginPath();
	ctx.fillStyle = player.color;
	ctx.arc(player.pos.x, player.pos.y, RADIUS, 0, 2 * Math.PI);
	ctx.fill();
}