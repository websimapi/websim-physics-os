const Matter = window.Matter;

class PhysicsSystem {
  constructor() {
    // Matter.js setup
    this.engine = Matter.Engine.create();
    this.engine.gravity.y = 0;
    
    // Track physics objects
    this.physicsObjects = new Map();
    
    // Start animation loop
    this.animate();
  }
  
  createPhysicsWindow(window, x, y) {
    // Create matter.js body
    const body = Matter.Bodies.rectangle(x, y, window.offsetWidth, window.offsetHeight, {
      inertia: Infinity,
      friction: 0.001,
      restitution: 0.8,
    });
    
    Matter.World.add(this.engine.world, body);
    
    // Store reference
    this.physicsObjects.set(window, {
      body
    });
    
    // Add bounds if they don't exist
    if (this.engine.world.bodies.length === 1) {
      const bounds = [
        Matter.Bodies.rectangle(window.innerWidth/2, -10, window.innerWidth, 20, { isStatic: true }), // top
        Matter.Bodies.rectangle(window.innerWidth/2, window.innerHeight+10, window.innerWidth, 20, { isStatic: true }), // bottom
        Matter.Bodies.rectangle(-10, window.innerHeight/2, 20, window.innerHeight, { isStatic: true }), // left
        Matter.Bodies.rectangle(window.innerWidth+10, window.innerHeight/2, 20, window.innerHeight, { isStatic: true }) // right
      ];
      Matter.World.add(this.engine.world, ...bounds);
    }
    
    return body;
  }
  
  removePhysicsWindow(window) {
    const obj = this.physicsObjects.get(window);
    if (obj) {
      Matter.World.remove(this.engine.world, obj.body);
      this.physicsObjects.delete(window);
    }
  }
  
  setGravity(x, y) {
    this.engine.gravity.x = x;
    this.engine.gravity.y = y;
  }
  
  createStaticPlatform(element, x, y, width, height) {
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: '#F0F0F0'
      }
    });
    
    Matter.World.add(this.engine.world, body);
    this.physicsObjects.set(element, { body });
    
    return body;
  }
  
  animate = () => {
    requestAnimationFrame(this.animate);
    
    Matter.Engine.update(this.engine);
    
    // Update visual positions
    this.physicsObjects.forEach((obj, window) => {
      const pos = obj.body.position;
      const angle = obj.body.angle;
      
      // Update DOM element
      window.style.transform = `translate(${pos.x - window.offsetWidth/2}px, ${pos.y - window.offsetHeight/2}px) rotate(${angle}rad)`;
    });
  }
}

export const physicsSystem = new PhysicsSystem();