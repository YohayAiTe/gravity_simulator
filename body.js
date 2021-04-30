class Body {
    /**
     * Creates a new Body.
     * @param {string} name - the name of the Body
     * @param {Vector} position - the position of the Body
     * @param {number} mass - the mass of the Body
     * @param {Vector} velocity - the initial velocity of the Body
     * @param {number} radius - the radius of the body(used only for rendering)
     * @param {string} color - must be a color for CanvasRenderingContext2D
     * @param {number} trailLength - the maximum number of points in the trail(also used when the object is the reference)
     * @param {number} trailSteps - the number of updates needed per trail point
     */
    constructor(name, position, mass, velocity, radius, color, trailLength, trailSteps) {
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
     * Calculates and applies the force Body other exerts on this. The force is calculated only on this, so in order to
     * comply with Newton's third law other.applyForceFromBody(this) needs to be called. The function does not move the
     * body.
     * @param {Body} other - the body that exerts the force
     */
    applyForceFromBody(other) {
        const G = 6.67e-11
        let forceMag = G * this.mass * other.mass / this.postion.sub(other.postion).length2
        this.force = this.force.add(Vector.fromPolar(forceMag, other.postion.sub(this.postion).angle))
    }

    /**
     * Updates the position of this, according to its velocity and the forces exerted with applyForceFromBody.
     * Adds a trail point if needed. The function also resets the forces exerted on this, so applyForceFromBody needs
     * to be called between consecutive calls. The function approximates the position using the time-step dt.
     * @param {number} dt - time step(in seconds)
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
     * Returns a Body that can be used to view the world when no object is tracked.
     * @return {Body}
     */
    #getNullReference() {
        let reference = new Body("", new Vector(), 0, new Vector(), 0, "", this.trail.length)
        for (let i = 0; i < this.trail.length; i++) reference.trail.push(new Vector())
        return reference
    }

    /**
     * Renders the Body on the given ctx, with relation to reference.
     * @param {CanvasRenderingContext2D} ctx - the context to use for drawing
     * @param {?Body} reference - the reference object
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
     * Renders the Body's trail with relation to reference
     * @param {CanvasRenderingContext2D} ctx - the context to use for drawing
     * @param {?Body} reference - the reference object
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