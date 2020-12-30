// Constants

const WIDTH = 800;
const HEIGHT = 600;
const RADIUS = 10;
const LAPSE = 0.001;
const ZERO = new Vector(0, 0);
const DELTA = 0.001;
const CENTER = new Vector(WIDTH / 2, HEIGHT / 2);
const MAX_HEALTH = 100;
const TIME = 10;

const PLAYERS = {
	0: new Player(0, 'Vieira', 100, 10),
	1: new Player(1, 'El Tío', 10, 10),
	2: new Player(2, 'Sergini', 10, 10),
	3: new Player(3, 'Grido', 10, 10),
	4: new Player(4, 'Rafa', 10, 10),
	5: new Player(5, 'Piotr', 10, 10),
	6: new Player(6, 'Mausy', 10, 10),
	7: new Player(7, 'Arielaki', 10, 10),
	8: new Player(8, 'GREgO', 10, 10),
	9: new Player(9, 'Dieguito', 10, 10),
	10: new Player(10, 'Lucardo', 10, 10),
	11: new Player(11, 'Negra', 10, 10),
	12: new Player(12, 'Manu', 10, 10),
	13: new Player(13, 'Cristo', 10, 10),
	14: new Player(14, 'Mauricio', 10, 10),
	15: new Player(15, 'Axel', 10, 10),
	16: new Player(16, 'Wences', 10, 10),
	17: new Player(17, 'Pablito', 10, 10),
	18: new Player(18, 'Leander', 10, 10),
	19: new Player(19, 'Eddie', 10, 10)
}

const ATTACKING = new State(
	function (player) {
			let closestPlayer = getClosestPlayer(player);

			if (closestPlayer) {
				if (inContact(player, closestPlayer)) {
					player.hit(closestPlayer);
				} else {
					updatePosition(player, closestPlayer.pos.sub(player.pos));
				}
			}
		},
	function(hitter, hitee) {
			hitee.health--;

			if (hitee.health < 1) {
				hitee.state = DEAD;
			} else {
				hitee.state = STUNNED;
				hitee.counter = 0;
			}

			hitee.acceleration = hitee.pos.sub(hitter.pos).mul(hitter.force / hitee.mass);
		},
	function(player) {
		return player.name;
	});

const STUNNED = new State(
	function (player) {
		updatePosition(player, player.acceleration);
		player.counter++;
		if (player.counter > 500) {
			player.state = ATTACKING;
		}
	},
	function(hitter, hitee) {
		hitee.health--;

		if (hitee.health < 1) {
			hitee.state = DEAD;
		}

		hitee.acceleration = hitee.pos.sub(hitter.pos).mul(hitter.force / hitee.mass);
	},
	function(player) {
		return player.name;
	});

const DEAD = new State(
	function (player) {
		player.acceleration = ZERO;
		player.speed = ZERO
	},
	function(hitter, hitee) {
		hitee.acceleration = hitee.pos.sub(hitter.pos).mul(hitter.force / hitee.mass);
	},
	function(player) {
		return player.name;
	});

// Variables

let state = 0;

// Classes
function State(update, hit, getBubbleText) {
	this.update = update;
	this.hit = hit;
	this.getBubbleText = getBubbleText;
}

function Player(id, name, force, mass) {
	this.id = id;
	this.name = name;
	this.pos = ZERO;
	this.speed = ZERO;
	this.acceleration = ZERO;
	this.active = false;
	this.counter = 0;
	this.health = MAX_HEALTH;
	this.force = force;
	this.mass = mass;
	this.state = null;
	this.update = function() {
		this.state.update(this);
	}
	this.hit = function(player) {
		this.state.hit(this, player);
	}
	this.getBubbleText = function() {
		return this.state.getBubbleText(this);
	}
	this.getColor = function() {
		let red = this.health >= MAX_HEALTH / 2 ? 510 - Math.floor(510 * this.health / MAX_HEALTH) : 255;
		let green = this.health < MAX_HEALTH / 2 ? Math.floor(510 * this.health / MAX_HEALTH) : 255;
		return '#' + red.toString(16).padStart(2, '0') + green.toString(16).padStart(2, '0') + '00';
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
	updatePlayerColor(id, PLAYERS[id].getColor());
	element.draggable = false;
	placePlayer(id, getCanvasCoordinates(getCanvas(), event.clientX, event.clientY), ATTACKING);
	render();
}

function updatePlayerColor(id, color) {
	document.getElementById(id).style.backgroundColor = color;
}

function placePlayer(id, pos, state) {
	let player = PLAYERS[id];
	player.pos = pos;
	player.active = true;
	player.state = state;
}

function getCanvas() {
	return document.getElementById('arenaCanvas');
}

function getCanvasCoordinates(canvas, x, y) {
	const rect = canvas.getBoundingClientRect()
	return new Vector(x - rect.left, y - rect.top);
}

function start() {
	state = 1;
	loop();
}

function loop() {
	getActivePlayers().forEach(p => p.update());
	render();

	if (state === 1) {
		setInterval(loop, TIME);
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
	if (player.state === DEAD) {
		return false;
	} else {
		return getActivePlayers()
			.filter(p => p !== player)
			.filter(p => p.state !== DEAD)
			.filter(p => p.pos.sub(newPos).abs() <= RADIUS * 2)
			.length > 0;
	}
}

function getClosestPlayer(player) {
	return getActivePlayers()
		.filter(p => p !== player)
		.filter(p => p.state !== DEAD)
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
	let color = player.getColor();
	updatePlayerColor(player.id, color);
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(player.pos.x, player.pos.y, RADIUS, 0, 2 * Math.PI);
	ctx.fill();

	let offset = CENTER.sub(player.pos);
	offset = offset.mul(RADIUS / offset.abs());
	offset = player.pos.add(offset);
	ctx.fillStyle = 'black';
	ctx.fillText(player.getBubbleText(), offset.x, offset.y);
}