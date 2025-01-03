import * as THREE from 'three';

const FOV = 75;
const VIEW_RANGE = [0.1, 1000];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    FOV,
    window.innerWidth / window.innerHeight,
    VIEW_RANGE[0],
    VIEW_RANGE[1]
);
camera.position.z = 5;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

{
    const color = 0xFFFFFF;
    const intensity = 50;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 0, 0);
    scene.add(light);
}

const meshes = {
    "sun": new THREE.Mesh(
        new THREE.SphereGeometry(1, 4, 4),
        new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 })
    ),
    "earth": new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 3, 3),
        new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 })
    ),
    "moon": new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 4, 4),
        new THREE.MeshPhongMaterial({ color: 0x888888 })
    ),
    "trail": new THREE.Mesh(
        new THREE.CircleGeometry(0.01, 4),
        new THREE.MeshBasicMaterial({ color: 0xFF0000 })
    ),
};

/**
 * @param {string} meshName
 * @param {THREE.Scene | THREE.Mesh | THREE.Object3D} targetScene
 */
function createObject(meshName, targetScene = scene) {
    /** @type {THREE.Mesh} */
    const mesh = meshes[meshName].clone();
    targetScene.add(mesh);
    return mesh;
}

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);

const sun = createObject("sun", solarSystem);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 2;
solarSystem.add(earthOrbit);

const earth = createObject("earth", earthOrbit);

const moon = createObject("moon", earthOrbit);
moon.position.x = 0.5;

const trail = [];

/**
 * @param {number} time
 */

const SUN_ROTATION = 1;
const EARTH_REVOLUTION = 1;
const EARTH_ROTATION = 10;
const MOON_REVOLUTION = 10;
const MOON_ROTATION = 1;
const TRAIL_LENGTH = 376;

/**
 * @param {number} time
 */
function animate(time) {
    const timeInSeconds = time / 1000;

    solarSystem.rotation.z = timeInSeconds * EARTH_REVOLUTION;
    sun.rotation.z = timeInSeconds * SUN_ROTATION;

    earthOrbit.rotation.z = timeInSeconds * MOON_REVOLUTION;
    earth.rotation.z = timeInSeconds * EARTH_ROTATION;
    moon.rotation.z = timeInSeconds * MOON_ROTATION;

    const trailElement = createObject("trail");
    trailElement.position.copy(moon.getWorldPosition(new THREE.Vector3()));
    trail.push(trailElement);
    if (trail.length > TRAIL_LENGTH) {
        scene.remove(trail.shift());
    }

    renderer.render(scene, camera);
}