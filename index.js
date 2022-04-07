console.log("test");
import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.139.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/DRACOLoader.js";

import Stats from "https://unpkg.com/three@0.139.2/examples/jsm/libs/stats.module";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-25, 25, 50);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

//LIGHTS
var light = new THREE.DirectionalLight(0xffa95c, 4);
light.position.set(0, 50, 0);
light.rotation.set(50, 45, 45);

scene.add(light.target);
light.target.position.set(25, 25, 25);

light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;

light.shadow.bias = -0.0005;

light.castShadow = true;
light.shadow.mapSize.width = 512 * 8; // default
light.shadow.mapSize.height = 512 * 8; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500;
const helper = new THREE.DirectionalLightHelper(light, 5);
//scene.add(helper);
//scene.add(new THREE.CameraHelper(light.shadow.camera));

scene.add(light);

//SET HDRI
new RGBELoader()
  .setPath("./assets/")
  .load("venice_sunset_1k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    //scene.background = texture;
    scene.environment = texture;

    render();
  });

//LOAD GLTF
const loader = new GLTFLoader().setPath("./assets/");

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://unpkg.com/three@0.139.2/examples/js/libs/draco/"
);
loader.setDRACOLoader(dracoLoader);
loader.load("app-3d-st_draco.glb", function (gltf) {
  gltf.scene.traverse(function (obj) {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
  render();
});

//STATS
const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
