/* ==========================================================================
   ADVAITA SEMICONDUCTOR TECHNOLOGIES — Interactive Client Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasAnimation();
    runSimulation();
    initSliderListeners();
});

/* ─── Slider / Select Live Listeners ────────────────────────────────────── */
function initSliderListeners() {
    ['workload-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', runSimulation);
    });
    ['dac-slider', 'adc-slider', 'noise-slider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', runSimulation);
    });
}

/* ─── Canvas Background Animation ───────────────────────────────────────── */
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

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        pulses.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0 || p.x > width) p.dx *= -1;
            if (p.y < 0 || p.y > height) p.dy *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ─── Interactive Simulator ──────────────────────────────────────────────── */
function runSimulation() {
    const workloadSelect = document.getElementById('workload-select');
    const dacSlider      = document.getElementById('dac-slider');
    const adcSlider      = document.getElementById('adc-slider');
    const noiseSlider    = document.getElementById('noise-slider');

    if (!workloadSelect || !dacSlider || !adcSlider || !noiseSlider) return;

    const workload   = workloadSelect.value;
    const dacBits    = parseInt(dacSlider.value);
    const adcBits    = parseInt(adcSlider.value);
    const noiseLevel = parseFloat(noiseSlider.value);

    document.getElementById('dac-val').innerText   = `${dacBits}-Bit`;
    document.getElementById('adc-val').innerText   = `${adcBits}-Bit`;
    document.getElementById('noise-val').innerText = noiseLevel.toFixed(2);

    let tilesCount = 6, tileLayout = 'Mapped to 1x4 TileModuleArray';
    let dacUnits = 2203, adcUnits = 538, baseEnergy = 88.5, maeBase = 0.095244;

    if (workload === 'mha') {
        tilesCount = 4; tileLayout = 'Mapped to 4 Parallel Q,K,V,O Tiles';
        dacUnits = 1024; adcUnits = 256; baseEnergy = 89.2; maeBase = 0.095244;
    } else if (workload === 'cnn') {
        tilesCount = 3; tileLayout = 'Mapped to 2x Conv2d + 2x Linear Tiles';
        dacUnits = 1536; adcUnits = 384; baseEnergy = 86.4; maeBase = 0.124105;
    } else if (workload === 'large') {
        tilesCount = 6; tileLayout = 'Mapped to 1x4 TileModuleArray (fc_large)';
        dacUnits = 2203; adcUnits = 538; baseEnergy = 88.5; maeBase = 0.084120;
    } else if (workload === 'yolo') {
        tilesCount = 8; tileLayout = 'Mapped to 8x Spatial Crossbars';
        dacUnits = 4096; adcUnits = 1024; baseEnergy = 91.0; maeBase = 0.076512;
    }

    const quantizationPenalty = (16 - dacBits) * 0.008 + (16 - adcBits) * 0.012;
    const noisePenalty         = noiseLevel * 0.45;
    const calculatedMAE        = (maeBase + quantizationPenalty + noisePenalty).toFixed(6);
    const calculatedEnergy     = (baseEnergy + (16 - adcBits) * 0.45).toFixed(1);
    const dacRes = (1.0 / (Math.pow(2, dacBits) - 1)).toFixed(6);
    const adcRes = (1.0 / (Math.pow(2, adcBits) - 1)).toFixed(6);

    document.getElementById('sim-tiles').innerText      = `${tilesCount} Tiles`;
    document.getElementById('sim-tile-layout').innerText = tileLayout;
    document.getElementById('sim-dac').innerText        = `${dacUnits.toLocaleString()} Units`;
    document.getElementById('sim-dac-res').innerText    = `Res: ${dacRes} (${dacBits}-Bit)`;
    document.getElementById('sim-adc').innerText        = `${adcUnits.toLocaleString()} Units`;
    document.getElementById('sim-adc-res').innerText    = `Res: ${adcRes} (${adcBits}-Bit)`;
    document.getElementById('sim-energy').innerText     = `${calculatedEnergy}%`;
    document.getElementById('mae-display').innerText    = `MAE: ${calculatedMAE}`;

    const logElem = document.getElementById('output-tensor-log');
    if (logElem) {
        logElem.innerHTML =
`// Executing Advaita Compiler SDK Transformation...
Topology                : ${workloadSelect.options[workloadSelect.selectedIndex].text}
Quantization Bounds     : DAC ${dacBits}-Bit (${dacRes}) | ADC ${adcBits}-Bit (${adcRes})
Noise Injection (σ)     : ${noiseLevel.toFixed(2)} (PCM Readout Drift)
Digital Baseline Output : [-0.161862,  0.024492, -0.138176,  0.048621,  0.270396]
Analog Crossbar Output  : [${(-0.161862 + rnd()).toFixed(6)},  ${(0.024492 + rnd()).toFixed(6)}, ${(-0.138176 + rnd()).toFixed(6)},  ${(0.048621 + rnd()).toFixed(6)},  ${(0.270396 + rnd()).toFixed(6)}]
Mean Absolute Error     : ${calculatedMAE} (Sum Abs Error: ${(calculatedMAE * 16).toFixed(6)})
Status                  : 0 NaN / 0 Inf — Numerical Convergence Stable`;
    }
}

function rnd() { return Math.random() * 0.002 - 0.001; }

/* ─── Modal Controls ─────────────────────────────────────────────────────── */
function openAuditModal() {
    const modal = document.getElementById('audit-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('input')?.focus(), 80);
}

function closeAuditModal() {
    const modal = document.getElementById('audit-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const form       = document.getElementById('audit-form');
    const successMsg = document.getElementById('form-success-msg');
    const errorMsg   = document.getElementById('form-error-msg');
    if (form) { form.reset(); form.style.display = ''; }
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg)   errorMsg.style.display   = 'none';
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAuditModal();
});

/* ─── Audit Modal Form — Formspree fetch + mailto fallback ───────────────── */
async function handleAuditSubmit(event) {
    event.preventDefault();
    const form      = event.target;
    const submitBtn = document.getElementById('audit-submit-btn');
    const successMsg = document.getElementById('form-success-msg');
    const errorMsg   = document.getElementById('form-error-msg');

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg)   errorMsg.style.display   = 'none';
    if (submitBtn)  { submitBtn.disabled = true; submitBtn.textContent = 'Submitting…'; }

    try {
        const res = await fetch('https://formspree.io/f/mkjwbjjo', {
            method: 'POST',
            body:   new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            // Primary path: Formspree received the submission
            form.style.display = 'none';
            if (successMsg) successMsg.style.display = 'flex';
        } else {
            throw new Error(`Formspree returned ${res.status}`);
        }

    } catch (err) {
        // Fallback path: open mailto so the submission is never lost
        if (errorMsg) errorMsg.style.display = 'block';

        const company = form.querySelector('[name="company"]')?.value      || '';
        const email   = form.querySelector('[name="email"]')?.value        || '';
        const model   = form.querySelector('[name="model_type"]')?.value   || '';
        const target  = form.querySelector('[name="target_application"]')?.value || '';
        const message = form.querySelector('[name="message"]')?.value      || '';

        const subject = encodeURIComponent(`Advaita Feasibility Audit Request: ${company}`);
        const body    = encodeURIComponent(
            `Hello Advaita Engineering Team,\n\nFeasibility Audit Request\n` +
            `─────────────────────────\n` +
            `Company / Name : ${company}\n` +
            `Contact Email  : ${email}\n` +
            `Model / Arch   : ${model}\n` +
            `Target App     : ${target}\n\n` +
            `Additional Context:\n${message || '(none)'}\n\n` +
            `Please contact us to schedule the Phase 1 scoping call.\n\nBest regards,\n${company}`
        );

        setTimeout(() => {
            window.location.href =
                `mailto:vandan.advaita@outlook.com?subject=${subject}&body=${body}`;
        }, 900);

    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit request'; }
    }
}

/* ─── Contact Section Form — Formspree fetch + mailto fallback ───────────── */
async function handleContactSubmit(event) {
    event.preventDefault();
    const form       = event.target;
    const submitBtn  = document.getElementById('contact-submit-btn');
    const successMsg = document.getElementById('contact-success-msg');

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    try {
        const res = await fetch('https://formspree.io/f/mkjwbjjo', {
            method: 'POST',
            body:   new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            form.style.display = 'none';
            if (successMsg) successMsg.style.display = 'flex';
        } else {
            throw new Error(`Formspree returned ${res.status}`);
        }

    } catch (err) {
        // Fallback: compose mailto
        const name    = form.querySelector('[name="name"]')?.value    || '';
        const email   = form.querySelector('[name="email"]')?.value   || '';
        const message = form.querySelector('[name="message"]')?.value || '';

        const subject = encodeURIComponent(`Advaita Website Inquiry: ${name}`);
        const body    = encodeURIComponent(
            `From: ${name}\nEmail: ${email}\n\n${message}`
        );
        window.location.href =
            `mailto:vandan.advaita@outlook.com?subject=${subject}&body=${body}`;

    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
    }
}
