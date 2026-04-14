/* ============================================
   VYTAL — SVG Exercise Animations
   Detailed anatomical stick figures with
   muscle highlights and smooth movement
   ============================================ */
(function() {
  'use strict';

  var SKIN = '#C4BDB3';
  var SKIN_LIGHT = '#D4CFC7';
  var BONE = '#A09888';
  var BENCH = '#D4CFC7';
  var BENCH_DARK = '#B8B0A4';
  var FLOOR = '#E8E3DC';
  var TERRA = 'var(--push-terracotta)';
  var TERRA_SOFT = 'var(--push-terracotta-medium)';
  var SAGE = 'var(--pull-sage)';
  var SAGE_SOFT = 'var(--pull-sage-medium)';

  /* Helper: create animated group with translate */
  function anim(content, dy, dur) {
    return '<g>' + content +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,0;0,' + dy + ';0,0" dur="' + (dur || 3) + 's" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
  }

  /* Helper: person body base */
  function body(cx, cy, opts) {
    opts = opts || {};
    var s = opts.scale || 1;
    var headR = 7 * s;
    var color = opts.color || SKIN;
    var head = '<circle cx="' + cx + '" cy="' + cy + '" r="' + headR + '" fill="' + color + '"/>';
    return head;
  }

  /* Helper: limb line */
  function limb(x1, y1, x2, y2, w, color) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' +
      'stroke="' + (color || SKIN) + '" stroke-width="' + (w || 2.5) + '" stroke-linecap="round"/>';
  }

  /* Helper: muscle highlight */
  function muscle(cx, cy, rx, ry, color, opacity) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" ' +
      'fill="' + color + '" opacity="' + (opacity || 0.25) + '"/>';
  }

  /* Helper: barbell */
  function barbell(x, y, w, plateW, plateH, color) {
    var bar = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="3" rx="1.5" fill="' + color + '"/>';
    var lp = '<rect x="' + (x - plateW + 2) + '" y="' + (y - (plateH - 3) / 2) + '" width="' + plateW + '" height="' + plateH + '" rx="2.5" fill="' + color + '" opacity="0.55"/>';
    var rp = '<rect x="' + (x + w - 2) + '" y="' + (y - (plateH - 3) / 2) + '" width="' + plateW + '" height="' + plateH + '" rx="2.5" fill="' + color + '" opacity="0.55"/>';
    return bar + lp + rp;
  }

  /* Helper: dumbbell */
  function dumbbell(cx, cy, len, color) {
    var half = len / 2;
    var bar = '<rect x="' + (cx - half) + '" y="' + (cy - 1.5) + '" width="' + len + '" height="3" rx="1.5" fill="' + color + '"/>';
    var lp = '<circle cx="' + (cx - half) + '" cy="' + cy + '" r="4.5" fill="' + color + '" opacity="0.5"/>';
    var rp = '<circle cx="' + (cx + half) + '" cy="' + cy + '" r="4.5" fill="' + color + '" opacity="0.5"/>';
    return bar + lp + rp;
  }

  var exercises = {};

  /* ==========================================
     PUSH EXERCISES
     ========================================== */

  exercises.press_banca = function() {
    var svg = '';
    // Floor
    svg += '<rect x="0" y="106" width="200" height="14" rx="0" fill="' + FLOOR + '"/>';
    // Bench
    svg += '<rect x="38" y="80" width="124" height="7" rx="3.5" fill="' + BENCH + '"/>';
    svg += '<rect x="55" y="87" width="6" height="19" rx="2" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="139" y="87" width="6" height="19" rx="2" fill="' + BENCH_DARK + '"/>';
    // Rack posts
    svg += '<rect x="28" y="26" width="4" height="64" rx="2" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="168" y="26" width="4" height="64" rx="2" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="26" y="26" width="8" height="4" rx="2" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="166" y="26" width="8" height="4" rx="2" fill="' + BENCH_DARK + '"/>';
    // Person lying on bench
    svg += '<ellipse cx="100" cy="75" rx="34" ry="5.5" fill="' + SKIN_LIGHT + '"/>'; // torso
    svg += '<circle cx="60" cy="71" r="7.5" fill="' + SKIN + '"/>'; // head
    // Legs hanging
    svg += limb(125, 78, 140, 95, 2.5, SKIN);
    svg += limb(140, 95, 138, 106, 2.5, SKIN);
    svg += limb(120, 78, 132, 95, 2.5, SKIN);
    svg += limb(132, 95, 130, 106, 2.5, SKIN);
    // Chest muscle highlight
    svg += muscle(90, 72, 18, 6, TERRA, 0.15);
    // Animated barbell + arms
    var moving = '';
    moving += barbell(18, 43, 164, 16, 16, TERRA);
    moving += limb(76, 73, 68, 45, 2.8, SKIN);
    moving += limb(124, 73, 132, 45, 2.8, SKIN);
    // Small deltoid circles
    moving += '<circle cx="68" cy="45" r="3" fill="' + TERRA + '" opacity="0.3"/>';
    moving += '<circle cx="132" cy="45" r="3" fill="' + TERRA + '" opacity="0.3"/>';
    svg += anim(moving, 22, 3);
    return svg;
  };

  exercises.press_inclinado = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Incline bench
    svg += '<path d="M44 98 L74 48 L80 48 L50 98 Z" fill="' + BENCH + '"/>';
    svg += '<rect x="50" y="95" width="94" height="6" rx="3" fill="' + BENCH + '"/>';
    svg += '<rect x="52" y="101" width="5" height="5" rx="1" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="137" y="101" width="5" height="5" rx="1" fill="' + BENCH_DARK + '"/>';
    // Person on incline
    svg += '<circle cx="70" cy="44" r="7" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="86" cy="68" rx="8" ry="22" transform="rotate(-20 86 68)" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Upper chest highlight
    svg += muscle(80, 58, 10, 6, TERRA, 0.2);
    // Legs
    svg += limb(98, 82, 118, 96, 2.5, SKIN);
    svg += limb(118, 96, 120, 106, 2.5, SKIN);
    svg += limb(95, 82, 112, 96, 2.5, SKIN);
    svg += limb(112, 96, 114, 106, 2.5, SKIN);
    // Animated dumbbells + arms
    var moving = '';
    moving += dumbbell(60, 48, 18, TERRA);
    moving += dumbbell(116, 48, 18, TERRA);
    moving += limb(78, 60, 62, 48, 2.5, SKIN);
    moving += limb(94, 60, 114, 48, 2.5, SKIN);
    svg += anim(moving, 20, 3);
    return svg;
  };

  exercises.pec_deck = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Machine frame
    svg += '<rect x="90" y="20" width="20" height="86" rx="3" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="85" y="20" width="30" height="6" rx="3" fill="' + BENCH_DARK + '"/>';
    // Seat
    svg += '<rect x="82" y="80" width="36" height="6" rx="3" fill="' + BENCH + '"/>';
    svg += '<rect x="95" y="86" width="10" height="20" rx="2" fill="' + BENCH_DARK + '"/>';
    // Person seated (front view)
    svg += '<circle cx="100" cy="52" r="8" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="100" cy="72" rx="12" ry="12" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Chest highlight
    svg += muscle(100, 68, 10, 7, TERRA, 0.2);
    // Legs
    svg += limb(92, 83, 82, 100, 2.5, SKIN);
    svg += limb(82, 100, 84, 106, 2.5, SKIN);
    svg += limb(108, 83, 118, 100, 2.5, SKIN);
    svg += limb(118, 100, 116, 106, 2.5, SKIN);
    // Animated arms with pads
    var moving = '';
    // Left arm + pad
    moving += '<rect x="38" y="56" width="8" height="20" rx="4" fill="' + BENCH_DARK + '"/>';
    moving += limb(88, 68, 48, 66, 2.8, SKIN);
    // Right arm + pad
    moving += '<rect x="154" y="56" width="8" height="20" rx="4" fill="' + BENCH_DARK + '"/>';
    moving += limb(112, 68, 152, 66, 2.8, SKIN);
    // Connecting arcs (machine arms)
    moving += '<path d="M42 56 Q42 30 90 24" stroke="' + BENCH_DARK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    moving += '<path d="M158 56 Q158 30 110 24" stroke="' + BENCH_DARK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';

    // Use horizontal squeeze animation
    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="30,0;0,0;30,0" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.press_militar = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Person standing (front view)
    svg += '<circle cx="100" cy="32" r="8" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="100" cy="58" rx="14" ry="18" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Shoulder highlight
    svg += muscle(84, 44, 6, 5, TERRA, 0.25);
    svg += muscle(116, 44, 6, 5, TERRA, 0.25);
    // Legs
    svg += limb(93, 76, 88, 96, 2.8, SKIN);
    svg += limb(88, 96, 88, 106, 2.8, SKIN);
    svg += limb(107, 76, 112, 96, 2.8, SKIN);
    svg += limb(112, 96, 112, 106, 2.8, SKIN);
    // Animated barbell + arms going up
    var moving = '';
    moving += barbell(22, 38, 156, 14, 14, TERRA);
    moving += limb(86, 48, 66, 40, 2.8, SKIN);
    moving += limb(114, 48, 134, 40, 2.8, SKIN);
    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,24;0,0;0,24" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.elevaciones_laterales = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Person standing (front view)
    svg += '<circle cx="100" cy="30" r="8" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="100" cy="56" rx="13" ry="18" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Lateral deltoid highlight
    svg += muscle(82, 42, 7, 5, TERRA, 0.3);
    svg += muscle(118, 42, 7, 5, TERRA, 0.3);
    // Legs
    svg += limb(93, 74, 90, 96, 2.8, SKIN);
    svg += limb(90, 96, 90, 106, 2.8, SKIN);
    svg += limb(107, 74, 110, 96, 2.8, SKIN);
    svg += limb(110, 96, 110, 106, 2.8, SKIN);
    // Animated arms + dumbbells raising to sides
    var moving = '';
    moving += dumbbell(50, 68, 14, TERRA);
    moving += dumbbell(150, 68, 14, TERRA);
    moving += limb(86, 46, 52, 68, 2.5, SKIN);
    moving += limb(114, 46, 148, 68, 2.5, SKIN);

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="18,16;0,0;18,16" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.extension_triceps = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Cable machine
    svg += '<rect x="92" y="8" width="16" height="98" rx="3" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="86" y="8" width="28" height="6" rx="3" fill="' + BENCH_DARK + '"/>';
    // Person standing (side view facing left)
    svg += '<circle cx="68" cy="34" r="7.5" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="72" cy="58" rx="10" ry="17" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Triceps highlight
    svg += muscle(80, 52, 5, 8, TERRA, 0.3);
    // Legs
    svg += limb(68, 75, 62, 96, 2.8, SKIN);
    svg += limb(62, 96, 64, 106, 2.8, SKIN);
    svg += limb(76, 75, 78, 96, 2.8, SKIN);
    svg += limb(78, 96, 78, 106, 2.8, SKIN);
    // Cable from machine
    svg += '<line x1="98" y1="14" x2="98" y2="28" stroke="' + BONE + '" stroke-width="1.5"/>';
    // Animated forearms + cable handle
    var moving = '';
    // Upper arms (fixed, elbows at sides)
    svg += limb(80, 44, 82, 58, 2.5, SKIN); // right upper arm
    // Cable going to hands
    moving += '<line x1="98" y1="28" x2="84" y2="56" stroke="' + BONE + '" stroke-width="1.5"/>';
    // Forearms extending down
    moving += limb(82, 58, 84, 56, 2.8, SKIN);
    // Handle
    moving += '<rect x="78" y="54" width="12" height="4" rx="2" fill="' + TERRA + '"/>';

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,0;0,22;0,0" dur="2.5s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  /* ==========================================
     PULL EXERCISES
     ========================================== */

  exercises.jalon_pecho = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Machine
    svg += '<rect x="90" y="6" width="20" height="100" rx="3" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="82" y="6" width="36" height="6" rx="3" fill="' + BENCH_DARK + '"/>';
    // Seat + thigh pad
    svg += '<rect x="78" y="82" width="44" height="5" rx="2.5" fill="' + BENCH + '"/>';
    svg += '<rect x="82" y="74" width="36" height="4" rx="2" fill="' + BENCH + '"/>';
    svg += '<rect x="95" y="87" width="10" height="19" rx="2" fill="' + BENCH_DARK + '"/>';
    // Person seated
    svg += '<circle cx="100" cy="44" r="8" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="100" cy="64" rx="14" ry="14" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Lat highlight
    svg += muscle(86, 62, 8, 10, SAGE, 0.2);
    svg += muscle(114, 62, 8, 10, SAGE, 0.2);
    // Legs
    svg += limb(90, 82, 82, 98, 2.5, SKIN);
    svg += limb(82, 98, 84, 106, 2.5, SKIN);
    svg += limb(110, 82, 118, 98, 2.5, SKIN);
    svg += limb(118, 98, 116, 106, 2.5, SKIN);
    // Animated bar + arms pulling down
    var moving = '';
    moving += '<rect x="30" y="16" width="140" height="3" rx="1.5" fill="' + SAGE + '"/>';
    moving += '<rect x="28" y="12" width="6" height="10" rx="2" fill="' + SAGE + '" opacity="0.6"/>';
    moving += '<rect x="166" y="12" width="6" height="10" rx="2" fill="' + SAGE + '" opacity="0.6"/>';
    // Cable connections
    moving += '<line x1="98" y1="12" x2="50" y2="17" stroke="' + BONE + '" stroke-width="1.5"/>';
    moving += '<line x1="102" y1="12" x2="150" y2="17" stroke="' + BONE + '" stroke-width="1.5"/>';
    // Arms
    moving += limb(86, 54, 54, 18, 2.8, SKIN);
    moving += limb(114, 54, 146, 18, 2.8, SKIN);

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,0;0,36;0,0" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.remo_barra = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Person bent over (side view)
    svg += '<circle cx="56" cy="38" r="7.5" fill="' + SKIN + '"/>'; // head
    // Torso angled
    svg += '<ellipse cx="80" cy="52" rx="22" ry="8" transform="rotate(-15 80 52)" fill="' + SKIN_LIGHT + '"/>';
    // Back highlight
    svg += muscle(82, 48, 16, 7, SAGE, 0.2);
    // Legs
    svg += limb(96, 58, 104, 84, 3, SKIN);
    svg += limb(104, 84, 100, 106, 2.8, SKIN);
    svg += limb(92, 58, 88, 84, 3, SKIN);
    svg += limb(88, 84, 86, 106, 2.8, SKIN);
    // Animated barbell + arms pulling up
    var moving = '';
    moving += barbell(28, 72, 120, 12, 12, SAGE);
    moving += limb(72, 56, 60, 73, 2.5, SKIN);
    moving += limb(90, 56, 106, 73, 2.5, SKIN);

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,8;0,-14;0,8" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.remo_mancuerna = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Flat bench
    svg += '<rect x="30" y="78" width="80" height="6" rx="3" fill="' + BENCH + '"/>';
    svg += '<rect x="40" y="84" width="5" height="22" rx="2" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="95" y="84" width="5" height="22" rx="2" fill="' + BENCH_DARK + '"/>';
    // Person bent over, one knee on bench
    svg += '<circle cx="110" cy="42" r="7" fill="' + SKIN + '"/>'; // head
    // Torso parallel
    svg += '<ellipse cx="92" cy="56" rx="22" ry="8" transform="rotate(-5 92 56)" fill="' + SKIN_LIGHT + '"/>';
    // Lat highlight (one side)
    svg += muscle(100, 52, 12, 6, SAGE, 0.25);
    // Left knee on bench, left hand on bench
    svg += limb(72, 60, 62, 78, 2.5, SKIN); // left arm on bench
    svg += '<circle cx="62" cy="78" r="3" fill="' + SKIN + '"/>'; // hand
    svg += limb(78, 62, 70, 78, 2.5, SKIN); // left thigh
    svg += limb(70, 78, 68, 82, 2, SKIN); // knee on bench
    // Right leg standing
    svg += limb(100, 62, 114, 86, 2.8, SKIN);
    svg += limb(114, 86, 112, 106, 2.8, SKIN);
    // Animated right arm + dumbbell
    var moving = '';
    moving += dumbbell(130, 72, 16, SAGE);
    moving += limb(106, 56, 128, 72, 2.8, SKIN);

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,8;0,-16;0,8" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.face_pulls = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Cable machine on right
    svg += '<rect x="160" y="10" width="16" height="96" rx="3" fill="' + BENCH_DARK + '"/>';
    svg += '<rect x="156" y="10" width="24" height="6" rx="3" fill="' + BENCH_DARK + '"/>';
    // Person standing facing machine
    svg += '<circle cx="80" cy="32" r="8" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="80" cy="56" rx="13" ry="18" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Rear delt highlight
    svg += muscle(68, 42, 5, 5, SAGE, 0.3);
    svg += muscle(92, 42, 5, 5, SAGE, 0.3);
    // Legs
    svg += limb(74, 74, 70, 96, 2.8, SKIN);
    svg += limb(70, 96, 72, 106, 2.8, SKIN);
    svg += limb(86, 74, 90, 96, 2.8, SKIN);
    svg += limb(90, 96, 88, 106, 2.8, SKIN);
    // Animated cable + arms pulling to face
    var moving = '';
    // Rope
    moving += '<line x1="166" y1="38" x2="110" y2="40" stroke="' + BONE + '" stroke-width="2"/>';
    // Arms pulling back
    moving += limb(88, 44, 110, 38, 2.5, SKIN);
    moving += limb(72, 44, 110, 42, 2.5, SKIN);
    // Rope ends in hands
    moving += '<circle cx="110" cy="38" r="3" fill="' + SAGE + '"/>';
    moving += '<circle cx="110" cy="42" r="3" fill="' + SAGE + '"/>';

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="28,4;0,0;28,4" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.curl_predicador = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Preacher bench
    svg += '<path d="M70 50 L110 80 L110 84 L70 54 Z" fill="' + BENCH + '"/>'; // angled pad
    svg += '<rect x="108" y="80" width="30" height="5" rx="2.5" fill="' + BENCH + '"/>'; // seat
    svg += '<rect x="118" y="85" width="8" height="21" rx="2" fill="' + BENCH_DARK + '"/>';
    // Person
    svg += '<circle cx="120" cy="46" r="7.5" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="116" cy="66" rx="10" ry="14" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Bicep highlight
    svg += muscle(88, 58, 5, 8, SAGE, 0.3);
    // Upper arm on pad (fixed)
    svg += limb(106, 56, 88, 66, 2.8, SKIN);
    // Animated forearm + dumbbell curling
    var moving = '';
    moving += dumbbell(76, 78, 14, SAGE);
    moving += limb(88, 66, 78, 78, 2.8, SKIN);

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,0;6,-20;0,0" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  exercises.curl_martillo = function() {
    var svg = '';
    svg += '<rect x="0" y="106" width="200" height="14" fill="' + FLOOR + '"/>';
    // Person standing (front view)
    svg += '<circle cx="100" cy="28" r="8" fill="' + SKIN + '"/>'; // head
    svg += '<ellipse cx="100" cy="54" rx="14" ry="18" fill="' + SKIN_LIGHT + '"/>'; // torso
    // Forearm/brachioradialis highlight
    svg += muscle(78, 64, 5, 10, SAGE, 0.3);
    svg += muscle(122, 64, 5, 10, SAGE, 0.3);
    // Legs
    svg += limb(93, 72, 90, 96, 2.8, SKIN);
    svg += limb(90, 96, 90, 106, 2.8, SKIN);
    svg += limb(107, 72, 110, 96, 2.8, SKIN);
    svg += limb(110, 96, 110, 106, 2.8, SKIN);
    // Upper arms fixed at sides
    svg += limb(86, 42, 80, 60, 2.5, SKIN);
    svg += limb(114, 42, 120, 60, 2.5, SKIN);
    // Animated forearms + vertical dumbbells (hammer grip)
    var moving = '';
    // Dumbbells held vertically
    moving += '<rect x="74" y="70" width="3" height="16" rx="1.5" fill="' + SAGE + '"/>';
    moving += '<circle cx="75.5" cy="70" r="4" fill="' + SAGE + '" opacity="0.5"/>';
    moving += '<circle cx="75.5" cy="86" r="4" fill="' + SAGE + '" opacity="0.5"/>';
    moving += '<rect x="123" y="70" width="3" height="16" rx="1.5" fill="' + SAGE + '"/>';
    moving += '<circle cx="124.5" cy="70" r="4" fill="' + SAGE + '" opacity="0.5"/>';
    moving += '<circle cx="124.5" cy="86" r="4" fill="' + SAGE + '" opacity="0.5"/>';
    // Forearms
    moving += limb(80, 60, 75, 78, 2.5, SKIN);
    moving += limb(120, 60, 125, 78, 2.5, SKIN);

    svg += '<g>' + moving +
      '<animateTransform attributeName="transform" type="translate" ' +
      'values="0,0;2,-26;0,0" dur="3s" ' +
      'calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" ' +
      'repeatCount="indefinite"/></g>';
    return svg;
  };

  /* --- Public API --- */
  window.VYTAL_SVG = {
    render: function(key) {
      if (exercises[key]) {
        return '<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          exercises[key]() + '</svg>';
      }
      return '<svg viewBox="0 0 200 120"><text x="100" y="60" text-anchor="middle" fill="#999" font-size="12">No disponible</text></svg>';
    },
    keys: Object.keys(exercises)
  };

})();
