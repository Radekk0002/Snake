function Apple(ctx, appleSize, snakeSize, color, points, speed) {
    const _ = this
    _.x = 20
    _.y = 16
    // let apples = []
    _.appleEaten = false
    _.color = color
    _.points = points
    _.speed = speed
    _.appleSpeed = 0
    _.applePoints = 0
    _.ctx = ctx
    _.appleSize = appleSize
    _.snakeSize = snakeSize

    // _.randomize = function (fields) {
    //     if (fields.length > 0) {

    //         const num = Math.floor(Math.random() * (fields.length))
    //         const field = fields[num];

    //         fields.splice(num, 1)

    //         _.x = field.x
    //         _.y = field.y

    //         const apple = {
    //             x: _.x,
    //             y: _.y,
    //             color: _.color,
    //             points: _.points,
    //             speed: _.speed
    //         }
    //         apples.push(apple)
    //     }
    // }

    // _.drawApples = function () {
    //     for (let i = 0; i < apples.length; i++) {
    //         ctx.fillStyle = apples[i].color
    //         const x = apples[i].x
    //         const y = apples[i].y
    //         ctx.fillRect(snakeSize * x + 4, snakeSize * y + 4, appleSize, appleSize)
    //     }
    // }

    // _.checkEatenApple = function (pos) {
    //     _.appleEaten = false
    //     _.applePoints = 0
    //     _.appleSpeed = 0

    //     for (let i = 0; i < apples.length; i++) {
    //         if (pos.x / snakeSize === apples[i].x && pos.y / snakeSize === apples[i].y) {
    //             _.applePoints = apples[i].points
    //             _.appleSpeed = apples[i].speed
    //             apples.splice(i, 1)
    //             _.appleEaten = true

    //             break
    //         }
    //     }
    // }
}

Apple.prototype.apples = []


Apple.prototype.randomize = function (fields) {
    const _ = this

    if (fields.length > 0) {

        const num = Math.floor(Math.random() * (fields.length))
        const field = fields[num];

        fields.splice(num, 1)

        _.x = field.x
        _.y = field.y

        const apple = {
            x: _.x,
            y: _.y,
            color: _.color,
            points: _.points,
            speed: _.speed
        }
        _.apples.push(apple)
    }
}

Apple.prototype.drawApples = function () {
    const _ = this

    for (let i = 0; i < _.apples.length; i++) {
        _.ctx.fillStyle = _.apples[i].color
        const x = _.apples[i].x
        const y = _.apples[i].y
        _.ctx.fillRect(_.snakeSize * x + 4, _.snakeSize * y + 4, _.appleSize, _.appleSize)
    }
}

Apple.prototype.checkEatenApple = function (pos) {
    const _ = this

    _.appleEaten = false
    _.applePoints = 0
    _.appleSpeed = 0

    for (let i = 0; i < _.apples.length; i++) {
        if (pos.x / _.snakeSize === _.apples[i].x && pos.y / _.snakeSize === _.apples[i].y) {
            _.applePoints = _.apples[i].points
            _.appleSpeed = _.apples[i].speed
            _.apples.splice(i, 1)
            _.appleEaten = true

            break
        }
    }
}

export {Apple}