class Vector {
    /**
     *
     * @param {number} [x=0]
     * @param {number} [y=0]
     */
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /**
     *
     * @param {number} r
     * @param {number} theta
     * @returns {Vector}
     */
    static fromPolar(r, theta) {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta))
    }

    /**
     *
     * @returns {number}
     */
    get angle() {
        return Math.atan2(this.y, this.x)
    }

    /**
     *
     * @returns {number}
     */
    get length2() {
        return this.dot(this)
    }

    /**
     *
     * @returns {number}
     */
    get length() {
        return Math.sqrt(this.length2)
    }

    /**
     *
     * @param {number} s
     * @returns {Vector}
     */
    scale(s) {
        return new Vector(this.x * s, this.y * s)
    }

    /**
     *
     * @param {Vector} other
     * @returns {Vector}
     */
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    /**
     *
     * @param {Vector} other
     * @returns {Vector}
     */
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    /**
     *
     * @returns {Vector}
     */
    neg() {
        return new Vector(-this.x, -this.y)
    }

    /**
     *
     * @param {Vector} other
     * @returns {number}
     */
    dot(other) {
        return this.x * other.x + this.y * other.y
    }
}