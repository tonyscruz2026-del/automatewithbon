/* ==============================================================
   sections.js — powers every ported section in sections.html.
   Load this AFTER your hero3d.js, near the end of <body>:
     <script src="./js/sections.js"></script>

   Every init function guards on its own elements existing
   (if (!el) return), so nothing here throws if you delete a
   section from sections.html — it just quietly does nothing.

   Excluded from the reference build: hero orb-cluster mouse
   parallax (that's hero3d.js's job now) and the countdown timer
   (dropped — fake-urgency pattern).
================================================================== */
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function clamp01(t) { return Math.max(0, Math.min(1, t)); }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  /* Mobile browsers resize window.innerHeight as the address bar shows/
     hides mid-scroll, which desyncs it from the 100vh/100dvh box the pin
     is actually rendered at. Measuring the pin element itself keeps the
     scroll-progress math locked to what's really on screen. */
  function pinHeight(pinEl) {
    return (pinEl && pinEl.getBoundingClientRect().height) || window.innerHeight;
  }

  /* ---- Reveal-on-view ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Bento heading scramble-in ---- */
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*';
  function scrambleText(el, finalText, duration) {
    var frame = 0;
    var totalFrames = Math.round(duration / 16);
    var revealCount = 0;
    function step() {
      frame++;
      revealCount = Math.floor((frame / totalFrames) * finalText.length);
      var out = '';
      for (var i = 0; i < finalText.length; i++) {
        if (i < revealCount) out += finalText[i];
        else if (finalText[i] === ' ') out += ' ';
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      if (frame < totalFrames) requestAnimationFrame(step);
      else el.textContent = finalText;
    }
    step();
  }
  var bentoHeadingEl = document.getElementById('bentoHeading');
  if (bentoHeadingEl && 'IntersectionObserver' in window) {
    var scrambleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scrambleText(bentoHeadingEl, bentoHeadingEl.textContent, 700);
          scrambleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    scrambleObserver.observe(bentoHeadingEl);
  }

  /* ---- Magnetic buttons (footer CTA) ---- */
  var magneticEls = Array.prototype.slice.call(document.querySelectorAll('[data-magnetic]'));
  var MAGNETIC_STRENGTH = 0.35;
  magneticEls.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      el.style.transition = 'transform 0.05s ease';
      el.style.transform = 'translate(' + (dx * MAGNETIC_STRENGTH).toFixed(1) + 'px, ' + (dy * MAGNETIC_STRENGTH).toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = 'translate(0, 0)';
    });
  });

  /* ---- Split-word heading stagger ---- */
  function splitIntoWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'split-word';
      span.textContent = word;
      span.style.transitionDelay = (i * 0.07) + 's';
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  var statsHeadingEl = document.getElementById('statsHeading');
  if (statsHeadingEl) {
    splitIntoWords(statsHeadingEl);
    if ('IntersectionObserver' in window) {
      var splitObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-split');
            splitObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      splitObserver.observe(statsHeadingEl);
    } else {
      statsHeadingEl.classList.add('is-split');
    }
  }

  /* ---- Animated stat counters ---- */
  function animateCounter(el, target, suffix, duration) {
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counterEls = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
  if (counterEls.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
          var suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix, 1600);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    counterEls.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---- SVG path draw-in (stats divider) ---- */
  var dividerPath = document.getElementById('dividerPath');
  if (dividerPath) {
    var pathLen = dividerPath.getTotalLength();
    dividerPath.style.strokeDasharray = pathLen;
    dividerPath.style.strokeDashoffset = pathLen;
    if ('IntersectionObserver' in window) {
      var pathObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            dividerPath.style.strokeDashoffset = 0;
            pathObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      pathObserver.observe(dividerPath);
    } else {
      dividerPath.style.strokeDashoffset = 0;
    }
  }

  /* ---- 3D tilt cards (bento) ---- */
  var tiltCards = Array.prototype.slice.call(document.querySelectorAll('.tilt-card'));
  var TILT_MAX_DEG = 8;
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rotateY = (px - 0.5) * 2 * TILT_MAX_DEG;
      var rotateX = (0.5 - py) * 2 * TILT_MAX_DEG;
      card.style.transition = 'transform 0.05s ease';
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  /* ---- Cursor spotlight (final CTA) ---- */
  var spotlightSection = document.querySelector('.spotlight-section');
  if (spotlightSection) {
    spotlightSection.addEventListener('mousemove', function (e) {
      var rect = spotlightSection.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlightSection.style.setProperty('--spot-x', x + '%');
      spotlightSection.style.setProperty('--spot-y', y + '%');
    });
  }

  /* ==============================================================
     Scroll-jack engine
     ------------------------------------------------------------
     Problem this solves: the old approach mapped animation progress
     straight off scrollY (progress = -rect.top / total). That means
     one fast wheel/trackpad gesture could blow through the entire
     scroll distance in a single input event, so the page moved on
     before the animation had a chance to finish — "downscroll faster
     than the animation".

     Fix: when one of these sections reaches the top of the viewport,
     we fully LOCK page scroll (position:fixed on <body>, so wheel,
     touch, keyboard and scrollbar-drag are all blocked) and instead
     read wheel/touch/key input ourselves to drive progress from 0->1
     (or 1->0 scrolling back up). Only once progress hits the far end
     do we unlock and let the page continue scrolling to the next
     section — guaranteeing the animation always finishes first.
  ================================================================== */
  var SJ_DISTANCE = 650; // px of input needed to play a section start-to-end
  var sjLocked = null;   // the controller currently holding scroll, or null
  var sjSavedScrollY = 0;

  function sjLockScroll() {
    var scrollBarW = window.innerWidth - document.documentElement.clientWidth;
    sjSavedScrollY = window.scrollY || window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = (-sjSavedScrollY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    if (scrollBarW > 0) document.body.style.paddingRight = scrollBarW + 'px';
  }
  function sjUnlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.paddingRight = '';
    window.scrollTo(0, sjSavedScrollY);
  }

  function createScrollJack(el, render, opts) {
    if (!el) return null;
    opts = opts || {};
    var ctrl = { el: el, render: render, progress: 0, distance: opts.distance || SJ_DISTANCE, lastTop: null };
    ctrl.render(0);
    return ctrl;
  }

  function sjEnter(ctrl) {
    if (sjLocked === ctrl) return;
    var top = ctrl.el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
    window.scrollTo(0, top);
    sjLockScroll();
    sjLocked = ctrl;
  }

  function sjExit(ctrl, leftoverDelta) {
    sjUnlockScroll();
    sjLocked = null;
    if (leftoverDelta) window.scrollBy(0, leftoverDelta);
  }

  function sjHandleDelta(deltaY) {
    var ctrl = sjLocked;
    if (!ctrl) return;
    var next = ctrl.progress + deltaY / ctrl.distance;
    if (next >= 1) {
      ctrl.progress = 1;
      ctrl.render(1);
      sjExit(ctrl, deltaY > 0 ? Math.min(deltaY, 60) : 0);
      return;
    }
    if (next <= 0) {
      ctrl.progress = 0;
      ctrl.render(0);
      sjExit(ctrl, deltaY < 0 ? Math.max(deltaY, -60) : 0);
      return;
    }
    ctrl.progress = next;
    ctrl.render(next);
  }

  window.addEventListener('wheel', function (e) {
    if (!sjLocked) return;
    e.preventDefault();
    sjHandleDelta(e.deltaY);
  }, { passive: false });

  var sjTouchY = null;
  window.addEventListener('touchstart', function (e) {
    if (sjLocked) sjTouchY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (!sjLocked || sjTouchY === null) return;
    e.preventDefault();
    var y = e.touches[0].clientY;
    sjHandleDelta((sjTouchY - y) * 1.6);
    sjTouchY = y;
  }, { passive: false });
  window.addEventListener('touchend', function () { sjTouchY = null; });

  var SJ_BLOCK_KEYS = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 38: 1, 40: 1 };
  window.addEventListener('keydown', function (e) {
    if (!sjLocked || !SJ_BLOCK_KEYS[e.keyCode]) return;
    e.preventDefault();
    var delta = (e.keyCode === 38 || e.keyCode === 33) ? -80 : 80;
    if (e.keyCode === 36) delta = -1000;
    if (e.keyCode === 35) delta = 1000;
    sjHandleDelta(delta);
  });

  var sjControllers = [];
  function sjCheckCrossings() {
    if (sjLocked) return;
    for (var i = 0; i < sjControllers.length; i++) {
      var ctrl = sjControllers[i];
      var top = ctrl.el.getBoundingClientRect().top;
      var prev = ctrl.lastTop;
      ctrl.lastTop = top;
      if (prev === null) continue;
      var crossedDown = prev > 0 && top <= 0 && ctrl.progress < 1;
      var crossedUp = prev < 0 && top >= 0 && ctrl.progress > 0;
      if (crossedDown || crossedUp) { sjEnter(ctrl); break; }
    }
  }

  /* ---- Horizontal scroll gallery ---- */
  var hscrollSection = document.getElementById('hscrollSection');
  var hscrollTrack = document.getElementById('hscrollTrack');
  function renderHscroll(progress) {
    if (!hscrollSection || !hscrollTrack) return;
    var maxScroll = Math.max(0, hscrollTrack.scrollWidth - hscrollSection.clientWidth);
    hscrollTrack.style.transform = 'translate3d(' + (-progress * maxScroll).toFixed(1) + 'px, 0, 0)';
  }

  /* ---- Scrollytelling steps ---- */
  var scrollySection = document.getElementById('scrollySection');
  var scrollySteps = scrollySection ? Array.prototype.slice.call(scrollySection.querySelectorAll('.scrolly-step')) : [];
  var scrollyNodes = scrollySection ? Array.prototype.slice.call(scrollySection.querySelectorAll('.scrolly-node')) : [];
  var scrollyProgressLine = document.getElementById('scrollyProgressLine');
  var SCROLLY_STEP_COUNT = scrollySteps.length || 3;
  var lastActiveStep = -1;
  function renderScrolly(progress) {
    if (!scrollySection) return;
    var stepFloat = progress * SCROLLY_STEP_COUNT;
    var activeStep = progress <= 0 ? 0 : Math.min(SCROLLY_STEP_COUNT - 1, Math.floor(stepFloat));
    if (activeStep !== lastActiveStep) {
      scrollySteps.forEach(function (el) { el.classList.toggle('is-active', parseInt(el.getAttribute('data-step'), 10) === activeStep); });
      scrollyNodes.forEach(function (el) { el.classList.toggle('is-active', parseInt(el.getAttribute('data-step'), 10) <= activeStep); });
      lastActiveStep = activeStep;
    }
    if (scrollyProgressLine) {
      var x2 = 80 + progress * 600;
      scrollyProgressLine.setAttribute('x2', x2.toFixed(1));
    }
  }

  /* ---- Cinematic pipeline canvas ---- */
  var cinemaSection = document.getElementById('cinemaSection');
  var canvas = document.getElementById('pipelineCanvas');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var cinemaCaptionEl = document.getElementById('cinemaCaptionText');
  var pipelineNodes = [
    { x: 0.14, y: 0.58, label: 'Intake message received' },
    { x: 0.34, y: 0.34, label: 'Routed to the right workflow' },
    { x: 0.54, y: 0.62, label: 'Availability checked automatically' },
    { x: 0.74, y: 0.34, label: 'Confirmation drafted' },
    { x: 0.90, y: 0.58, label: 'Delivered, zero manual steps' }
  ];
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  function drawPipeline(progress) {
    if (!ctx) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    var zoom = 1 + progress * 0.1;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h / 2);
    ctx.strokeStyle = 'rgba(45,125,255,0.45)';
    ctx.lineWidth = 2;
    for (var i = 0; i < pipelineNodes.length - 1; i++) {
      var segStart = i / (pipelineNodes.length - 1);
      var segEnd = (i + 1) / (pipelineNodes.length - 1);
      var segT = clamp01((progress - segStart) / (segEnd - segStart));
      if (segT <= 0) continue;
      var a = pipelineNodes[i], b = pipelineNodes[i + 1];
      var ax = a.x * w, ay = a.y * h, bx = b.x * w, by = b.y * h;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + (bx - ax) * segT, ay + (by - ay) * segT);
      ctx.stroke();
    }
    var activeLabel = pipelineNodes[0].label;
    pipelineNodes.forEach(function (n, i) {
      var appearAt = i / (pipelineNodes.length + 1);
      var t = clamp01((progress - appearAt) / 0.18);
      if (t <= 0) return;
      var eased = easeOutCubic(t);
      var r = 15 * eased;
      var x = n.x * w, y = n.y * h;
      ctx.save();
      ctx.shadowColor = 'rgba(143,227,255,' + (0.55 * eased).toFixed(2) + ')';
      ctx.shadowBlur = 22 * eased;
      ctx.fillStyle = '#0D1A2C';
      ctx.strokeStyle = t >= 1 ? '#8fe3ff' : 'rgba(45,125,255,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      if (progress >= appearAt) activeLabel = n.label;
    });
    ctx.restore();
    if (cinemaCaptionEl && cinemaCaptionEl.textContent !== activeLabel) {
      cinemaCaptionEl.style.opacity = 0;
      setTimeout(function () {
        cinemaCaptionEl.textContent = activeLabel;
        cinemaCaptionEl.style.opacity = 1;
      }, 120);
    }
  }
  drawPipeline(0);

  /* ---- Real 3D scroll scene (Three.js) ---- */
  var scene3dSection = document.getElementById('scene3dSection');
  var threeContainer = document.getElementById('threeContainer');
  var scene3dCaptionEl = document.getElementById('scene3dCaptionText');
  var three = null;
  if (typeof THREE !== 'undefined' && threeContainer) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeContainer.appendChild(renderer.domElement);
    var group = new THREE.Group();
    scene.add(group);
    var path3d = [[-4, 0.4, 0], [-2, -1.2, -2.4], [0.2, 0.8, -5], [2.4, -1.2, -7.6], [4.4, 0.6, -10.4]];
    var nodeLabels3d = ['Intake', 'Route', 'Process', 'Confirm', 'Deliver'];
    path3d.forEach(function (p) {
      var geo = new THREE.SphereGeometry(0.42, 24, 24);
      var mat = new THREE.MeshStandardMaterial({ color: 0x2d7dff, emissive: 0x0A1830, metalness: 0.35, roughness: 0.4 });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p[0], p[1], p[2]);
      group.add(mesh);
    });
    for (var i = 0; i < path3d.length - 1; i++) {
      var a = new THREE.Vector3(path3d[i][0], path3d[i][1], path3d[i][2]);
      var b = new THREE.Vector3(path3d[i + 1][0], path3d[i + 1][1], path3d[i + 1][2]);
      var mid = a.clone().add(b).multiplyScalar(0.5);
      var dir = b.clone().sub(a);
      var len = dir.length();
      var cylGeo = new THREE.CylinderGeometry(0.045, 0.045, len, 8);
      var cylMat = new THREE.MeshStandardMaterial({ color: 0x8fe3ff, emissive: 0x0d2a33, metalness: 0.2, roughness: 0.5 });
      var cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.copy(mid);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      group.add(cyl);
    }
    scene.add(new THREE.AmbientLight(0x25334f, 1.4));
    var keyLight = new THREE.PointLight(0x8fe3ff, 2.2, 26);
    keyLight.position.set(0, 4, 3);
    scene.add(keyLight);
    var rimLight = new THREE.PointLight(0x2d7dff, 1.4, 30);
    rimLight.position.set(-3, -2, -6);
    scene.add(rimLight);
    function resize3d() {
      var rect = threeContainer.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    }
    window.addEventListener('resize', resize3d);
    resize3d();
    function render3d(progress) {
      camera.position.z = 3 - progress * 13;
      camera.position.x = Math.sin(progress * Math.PI) * 1.2;
      camera.position.y = 0.3;
      camera.lookAt(0, 0, 3 - progress * 13 - 3);
      group.rotation.y = progress * 0.35;
      renderer.render(scene, camera);
      var idx = Math.min(nodeLabels3d.length - 1, Math.floor(progress * nodeLabels3d.length));
      var label = nodeLabels3d[idx];
      if (scene3dCaptionEl && scene3dCaptionEl.textContent !== label) {
        scene3dCaptionEl.style.opacity = 0;
        setTimeout(function () { scene3dCaptionEl.textContent = label; scene3dCaptionEl.style.opacity = 1; }, 120);
      }
    }
    three = { render: render3d };
    render3d(0);
  }
  function renderScene3d(progress) { if (three) three.render(progress); }

  /* ---- Register all four sections with the scroll-jack engine ---- */
  sjControllers = [
    createScrollJack(scrollySection, renderScrolly, { distance: 700 }),
    createScrollJack(hscrollSection, renderHscroll, { distance: 900 }),
    createScrollJack(cinemaSection, drawPipeline, { distance: 750 }),
    createScrollJack(scene3dSection, renderScene3d, { distance: 850 })
  ].filter(Boolean);

  /* ---- WebGL shader mesh background ---- */
  function initShader() {
    var canvas = document.getElementById('shaderCanvas');
    if (!canvas) return;
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    var vertSrc = 'attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';
    var fragSrc = [
      'precision mediump float;',
      'uniform vec2 u_res;',
      'uniform float u_time;',
      'void main(){',
      '  vec2 uv = gl_FragCoord.xy / u_res;',
      '  vec3 colA = vec3(0.02, 0.03, 0.06);',
      '  vec3 colB = vec3(0.11, 0.35, 0.83);',
      '  vec3 colC = vec3(0.35, 0.72, 0.90);',
      '  float w1 = sin(uv.x * 3.0 + u_time * 0.25) * 0.5 + 0.5;',
      '  float w2 = sin(uv.y * 4.0 - u_time * 0.18 + w1) * 0.5 + 0.5;',
      '  vec3 mixed = mix(colA, colB, w1 * 0.5);',
      '  mixed = mix(mixed, colC, w2 * 0.18);',
      '  float vign = smoothstep(1.1, 0.2, distance(uv, vec2(0.5)));',
      '  gl_FragColor = vec4(mixed * (0.35 + vign * 0.65), 1.0);',
      '}'
    ].join('\n');
    function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var vs = compile(gl.VERTEX_SHADER, vertSrc);
    var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var quad = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    var resLoc = gl.getUniformLocation(prog, 'u_res');
    var timeLoc = gl.getUniformLocation(prog, 'u_time');
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();
    var shaderSection = document.querySelector('.shader-section');
    var shaderVisible = true;
    if ('IntersectionObserver' in window && shaderSection) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { shaderVisible = e.isIntersecting; });
      }, { threshold: 0 }).observe(shaderSection);
    }
    function frame(t) {
      if (shaderVisible) {
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, t * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  initShader();

  /* ---- Typewriter ---- */
  function initTypewriter() {
    var el = document.getElementById('typewriterText');
    if (!el) return;
    var phrases = ['powered by real automation.', 'connected to your CRM.', 'running while you sleep.'];
    var pi = 0, ci = 0, deleting = false;
    function step() {
      var phrase = phrases[pi];
      if (!deleting) {
        ci++;
        el.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) { deleting = true; setTimeout(step, 1400); return; }
      } else {
        ci--;
        el.textContent = phrase.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(step, deleting ? 35 : 55);
    }
    step();
  }
  initTypewriter();

  /* ---- Particle network ---- */
  function initParticles() {
    var canvas = document.getElementById('particleCanvas');
    var pctx = canvas ? canvas.getContext('2d') : null;
    if (!pctx) return;
    var section = document.getElementById('particleSection');
    var particles = [];
    var COUNT = 70;
    var mouseX = null, mouseY = null;
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();
    function seed() {
      particles = [];
      var rect = canvas.getBoundingClientRect();
      for (var i = 0; i < COUNT; i++) {
        particles.push({ x: Math.random() * rect.width, y: Math.random() * rect.height, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.6 + 0.8 });
      }
    }
    seed();
    if (section) {
      section.addEventListener('mousemove', function (e) {
        var rect = section.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      section.addEventListener('mouseleave', function () { mouseX = null; mouseY = null; });
    }
    var particleVisible = true;
    if ('IntersectionObserver' in window && section) {
      new IntersectionObserver(function (entries) { entries.forEach(function (e) { particleVisible = e.isIntersecting; }); }, { threshold: 0 }).observe(section);
    }
    function drawParticles() {
      if (particleVisible) {
        var rect = canvas.getBoundingClientRect();
        pctx.clearRect(0, 0, rect.width, rect.height);
        particles.forEach(function (p) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = rect.width; if (p.x > rect.width) p.x = 0;
          if (p.y < 0) p.y = rect.height; if (p.y > rect.height) p.y = 0;
          if (mouseX != null) {
            var dx = p.x - mouseX, dy = p.y - mouseY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90 && dist > 0.01) { p.x += (dx / dist) * 0.6; p.y += (dy / dist) * 0.6; }
          }
        });
        pctx.fillStyle = 'rgba(143,227,255,0.7)';
        particles.forEach(function (p) { pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); pctx.fill(); });
        pctx.strokeStyle = 'rgba(45,125,255,0.15)';
        pctx.lineWidth = 1;
        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var a = particles[i], b = particles[j];
            var dx2 = a.x - b.x, dy2 = a.y - b.y;
            if (dx2 * dx2 + dy2 * dy2 < 120 * 120) { pctx.beginPath(); pctx.moveTo(a.x, a.y); pctx.lineTo(b.x, b.y); pctx.stroke(); }
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    requestAnimationFrame(drawParticles);
  }
  initParticles();

  /* ---- Skeleton shimmer -> real content ---- */
  function initSkeleton() {
    var grid = document.getElementById('skeletonGrid');
    if (!grid) return;
    var content = [
      { cls: 'b-wide', title: 'Lead intake', text: 'Every channel lands in one queue.' },
      { cls: '', title: 'Auto-routing', text: 'Rules decide where it goes next.' },
      { cls: '', title: 'Confirmations', text: 'Sent the moment a booking succeeds.' },
      { cls: 'b-wide', title: 'Reporting', text: 'Dashboards update on their own.' }
    ];
    function load() {
      grid.innerHTML = '';
      content.forEach(function (c) {
        var div = document.createElement('div');
        div.className = 'bento-card loaded-fade ' + c.cls;
        div.innerHTML = '<h4>' + c.title + '</h4><p>' + c.text + '</p>';
        grid.appendChild(div);
      });
    }
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { setTimeout(load, 1200); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.3 });
      obs.observe(grid);
    } else { load(); }
  }
  initSkeleton();

  /* ---- Drag-to-pan automation map ---- */
  function initPanCanvas() {
    var wrap = document.getElementById('panWrap');
    var canvas = document.getElementById('panCanvas');
    if (!wrap || !canvas) return;
    var pctx = canvas.getContext('2d');
    function drawMap() {
      pctx.clearRect(0, 0, canvas.width, canvas.height);
      pctx.fillStyle = '#0A1220';
      pctx.fillRect(0, 0, canvas.width, canvas.height);
      pctx.strokeStyle = 'rgba(45,125,255,0.15)';
      pctx.lineWidth = 1;
      for (var x = 0; x < canvas.width; x += 60) { pctx.beginPath(); pctx.moveTo(x, 0); pctx.lineTo(x, canvas.height); pctx.stroke(); }
      for (var y = 0; y < canvas.height; y += 60) { pctx.beginPath(); pctx.moveTo(0, y); pctx.lineTo(canvas.width, y); pctx.stroke(); }
      var nodes = [[140,120,'Intake'], [420,260,'Route'], [700,140,'Qualify'], [980,300,'Book'], [1260,180,'Confirm'], [1460,420,'Report'], [260,480,'Follow-up'], [860,520,'Review']];
      pctx.strokeStyle = 'rgba(143,227,255,0.4)';
      pctx.lineWidth = 2;
      for (var i = 0; i < nodes.length - 1; i++) { pctx.beginPath(); pctx.moveTo(nodes[i][0], nodes[i][1]); pctx.lineTo(nodes[i + 1][0], nodes[i + 1][1]); pctx.stroke(); }
      nodes.forEach(function (n) {
        pctx.beginPath();
        pctx.fillStyle = '#0D1A2C';
        pctx.strokeStyle = '#2d7dff';
        pctx.lineWidth = 2;
        pctx.arc(n[0], n[1], 26, 0, Math.PI * 2);
        pctx.fill(); pctx.stroke();
        pctx.fillStyle = '#f2fbff';
        pctx.font = '600 13px Inter, sans-serif';
        pctx.textAlign = 'center';
        pctx.fillText(n[2], n[0], n[1] + 4);
      });
    }
    drawMap();
    var isDown = false, startX = 0, startY = 0, curX = 0, curY = 0, lastTx = 0, lastTy = 0;
    function clampPan() {
      var wrapRect = wrap.getBoundingClientRect();
      var minX = wrapRect.width - canvas.width;
      var minY = wrapRect.height - canvas.height;
      curX = Math.min(0, Math.max(minX, curX));
      curY = Math.min(0, Math.max(minY, curY));
    }
    function apply() { canvas.style.transform = 'translate3d(' + curX + 'px,' + curY + 'px,0)'; }
    function down(e) { isDown = true; wrap.classList.add('is-dragging'); var p = e.touches ? e.touches[0] : e; startX = p.clientX; startY = p.clientY; lastTx = curX; lastTy = curY; }
    function move(e) { if (!isDown) return; var p = e.touches ? e.touches[0] : e; curX = lastTx + (p.clientX - startX); curY = lastTy + (p.clientY - startY); clampPan(); apply(); }
    function up() { isDown = false; wrap.classList.remove('is-dragging'); }
    wrap.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    wrap.addEventListener('touchstart', down, { passive: true });
    wrap.addEventListener('touchmove', move, { passive: true });
    wrap.addEventListener('touchend', up);
    clampPan();
    apply();
  }
  initPanCanvas();

  /* ---- Mask-wipe heading reveal ---- */
  function initMaskWipe() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.mask-wipe'));
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-wiped'); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('is-wiped'); obs.unobserve(entry.target); } });
    }, { threshold: 0.4 });
    els.forEach(function (el) { obs.observe(el); });
  }
  initMaskWipe();

  /* ---- Scroll-snap carousel ---- */
  function initCarousel() {
    var viewport = document.getElementById('carouselViewport');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var dots = Array.prototype.slice.call(document.querySelectorAll('.carousel-dot'));
    if (!viewport) return;
    var slides = Array.prototype.slice.call(viewport.children);
    function currentIndex() {
      var vRect = viewport.getBoundingClientRect();
      var center = vRect.left + vRect.width / 2;
      var closest = 0, closestDist = Infinity;
      slides.forEach(function (s, i) { var r = s.getBoundingClientRect(); var d = Math.abs((r.left + r.width / 2) - center); if (d < closestDist) { closestDist = d; closest = i; } });
      return closest;
    }
    function scrollToIndex(i) { i = Math.max(0, Math.min(slides.length - 1, i)); slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }
    function updateDots() { var idx = currentIndex(); dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); }); }
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollToIndex(currentIndex() - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollToIndex(currentIndex() + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { scrollToIndex(i); }); });
    var scrollTimer = null;
    viewport.addEventListener('scroll', function () { clearTimeout(scrollTimer); scrollTimer = setTimeout(updateDots, 100); }, { passive: true });
    updateDots();
  }
  initCarousel();

  /* ---- Command palette (⌘K) ---- */
  function initCommandPalette() {
    var trigger = document.getElementById('cmdkTrigger');
    var overlay = document.getElementById('cmdkOverlay');
    var input = document.getElementById('cmdkInput');
    var list = document.getElementById('cmdkList');
    if (!overlay || !input || !list) return;
    var items = [
      { label: 'Home', hint: 'Top of page', target: 'body' },
      { label: 'Services / Features', hint: 'What you offer', target: '.features' },
      { label: 'Capabilities', hint: 'Bento grid', target: '#bentoSection' },
      { label: 'How It Works', hint: 'Scrollytelling steps', target: '#scrollySection' },
      { label: 'Projects', hint: 'Horizontal gallery', target: '#hscrollSection' },
      { label: 'Stats', hint: 'Numbers that back it up', target: '.stats-section' },
      { label: 'Automation Map', hint: 'Drag to explore', target: '#panWrap' },
      { label: 'Client Feedback', hint: 'Swipe carousel', target: '.carousel-section' },
      { label: 'Book a Consultation', hint: 'Contact', target: '#consult' }
    ].filter(function (t) { return t.target === 'body' || document.querySelector(t.target); });
    var selectedIndex = 0;
    var filtered = items.slice();
    function render() {
      list.innerHTML = '';
      if (!filtered.length) { list.innerHTML = '<div class="cmdk-empty">No matches</div>'; return; }
      filtered.forEach(function (item, i) {
        var row = document.createElement('div');
        row.className = 'cmdk-item' + (i === selectedIndex ? ' is-selected' : '');
        row.innerHTML = '<span>' + item.label + '</span><span class="hint">' + item.hint + '</span>';
        row.addEventListener('mouseenter', function () { selectedIndex = i; render(); });
        row.addEventListener('click', function () { go(item); });
        list.appendChild(row);
      });
    }
    function go(item) { close(); var el = document.querySelector(item.target); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    function open() { overlay.classList.add('is-open'); input.value = ''; filtered = items.slice(); selectedIndex = 0; render(); setTimeout(function () { input.focus(); }, 50); }
    function close() { overlay.classList.remove('is-open'); }
    if (trigger) trigger.addEventListener('click', open);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', function () {
      var q = input.value.toLowerCase();
      filtered = items.filter(function (item) { return item.label.toLowerCase().indexOf(q) !== -1; });
      selectedIndex = 0; render();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(filtered.length - 1, selectedIndex + 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(0, selectedIndex - 1); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[selectedIndex]) go(filtered[selectedIndex]); }
      else if (e.key === 'Escape') { close(); }
    });
    window.addEventListener('keydown', function (e) {
      var isK = e.key === 'k' || e.key === 'K';
      if ((e.metaKey || e.ctrlKey) && isK) { e.preventDefault(); overlay.classList.contains('is-open') ? close() : open(); }
      else if (e.key === 'Escape') { close(); }
    });
  }
  initCommandPalette();

  /* ---- Custom cursor ---- */
  function initCustomCursor() {
    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;
    var dot = document.getElementById('customCursor');
    var ring = document.getElementById('customCursorRing');
    if (!dot || !ring) return;
    document.body.classList.add('custom-cursor-active');
    var rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) { dot.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)'; tx = e.clientX; ty = e.clientY; });
    var hoverables = document.querySelectorAll('a, button, [data-magnetic], .tilt-card, .carousel-dot');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
    function ringTick() { rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18; ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; requestAnimationFrame(ringTick); }
    requestAnimationFrame(ringTick);
  }
  initCustomCursor();

  /* ---- Scroll progress bar (fallback for browsers without animation-timeline) ---- */
  function initScrollProgressFallback() {
    var supported = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
    if (supported) return;
    var bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      var progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    }, { passive: true });
  }
  initScrollProgressFallback();

  /* ---- Master tick: watches for a scroll-jack section reaching the
     top of the viewport and locks scroll into it (see engine above) ---- */
  function tick() {
    sjCheckCrossings();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---- Word rotator ---- */
  function initRotator() {
    var win = document.getElementById('rotatorWindow');
    if (!win) return;
    var words = ['bookings', 'follow-ups', 'lead replies', 'reporting'];
    var idx = 0;
    var first = document.createElement('span');
    first.className = 'rotator-word is-current';
    first.textContent = words[0];
    win.appendChild(first);
    setInterval(function () {
      var current = win.querySelector('.rotator-word.is-current');
      idx = (idx + 1) % words.length;
      var next = document.createElement('span');
      next.className = 'rotator-word';
      next.textContent = words[idx];
      win.appendChild(next);
      if (current) { current.classList.remove('is-current'); current.classList.add('is-exit'); }
      requestAnimationFrame(function () { requestAnimationFrame(function () { next.classList.add('is-current'); }); });
      setTimeout(function () { if (current && current.parentNode) current.parentNode.removeChild(current); }, 600);
    }, 2200);
  }
  initRotator();

  /* ---- FAQ accordion ---- */
  function initFaq() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (other) { other.classList.remove('is-open'); other.querySelector('.faq-answer').style.maxHeight = '0px'; });
        if (!isOpen) { item.classList.add('is-open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
      });
    });
  }
  initFaq();

  /* ---- Tabs ---- */
  function initTabs() {
    var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === target); });
      });
    });
  }
  initTabs();

  /* ---- Pricing toggle ---- */
  function initPricingToggle() {
    var sw = document.getElementById('pricingSwitch');
    if (!sw) return;
    var amounts = Array.prototype.slice.call(document.querySelectorAll('.price-amount'));
    sw.addEventListener('click', function () {
      var yearly = !sw.classList.contains('is-yearly');
      sw.classList.toggle('is-yearly', yearly);
      amounts.forEach(function (el) {
        var val = yearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        el.innerHTML = '$' + val + '<span>/mo</span>';
      });
    });
  }
  initPricingToggle();

  /* ---- Before/after comparison slider ---- */
  function initCompareSlider() {
    var wrap = document.getElementById('compareWrap');
    var after = document.getElementById('compareAfter');
    var line = document.getElementById('compareLine');
    var grip = document.getElementById('compareGrip');
    if (!wrap || !after) return;
    var dragging = false;
    function setPct(pct) { pct = Math.max(0, Math.min(100, pct)); after.style.clipPath = 'inset(0 0 0 ' + pct + '%)'; line.style.left = pct + '%'; grip.style.left = pct + '%'; }
    setPct(50);
    function pctFromEvent(e) { var p = e.touches ? e.touches[0] : e; var rect = wrap.getBoundingClientRect(); return ((p.clientX - rect.left) / rect.width) * 100; }
    function down(e) { dragging = true; setPct(pctFromEvent(e)); }
    function move(e) { if (dragging) setPct(pctFromEvent(e)); }
    function up() { dragging = false; }
    grip.addEventListener('mousedown', down);
    wrap.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    wrap.addEventListener('touchstart', down, { passive: true });
    wrap.addEventListener('touchmove', move, { passive: true });
    wrap.addEventListener('touchend', up);
  }
  initCompareSlider();

  /* ---- Micro-interactions: ripple / confetti / toast / copy ---- */
  function initFx() {
    var rippleBtn = document.getElementById('rippleBtn');
    if (rippleBtn) {
      rippleBtn.addEventListener('click', function (e) {
        var rect = rippleBtn.getBoundingClientRect();
        var span = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        span.className = 'ripple-ping';
        span.style.width = span.style.height = size + 'px';
        span.style.left = (e.clientX - rect.left - size / 2) + 'px';
        span.style.top = (e.clientY - rect.top - size / 2) + 'px';
        rippleBtn.appendChild(span);
        setTimeout(function () { span.remove(); }, 650);
      });
    }
    var confettiBtn = document.getElementById('confettiBtn');
    var confettiCanvas = document.getElementById('confettiCanvas');
    var cctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
    function resizeConfetti() { if (!confettiCanvas) return; confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeConfetti);
    resizeConfetti();
    if (confettiBtn && cctx) {
      confettiBtn.addEventListener('click', function () {
        var rect = confettiBtn.getBoundingClientRect();
        var originX = rect.left + rect.width / 2;
        var originY = rect.top;
        var particles = [];
        var colors = ['#8fe3ff', '#2d7dff', '#f2fbff', '#2aa8ff'];
        for (var i = 0; i < 80; i++) {
          particles.push({ x: originX, y: originY, vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 8 - 4, size: Math.random() * 5 + 3, color: colors[Math.floor(Math.random() * colors.length)], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
        }
        var start = performance.now();
        function frame(t) {
          var elapsed = t - start;
          cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
          var alive = false;
          particles.forEach(function (p) {
            p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
            if (p.y < confettiCanvas.height + 20) alive = true;
            cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
            cctx.fillStyle = p.color; cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            cctx.restore();
          });
          if (alive && elapsed < 2600) requestAnimationFrame(frame);
          else cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        requestAnimationFrame(frame);
      });
    }
    var toastBtn = document.getElementById('toastBtn');
    var toastStack = document.getElementById('toastStack');
    function showToast(msg) {
      if (!toastStack) return;
      var el = document.createElement('div');
      el.className = 'toast';
      el.textContent = msg;
      toastStack.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('is-visible'); });
      setTimeout(function () { el.classList.remove('is-visible'); setTimeout(function () { el.remove(); }, 300); }, 2600);
    }
    if (toastBtn) toastBtn.addEventListener('click', function () { showToast('This is what a toast notification looks like.'); });
    var copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = copyBtn.getAttribute('data-copy-text') || '';
        var done = function () {
          var original = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          showToast('Copied to clipboard.');
          setTimeout(function () { copyBtn.textContent = original; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
        else done();
      });
    }
  }
  initFx();

  /* ---- Scrollspy side nav ---- */
  function initScrollspy() {
    var nav = document.getElementById('scrollspyNav');
    if (!nav) return;
    var targets = [
      { id: 'bentoSection', label: 'Capabilities' },
      { id: 'scrollySection', label: 'How it works' },
      { id: 'hscrollSection', label: 'Projects' },
      { id: 'faqSection', label: 'FAQ' },
      { id: 'pricingSection', label: 'Pricing' },
      { id: 'compareSection', label: 'Compare' },
      { id: 'flipSection', label: 'Flip cards' },
      { id: 'consult', label: 'Contact' }
    ].filter(function (t) { return document.getElementById(t.id); });
    targets.forEach(function (t) {
      var dot = document.createElement('button');
      dot.className = 'scrollspy-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', t.label);
      dot.innerHTML = '<span class="spy-label">' + t.label + '</span>';
      dot.addEventListener('click', function () { document.getElementById(t.id).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      nav.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(nav.querySelectorAll('.scrollspy-dot'));
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var idx = targets.findIndex(function (t) { return document.getElementById(t.id) === entry.target; });
          if (idx !== -1) dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
        });
      }, { threshold: 0.4 });
      targets.forEach(function (t) { obs.observe(document.getElementById(t.id)); });
    }
  }
  initScrollspy();

  /* ---- Back to top + scroll progress ring ---- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    var progress = document.getElementById('backToTopProgress');
    if (!btn || !progress) return;
    var CIRC = 125.6;
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      var pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      progress.style.strokeDashoffset = (CIRC * (1 - pct)).toFixed(1);
      btn.classList.toggle('is-visible', scrollTop > 500);
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  initBackToTop();

  /* ---- Rating stars ---- */
  function initRatingStars() {
    var wrap = document.getElementById('ratingStars');
    var feedback = document.getElementById('ratingFeedback');
    if (!wrap) return;
    var stars = Array.prototype.slice.call(wrap.querySelectorAll('.rating-star'));
    var locked = 0;
    var messages = { 1: 'Not very useful, noted.', 2: 'Could be better.', 3: 'Pretty useful.', 4: 'Really useful!', 5: 'Extremely useful, thank you!' };
    function paint(value) { stars.forEach(function (s) { var v = parseInt(s.getAttribute('data-value'), 10); s.classList.toggle('is-filled', v <= value); }); }
    stars.forEach(function (s) {
      var v = parseInt(s.getAttribute('data-value'), 10);
      s.addEventListener('mouseenter', function () { paint(v); });
      s.addEventListener('click', function () { locked = v; paint(locked); feedback.textContent = messages[locked]; });
    });
    wrap.addEventListener('mouseleave', function () { paint(locked); });
  }
  initRatingStars();

  /* ---- Range slider ---- */
  function initHoursSlider() {
    var input = document.getElementById('hoursSlider');
    var fill = document.getElementById('sliderFill');
    var bubble = document.getElementById('sliderBubble');
    var resultVal = document.getElementById('sliderResultVal');
    if (!input) return;
    function update() {
      var min = parseFloat(input.min), max = parseFloat(input.max), val = parseFloat(input.value);
      var pct = ((val - min) / (max - min)) * 100;
      fill.style.width = pct + '%';
      bubble.style.left = pct + '%';
      bubble.textContent = val + ' hrs';
      resultVal.textContent = Math.round(val * 0.8);
    }
    input.addEventListener('input', update);
    update();
  }
  initHoursSlider();

  /* ---- Custom select ---- */
  function initCustomSelect() {
    var root = document.getElementById('customSelect');
    var trigger = document.getElementById('selectTrigger');
    var valueEl = document.getElementById('selectValue');
    var panel = document.getElementById('selectPanel');
    if (!root) return;
    var options = Array.prototype.slice.call(panel.querySelectorAll('.select-option'));
    function close() { root.classList.remove('is-open'); }
    function open() { root.classList.add('is-open'); }
    trigger.addEventListener('click', function (e) { e.stopPropagation(); root.classList.contains('is-open') ? close() : open(); });
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('is-selected'); });
        opt.classList.add('is-selected');
        valueEl.textContent = opt.querySelector('span').textContent;
        close();
      });
    });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  initCustomSelect();

  /* ---- Drag-to-reorder list ---- */
  function initReorderList() {
    var list = document.getElementById('reorderList');
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('.reorder-item'));
    var dragEl = null;
    function renumber() { Array.prototype.slice.call(list.querySelectorAll('.reorder-item')).forEach(function (item, i) { item.querySelector('.reorder-rank').textContent = (i + 1); }); }
    items.forEach(function (item) {
      item.addEventListener('dragstart', function () { dragEl = item; setTimeout(function () { item.classList.add('is-dragging'); }, 0); });
      item.addEventListener('dragend', function () { item.classList.remove('is-dragging'); dragEl = null; renumber(); });
    });
    list.addEventListener('dragover', function (e) {
      e.preventDefault();
      if (!dragEl) return;
      var target = e.target.closest ? e.target.closest('.reorder-item') : null;
      if (!target || target === dragEl) return;
      var rect = target.getBoundingClientRect();
      var before = (e.clientY - rect.top) < rect.height / 2;
      list.insertBefore(dragEl, before ? target : target.nextSibling);
    });
  }
  initReorderList();

  /* ---- Lightbox ---- */
  function initLightbox() {
    var grid = document.getElementById('lightboxGrid');
    var overlay = document.getElementById('lightboxOverlay');
    var titleEl = document.getElementById('lightboxTitle');
    var descEl = document.getElementById('lightboxDesc');
    var closeBtn = document.getElementById('lightboxClose');
    if (!grid || !overlay) return;
    function open(thumb) { titleEl.textContent = thumb.getAttribute('data-title') || ''; descEl.textContent = thumb.getAttribute('data-desc') || ''; overlay.classList.add('is-open'); }
    function close() { overlay.classList.remove('is-open'); }
    Array.prototype.slice.call(grid.querySelectorAll('.lightbox-thumb')).forEach(function (thumb) { thumb.addEventListener('click', function () { open(thumb); }); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  initLightbox();

  /* ---- Cursor-follow preview ---- */
  function initCursorPreview() {
    var list = document.getElementById('cfpList');
    var preview = document.getElementById('cfpPreview');
    if (!list || !preview) return;
    var rows = Array.prototype.slice.call(list.querySelectorAll('.cfp-row'));
    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        preview.textContent = row.getAttribute('data-preview') || '';
        preview.style.background = row.getAttribute('data-color') || '#0A1220';
        preview.classList.add('is-visible');
      });
      row.addEventListener('mouseleave', function () { preview.classList.remove('is-visible'); });
    });
    list.addEventListener('mousemove', function (e) { preview.style.transform = 'translate(' + (e.clientX + 20) + 'px,' + (e.clientY - 60) + 'px) scale(1)'; });
  }
  initCursorPreview();

  /* ---- SVG goo blob merge ---- */
  function initGoo() {
    var group = document.getElementById('gooGroup');
    if (!group) return;
    var blobs = Array.prototype.slice.call(group.querySelectorAll('.goo-blob'));
    var start = performance.now();
    function frame(t) {
      var elapsed = (t - start) * 0.001;
      blobs.forEach(function (b, i) {
        var baseX = 180 + i * 80;
        var x = baseX + Math.sin(elapsed * 0.8 + i * 2.1) * 60;
        var y = 110 + Math.cos(elapsed * 0.6 + i * 1.4) * 26;
        b.setAttribute('cx', x.toFixed(1));
        b.setAttribute('cy', y.toFixed(1));
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  initGoo();

  /* ---- Sound pads (Web Audio) ---- */
  function initSoundPads() {
    var pads = document.getElementById('soundPads');
    if (!pads) return;
    var audioCtx = null;
    function playTone(freq) {
      if (!audioCtx) { var Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return; audioCtx = new Ctx(); }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.42);
    }
    Array.prototype.slice.call(pads.querySelectorAll('.sound-pad')).forEach(function (pad) {
      pad.addEventListener('click', function () {
        var freq = parseFloat(pad.getAttribute('data-note')) || 440;
        playTone(freq);
        pad.classList.add('is-hit');
        setTimeout(function () { pad.classList.remove('is-hit'); }, 220);
      });
    });
  }
  initSoundPads();

  /* ---- View Transitions grid/list toggle ---- */
  function initViewTransitions() {
    var container = document.getElementById('vtContainer');
    var gridBtn = document.getElementById('vtGridBtn');
    var listBtn = document.getElementById('vtListBtn');
    if (!container || !gridBtn || !listBtn) return;
    function applyView(mode) {
      container.classList.toggle('vt-grid-view', mode === 'grid');
      container.classList.toggle('vt-list-view', mode === 'list');
      gridBtn.classList.toggle('is-active', mode === 'grid');
      listBtn.classList.toggle('is-active', mode === 'list');
    }
    function switchView(mode) {
      if (document.startViewTransition) document.startViewTransition(function () { applyView(mode); });
      else applyView(mode);
    }
    gridBtn.addEventListener('click', function () { switchView('grid'); });
    listBtn.addEventListener('click', function () { switchView('list'); });
  }
  initViewTransitions();
})();
