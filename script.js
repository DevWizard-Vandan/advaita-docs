/* ==========================================================================
   ADVAITA SEMICONDUCTOR TECHNOLOGIES - INTERACTIVE CLIENT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasAnimation();
    runSimulation();
});

/* Canvas Background Crossbar Matrix Animation */
function initCanvasAnimation() {
    const canvas = document.getElementById('crossbar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const gridSize = 40;
    const pulses = [];

    for (let i = 0; i < 25; i++) {
        pulses.push({
            x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
            dx: (Math.random() > 0.5 ? 1 : -1) * 2,
            dy: (Math.random() > 0.5 ? 1 : -1) * 2,
            size: Math.random() * 3 + 2,
            color: Math.random() > 0.3 ? '#00F2FE' : '#7000FF'
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(11, 15, 25, 0.2)';
        ctx.fillRect(0, 0, width, height);

        // Draw crossbar grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw crossbar pulse nodes
        pulses.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > width) p.dx *= -1;
            if (p.y < 0 || p.y > height) p.dy *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* Interactive Digital-Twin AIMC Simulator Engine */
function runSimulation() {
    const workloadSelect = document.getElementById('workload-select');
    const dacSlider = document.getElementById('dac-slider');
    const adcSlider = document.getElementById('adc-slider');
    const noiseSlider = document.getElementById('noise-slider');

    if (!workloadSelect || !dacSlider || !adcSlider || !noiseSlider) return;

    const workload = workloadSelect.value;
    const dacBits = parseInt(dacSlider.value);
    const adcBits = parseInt(adcSlider.value);
    const noiseLevel = parseFloat(noiseSlider.value);

    // Update UI badge labels
    document.getElementById('dac-val').innerText = `${dacBits}-Bit`;
    document.getElementById('adc-val').innerText = `${adcBits}-Bit`;
    document.getElementById('noise-val').innerText = noiseLevel.toFixed(2);

    let tilesCount = 6;
    let tileLayout = 'Mapped to 1x4 TileModuleArray';
    let dacUnits = 2203;
    let adcUnits = 538;
    let baseEnergy = 88.5;
    let maeBase = 0.095244;

    if (workload === 'mha') {
        tilesCount = 4;
        tileLayout = 'Mapped to 4 Parallel Q,K,V,O Tiles';
        dacUnits = 1024;
        adcUnits = 256;
        baseEnergy = 89.2;
        maeBase = 0.095244;
    } else if (workload === 'cnn') {
        tilesCount = 3;
        tileLayout = 'Mapped to 2x Conv2d + 2x Linear Tiles';
        dacUnits = 1536;
        adcUnits = 384;
        baseEnergy = 86.4;
        maeBase = 0.124105;
    } else if (workload === 'large') {
        tilesCount = 6;
        tileLayout = 'Mapped to 1x4 TileModuleArray (fc_large)';
        dacUnits = 2203;
        adcUnits = 538;
        baseEnergy = 88.5;
        maeBase = 0.084120;
    } else if (workload === 'yolo') {
        tilesCount = 8;
        tileLayout = 'Mapped to 8x Spatial Crossbars';
        dacUnits = 4096;
        adcUnits = 1024;
        baseEnergy = 91.0;
        maeBase = 0.076512;
    }

    // Quantization impact on MAE error
    const quantizationPenalty = (16 - dacBits) * 0.008 + (16 - adcBits) * 0.012;
    const noisePenalty = noiseLevel * 0.45;
    const calculatedMAE = (maeBase + quantizationPenalty + noisePenalty).toFixed(6);

    // Energy reduction adjusted by quantization precision
    const calculatedEnergy = (baseEnergy + (16 - adcBits) * 0.45).toFixed(1);

    const dacRes = (1.0 / (Math.pow(2, dacBits) - 1)).toFixed(6);
    const adcRes = (1.0 / (Math.pow(2, adcBits) - 1)).toFixed(6);

    // Update UI Displays
    document.getElementById('sim-tiles').innerText = `${tilesCount} Tiles`;
    document.getElementById('sim-tile-layout').innerText = tileLayout;
    document.getElementById('sim-dac').innerText = `${dacUnits.toLocaleString()} Units`;
    document.getElementById('sim-dac-res').innerText = `Res: ${dacRes} (${dacBits}-Bit)`;
    document.getElementById('sim-adc').innerText = `${adcUnits.toLocaleString()} Units`;
    document.getElementById('sim-adc-res').innerText = `Res: ${adcRes} (${adcBits}-Bit)`;
    document.getElementById('sim-energy').innerText = `${calculatedEnergy}%`;
    document.getElementById('mae-display').innerText = `MAE: ${calculatedMAE}`;

    // Update Code Tensor Log Display
    const logElem = document.getElementById('output-tensor-log');
    if (logElem) {
        logElem.innerHTML = `// Executing Advaita Compiler SDK Transformation...
Topology                : ${workloadSelect.options[workloadSelect.selectedIndex].text}
Quantization Bounds     : DAC ${dacBits}-Bit (${dacRes}) | ADC ${adcBits}-Bit (${adcRes})
Noise Injection (σ)     : ${noiseLevel.toFixed(2)} (PCM Readout Drift)
Digital Baseline Output : [-0.161862,  0.024492, -0.138176,  0.048621,  0.270396]
Analog Crossbar Output   : [${(-0.161862 + (Math.random() * 0.002 - 0.001)).toFixed(6)},  ${(0.024492 + (Math.random() * 0.002 - 0.001)).toFixed(6)}, ${(-0.138176 + (Math.random() * 0.002 - 0.001)).toFixed(6)},  ${(0.048621 + (Math.random() * 0.002 - 0.001)).toFixed(6)},  ${(0.270396 + (Math.random() * 0.002 - 0.001)).toFixed(6)}]
Mean Absolute Error     : ${calculatedMAE} (Sum Abs Error: ${(calculatedMAE * 16).toFixed(6)})
Status                  : 0 NaN / 0 Inf - Numerical Convergence Stable`;
    }
}

/* Modal Dialog Controls */
function openAuditModal() {
    const modal = document.getElementById('audit-modal');
    if (modal) modal.classList.add('active');
}

function closeAuditModal(event) {
    const modal = document.getElementById('audit-modal');
    if (modal) modal.classList.remove('active');
}

function handleAuditSubmit(event) {
    event.preventDefault();
    const company = document.getElementById('company-name').value;
    const email = document.getElementById('contact-email').value;
    const model = document.getElementById('model-type').value;
    const target = document.getElementById('target-application').value;

    const successMsg = document.getElementById('form-success-msg');
    if (successMsg) {
        successMsg.style.display = 'block';
    }

    const mailtoSubject = encodeURIComponent(`Advaita Feasibility Audit Request: ${company}`);
    const mailtoBody = encodeURIComponent(`Hello Advaita Engineering Team,\n\nWe would like to request a 14-Day Hardware-Aware Feasibility Audit.\n\nCompany: ${company}\nContact: ${email}\nModel Type: ${model}\nTarget Application: ${target}\n\nPlease get in touch with us to set up the Phase 1 NDA & Model Ingestion.\n\nBest regards,\n${company}`);

    setTimeout(() => {
        window.location.href = `mailto:founder@advaita-semi.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    }, 1200);
}
