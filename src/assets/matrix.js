var context, wi = window.innerWidth, hi = window.innerHeight, prev = performance.now(), chars = [], maxRunningChars = 400, fontSize = 20, alphaMask = 0.1, gridHorizontal, gridVertical;

function getRandomHexChar() {
    return "0123456789ABCDEF".charAt(Math.random() * 16);
}

function initCanvas(stage) {
    stage.width = wi;
    stage.height = hi;
    gridHorizontal = Math.floor(wi / (fontSize - 6));
    gridVertical = Math.floor(hi / fontSize);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, wi, hi);
}

function initChar() {
    return {
        x: Math.floor(Math.random() * gridHorizontal),
        y: 0,
        tickTime: Math.random() * 50 + 50,
        lastTick: performance.now(),
        char: getRandomHexChar()
    };
}

function addBrightness(rgb, brightness) {
    var multiplier = (100 + brightness) / 100;
    return {
        r: rgb.r * multiplier,
        g: rgb.g * multiplier,
        b: rgb.b * multiplier
    };
}

function render(time) {
    if (time - prev > 50) {
        context.fillStyle = "rgba(0,0,0," + alphaMask + ")";
        context.fillRect(0, 0, wi, hi);
        prev = time;
    }

    context.font = 'bold 20px Consolas';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (var i = 0, iOut = 0; i < chars.length; i++) {
        var c = chars[i];

        if (c.y < gridVertical) {
            chars[iOut++] = c;
            var color = addBrightness({ r: 100, g: 200, b: 100 }, Math.random() * 70);
            context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            context.fillText(c.char, c.x * (fontSize - 6), c.y * fontSize);

            if (time - c.lastTick > c.tickTime) {
                c.y++;
                c.lastTick = time;
                c.char = getRandomHexChar();
            }
        }
    }
    chars.length = iOut;

    var newChars = 0;
    while (chars.length < maxRunningChars && newChars < 3) {
        chars.push(initChar());
        newChars++;
    }

    requestAnimationFrame(render);
}

function startCanvasDraw() {
    var stage = document.getElementById("mainStage");

    if (stage.getContext) {
        context = stage.getContext("2d");
    } else {
        alert("Browser not able to render 2D canvas");
        return;
    }

    initCanvas(stage);

    function handleResize() {
        wi = window.innerWidth;
        hi = window.innerHeight;
        stage.width = wi;
        stage.height = hi;
        gridHorizontal = Math.floor(wi / (fontSize - 6));
        gridVertical = Math.floor(hi / fontSize);
        chars.length = 0;

        initCanvas(stage);
    }

    window.addEventListener('resize', handleResize);
    requestAnimationFrame(render);
}
