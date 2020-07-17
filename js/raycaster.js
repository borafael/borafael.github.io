var RAYCASTER = {};

function init() {
	RAYCASTER.miniMap = document.getElementById('miniMap');
	RAYCASTER.viewPort = document.getElementById('viewPort');
	RAYCASTER.pos = new Vector(
		RAYCASTER.miniMap.width / 2,
		RAYCASTER.miniMap.height / 2);
	RAYCASTER.angle = 3 * Math.PI / 2;
	RAYCASTER.size = 64;

	RAYCASTER.rightPressed = false;
	RAYCASTER.leftPressed = false;
	RAYCASTER.upPressed = false;
	RAYCASTER.downPressed = false;

	RAYCASTER.map = createMap(RAYCASTER.miniMap.width, RAYCASTER.miniMap.height,
		RAYCASTER.size);

	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyUpHandler, false);

	RAYCASTER.miniMap.addEventListener('click', miniMapClickHandler, false);

	loop();
}

function miniMapClickHandler(event) {
	var row = Math.floor((event.clientY - RAYCASTER.miniMap.getBoundingClientRect()
			.top) /
		RAYCASTER.size);
	var column = Math.floor((event.clientX - RAYCASTER.miniMap.getBoundingClientRect()
			.left) /
		RAYCASTER.size);
	RAYCASTER.map[row][column] = !RAYCASTER.map[row][column];
}

function createMap(width, height, size) {
	var rows = height / size;
	var columns = width / size;

	var map = [];

	for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
		var column = [];
		for (var colIndex = 0; colIndex < columns; colIndex++) {
			column[colIndex] = false;
		}
		map[rowIndex] = column;
	}

	return map;
}

function loop() {
	update();
	render();

	setTimeout(function() {
		loop();
	}, 0.1);
}

function update() {

	if (RAYCASTER.rightPressed) {
		RAYCASTER.angle = RAYCASTER.angle + Math.PI / 100;
	}

	if (RAYCASTER.leftPressed) {
		RAYCASTER.angle = RAYCASTER.angle - Math.PI / 100;
	}

	if (RAYCASTER.upPressed) {
		RAYCASTER.pos = RAYCASTER.pos.add(new Vector(1 * Math.cos(RAYCASTER.angle),
			1 * Math.sin(RAYCASTER.angle)));
	}

	if (RAYCASTER.downPressed) {
		RAYCASTER.pos = RAYCASTER.pos.sub(new Vector(1 * Math.cos(RAYCASTER.angle),
			1 * Math.sin(RAYCASTER.angle)));
	}
}

function render() {
	renderMiniMap();
	renderViewPort();
}

function renderMiniMap() {
	var miniMap = RAYCASTER.miniMap;
	var pos = RAYCASTER.pos;
	var angle = RAYCASTER.angle;
	var size = RAYCASTER.size;
	var map = RAYCASTER.map;
	var width = miniMap.width;
	var height = miniMap.height;
	var ctx = miniMap.getContext('2d');

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, width, height);

	for (var i = 0; i < width; i = i + RAYCASTER.size) {
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, height);
		ctx.stroke();
	}

	for (var i = 0; i < height; i = i + RAYCASTER.size) {
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(width, i);
		ctx.stroke();
	}

	var rows = height / size;
	var columns = width / size;

	for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
		for (var colIndex = 0; colIndex < columns; colIndex++) {
			if (map[rowIndex][colIndex]) {
				ctx.fillStyle = "#000000";
				ctx.fillRect(colIndex * size, rowIndex * size, size, size);
			}
		}
	}

	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.arc(pos.x, pos.y, 2.5, 0, 2 * Math.PI);
	ctx.fill();
}

function renderViewPort() {
	var ctx = RAYCASTER.viewPort.getContext('2d');
	var viewPort = RAYCASTER.viewPort;
	var delta = (Math.PI / 3) / viewPort.width;

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, viewPort.width, viewPort.height);

	for (var column = 0; column < viewPort.width; column = column + 1) {
		var offset = -(Math.PI / 6) + delta * column;
		distance = cast(RAYCASTER.angle + offset);
		//projection = RAYCASTER.size * 277 / (distance * Math.cos(offset));
		projection = RAYCASTER.size / 2 * 277 / distance;

		ctx.beginPath();
		//ctx.strokeStyle = getRandomColor();

		var maxDistance = Math.sqrt((RAYCASTER.miniMap.width * RAYCASTER.miniMap.width) +
			(RAYCASTER.miniMap.height * RAYCASTER.miniMap.height));
		var colorComponent = Math.floor((1 - (distance / maxDistance)) * 255.0).toString(
				16)
			.padStart(2, '0');
		var color = '#' + colorComponent + colorComponent + colorComponent;

		ctx.strokeStyle = color;
		ctx.moveTo(column, viewPort.height / 2 + projection / 2);
		ctx.lineTo(column, viewPort.height / 2 - projection / 2);
		ctx.stroke();
	}
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function cast(angle) {
	var aux = new Vector(RAYCASTER.pos.x, RAYCASTER.pos.y);

	while (aux.x >= 0 && aux.x <= RAYCASTER.miniMap.width && aux.y >= 0 && aux.y <=
		RAYCASTER.miniMap.height && isHollow(aux)) {
		aux = aux.add(new Vector(Math.cos(angle), Math.sin(angle)));
	}

	var ctx = RAYCASTER.miniMap.getContext('2d');

	ctx.beginPath();
	ctx.strokeStyle = "#00FF00";
	ctx.moveTo(RAYCASTER.pos.x, RAYCASTER.pos.y);
	ctx.lineTo(aux.x, aux.y);
	ctx.stroke();

	return aux.sub(RAYCASTER.pos).abs();
}

function isHollow(pos) {
	var row = Math.floor(pos.y / RAYCASTER.size);
	var col = Math.floor(pos.x / RAYCASTER.size);

	return !RAYCASTER.map[row][col];
}

function keyDownHandler(event) {
	if (event.keyCode == 39) {
		RAYCASTER.rightPressed = true;
	}

	if (event.keyCode == 37) {
		RAYCASTER.leftPressed = true;
	}

	if (event.keyCode == 40) {
		RAYCASTER.downPressed = true;
	}

	if (event.keyCode == 38) {
		RAYCASTER.upPressed = true;
	}
}

function keyUpHandler(event) {
	if (event.keyCode == 39) {
		RAYCASTER.rightPressed = false;
	}

	if (event.keyCode == 37) {
		RAYCASTER.leftPressed = false;
	}

	if (event.keyCode == 40) {
		RAYCASTER.downPressed = false;
	}

	if (event.keyCode == 38) {
		RAYCASTER.upPressed = false;
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
