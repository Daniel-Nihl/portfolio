function initParticles() {

    const effects = document.querySelector(
        ".portfolio-background__effects"
    );

    if (!effects) {
        return;
    }

    const root = document.documentElement;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    canvas.className = "portfolio-background__particles";
    effects.appendChild(canvas);

    const styles = getComputedStyle(root);

    const count = parseInt(
        styles.getPropertyValue("--particles-count"),
        10
    );

    const speed = parseFloat(
        styles.getPropertyValue("--particles-speed")
    );

    const directionX = parseFloat(
        styles.getPropertyValue("--particles-direction-x")
    );

    const directionY = parseFloat(
        styles.getPropertyValue("--particles-direction-y")
    );

    const minSize = parseFloat(
        styles.getPropertyValue("--particles-size-min")
    );

    const maxSize = parseFloat(
        styles.getPropertyValue("--particles-size-max")
    );

    const minOpacity = parseFloat(
        styles.getPropertyValue("--particles-opacity-min")
    );

    const maxOpacity = parseFloat(
        styles.getPropertyValue("--particles-opacity-max")
    );

    const color = styles
        .getPropertyValue("--particles-color")
        .trim();

    let width = 0;
    let height = 0;

    function resize() {

        width = effects.clientWidth;
        height = effects.clientHeight;

        canvas.width = width;
        canvas.height = height;

    }

    const particles = [];

    function createParticle() {

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size:
                minSize +
                Math.random() * (maxSize - minSize),
            opacity:
                minOpacity +
                Math.random() * (maxOpacity - minOpacity)
        };

    }

    function createParticles() {

        particles.length = 0;

        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }

    }

    function update() {

        for (const particle of particles) {

            particle.x += directionX * speed;
            particle.y += directionY * speed;

            if (particle.x > width) {
                particle.x = 0;
            }

            if (particle.x < 0) {
                particle.x = width;
            }

            if (particle.y > height) {
                particle.y = 0;
            }

            if (particle.y < 0) {
                particle.y = height;
            }

        }

    }

    function draw() {

        context.clearRect(
            0,
            0,
            width,
            height
        );

        for (const particle of particles) {

            context.beginPath();

            context.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            context.fillStyle =
                `rgba(${color}, ${particle.opacity})`;

            context.fill();

        }

    }

    function animate() {

        update();
        draw();

        requestAnimationFrame(animate);

    }

    resize();
    createParticles();
    animate();

    window.addEventListener(
        "resize",
        () => {
            resize();
            createParticles();
        }
    );
}