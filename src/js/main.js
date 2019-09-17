// This is due to image flickering
let appleImg = new Image()
let rottenAppleImg = new Image()
let goodAppleImg = new Image()
let betterAppleImg = new Image()
let godAppleImg = new Image()
let trophyCup = new Image()

appleImg.src = "../media/apple.png";
rottenAppleImg.src = "../media/rotten_apple.png";
goodAppleImg.src = "../media/apple_green.png";
betterAppleImg.src = "../media/apple_yellow.png";
godAppleImg.src = "../media/apple_pink.png";
trophyCup.src = "../media/trophy_cup.png";

function Apple(ctx, appleSize, snakeSize, points, speed, img) {
    const _ = this;
    _.x = 20
    _.y = 16
    _.appleEaten = false
    _.points = points
    _.speed = speed
    _.appleSpeed = 0
    _.applePoints = 0
    _.ctx = ctx
    _.appleSize = appleSize
    _.snakeSize = snakeSize
    _.img = img
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
            img: _.img,
            points: _.points,
            speed: _.speed
        }
        _.apples.push(apple)
    }
}

Apple.prototype.drawApples = function () {
    const _ = this

    for (let i = 0; i < _.apples.length; i++) {
        const x = _.apples[i].x
        const y = _.apples[i].y

        const imgT = _.apples[i].img

        _.ctx.drawImage(imgT, _.snakeSize * x, _.snakeSize * y, _.appleSize + 8, _.appleSize + 8)

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

function Snake(canvas, ctx, size) {
    const _ = this
    _.speed = 250
    _.bodyParts = 5
    _.bodyPartsHolder = []
    _.direction = "up"
    _.gameOver = false

    _.initSnake = function () {
        for (let i = 0; i < _.bodyParts; i++) {
            _.bodyPartsHolder.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + size * i
            })
        }
        _.snakeListen()
    }

    _.drawSnake = function () {

        for (let i = 0; i < _.bodyParts; i++) {
            ctx.fillStyle = "#7AE582"
            const x = _.bodyPartsHolder[i].x
            const y = _.bodyPartsHolder[i].y


            if (_.direction === "up" || _.direction === "down") {
                ctx.fillRect(x + (size - (size - 2 - (i / 2))) / 2, y + (size - (size - 2 - (i / 2))) / 2, size - 2 - (i / 2), size - 2 - (i / 2))


            } else {
                ctx.fillRect(x + (size - (size - 2 - (i / 2))) / 2, y + (size - (size - 2 - (i / 2))) / 2, size - 2 - (i / 2), size - 2 - (i / 2))
            }

        }

        ctx.fillStyle = "black"

        ctx.beginPath();
        ctx.arc(_.bodyPartsHolder[0].x + (size / 2) - 5, _.bodyPartsHolder[0].y + (size / 2) - 4, 3, 0, 2 * Math.PI, false)
        ctx.fill()

        ctx.fillStyle = "black"
        ctx.beginPath();
        ctx.arc((_.bodyPartsHolder[0].x + size) - 8, _.bodyPartsHolder[0].y + (size / 2) - 4, 4, 0, 2 * Math.PI, false)

        ctx.fill()
    }


    _.snakeListen = function () {
        window.onkeydown = function (e) {

            switch (e.keyCode) {
                case 40:
                    if (_.direction !== "up") {
                        _.direction = "down"

                    }
                    break;
                case 38:
                    if (_.direction !== "down") {
                        _.direction = "up"
                    }
                    break;
                case 37:
                    if (_.direction !== "right") {
                        _.direction = "left"
                    }
                    break;
                case 39:
                    if (_.direction !== "left") {
                        _.direction = "right"
                    }
                    break;
            }
        }
    }

    _.updatePosition = function () {
        let prevX = _.bodyPartsHolder[0].x
        let prevY = _.bodyPartsHolder[0].y
        switch (_.direction) {
            case "up":
                _.bodyPartsHolder[0].y -= size
                break;
            case "down":
                _.bodyPartsHolder[0].y += size
                break;
            case "right":
                _.bodyPartsHolder[0].x += size
                break;
            case "left":
                _.bodyPartsHolder[0].x -= size
                break;
        }
        for (let i = 1; i < _.bodyParts; i++) {

            const tempX = _.bodyPartsHolder[i].x
            const tempY = _.bodyPartsHolder[i].y

            _.bodyPartsHolder[i].x = prevX
            _.bodyPartsHolder[i].y = prevY


            prevX = tempX
            prevY = tempY
        }
    }

    _.moveSnake = function () {

        _.updatePosition()
        _.drawSnake()
    }

    _.checkCollision = function (collisionX, collisionY) {
        const snakeHeadPosX = _.bodyPartsHolder[0].x
        const snakeHeadPosY = _.bodyPartsHolder[0].y

        if (snakeHeadPosX / size < collisionX / (2 * size) || snakeHeadPosY / size < collisionY / (2 * size) || (snakeHeadPosX + 1) / size > (canvas.width - (collisionX / 2)) / size || (snakeHeadPosY + 1) / size > (canvas.height - (collisionY / 2)) / size) {
            _.gameOver = true
            return
        }

        for (let i = 1; i < _.bodyParts; i++) {
            const snakePosX = _.bodyPartsHolder[i].x
            const snakePosY = _.bodyPartsHolder[i].y
            if (snakeHeadPosX === snakePosX && snakeHeadPosY === snakePosY) {
                _.gameOver = true
                break
            }
        }
    }


    _.grow = function () {
        _.bodyParts++

        _.bodyPartsHolder.push({
            x: _.bodyPartsHolder[_.bodyParts - 1],
            y: _.bodyPartsHolder[_.bodyParts - 1]
        })
    }
}

function Game() {
    const _ = this

    _.canvas = document.getElementById("game");

    _.canvasWidth = _.canvas.width
    _.canvasHeight = _.canvas.height

    _.fieldWidth = _.canvasWidth - 100
    _.fieldHeight = _.canvasHeight - 100

    _.status = "info"
    _.totalPoints = 0;
    _.contWidthGameOver = 300
    _.contHeightGameOver = 250
    _.delayAppleAppear = 2000
    _.appleSize = 17
    _.snakeSize = 25
    _.fields = []
    _.randomAppleInterv
    _.moveSnakeInterv
    _.endGame = false
    if (_.canvas.getContext) {
        _.ctx = _.canvas.getContext("2d");
    } else {
        return
    }

    _.startGameListen = function (e) {
        if (e.keyCode === 13) {
            _.status = "startGame"
            _.checkStatus()
        }
        window.removeEventListener("keypress", _.startGameListen)
    }
}

Game.prototype.setFields = function (snakeBodyHolder) {
    const _ = this

    _.fields = []

    const maxFieldsRow = _.fieldWidth / _.snakeSize
    const maxFieldsColumn = _.fieldHeight / _.snakeSize

    const startX = ((_.canvasWidth - _.fieldWidth) / 2) / _.snakeSize
    const startY = ((_.canvasHeight - _.fieldHeight) / 2) / _.snakeSize

    for (let x = startX; x < maxFieldsRow + startX; x++) {
        for (let y = startY; y < maxFieldsColumn + startY; y++) {
            if (!(snakeBodyHolder.some(el => el.x === x * _.snakeSize && el.y === y * _.snakeSize))) {
                const field = {
                    x: x,
                    y: y
                }

                _.fields.push(field)
            }
        }
    }

}

Game.prototype.drawBackground = function () {
    const _ = this

    _.ctx.beginPath()
    _.ctx.strokeStyle = "#9FFFCB"

    let lineWidth = 50
    _.ctx.lineWidth = lineWidth
    _.ctx.moveTo(0, lineWidth / 2)
    _.ctx.lineTo(_.canvasWidth, lineWidth / 2)

    _.ctx.moveTo(0, _.canvasHeight - lineWidth / 2)
    _.ctx.lineTo(_.canvasWidth, _.canvasHeight - lineWidth / 2)
    _.ctx.stroke()
    _.ctx.closePath()


    _.ctx.beginPath()

    lineWidth = (_.canvasWidth - _.fieldWidth) / 2;
    _.ctx.lineWidth = lineWidth

    _.ctx.moveTo(_.canvasWidth - lineWidth / 2, 0)
    _.ctx.lineTo(_.canvasWidth - lineWidth / 2, _.canvasHeight)

    _.ctx.moveTo(lineWidth / 2, 0)
    _.ctx.lineTo(lineWidth / 2, _.canvasHeight)

    _.ctx.stroke()



    _.ctx.closePath()

    _.ctx.strokeStyle = "#004E64"
    _.ctx.lineWidth = 6
    _.ctx.strokeRect((_.canvasWidth - _.fieldWidth) / 2 - _.ctx.lineWidth / 2, (_.canvasHeight - _.fieldHeight) / 2 - _.ctx.lineWidth / 2, _.fieldWidth + _.ctx.lineWidth, _.fieldHeight + _.ctx.lineWidth);


    _.ctx.fillStyle = "#00A5CF"
    _.ctx.font = "30px Roboto"
    _.ctx.fillText(`Points: ${_.totalPoints}`, 100, 30)

    trophyCup.onload = function () {
        _.ctx.drawImage(trophyCup, 250, -4, 50, 50)
        _.ctx.drawImage(trophyCup, 380, -4, 50, 50)
    }
    _.ctx.drawImage(trophyCup, 250, -4, 50, 50)
    _.ctx.fillText(`${_.bestScore}`, 305, 30)

    _.ctx.drawImage(trophyCup, 380, -4, 50, 50)
    _.ctx.fillText(`${_.bestTime}s`, 435, 30)
}

Game.prototype.getHighestScore = function () {
    const _ = this;

    if (window.localStorage.getItem("scores")) {
        _.bestScore = JSON.parse(window.localStorage.getItem("scores")).points
        _.bestTime = JSON.parse(window.localStorage.getItem("scores")).time
    } else {
        _.bestScore = 0
        _.bestTime = 0
    }
}

Game.prototype.setHighestScore = function () {
    const _ = this;

    if (window.localStorage) {

        const storagePoints = window.localStorage.getItem("scores") ? JSON.parse(window.localStorage.getItem("scores")).points : 0
        const storageTime = window.localStorage.getItem("scores") ? JSON.parse(window.localStorage.getItem("scores")).time : 0


        let points = storagePoints < _.totalPoints ? _.totalPoints : storagePoints
        let time = storageTime < _.timeSpent ? _.timeSpent : storageTime

        const score = {
            points,
            time,
        }

        window.localStorage.setItem("scores", JSON.stringify(score))
    }
}



Game.prototype.drawField = function () {
    const _ = this

    _.ctx.fillStyle = "#41B864";
    _.ctx.fillRect((_.canvasWidth - _.fieldWidth) / 2, (_.canvasHeight - _.fieldHeight) / 2, _.fieldWidth, _.fieldHeight);
}


Game.prototype.draw = function () {
    const _ = this


    const step = function () {
        _.drawField()
        _.snake.drawSnake()
        _.apple.drawApples()
        _.drawBackground()
        _.drawID = requestAnimationFrame(step)
    }
    step()
}

Game.prototype.shrinkCanv = function () {
    const _ = this

    const fieldWidth = _.fieldWidth

    const step = function () {

        if (_.fieldWidth === fieldWidth - 200 && _.contWidthGameOver + 50 <= fieldWidth - 200) {

            _.fieldWidth = fieldWidth - 200
        } else if (_.status === "startGame" && _.contWidthGameOver + 50 <= _.fieldWidth - 10) {
            _.fieldWidth -= 10
            cancelAnimationFrame(_.drawID)
            _.draw()
            requestAnimationFrame(step)
        }
    }
    step()
}


Game.prototype.startGame = function () {
    const _ = this

    _.canvas.width = _.canvasWidth
    _.canvas.height = _.canvasHeight

    _.getHighestScore()

    _.fieldWidth = _.canvasWidth - 100
    _.fieldHeight = _.canvasHeight - 100
    _.totalPoints = 0

    Apple.prototype.apples = []
    clearTimeout(_.moveTimeout)
    clearInterval(_.randomAppleInterv)

    _.timeStart = new Date()
    _.timeStartSec = _.timeStart.getTime() / 1000

    _.drawField()


    _.snake = new Snake(_.canvas, _.ctx, _.snakeSize)
    _.snake.initSnake()

    _.setFields(_.snake.bodyPartsHolder)
    _.drawBackground()


    _.apple = new Apple(_.ctx, _.appleSize, _.snakeSize, 50, 10, appleImg)

    _.goodApple = new Apple(_.ctx, _.appleSize, _.snakeSize, 25, -10, goodAppleImg)

    _.rottenApple = new Apple(_.ctx, _.appleSize, _.snakeSize, -200, -50, rottenAppleImg)

    _.betterApple = new Apple(_.ctx, _.appleSize, _.snakeSize, 70, 5, betterAppleImg)

    _.godApple = new Apple(_.ctx, _.appleSize, _.snakeSize, 175, -30, godAppleImg)


    _.apple.randomize(_.fields)



    _.randomAppleInterv = setInterval(() => {
        if (Apple.prototype.apples.length < 5) {

            _.setFields(_.snake.bodyPartsHolder)

            let num = 0

            if (_.totalPoints >= 150) num = Math.random() * 100

            if (_.totalPoints <= 150 || num < 60) _.apple.randomize(_.fields)

            else if (_.totalPoints >= 150 && num < 75) _.rottenApple.randomize(_.fields)

            else if (_.totalPoints >= 200 && num < 85) _.goodApple.randomize(_.fields)

            else if (_.totalPoints >= 375 && num < 95) _.betterApple.randomize(_.fields)

            else if (_.totalPoints >= 575 && num < 100) _.godApple.randomize(_.fields)

            else _.apple.randomize(_.fields)

            cancelAnimationFrame(_.drawID)

        } else if (_.apple.apples.length === 5 && _.fieldWidth >= _.contWidthGameOver + 50) {
            Apple.prototype.apples = []
            _.snake.speed = _.snake.speed - 75 > 15 ? _.snake.speed - 75 : 15
            _.totalPoints = _.totalPoints - 100 > 0 ? _.totalPoints - 100 : 0
            _.draw()
            _.shrinkCanv()

        }
    }, _.delayAppleAppear)

    _.moveSnakeInterv = function () {

        if (_.snake.gameOver) {
            _.status = "gameOver"
            _.checkStatus()
        } else {
            _.drawField()
            _.apple.drawApples()

            _.snake.moveSnake()

            _.snake.checkCollision(_.canvasWidth - _.fieldWidth, _.canvasHeight - _.fieldHeight)

            _.apple.checkEatenApple(_.snake.bodyPartsHolder[0])
            if (_.apple.appleEaten) {
                _.snake.grow()
                _.totalPoints = _.totalPoints + _.apple.applePoints >= 0 ? _.totalPoints + _.apple.applePoints : 0
                if (_.snake.speed >= 70) {

                    _.snake.speed = _.snake.speed - _.apple.appleSpeed > 70 ? _.snake.speed - _.apple.appleSpeed : 70

                }
            }
            _.moveTimeout = setTimeout(() => {
                requestAnimationFrame(_.moveSnakeInterv)

            }, _.snake.speed)

            _.drawBackground()
        }
    }

    _.moveSnakeInterv()
}

Game.prototype.sendScore = function () {

}

Game.prototype.gameOver = function () {
    const _ = this

    _.timeEnd = new Date()
    _.timeEndSec = _.timeEnd.getTime() / 1000

    _.timeSpent = Math.round((_.timeEndSec - _.timeStartSec) * 100) / 100

    const infoHeaderPosX = _.contWidthGameOver / 2.5
    const pointsPosY = _.contWidthGameOver / 8
    const infoPosYDiff = 28

    clearInterval(_.randomAppleInterv)
    cancelAnimationFrame(_.drawID)

    _.drawField()
    _.apple.drawApples()
    _.snake.drawSnake()

    _.setHighestScore()
    _.getHighestScore()

    _.drawBackground()

    _.ctx.fillStyle = "#DAD2D8"
    _.ctx.fillRect((_.canvas.width / 2) - _.contWidthGameOver / 2, (_.canvas.height / 2) - _.contHeightGameOver / 2, _.contWidthGameOver, _.contHeightGameOver);


    _.ctx.strokeStyle = "#0F8B8D"
    _.ctx.lineWidth = 3
    _.ctx.strokeRect((_.canvas.width / 2) - _.contWidthGameOver / 2, (_.canvas.height / 2) - _.contHeightGameOver / 2, _.contWidthGameOver, _.contHeightGameOver);
    _.ctx.font = "40px Roboto"
    _.ctx.fillStyle = "black"
    _.ctx.fillText("Game Over!", (_.canvas.width / 2) - 80, (_.canvas.height / 2) - _.contHeightGameOver / 2 + 40, 165)

    _.ctx.font = "25px Roboto"
    _.ctx.fillText(`Your points: ${_.totalPoints}`, (_.canvas.width / 2) - infoHeaderPosX, (_.canvas.height / 2) - pointsPosY)
    _.ctx.fillText(`Your time: ${_.timeSpent}s`, (_.canvas.width / 2) - infoHeaderPosX, (_.canvas.height / 2) - pointsPosY + infoPosYDiff)


    _.ctx.lineWidth = 3
    _.ctx.strokeRect((_.canvas.width / 2) - _.contWidthGameOver / 2, (_.canvas.height / 2) + _.contHeightGameOver / 4, _.contWidthGameOver, _.contHeightGameOver / 4);
    _.ctx.font = "30px Roboto"
    _.ctx.fillText("Restart Game ( Enter )", (_.canvas.width / 2) - 125, (_.canvas.height / 2) + _.contHeightGameOver / 2 - _.contHeightGameOver / 8 + 30 / 4, 250)



    window.addEventListener("keypress",
        _.startGameListen
    )
}

Game.prototype.info = function () {
    const _ = this

    const contWidth = 400
    const contHeight = 300
    const infoHeaderPosX = 175
    const controlPosY = 70
    const infoPosX = 150
    const infoPosYDiff = 23


    _.getHighestScore()
    _.drawField()
    _.drawBackground()

    _.ctx.fillStyle = "#DAD2D8"
    _.ctx.fillRect((_.canvas.width / 2) - contWidth / 2, (_.canvas.height / 2) - contHeight / 2, contWidth, contHeight);


    _.ctx.strokeStyle = "#0F8B8D"
    _.ctx.lineWidth = 3
    _.ctx.strokeRect((_.canvas.width / 2) - contWidth / 2, (_.canvas.height / 2) - contHeight / 2, contWidth, contHeight);
    _.ctx.font = "40px Roboto"
    _.ctx.fillStyle = "black"
    _.ctx.fillText("Snake!!!", (_.canvas.width / 2) - 65, (_.canvas.height / 2) - 110, 130)

    _.ctx.font = "25px Roboto"
    _.ctx.fillText("Control:", (_.canvas.width / 2) - infoHeaderPosX, (_.canvas.height / 2) - controlPosY)

    _.ctx.fillText("Instructions:", (_.canvas.width / 2) - infoHeaderPosX, (_.canvas.height / 2) - controlPosY + infoPosYDiff * 2)


    _.ctx.font = "18px Roboto"
    _.ctx.fillText("- Arrows on keyboard", (_.canvas.width / 2) - infoPosX, (_.canvas.height / 2) - controlPosY + infoPosYDiff)

    _.ctx.fillText("- For every apple you will get points", (_.canvas.width / 2) - infoPosX, (_.canvas.height / 2) - controlPosY + infoPosYDiff * 3)
    _.ctx.fillText(`- Apple will appear in every ${_.delayAppleAppear/1000}s`, (_.canvas.width / 2) - infoPosX, (_.canvas.height / 2) - controlPosY + infoPosYDiff * 4)
    _.ctx.fillText("- After you will reach certain amount of points,", (_.canvas.width / 2) - infoPosX, (_.canvas.height / 2) - controlPosY + infoPosYDiff * 5)
    _.ctx.fillText("      the new kinds of apple will appear", (_.canvas.width / 2) - infoPosX, (_.canvas.height / 2) - controlPosY + infoPosYDiff * 6)

    _.ctx.lineWidth = 3
    _.ctx.strokeRect((_.canvas.width / 2) - contWidth / 2, (_.canvas.height / 2) + 80, contWidth, 70);
    _.ctx.font = "30px Roboto"

    _.ctx.fillText("Start Game ( Enter )", (_.canvas.width / 2) - 115, (_.canvas.height / 2) + 122.5, 230)

    window.addEventListener("keypress",
        _.startGameListen
    )
}

Game.prototype.checkStatus = function () {
    const _ = this
    if (_.status === "startGame") {
        _.startGame()
    } else if (_.status === "gameOver") {
        _.gameOver()
    } else if (_.status === "info") {
        _.info()
    }
}

const game = new Game()

game.checkStatus()