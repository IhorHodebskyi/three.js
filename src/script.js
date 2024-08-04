import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

// Сцена
const scene = new THREE.Scene();
const canvas = document.querySelector(".canvas");

// Камера
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

scene.add(camera);

// Объект
// const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
// const geometry = new THREE.CircleGeometry(3, 32, 0, Math.PI * 2);
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
//
// const geometry = new THREE.IcosahedronGeometry(1, 0);
// const geometry = new THREE.ConeGeometry(1, 2, 32, 50, true, 0, Math.PI);
// const geometry = new THREE.CylinderGeometry(
//   11,
//   1,
//   2,
//   32,
//   50,
//   true,
//   0,
//   Math.PI * 2
// );

// const geometry = new THREE.RingGeometry(1, 3, 32, 50, 0, Math.PI * 2);

const amount = 50;
const points = new Float32Array(amount * 3 * 3);

for (let i = 0; i < amount * 3 * 3; i++) {
  points[i] = (Math.random() - 0.5) * 10;
}

const pointsBuffer = new THREE.BufferAttribute(points, 3);
const geometry = new THREE.BufferGeometry();

geometry.setAttribute("position", pointsBuffer);

const material = new THREE.MeshBasicMaterial({
  color: "yellow",
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const mouse = (event) => {
  cursor.x = -(event.clientX / sizes.width - 0.5);
  cursor.y = event.clientY / sizes.height - 0.5;
};

window.addEventListener("mousemove", mouse);

const tick = () => {
  // camera.position.x = cursor.x * 5;
  // camera.position.y = cursor.y * 5;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});
window.addEventListener("dblclick", () => {
  document.fullscreenElement
    ? document.exitFullscreen()
    : canvas.requestFullscreen();
});
