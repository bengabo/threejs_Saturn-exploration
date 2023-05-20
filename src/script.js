import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000);

/**
 * Lights
 */
const hlight = new THREE.AmbientLight (0xd2def2,0.15);
  scene.add(hlight);

const directionalLight = new THREE.DirectionalLight(0xfff0c9,2);
  directionalLight.position.set(2.5,1.5,-3);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
   

/**
 * Geometries
 */

//Stars
const textureLoader = new THREE.TextureLoader()
const starsGeometry  = new THREE.SphereGeometry(500, 32, 32);
const starsMaterial  = new THREE.MeshBasicMaterial({
  map: textureLoader.load('/textures/galaxy_starfield.png'),
  side: THREE.BackSide,
  // shininess: 0,
});
const starsMesh  = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(starsMesh);

//Saturn
let saturn;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./saturn_with_rings/scene.gltf', function(gltf){
  saturn = gltf.scene.children[0];
  saturn.scale.set(30,30,30);
  saturn.rotation.x = 1
  scene.add(gltf.scene);
  tick();
});
 

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
* Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = 5;
camera.position.y = 4;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 200;
controls.maxDistance = 1000;

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
* Animate
*/
const clock = new THREE.Clock();

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();

  // Saturn controls
  // saturn.rotation.z = 0.1 * elapsedTime

  saturn.rotation.z = 0.1 * elapsedTime;
  // saturn.rotation.x += 0.0001 * elapsedTime;
  // saturn.rotation.y -= 0.0001 * elapsedTime;
  camera.position.z -= 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick();