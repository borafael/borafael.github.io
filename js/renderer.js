// Classes
function Vertex(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

function Triangle(v1, v2, v3) {
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
}

// Constants
TRIANGLE_SIDE_SIZE = 800;
TRIANGLES = [
	new Triangle(
		new Vertex(TRIANGLE_SIDE_SIZE, 0, 0),
		new Vertex(0, 0, 0),
		new Vertex(0, 0, TRIANGLE_SIDE_SIZE)
	),
	new Triangle(
		new Vertex(0, TRIANGLE_SIDE_SIZE, 0),
		new Vertex(0, 0, 0),
		new Vertex(0, 0, TRIANGLE_SIDE_SIZE)
	),
	new Triangle(
		new Vertex(TRIANGLE_SIDE_SIZE, 0, 0),
		new Vertex(0, 0, 0),
		new Vertex(0, TRIANGLE_SIDE_SIZE, 0)
	),
	new Triangle(
		new Vertex(TRIANGLE_SIDE_SIZE, 0, 0),
		new Vertex(0, TRIANGLE_SIDE_SIZE, 0),
		new Vertex(0, 0, TRIANGLE_SIDE_SIZE)
	)
]

// Functions
function drawTriangle(triangle) {
		ctx = document.getElementById('viewport').getContext('2d');
		ctx.moveTo(triangle.v1.x, triangle.v1.y);
		ctx.lineTo(triangle.v2.x, triangle.v2.y);
		ctx.lineTo(triangle.v3.x, triangle.v3.y);
		ctx.stroke();
}

function render() {
		TRIANGLES.forEach((triangle, i) => {
			drawTriangle(triangle);
		});

}

function rotate(direction) {
	alert(direction);
}
