
const canvasArea = document.getElementById('canvasArea');
const fontSelect = document.getElementById('fontSelect');
const fontSize = document.getElementById('fontSize');
const colorPicker = document.getElementById('colorPicker');
const addTextBtn = document.getElementById('addTextBtn');

let activeElement = null;

addTextBtn.addEventListener('click', createNewText);

function createNewText() {
    const textElement = document.createElement('div');
    textElement.className = 'text-element';
    textElement.innerHTML = `
        <div class="text-content" contenteditable="true">New Text</div>
        <div class="resize-handle"></div>
        <div class="rotate-handle"></div>
    `;
    textElement.style.left = `${Math.random() * (canvasArea.clientWidth - 100)}px`;
    textElement.style.top = `${Math.random() * (canvasArea.clientHeight - 50)}px`;
    
    const textContent = textElement.querySelector('.text-content');
    updateTextStyle(textContent);

    canvasArea.appendChild(textElement);
    makeElementDraggable(textElement);
    makeElementResizable(textElement);
    makeElementRotatable(textElement);
    
    textContent.focus();
    selectTextElement(textElement);
}

function makeElementDraggable(element) {
    let isDragging = false;
    let startX, startY;

    element.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        if (e.target.className === 'text-content') {
            isDragging = true;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            selectTextElement(element);
        }
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        element.style.left = `${e.clientX - startX}px`;
        element.style.top = `${e.clientY - startY}px`;
    }

    function stopDragging() {
        isDragging = false;
    }
}

function makeElementResizable(element) {
    const resizeHandle = element.querySelector('.resize-handle');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', startResizing);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    function startResizing(e) {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        selectTextElement(element);
        e.stopPropagation();
    }

    function resize(e) {
        if (!isResizing) return;
        e.preventDefault();
        const width = startWidth + e.clientX - startX;
        const height = startHeight + e.clientY - startY;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
    }

    function stopResizing() {
        isResizing = false;
    }
}

function makeElementRotatable(element) {
    const rotateHandle = element.querySelector('.rotate-handle');
    let isRotating = false;
    let startAngle = 0;

    rotateHandle.addEventListener('mousedown', startRotating);
    document.addEventListener('mousemove', rotate);
    document.addEventListener('mouseup', stopRotating);

    function startRotating(e) {
        isRotating = true;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        selectTextElement(element);
        e.stopPropagation();
    }

    function rotate(e) {
        if (!isRotating) return;
        e.preventDefault();
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const rotation = angle - startAngle;
        element.style.transform = `rotate(${rotation}rad)`;
    }

    function stopRotating() {
        isRotating = false;
    }
}

function selectTextElement(element) {
    if (activeElement) {
        deselectTextElement(activeElement);
    }
    activeElement = element;
    activeElement.style.boxShadow = '0 0 0 2px #007bff';
    updateControlValues(element.querySelector('.text-content'));
}

function deselectTextElement(element) {
    element.style.boxShadow = 'none';
}

function updateControlValues(textContent) {
    fontSelect.value = textContent.style.fontFamily.replace(/['"]+/g, '') || 'Arial';
    fontSize.value = parseInt(textContent.style.fontSize) || 16;
    colorPicker.value = rgb2hex(textContent.style.color) || '#000000';
}

function rgb2hex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
}

canvasArea.addEventListener('click', (e) => {
    if (e.target === canvasArea) {
        if (activeElement) {
            deselectTextElement(activeElement);
            activeElement = null;
        }
    }
});

fontSelect.addEventListener('change', updateActiveElementStyle);
fontSize.addEventListener('input', updateActiveElementStyle);
colorPicker.addEventListener('input', updateActiveElementStyle);

function updateActiveElementStyle() {
    if (activeElement) {
        const textContent = activeElement.querySelector('.text-content');
        updateTextStyle(textContent);
    }
}

function updateTextStyle(textContent) {
    textContent.style.fontFamily = fontSelect.value;
    textContent.style.fontSize = `${fontSize.value}px`;
    textContent.style.color = colorPicker.value;
}
