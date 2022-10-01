class EpicScroll {

    constructor() {

        document.body.style.overflow = 'hidden';

        this.animations = [];

        window.addEventListener('wheel', (e) => {
            if (!e.ctrlKey) {
                if (e.deltaMode == 0) {
                    this.scroll(e.deltaY, e);
                } else if (e.deltaMode == 1) {
                    this.scroll(e.deltaY * this.getScrollLineHeight(), e);
                }
            }
        });
    }

    addAnimation({ startY = 0, distance = 0, blockScroll = false, scrollSpeed = 1, callback = () => { } }) {
        this.animations.push({
            startY: startY,
            distance: distance,
            virtualY: 0,
            blockScroll: blockScroll,
            scrollSpeed: scrollSpeed,
            callback: callback
        });
    }


    yPos() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    scroll(pixels, event) {

        let direction;
        if (pixels > 0) {
            direction = 'down';
        } else {
            direction = 'up';
        }

        let handled = false;

        this.animations.forEach((animation) => {

            let startPosUp;
            if (animation.blockScroll) {
                startPosUp = animation.startY;
            } else {
                startPosUp = animation.startY + animation.distance;
            }

            if (direction == 'down' && this.yPos() > animation.startY && animation.virtualY < animation.distance) {

                handled = true;
                pixels = pixels * animation.scrollSpeed;

                let pixelsMoved = Math.min(animation.distance - animation.virtualY, pixels);
                animation.virtualY += pixelsMoved;
                animation.callback({ pixelsMoved: pixelsMoved, progressPixels: animation.virtualY, progressPercentage: (animation.virtualY / animation.distance) * 100 });

                if (animation.blockScroll) {
                    window.scrollTo(0, this.yPos() + (pixels - pixelsMoved));
                } else {
                    window.scrollTo(0, this.yPos() + pixels);
                }
            }

            else if (direction == 'up' && this.yPos() < startPosUp && animation.virtualY > 0) {

                handled = true;
                pixels = pixels * animation.scrollSpeed;

                let pixelsMoved = Math.min(animation.virtualY, Math.abs(pixels));
                animation.virtualY -= pixelsMoved;
                animation.callback({ pixelsMoved: -pixelsMoved, progressPixels: animation.virtualY, progressPercentage: (animation.virtualY / animation.distance) * 100 });


                if (animation.blockScroll) {
                    window.scrollTo(0, this.yPos() + pixels + pixelsMoved);
                } else {
                    window.scrollTo(0, this.yPos() + pixels);
                }

            }

        });

        if (!handled) {
            window.scrollTo(0, this.yPos() + pixels);
        }

    }

    getScrollLineHeight() {
        const el = document.createElement('div');
        el.style.fontSize = 'initial';
        el.style.display = 'none';
        document.body.appendChild(el);
        const fontSize = window.getComputedStyle(el).fontSize;
        document.body.removeChild(el);
        return fontSize ? window.parseInt(fontSize) : undefined;
    }

}

export default EpicScroll