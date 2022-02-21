import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CharacterControls } from './characterControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 10, 40);

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(10, 5, 10);

// LIGHTS
light();

const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
//renderer.gammaOuput = true;
renderer.outputEncoding = THREE.sRGBEncoding;

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.update();

//x y z輔助線
/*const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);*/

// 初始化FPS顯示
let statsUI = initStats();

// Ground
ground();

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  'https://unpkg.com/three@0.137.5/examples/js/libs/draco/'
);
loader.setDRACOLoader(dracoLoader);

let clock = new THREE.Clock();
let model1, model2, mixer2, characterControls;
Promise.all([
  //loader.loadAsync('./models/Bridge.gltf'),
  loader.loadAsync('./models/littleman.gltf'),
])
  .then((results) => {
    // here the models are returned in deterministic order
    //const [modelA, modelB] = results;
    const [modelB] = results;
    /*model1 = modelA.scene;
    model1.scale.set(3, 3, 3);
    model1.position.x = 0;
    model1.position.y = 0;
    console.log('modelA: ', modelA);
    scene.add(model1);
*/
    model2 = modelB.scene;
    model2.scale.set(3, 3, 3);

    model2.rotation.y = 0.5;
    scene.add(model2);
    mixer2 = new THREE.AnimationMixer(model2);
    const animationsMap = new Map();
    //mixer.clipAction(modelB.animations[1]).play();
    modelB.animations.forEach((clip) => {
      animationsMap.set(clip.name, mixer2.clipAction(clip));
      //mixer2.clipAction(clip).play();
    });
    characterControls = new CharacterControls(
      model2,
      mixer2,
      animationsMap,
      orbitControls,
      camera,
      'course_chapeau'
    );
    console.log('modelB: ', modelB);

    window.addEventListener('resize', onWindowResize);

    animate();
  })
  .catch((err) => {
    console.log(err);
  });

const keysPressed = {};
document.addEventListener(
  'keydown',
  (e) => {
    if (e.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      keysPressed[e.key.toLowerCase()] = true;
    }
  },
  false
);
document.addEventListener(
  'keyup',
  (e) => {
    keysPressed[e.key.toLowerCase()] = false;
  },
  false
);

function animate() {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();

  if (mixer2) mixer2.update(delta);

  statsUI.update();
  orbitControls.update();

  if (characterControls) {
    characterControls.update(delta, keysPressed);
  }

  if (model2) {
    //toScreenPosition(model2, camera);
  }
  renderer.render(scene, camera);
}

// 建立監測器
function initStats() {
  const stats = new Stats();
  stats.setMode(0); // FPS mode
  document.getElementById('Stats-output').appendChild(stats.domElement);
  return stats;
}

// 建立光源
function light() {
  // Lights
  const hemiLight = new THREE.HemisphereLight(0x443333, 0x111122);
  hemiLight.name = 'hemiLight';
  scene.add(hemiLight);

  const spotLight = new THREE.SpotLight();
  spotLight.name = 'spotLight';
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.5;
  // spotLight.castShadow = true;
  spotLight.position.set(0, 10, 0);
  scene.add(spotLight);
}

function ground() {
  const map = new THREE.TextureLoader().load('./textures/uv_grid_opengl.jpg');
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(15, 15);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshPhongMaterial({
      color: 0x999999,
      specular: 0x101010,
      map,
    })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.0001;
  // plane.receiveShadow = true;
  scene.add(plane);
}

function toScreenPosition(obj, cam) {
  var vector = new THREE.Vector3();

  var widthHalf = 0.5 * renderer.context.canvas.width;
  var heightHalf = 0.5 * renderer.context.canvas.height;

  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(cam);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;
  let textDIV = document.getElementById('test');
  textDIV.style.left = vector.x + 'px';
  textDIV.style.top = vector.y - 350 + 'px';
  /*return {
    x: vector.x,
    y: vector.y,
  };*/
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
