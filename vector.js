class Vector {
    /**
     * Creates a new vector using cartesian coordinates.
     * @param {number} [x=0]
     * @param {number} [y=0]
     */
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /**
     * Creates a Vector with length r and angle theta.
     * @param {number} r - the length
     * @param {number} theta - the angle(in radians)
     * @returns {Vector}
     */
    static fromPolar(r, theta) {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta))
    }

    /**
     * Returns the angle of the Vector(in radians).
     * @returns {number}
     */
    get angle() {
        return Math.atan2(this.y, this.x)
    }

    /**
     * Returns the length of the Vector squared.
     * @returns {number}
     */
    get length2() {
        return this.dot(this)
    }

    /**
     * Returns the length of the Vector.
     * @returns {number}
     */
    get length() {
        return Math.sqrt(this.length2)
    }

    /**
     * Returns a new Vector scaled by s.
     * @param {number} s - the scale factor
     * @returns {Vector}
     */
    scale(s) {
        return new Vector(this.x * s, this.y * s)
    }

    /**
     * Returns a new Vector that is sum of other and this.
     * @param {Vector} other - the Vector to add
     * @returns {Vector}
     */
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    /**
     * Returns a new Vector that the difference between this and other.
     * @param {Vector} other - the Vector to be subtracted(minuend)
     * @returns {Vector}
     */
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    /**
     * Returns a new Vector that is the negative of this.
     * @returns {Vector}
     */
    neg() {
        return new Vector(-this.x, -this.y)
    }

    /**
     * Returns the dot product of this with the Vector other.
     * @param {Vector} other - the Vector to calculate the dot product with.
     * @returns {number}
     */
    dot(other) {
        return this.x * other.x + this.y * other.y
    }
}