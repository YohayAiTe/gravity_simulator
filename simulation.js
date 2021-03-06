class Simulation {
    /**
     * A type used to describe the creation parameters of a body.
     * @typedef {{color: string, mass: number, name: string, position: Vector, velocity: Vector, radius: number}} Simulation~CreationParameter
     */

    /**@type {Simulation~CreationParameter}*/
    #sunParameters = {
        name: "The Sun", position: new Vector(), mass: 1.989e30, velocity: new Vector(), radius: 6.96e8, color: "yellow"
    }
    /**@type {Object.<string, Simulation~CreationParameter>}*/
    #planetParameters = {
        "mercury": {
            name: "Mercury",
            position: new Vector(-6.9817e10, 0),
            mass: 0.33011e24,
            velocity: new Vector(0, 3.886e4),
            radius: 2.439e6,
            color: "gray"
        },
        "venus": {
            name: "Venus",
            position: new Vector(-1.08e11, 0),
            mass: 4.8675e24,
            velocity: new Vector(0, 3.479e4),
            radius: 6.051e6,
            color: "orange"
        },
        "earth": {
            name: "Earth",
            position: new Vector(-1.52e11, 0),
            mass: 5.972e24,
            velocity: new Vector(0, 2.929e4),
            radius: 6.37e6,
            color: "blue"
        },
        "mars": {
            name: "Mars",
            position: new Vector(-2.49e11, 0),
            mass: 0.64171e24,
            velocity: new Vector(0, 2.197e4),
            radius: 3.396e6,
            color: "red"
        },
        "jupiter": {
            name: "Jupiter",
            position: new Vector(-8.16618e11, 0),
            mass: 1898.19e24,
            velocity: new Vector(0, 1.244e4),
            radius: 71.492e6,
            color: "coral"
        },
        "saturn": {
            name: "Saturn",
            position: new Vector(-15.14504e11, 0),
            mass: 568.34e24,
            velocity: new Vector(0, 0.909e4),
            radius: 60.268e6,
            color: "navajowhite"
        },
        "uranus": {
            name: "Uranus",
            position: new Vector(-30.036254e11, 0),
            mass: 86.813e24,
            velocity: new Vector(0, 0.649e4),
            radius: 25.559e6,
            color: "azure"
        },
        "neptune": {
            name: "Neptune",
            position: new Vector(-45.45671e11, 0),
            mass: 102.413e24,
            velocity: new Vector(0, 0.537e4),
            radius: 24.764e6,
            color: "darkblue"
        },
    }
    /**@type {Object.<string, Simulation~CreationParameter>}*/
    #moonParameters = {
        "moon": {
            name: "The Moon (Earth)",
            position: new Vector(-1.52e11, 4.05e8),
            mass: 0.07346e24,
            velocity: new Vector(0.970e3, 2.929e4),
            radius: 1.738e6,
            color: "white"
        },
        "phobos": {
            name: "Phobos(Mars)",
            position: new Vector(-2.49e11, 9.378e6),
            mass: 10.5e15,
            velocity: new Vector(2.138e3, 2.197e4),
            radius: 11.2667e3,
            color: "white"
        },
        "deimos": {
            name: "Deimos(Mars)",
            position: new Vector(-2.49e11, 23.459e6),
            mass: 2.4e15,
            velocity: new Vector(1.3513e3, 2.197e4),
            radius: 6.2e3,
            color: "white"
        },
        "io": {
            name: "Io(Jupiter)",
            position: new Vector(-8.16618e11, 423.4e6),
            mass: 8.931938e22,
            velocity: new Vector(17.334e3, 1.244e4),
            radius: 1821.6e3,
            color: "khaki"
        },
        "europa": {
            name: "Europa(Jupiter)",
            position: new Vector(-8.16618e11, 676.938e6),
            mass: 4.799844e22,
            velocity: new Vector(13.740e3, 1.244e4),
            radius: 1560.8e3,
            color: "azure"
        },
        "ganymede": {
            name: "Ganymede(Jupiter)",
            position: new Vector(-8.16618e11, 1071.6e6),
            mass: 1.4819e23,
            velocity: new Vector(10.880e3, 1.244e4),
            radius: 2634.1e3,
            color: "bisque"
        },
        "callisto": {
            name: "Callisto(Jupiter)",
            position: new Vector(-8.16618e11, 1897e6),
            mass: 1.075938e23,
            velocity: new Vector(8.204e3, 1.244e4),
            radius: 2410.3e3,
            color: "burlywood"
        },
    }

    /**
     * Creates a new simulation.
     * @param {CanvasRenderingContext2D} ctx - the context the simulation uses
     * @param {number} dt - the time-step to take each calculation
     * @param {number} trailLength - the maximum number of points in every planet's trail
     * @param {number} calculationsPerTrail - the number of steps needed to add a point to the trail
     * @param {number} calculationsPerFrame - the number of calculations to do every frame
     * @param {string[]} bodyNames - the names of the bodies to create
     */
    constructor(ctx, dt, trailLength, calculationsPerTrail, calculationsPerFrame, bodyNames) {
        this.isRunning = true
        this.ctx = ctx
        this.dt = dt
        this.time = 0

        this.calculationsPerFrame = calculationsPerFrame

        this.sun = null
        this.bodies = []
        this.planets = []
        this.moons = []
        for (const bodyName of bodyNames) {
            if (bodyName === "sun") {
                let params = this.#sunParameters
                this.sun = new Body(params.name, params.position, params.mass, params.velocity,
                    params.radius * 50, params.color, trailLength, calculationsPerTrail)
                this.bodies.unshift(this.sun)
            }
            if (this.#planetParameters[bodyName] !== undefined) {
                let params = this.#planetParameters[bodyName]
                this.planets.unshift(new Body(params.name, params.position, params.mass, params.velocity,
                    params.radius * 1000, params.color, trailLength, calculationsPerTrail))
            }
            if (this.#moonParameters[bodyName] !== undefined) {
                let params = this.#moonParameters[bodyName]
                this.moons.unshift(new Body(params.name, params.position, params.mass, params.velocity,
                    params.radius * 100, params.color, trailLength, calculationsPerTrail))
            }
        }
        this.bodies.push(...this.planets, ...this.moons)
        /** @type {?Body}*/
        this.trackedBody = null
        this.translation = new Vector()
    }

    /**
     * Calculates the step and updates the simulation.
     */
    #calculate() {
        for (const body1 of this.bodies) {
            for (const body2 of this.bodies) {
                if (body1 !== body2) body1.applyForceFromBody(body2)
            }
        }
        for (const body of this.bodies) body.updatePosition(this.dt)
        this.time += this.dt
    }

    /**
     * Renders the simulation.
     */
    #render() {
        this.ctx.save()
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.restore()

        if (this.sun !== null) this.sun.renderTrail(this.ctx, this.trackedBody, this.translation)
        for (const planet of this.planets) planet.renderTrail(this.ctx, this.trackedBody, this.translation)
        if (this.sun !== null) this.sun.renderBody(this.ctx, this.trackedBody, this.translation)
        for (const planet of this.planets) planet.renderBody(this.ctx, this.trackedBody, this.translation)
        for (const planetMoon of this.moons) planetMoon.renderTrail(this.ctx, this.trackedBody, this.translation)
        for (const planetMoon of this.moons) planetMoon.renderBody(this.ctx, this.trackedBody, this.translation)
    }

    /**
     * Executes the number of necessary calculations and renders the result to the canvas.
     */
    frame() {
        if (this.isRunning) {
            for (let i = 0; i < this.calculationsPerFrame; i++) this.#calculate()
        }
        this.#render()
    }

    /**
     *
     * @param {Vector} position
     */
    getClosestBody(position) {
        let closestBody = null, closestDistance2 = Infinity;
        let clickPos = position.add(this.translation)
        if (this.trackedBody !== null) {
            clickPos = position.add(this.trackedBody.position).add(this.translation)
        }
        for (const body of this.bodies) {
            let clickDistance2 = body.position.sub(clickPos).length2
            if (clickDistance2 < body.radius * body.radius && clickDistance2 < closestDistance2) {
                closestBody = body
                closestDistance2 = clickDistance2
            }
        }
        return closestBody
    }
}