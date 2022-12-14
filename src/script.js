import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import './style.css'
import './index.html'
import anime from 'animejs/lib/anime.es.js';

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml6 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({ loop: true })
    .add({
        targets: '.ml6 .letter',
        translateY: ["1.6em", 0],
        translateZ: 0,
        duration: 1500,
        delay: (el, i) => 50 * i
    }).add({
        targets: '.ml6',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });

// Wrap every letter in a span
var phraseWrapper = document.querySelectorAll('.ml13');

phraseWrapper.forEach(div => {

    div.innerHTML = div.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

})



anime.timeline({ loop: true })
    .add({
        targets: '.ml13 .letter',
        translateY: [100, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 500,
        delay: (el, i) => 300 + 30 * i
    }).add({
        targets: '.ml13 .letter',
        translateY: [0, -100],
        opacity: [1, 0],
        easing: "easeInExpo",
        duration: 300,
        delay: (el, i) => 100 + 30 * i
    });

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const light = new THREE.PointLight(0xC2EAEF, 0.6, 100, 2)
//const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 

light.position.set(0.8, 10, 5.0)
scene.add(light)

const ambientLight = new THREE.AmbientLight(0xC2EAEF, 1.2)
scene.add(ambientLight)

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
//scene.add(mesh)

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'casa.fbx',
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        object.scale.set(.01, .01, .01)
        object.position.y = -1;
        object.castShadow = true;
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

fbxLoader.load(
    'eevee.hipoly.fbx',
    (object) => {
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        object.scale.set(.5, .5, .5)
        object.position.y = -1.2;
        object.position.x = 2;
        object.rotation.y = Math.PI * 0.5
        object.castShadow = true;
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


})

// window.addEventListener('dblclick', () => {
//     const  fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
//     if (!fullscreenElement){
//         if(canvas.requestFullscreen){
//             canvas.requestFullscreen();
//         }

//         else if (canvas.webkitRequestFullscreen){
//             canvas.webkitRequestFullscreen();
//         }
//     }

//     else{
//         if(document.exitFullscreen){
//             document.exitFullscreen();
//         }

//         else if (canvas.webkitExitFullscreen){
//             document.webkitExitFullscreen();
//         }
//     }
// })

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 6
camera.position.y = 0.5
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(0, -3, -6);
controls.update();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true

})
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()