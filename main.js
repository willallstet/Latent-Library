import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
if (window.innerWidth <= 600) {
  //document.body.style.display = 'none'; // Hide the entire body

  // Display a message for mobile users
  const errorMessage = document.createElement('div');
  errorMessage.innerHTML = 'This website does not work on mobile phones.';
  errorMessage.style.fontSize = '20px';
  errorMessage.style.textAlign = 'center';
  errorMessage.style.padding = '20px';
  errorMessage.style.color = '#FFFFFF'; // Adjust the color based on your design
  errorMessage.style.backgroundColor = '#000000'; // Adjust the background color based on your design
  document.body.appendChild(errorMessage);
}
else{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a modal container
  const modalContainer = document.createElement('div');
  modalContainer.style.position = 'absolute';
  modalContainer.style.top = '10px';
  modalContainer.style.left = '10px';
  modalContainer.style.padding = '10px';
  modalContainer.style.background = 'rgba(255, 255, 255, 1)';
  modalContainer.style.fontFamily = 'monospace';
  modalContainer.style.borderRadius = '0px';
  modalContainer.style.maxWidth = '33vw';
  modalContainer.style.zIndex = '1'; // Ensure the modal appears above the canvas
  document.body.appendChild(modalContainer);

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.innerHTML = '<h2>The Latent Library: <i>The Great Gatsby</i></h2><body>Each cube in the constellation represents a sentence in <i>The Great Gatsby</i> by F. Scott Fitzgerald. They are arranged by their latent embedding (reduced to three dimensions by SKLearn&apos;s TSNE algorithm) in the Google Universal Sentence Encoder. In effect, this means similar sentences are near each other. Use the arrow keys to move and the mouse to change the camera angle. Sentences in the crosshairs will be displayed in this window. Learn more <a href="https://willallstetter.com/latent" target="_blank">here</a>. Built by <a href="https://willallstetter.com" target="_blank">Will Allstetter</a>.</body>';
  modalContent.style.color = '#000';
  modalContainer.appendChild(modalContent);

  let cubes = []; // Use an array to store multiple cubes
  var embeddingLookup = {}; //dictionary

  // Variables for handling mouse movement
  let isMouseDown = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };

  // Variables for handling arrow key movement
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;

  // Raycaster for detecting intersections
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  async function fetchData() {
    try {
      const response =  await fetch('output1.json');
      const embeddingJson = await response.json();
      for (const key in embeddingJson) {
        if (Object.hasOwnProperty.call(embeddingJson, key)) {
          const item = embeddingJson[key];
          for (const property in item) {
            if (Object.hasOwnProperty.call(item, property)) {
              if (property === "Embedding") {
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
                const cube = new THREE.Mesh(geometry, material);
                const embeddingNumbers = item[property].match(/-?\d+\.?\d*/g).map(Number);
                cube.position.set(embeddingNumbers[0], embeddingNumbers[1], embeddingNumbers[2]);
                cubes.push(cube); // Add each cube to the array
                scene.add(cube);
                embeddingLookup[[embeddingNumbers[0], embeddingNumbers[1], embeddingNumbers[2]]] = item["Sentence"]
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  }

  fetchData();

  // Set up camera and controls
  camera.position.z = 100;
  const controls = new PointerLockControls(camera, document.body);

  // Enable pointer lock and add event listeners for mouse movement
  document.addEventListener('click', () => {
    controls.lock();
  });

  document.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Adjust the camera rotation based on mouse movement
      camera.rotation.y += deltaMove.x * 0.002;
      camera.rotation.x += deltaMove.y * 0.002;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  });

  document.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  });

  document.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  // Create a red crosshair
  const crosshairGeometry = new THREE.BoxGeometry(0.02, 0.2, 0.02);
  const crosshairMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  const crosshairVert = new THREE.Mesh(crosshairGeometry, crosshairMaterial);
  crosshairVert.position.z = -5; // Adjust the position to be in front of the camera
  const crosshairHor = new THREE.Mesh(crosshairGeometry, crosshairMaterial);
  crosshairHor.position.z = -5; // Adjust the position to be in front of the camera
  crosshairHor.rotateZ(1.5708);
  camera.add(crosshairHor);
  camera.add(crosshairVert);

  scene.add(camera); // Add the camera to the scene

  function onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
        moveForward = true;
        break;
      case 'ArrowDown':
        moveBackward = true;
        break;
      case 'ArrowLeft':
        moveLeft = true;
        break;
      case 'ArrowRight':
        moveRight = true;
        break;
    }
  }

  function onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
        moveForward = false;
        break;
      case 'ArrowDown':
        moveBackward = false;
        break;
      case 'ArrowLeft':
        moveLeft = false;
        break;
      case 'ArrowRight':
        moveRight = false;
        break;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    // Handle arrow key movement based on camera rotation
    const speed = 0.5;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    if (moveForward) camera.position.add(direction.multiplyScalar(speed));
    if (moveBackward) camera.position.add(direction.multiplyScalar(-speed));
    if (moveLeft) camera.position.add(direction.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(-speed));
    if (moveRight) camera.position.add(direction.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(speed));

    // Update raycaster and check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);

    // reset the color/text
    for (const cube of cubes) {
      cube.material.color.set(0xFFFFFF);
      modalContent.innerHTML = '<h2>The Latent Library: <i>The Great Gatsby</i></h2><body>Each cube in the constellation represents a sentence in <i>The Great Gatsby</i> by F. Scott Fitzgerald. They are arranged by their latent embedding (reduced to three dimensions by SKLearn&apos;s TSNE algorithm) in the Google Universal Sentence Encoder. In effect, this means similar sentences are near each other. Use the arrow keys to move and the mouse to change the camera angle. Sentences in the crosshairs will be displayed in this window. Learn more <a href="https://willallstetter.com/latent" target="_blank">here</a>. Built by <a href="https://willallstetter.com" target="_blank">Will Allstetter</a>.</body>';

    }
    // Change color of intersected cubes to red
    if(intersects != []){
      for (const intersectedObject of intersects) {
        intersectedObject.object.material.color.set(0xFF0000);
        modalContent.innerHTML = embeddingLookup[[intersectedObject.object.position.x,intersectedObject.object.position.y,intersectedObject.object.position.z]]
      }
    } 

    for (const cube of cubes) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
  }

  animate();
}
