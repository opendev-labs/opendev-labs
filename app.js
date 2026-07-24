// OpenDev Labs - Shadcn UI 3D Engine & Interactive Core
//----------------------------------------------------------------- BASIC Parameters
var container = document.getElementById('canvas-container');
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
}

if (container) {
  container.appendChild(renderer.domElement);
} else {
  document.body.appendChild(renderer.domElement);
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 2, 14);

var scene = new THREE.Scene();
var city = new THREE.Object3D();
var smoke = new THREE.Object3D();
var town = new THREE.Object3D();

var createCarPos = true;
var uSpeed = parseFloat(localStorage.getItem('opendev_speed')) || 0.001;
var isWireframe = localStorage.getItem('opendev_wireframe') === 'true';

//----------------------------------------------------------------- FOG & Theme Setup
var savedTheme = localStorage.getItem('opendev_theme') || 'red';
var themeHexMap = {
  red: 0xF02050,
  cyan: 0x00F2FE,
  purple: 0x7928CA,
  green: 0x00FF88,
  gold: 0xFF9900
};
var currentThemeColor = themeHexMap[savedTheme] || 0xF02050;

scene.background = new THREE.Color(currentThemeColor);
scene.fog = new THREE.Fog(currentThemeColor, 10, 16);

function mathRandom(num = 8) {
  var numValue = - Math.random() * num + Math.random() * num;
  return numValue;
}

var setTintNum = true;
function setTintColor() {
  if (setTintNum) {
    setTintNum = false;
    var setColor = 0x000000;
  } else {
    setTintNum = true;
    var setColor = 0x000000;
  }
  return setColor;
}

var buildingMeshes = [];

function init() {
  var segments = 2;
  var BoxGeo = THREE.BoxGeometry || THREE.CubeGeometry;

  for (var i = 1; i < 100; i++) {
    var geometry = new BoxGeo(1, 1, 1, segments, segments, segments);
    var material = new THREE.MeshStandardMaterial({
      color: setTintColor(),
      wireframe: isWireframe,
      roughness: 0.4,
      metalness: 0.8,
      side: THREE.DoubleSide
    });

    var wmaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide
    });

    var cube = new THREE.Mesh(geometry, material);
    var wire = new THREE.Mesh(geometry, wmaterial);
    var floor = new THREE.Mesh(geometry, material);

    cube.add(wire);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1 + Math.abs(mathRandom(8));

    floor.scale.y = 0.05;
    cube.scale.y = 0.1 + Math.abs(mathRandom(8));

    var cubeWidth = 0.9;
    cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
    cube.position.x = Math.round(mathRandom());
    cube.position.z = Math.round(mathRandom());

    floor.position.set(cube.position.x, 0, cube.position.z);

    town.add(floor);
    town.add(cube);
    buildingMeshes.push(cube);
  }

  var gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
  var gparticular = new THREE.CircleGeometry(0.01, 3);
  var aparticular = 5;

  for (var h = 1; h < 300; h++) {
    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
    particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particular);
  }

  var pmaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    roughness: 10,
    metalness: 0.6,
    opacity: 0.9,
    transparent: true
  });
  var pgeometry = new THREE.PlaneGeometry(60, 60);
  var pelement = new THREE.Mesh(pgeometry, pmaterial);
  pelement.rotation.x = -90 * Math.PI / 180;
  pelement.position.y = -0.001;
  pelement.receiveShadow = true;

  city.add(pelement);
}

var mouse = new THREE.Vector2();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);

var ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
var lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 4096;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);

smoke.position.y = 2;

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

var gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
city.add(gridHelper);

var carElements = [];

var createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) {
  var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
  var BoxGeo = THREE.BoxGeometry || THREE.CubeGeometry;
  var cGeo = new BoxGeo(1, cScale / 40, cScale / 40);
  var cElem = new THREE.Mesh(cGeo, cMat);
  var cAmp = 3;

  var targetPos = {};
  var duration = 3 + Math.random() * 2;

  if (createCarPos) {
    createCarPos = false;
    cElem.position.x = -cPos;
    cElem.position.z = mathRandom(cAmp);
    targetPos = { x: cPos };
  } else {
    createCarPos = true;
    cElem.position.x = mathRandom(cAmp);
    cElem.position.z = -cPos;
    cElem.rotation.y = 90 * Math.PI / 180;
    targetPos = { z: cPos };
  }

  cElem.receiveShadow = true;
  cElem.castShadow = true;
  cElem.position.y = Math.abs(mathRandom(5));
  city.add(cElem);

  if (window.gsap) {
    if (targetPos.x !== undefined) {
      gsap.to(cElem.position, { x: cPos, duration: duration, repeat: -1, yoyo: true, delay: Math.random() * 2, ease: "power1.inOut" });
    } else {
      gsap.to(cElem.position, { z: cPos, duration: duration, repeat: -1, yoyo: true, delay: Math.random() * 2, ease: "power1.inOut" });
    }
  }
};

var generateLines = function () {
  for (var i = 0; i < 60; i++) {
    createCars(0.1, 20);
  }
};

var cameraSet = function () {
  createCars(0.15, 20, 0xFFFFFF);
  if (window.gsap) {
    gsap.to(camera.position, {
      y: 1 + Math.random() * 5,
      z: 10 + Math.random() * 8,
      duration: 1.2,
      ease: "expo.out"
    });
  } else {
    camera.position.y = 1 + Math.random() * 4;
  }
};

var animate = function () {
  requestAnimationFrame(animate);

  city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
  city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed;

  if (city.rotation.x < -0.05) city.rotation.x = -0.05;
  else if (city.rotation.x > 1) city.rotation.x = 1;

  smoke.rotation.y += 0.01;
  smoke.rotation.x += 0.01;

  camera.lookAt(city.position);
  renderer.render(scene, camera);
};

generateLines();
init();
animate();

function setTheme(colorName) {
  var colorHex = themeHexMap[colorName] || 0xF02050;
  currentThemeColor = colorHex;
  localStorage.setItem('opendev_theme', colorName);

  if (window.gsap) {
    var c = new THREE.Color(colorHex);
    gsap.to(scene.background, { r: c.r, g: c.g, b: c.b, duration: 0.8 });
    gsap.to(scene.fog.color, { r: c.r, g: c.g, b: c.b, duration: 0.8 });
  } else {
    scene.background = new THREE.Color(colorHex);
    scene.fog.color = new THREE.Color(colorHex);
  }

  var dots = document.querySelectorAll('.theme-dot');
  dots.forEach(d => d.classList.remove('active'));
  var selected = document.querySelectorAll(`.theme-dot[onclick*="${colorName}"]`);
  selected.forEach(s => s.classList.add('active'));

  appendConsole(`[SYSTEM]: Fog theme changed to '${colorName.toUpperCase()}' (${colorHex.toString(16)})`);
}

function toggleWireframe() {
  isWireframe = !isWireframe;
  localStorage.setItem('opendev_wireframe', isWireframe);

  var switches = document.querySelectorAll('.toggle-switch');
  switches.forEach(sw => sw.classList.toggle('active', isWireframe));

  buildingMeshes.forEach(mesh => {
    mesh.material.wireframe = isWireframe;
  });

  appendConsole(`[SYSTEM]: Wireframe matrix: ${isWireframe ? 'ENABLED' : 'DISABLED'}`);
}

function setCameraPreset(preset) {
  if (!window.gsap) return;
  if (preset === 'top') {
    gsap.to(camera.position, { x: 0, y: 22, z: 2, duration: 1.5, ease: "power2.inOut" });
  } else if (preset === 'close') {
    gsap.to(camera.position, { x: 0, y: 1.2, z: 6, duration: 1.5, ease: "power2.inOut" });
  } else {
    gsap.to(camera.position, { x: 0, y: 2, z: 14, duration: 1.5, ease: "power2.inOut" });
  }
}

function updateSpeed(val) {
  uSpeed = parseFloat(val);
  localStorage.setItem('opendev_speed', uSpeed);
  const speedValEl = document.getElementById('speed-val');
  if (speedValEl) speedValEl.innerText = uSpeed;
}

function toggleSettingsDrawer() {
  const drawer = document.getElementById('settings-drawer-backdrop');
  if (drawer) drawer.classList.toggle('open');
}

function openCmdModal() {
  const modal = document.getElementById('cmd-modal');
  if (modal) {
    modal.classList.add('open');
    const input = document.getElementById('cmd-input');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

function closeCmdModal() {
  const modal = document.getElementById('cmd-modal');
  if (modal) modal.classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const modal = document.getElementById('cmd-modal');
    if (modal && modal.classList.contains('open')) {
      closeCmdModal();
    } else {
      openCmdModal();
    }
  } else if (e.key === 'Escape') {
    closeCmdModal();
    const drawer = document.getElementById('settings-drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
  }
});

function executeCmd(action) {
  closeCmdModal();
  if (action === 'theme-cyan') setTheme('cyan');
  else if (action === 'theme-red') setTheme('red');
  else if (action === 'toggle-wireframe') toggleWireframe();
  else if (action === 'add-line') cameraSet();
  else if (action === 'goto-marketplace') window.location.href = 'marketplace.html';
  else if (action === 'goto-booking') window.location.href = 'booking.html';
  else if (action === 'goto-domains') window.location.href = 'domains.html';
  else if (action === 'goto-ai' || action === 'goto-cloud') window.location.href = 'ai-cloud.html';
  else if (action === 'goto-settings') window.location.href = 'settings.html';
}

function filterCommands(query) {
  const q = query.toLowerCase();
  const items = document.querySelectorAll('.cmd-item');
  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    if (text.includes(q)) item.style.display = 'flex';
    else item.style.display = 'none';
  });
}

//----------------------------------------------------------------- CODE SNIPPET TAB SWITCHER (VISHWALEADER STACK & OPENROUTER API)
const codeSnippets = {
  ts: `<span class="syntax-keyword">import</span> { NextRequest, NextResponse } <span class="syntax-keyword">from</span> <span class="syntax-str">'next/server'</span>;
<span class="syntax-keyword">import</span> Razorpay <span class="syntax-keyword">from</span> <span class="syntax-str">'razorpay'</span>;

<span class="syntax-comment">// Next.js 16 Server Action with OpenRouter API + Razorpay</span>
<span class="syntax-keyword">export async function</span> <span class="syntax-fn">POST</span>(req: NextRequest) {
  <span class="syntax-keyword">const</span> { prompt } = <span class="syntax-keyword">await</span> req.<span class="syntax-fn">json</span>();
  
  <span class="syntax-comment">// Call Free OpenRouter AI API (DeepSeek R1 / Llama 3)</span>
  <span class="syntax-keyword">const</span> aiRes = <span class="syntax-keyword">await</span> <span class="syntax-fn">fetch</span>(<span class="syntax-str">'https://openrouter.ai/api/v1/chat/completions'</span>, {
    method: <span class="syntax-str">'POST'</span>,
    headers: {
      <span class="syntax-str">'Authorization'</span>: <span class="syntax-str">\`Bearer \${process.env.OPENROUTER_API_KEY}\`</span>,
      <span class="syntax-str">'Content-Type'</span>: <span class="syntax-str">'application/json'</span>
    },
    body: JSON.<span class="syntax-fn">stringify</span>({
      model: <span class="syntax-str">'deepseek/deepseek-r1:free'</span>,
      messages: [{ role: <span class="syntax-str">'user'</span>, content: prompt }]
    })
  });

  <span class="syntax-keyword">return</span> NextResponse.<span class="syntax-fn">json</span>(<span class="syntax-keyword">await</span> aiRes.<span class="syntax-fn">json</span>());
}`,

  py: `<span class="syntax-keyword">import</span> os
<span class="syntax-keyword">import</span> requests

<span class="syntax-comment"># OpenRouter Free AI API Wrapper (DeepSeek R1 / Llama 3)</span>
OPENROUTER_KEY = os.getenv(<span class="syntax-str">"OPENROUTER_API_KEY"</span>)

response = requests.post(
    <span class="syntax-str">"https://openrouter.ai/api/v1/chat/completions"</span>,
    headers={<span class="syntax-str">"Authorization"</span>: <span class="syntax-str">f"Bearer {OPENROUTER_KEY}"</span>},
    json={
        <span class="syntax-str">"model"</span>: <span class="syntax-str">"meta-llama/llama-3.3-70b-instruct:free"</span>,
        <span class="syntax-str">"messages"</span>: [{<span class="syntax-str">"role"</span>: <span class="syntax-str">"user"</span>, <span class="syntax-str">"content"</span>: <span class="syntax-str">"Review Firebase security rules"</span>}]
    }
)
print(response.json())`,

  rs: `<span class="syntax-keyword">use</span> reqwest::Client;

<span class="syntax-keyword">#[tokio::main]</span>
<span class="syntax-keyword">async fn</span> <span class="syntax-fn">main</span>() -> Result&lt;(), Box&lt;<span class="syntax-keyword">dyn</span> std::error::Error&gt;&gt; {
    <span class="syntax-keyword">let</span> client = Client::<span class="syntax-fn">new</span>();
    <span class="syntax-keyword">let</span> res = client.<span class="syntax-fn">post</span>(<span class="syntax-str">"https://openrouter.ai/api/v1/chat/completions"</span>)
        .<span class="syntax-fn">header</span>(<span class="syntax-str">"Authorization"</span>, <span class="syntax-str">"Bearer OPENROUTER_FREE_KEY"</span>)
        .<span class="syntax-fn">send</span>().<span class="syntax-keyword">await</span>?;
    println!(<span class="syntax-str">"OpenRouter Gateway status: {}"</span>, res.status());
    Ok(())
}`,

  go: `<span class="syntax-keyword">package</span> main

<span class="syntax-keyword">import</span> (
    <span class="syntax-str">"fmt"</span>
    <span class="syntax-str">"net/http"</span>
)

<span class="syntax-keyword">func</span> <span class="syntax-fn">main</span>() {
    req, _ := http.<span class="syntax-fn">NewRequest</span>(<span class="syntax-str">"POST"</span>, <span class="syntax-str">"https://openrouter.ai/api/v1/chat/completions"</span>, nil)
    req.Header.<span class="syntax-fn">Set</span>(<span class="syntax-str">"Authorization"</span>, <span class="syntax-str">"Bearer OPENROUTER_KEY"</span>)
    fmt.<span class="syntax-fn">Printf</span>(<span class="syntax-str">"OpenRouter API ready for OpenDev platform.\\n"</span>)
}`
};

function switchTab(lang) {
  const tabs = document.querySelectorAll('.tab-trigger');
  tabs.forEach(t => t.classList.remove('active'));

  event.target.classList.add('active');

  const snippetEl = document.getElementById('code-snippet');
  if (snippetEl && codeSnippets[lang]) {
    snippetEl.innerHTML = codeSnippets[lang];
  }
}

function copyCode() {
  const snippetEl = document.getElementById('code-snippet');
  if (snippetEl) {
    navigator.clipboard.writeText(snippetEl.innerText);
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.innerHTML = '✓ Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i data-lucide="copy" style="width:12px; height:12px; vertical-align:middle;"></i> Copy';
        if (window.lucide) lucide.createIcons();
      }, 2000);
    }
  }
}

function appendConsole(text) {
  const consoleOut = document.getElementById('console-output');
  if (consoleOut) {
    consoleOut.innerHTML += '\n' + text;
    consoleOut.scrollTop = consoleOut.scrollHeight;
  }
}

function handleTerminalKey(event) {
  if (event.key === 'Enter') {
    const input = document.getElementById('terminal-input');
    if (!input) return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';

    appendConsole(`opendev-labs$ ${cmd}`);

    if (cmd === 'help') {
      appendConsole(`Available commands:
  - open login          : Authenticate OpenDev CLI via device authorization (ZFKZ-ZGFN)
  - open / open --prod  : Deploy project to https://ebookstall.opendev.app
  - open android        : Compile Capacitor Android Mobile APK
  - open domains add    : Bind custom domain (e.g. ebookstall.com) to opendev.app
  - run                 : Execute mock agent pipeline
  - status              : View cluster latency and edge node count
  - add line            : Trigger 3D city car light animation & flyover
  - theme cyan / red    : Switch WebGL fog color palette
  - clear               : Clear console buffer`);
    } else if (cmd === 'open login') {
      appendConsole(`OpenDev CLI v1.0.0 (Node.js 20.20.2)
> Visit opendev-labs.com/device and enter ZFKZ-ZGFN

  Congratulations! You are now signed in to OpenDev Labs.
  Logged in as opendev-labs (yash@vishwaleader.com)

  To deploy something, run \`open --prod\`.`);
    } else if (cmd === 'open' || cmd === 'open --prod' || cmd === 'npx open') {
      appendConsole(`OpenDev CLI v1.0.0
> Inspecting project directory: ~/Projects/ebookstall
> Detected Next.js 16 E-Commerce WebApp (Razorpay + Firestore)
> Building production edge bundle...
> Deploying to OpenDev Global Edge Network...

✓ Production Deployment Live!

🌐 Web Application URL:
   https://ebookstall.opendev.app

📱 Android Mobile APK Download:
   https://ebookstall.opendev.app/download/ebookstall.apk`);
    } else if (cmd === 'open android') {
      appendConsole(`> Running Capacitor CLI Android APK Build...
> Compiling release APK bundle...
✓ Android APK Export Complete: https://ebookstall.opendev.app/download/ebookstall.apk`);
    } else if (cmd.startsWith('open domain') || cmd.startsWith('open domains')) {
      appendConsole(`> Provisioning Cloudflare Anycast DNS & SSL Certificate...
✓ Custom Domain bound to https://ebookstall.opendev.app (SSL Active)`);
    } else if (cmd === 'run') {
      appendConsole(`[OPENROUTER AI]: Dispatching DeepSeek R1 model via free API key...
[VERCEL EDGE]: Synthesizing Next.js 16 response...
[RAZORPAY]: Checkout session active. Execution time: 12ms.`);
    } else if (cmd === 'status') {
      appendConsole(`[STATUS]: OpenDev Cluster 'opendev-edge-01'
  - OpenRouter Models: DeepSeek R1, Llama 3.3, Qwen 2.5
  - Stack: Next.js 16 | React 19 | Firebase | Razorpay | Capacitor
  - Primary Deployment Domain: *.opendev.app (e.g. ebookstall.opendev.app)
  - Vercel Edge Latency: 3.2ms (p99)`);
    } else if (cmd === 'add line') {
      cameraSet();
      appendConsole(`[OK]: Generated new car light ray inside 3D city scene.`);
    } else if (cmd.startsWith('theme ')) {
      const colorName = cmd.replace('theme ', '').trim();
      setTheme(colorName);
    } else if (cmd === 'wireframe') {
      toggleWireframe();
    } else if (cmd === 'clear') {
      const consoleOut = document.getElementById('console-output');
      if (consoleOut) consoleOut.innerHTML = '[SYSTEM]: Console buffer cleared.';
    } else if (cmd !== '') {
      appendConsole(`[ERROR]: Unknown command '${cmd}'. Type 'open login', 'open --prod', or 'help'.`);
    }
  }
}

function toggleFaq(element) {
  element.classList.toggle('active');
}

function initTelemetryCharts() {
  const canvasLatency = document.getElementById('chart-latency');
  const canvasCpu = document.getElementById('chart-cpu');

  if (!canvasLatency || !canvasCpu) return;

  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  let latData = Array.from({ length: 30 }, () => 3 + Math.random() * 1.5);
  let cpuData = Array.from({ length: 30 }, () => 14 + Math.random() * 8);

  function drawChart(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = setupCanvas(canvas);

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const step = width / (data.length - 1);
    data.forEach((val, i) => {
      const x = i * step;
      const y = height - (val / 35) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, color.replace('1)', '0.25)'));
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  setInterval(() => {
    latData.shift();
    latData.push(3 + Math.random() * 1.2);
    cpuData.shift();
    cpuData.push(14 + Math.random() * 6);

    drawChart('chart-latency', latData, 'rgba(0, 255, 136, 1)');
    drawChart('chart-cpu', cpuData, 'rgba(240, 32, 80, 1)');
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  initTelemetryCharts();
  if (savedTheme) setTheme(savedTheme);
  if (isWireframe) {
    var switches = document.querySelectorAll('.toggle-switch');
    switches.forEach(sw => sw.classList.add('active'));
  }
});
