import * as THREE from "three";
import TWEEN from "three/examples/jsm/libs/tween.module";
import init from "./init";

import "./style.css";

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.z = 30;

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//   color: "gray",
//   wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

const gruop = new THREE.Group();
const geometry = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.ConeGeometry(0.5, 1, 32),
  new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
  new THREE.TorusGeometry(0.5, 0.2, 32, 100),
  new THREE.TorusKnotGeometry(0.5, 0.2, 32, 100),
  new THREE.IcosahedronGeometry(0.5, 32),
  new THREE.OctahedronGeometry(0.5, 32),
  new THREE.DodecahedronGeometry(0.5, 32),
];

let index = 0;

for (let i = -5; i <= 5; i += 5) {
  for (let j = -5; j <= 5; j += 5) {
    const material = new THREE.MeshBasicMaterial({
      color: "gray",
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry[index], material);

    mesh.position.set(i, j, 10);
    mesh.index = index;
    mesh.basePosition = new THREE.Vector3(i, j, 10);

    gruop.add(mesh);
    index++;
  }
}
scene.add(gruop);
let activeIndex = -1;
const resetActive = () => {
  gruop.children[activeIndex].material.color.set("gray");
  new TWEEN.Tween(gruop.children[activeIndex].position)
    .to(
      {
        x: gruop.children[activeIndex].basePosition.x,
        y: gruop.children[activeIndex].basePosition.y,
        z: gruop.children[activeIndex].basePosition.z,
      },
      Math.random() * 1000 + 1000
    )
    .easing(TWEEN.Easing.Exponential.InOut)
    .start();
  activeIndex = -1;
};

const clock = new THREE.Clock();

const tick = () => {
  const delta = clock.getDelta();
  if (activeIndex !== -1) {
    gruop.children[activeIndex].rotation.x += delta;
    gruop.children[activeIndex].rotation.y += delta;
    gruop.children[activeIndex].rotation.z += delta;
  }

  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

const raycaster = new THREE.Raycaster();

const handleClick = (event) => {
  const pointer = new THREE.Vector2();
  pointer.x = (event.clientX / sizes.width) * 2 - 1;
  pointer.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(gruop.children);
  if (activeIndex !== -1) {
    resetActive();
  }
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set("red");

    activeIndex = intersects[i].object.index;

    new TWEEN.Tween(intersects[i].object.position)
      .to(
        {
          x: 0,
          y: 0,
          z: 20,
        },
        Math.random() * 1000 + 1000
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
};

document.addEventListener("click", handleClick);

/** Базові роботодавці подій для підтримки ресайзу */
window.addEventListener("resize", () => {
  // Оновлюємо розміри
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Оновлюємо співвідношення сторін камери
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Оновлюємо renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
