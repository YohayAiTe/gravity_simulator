class Body {
    /**
     *
     * @param {string} name
     * @param {Vector} position
     * @param {number} mass
     * @param {Vector} velocity
     * @param {number} radius
     * @param {string} color - must be a color for CanvasRenderingContext2D
     * @param {number} [trailLength=100] - the maximum number of points remembered. If is also used when the object is the reference.
     * @param {number} [trailSteps=1] - the of updates per trail point
     */
    constructor(name, position, mass, velocity, radius, color, trailLength = 100, trailSteps = 1) {
        this.name = name
        this.postion = position
        this.mass = mass
        this.velocity = velocity
        this.radius = radius
        this.color = color

        this.force = new Vector()
        this.trailLength = trailLength
        this.trailSteps = trailSteps
        this.currentTrailStep = 0
        /** @type {Vector[]}*/
        this.trail = [];
    }

    /**
     *
     * @param {Body} other
     */
    applyForceFromBody(other) {
        const G = 6.67e-11
        let forceMag = G * this.mass * other.mass / this.postion.sub(other.postion).length2
        this.force = this.force.add(Vector.fromPolar(forceMag, other.postion.sub(this.postion).angle))
    }

    /**
     *
     * @param {number} dt
     */
    updatePosition(dt) {
        if (this.currentTrailStep === 0) {
            this.trail.unshift(this.postion)
            if (this.trail.length > this.trailLength) this.trail.pop()
        }
        this.currentTrailStep = (this.currentTrailStep + 1) % this.trailSteps

        this.postion = this.postion.add(this.velocity.scale(dt))
        this.velocity = this.velocity.add(this.force.scale(dt / this.mass))
        this.force = new Vector()
    }


    /**
     *
     * @return {Body}
     */
    #getNullReference() {
        let reference = new Body("", new Vector(), 0, new Vector(), 0, "", this.trail.length)
        for (let i = 0; i < this.trail.length; i++) reference.trail.push(new Vector())
        return reference
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {?Body} reference
     */
    renderBody(ctx, reference) {
        if (reference === null) reference = this.#getNullReference()

        let position = this.postion.sub(reference.postion)
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(position.x, position.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {?Body} reference
     */
    renderTrail(ctx, reference) {
        if (reference === null) reference = this.#getNullReference()

        let position = this.postion.sub(reference.postion)
        if (this.trail.length > 0) {
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.radius / 5
            ctx.beginPath()
            ctx.moveTo(position.x, position.y)
            for (let i = 0; i < Math.min(this.trail.length, reference.trail.length); i++) {
                let point = this.trail[i].sub(reference.trail[i])
                ctx.lineTo(point.x, point.y)
            }
            ctx.stroke()
        }
    }
}