"use strict";

let zoomOrigin = null;
let panOrigin = null;
let currentScale = 1;
let runningInterval = null;
const panSpeed = { x: 0, y: 0 };

function createInitialMouse(e) {
    return {
        clientX: e.clientX,
        clientY: e.clientY,
        pageUnscaledX: e.pageX / currentScale,
        pageUnscaledY: e.pageY / currentScale
    };
}

function zoom(mouseEvent) {
    if (!mouseEvent.altKey || !mouseEvent.ctrlKey) {
        zoomOrigin = null;
        return;
    }

    if (!zoomOrigin) {
        zoomOrigin = createInitialMouse(mouseEvent);
    }

    currentScale = Math.max(1, currentScale - mouseEvent.movementY / 100);
    document.documentElement.style.transformOrigin = '0 0';
    document.documentElement.style.transform = `scale(${currentScale})`;
    window.scrollTo(zoomOrigin.pageUnscaledX * currentScale - zoomOrigin.clientX, zoomOrigin.pageUnscaledY * currentScale - zoomOrigin.clientY);
}

function pan(mouseEvent) {
    if (!mouseEvent.altKey || !mouseEvent.shiftKey) {
        panOrigin = null;
        if (runningInterval) {
            clearInterval(runningInterval);
            runningInterval = null;
        }
        return;
    }

    if (!panOrigin) {
        panOrigin = createInitialMouse(mouseEvent);
        return;
    }

    panSpeed.x = (mouseEvent.clientX - panOrigin.clientX) / 6;
    panSpeed.y = (mouseEvent.clientY - panOrigin.clientY) / 6;
    if (!runningInterval) {
        runningInterval = setInterval(() => {
            if (panOrigin) {
                window.scrollBy(panSpeed.x, panSpeed.y);
            }
            else if (runningInterval) {
                clearInterval(runningInterval);
            }
        }, 25);
    }
}

function stopPanningOnKeyup(keyupEvent) {
    if (!keyupEvent.altKey || !keyupEvent.ctrlKey) {
        panOrigin = null;
        if (runningInterval) {
            clearInterval(runningInterval);
            runningInterval = null;
        }
    }
}

window.addEventListener('mousemove', zoom);
window.addEventListener('mousemove', pan);
window.addEventListener('keyup', stopPanningOnKeyup);
