export function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.add = function add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    };
    this.sub = function sub(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    };
    this.mul = function mul(num) {
        return new Vector(this.x * num, this.y * num);
    };
    this.dot = function dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    };
    this.abs = function abs() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.normal = function normal() {
        return new Vector(1, -(this.x / this.y));
    }
}
