import * as Matter from 'matter-js';
import * as THREE from 'three';

class PhysicsSystem {
  constructor() {
    // Matter.js setup
    this.engine = Matter.Engine.create();
    this.engine.gravity.y = 0.5;
    
    // Three.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    
    this.camera.position.z = 10;
    
    // Track physics objects
    this.physicsObjects = new Map();
    
    // Start animation loop
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  createPhysicsWindow(window, x, y) {
    // Create matter.js body
    const body = Matter.Bodies.rectangle(x, y, window.offsetWidth, window.offsetHeight, {
      inertia: Infinity,
      friction: 0.001,
      restitution: 0.8,
    });
    
    Matter.World.add(this.engine.world, body);
    
    // Create three.js mesh
    const geometry = new THREE.BoxGeometry(window.offsetWidth / 100, window.offsetHeight / 100, 0.1);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    this.scene.add(mesh);
    
    // Store reference
    this.physicsObjects.set(window, {
      body,
      mesh
    });
    
    return body;
  }
  
  removePhysicsWindow(window) {
    const obj = this.physicsObjects.get(window);
    if (obj) {
      Matter.World.remove(this.engine.world, obj.body);
      this.scene.remove(obj.mesh);
      this.physicsObjects.delete(window);
    }
  }
  
  animate = () => {
    requestAnimationFrame(this.animate);
    
    Matter.Engine.update(this.engine);
    
    // Update visual positions
    this.physicsObjects.forEach((obj, window) => {
      const pos = obj.body.position;
      const angle = obj.body.angle;
      
      // Update DOM element
      window.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${angle}rad)`;
      
      // Update 3D mesh
      obj.mesh.position.set(pos.x / 100 - window.innerWidth/200, -pos.y / 100 + window.innerHeight/200, 0);
      obj.mesh.rotation.z = angle;
    });
    
    this.renderer.render(this.scene, this.camera);
  }
}

export const physicsSystem = new PhysicsSystem();