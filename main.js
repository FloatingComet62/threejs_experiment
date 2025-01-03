import * as THREE from 'three';

const FOV = 75;
const VIEW_RANGE = [0.1, 1000];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    FOV,
    window.innerWidth / window.innerHeight,
    VIEW_RANGE[0],
    VIEW_RANGE[1]
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}

const meshes = {
    // a material with a different color for each side of the cube
    "cube": new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        [
            new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
            new THREE.MeshPhongMaterial({ color: 0xff0000 }),
            new THREE.MeshPhongMaterial({ color: 0x0000ff }),
            new THREE.MeshPhongMaterial({ color: 0xffff00 }),
            new THREE.MeshPhongMaterial({ color: 0x00ffff }),
            new THREE.MeshPhongMaterial({ color: 0xff00ff })
        ]
    ),
    "green_cube": new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0x44aa88 })
    ),
    "purple_cube": new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0x8844aa })
    ),
    "yellow_cube": new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0xaa8844 })
    ),
    "wired_sphere": new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 8),
        new THREE.MeshBasicMaterial({ color: "red", wireframe: true })
    ),
    "circle": new THREE.Mesh(
        new THREE.CircleGeometry(1, 3),
        new THREE.MeshBasicMaterial({ color: "blue" })
    )
};

/**
 * @param {string} meshName
 */
function createObject(meshName) {
    /** @type {THREE.Mesh} */
    const mesh = meshes[meshName].clone();
    scene.add(mesh);
    return mesh;
}

const polygon = createObject("circle");

/**
 * @param {string} meshName
 * @param {number} xPosition
 */
function configureCube(meshName, xPosition) {
    const cube = createObject(meshName);
    cube.position.set(xPosition, 0, 0);
    return cube;
}
const cubes = [
    configureCube("green_cube", 0),
    configureCube("purple_cube", 2),
    configureCube("yellow_cube", -2),
];

camera.position.z = 5;

/**
 * @param {number} time
 */
function animate(time) {
    const timeInSeconds = time / 1000;
    cubes.forEach((cube, index) => {
        cube.rotation.x = timeInSeconds / 2;
        cube.position.y = Math.sin(timeInSeconds + index) * 2;
    });
    polygon.geometry.dispose();
    polygon.geometry = new THREE.CircleGeometry(1, 3 + Math.floor(timeInSeconds) % 32);

    renderer.render(scene, camera);
}