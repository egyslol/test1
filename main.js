import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

let scene, camera, renderer, sphere;
let isDragging = false;
let lon = 0, lat = 0;
let prev = { x: 0, y: 0 };

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  const texture = new THREE.TextureLoader().load('test1.jpg');
  const material = new THREE.MeshBasicMaterial({ map: texture });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  animate();

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
  isDragging = true;
  prev.x = event.clientX;
  prev.y = event.clientY;
}

function onMouseMove(event) {
  if (!isDragging) return;

  const dx = event.clientX - prev.x;
  const dy = event.clientY - prev.y;

  lon -= dx * 0.1;
  lat += dy * 0.1;

  prev.x = event.clientX;
  prev.y = event.clientY;
}

function onMouseUp() {
  isDragging = false;
}

function animate() {
  requestAnimationFrame(animate);

  lat = Math.max(-85, Math.min(85, lat));
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);

  camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
  camera.target.y = 500 * Math.cos(phi);
  camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
  camera.lookAt(camera.target);

  renderer.render(scene, camera);
}
