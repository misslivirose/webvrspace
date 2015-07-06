function createSpaceScene() {
	//Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {hideButton: false});

// Add audio
var listener = new THREE.AudioListener();
camera.add(listener);

var sound = new THREE.Audio(listener);
sound.load("saturn.wav");
sound.autoplay = true;

// Create the home planet

var geo_earth = new THREE.SphereGeometry(13.5, 32, 32);
var txtr_earth = THREE.ImageUtils.loadTexture('earth.jpg');
var mat_earth = new THREE.MeshBasicMaterial({map: txtr_earth});

var planet = new THREE.Mesh(geo_earth, mat_earth);
// Position planet mesh

planet.position.z = -1;
planet.position.y = -15; // Planet should be directly below the camera
planet.add(sound);
scene.add(planet);

// Create the skybox as a background
var boxWidth = 30;
var txtr_skybox = THREE.ImageUtils.loadTexture('space.jpg');
txtr_skybox.wrapS = THREE.RepeatWrapping;
txtr_skybox.wrapT = THREE.RepeatWrapping;
//txtr_skybox.repeat.set(2, 2);

var geo_skybox = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
var mat_skybox = new THREE.MeshBasicMaterial({
          map: txtr_skybox,
          color: 0xffffff,
          side: THREE.BackSide});
          
var geo_sun = new THREE.SphereGeometry(2, 32, 32);
var mat_sun = new THREE.MeshBasicMaterial({});

var skybox = new THREE.Mesh(geo_skybox, mat_skybox);
scene.add(skybox);

// Create moon
var geo_moon = new THREE.SphereGeometry(1, 32, 32);
var txtr_moon = THREE.ImageUtils.loadTexture('moon.jpg');
var mat_moon = new THREE.MeshBasicMaterial({map: txtr_moon});

var moon = new THREE.Mesh(geo_moon, mat_moon);

moon.position.z = -12;
moon.position.x = 9;
moon.position.y = 2;
scene.add(moon);

var degree = 0;

// Request animation frame loop function
function animate() {
  // Apply rotation to planet
  planet.rotation.y += 0.0001;
  
  // Radius of moon orbit is 9 
  // Y value stays constant
  // X, Z orbits circle: x^2 + z^2 = 81
  // Use Date.GetSeconds() * 6 for degree value
  // X, Z = 7cos(s), 7sin(s)
  function orbit()
  {
    moon.position.z =  9 * Math.cos(degree);
    moon.position.x =  9 * Math.sin(degree);
    moon.position.y = -9 * Math.cos(degree);
    degree+= 0.001;
  }
  
  orbit();
  // Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the manager.
  manager.render(scene, camera);

  requestAnimationFrame(animate);
}
// Reset the position sensor when 'z' pressed.
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.resetSensor();
  }
};

window.addEventListener('keydown', onKey, true);

// Handle window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize, false);
}
