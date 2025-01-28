import { physicsSystem } from './physics.js';

export class Window {
  constructor(title, content) {
    this.element = document.createElement('div');
    this.element.className = 'window';
    
    const titlebar = document.createElement('div');
    titlebar.className = 'window-titlebar';
    
    const titleElement = document.createElement('h3');
    titleElement.className = 'window-title';
    titleElement.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.onclick = () => this.close();
    
    titlebar.appendChild(titleElement);
    titlebar.appendChild(closeBtn);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'window-content';
    contentDiv.innerHTML = content;
    
    this.element.appendChild(titlebar);
    this.element.appendChild(contentDiv);
    
    document.getElementById('desktop').appendChild(this.element);
    
    // Add physics
    const rect = this.element.getBoundingClientRect();
    this.body = physicsSystem.createPhysicsWindow(
      this.element,
      rect.left + rect.width/2,
      rect.top + rect.height/2
    );
    
    // Make draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    titlebar.onmousedown = (e) => {
      isDragging = true;
      const zoom = parseFloat(document.getElementById('desktop').style.getPropertyValue('--zoom')) || 1;
      const panX = parseFloat(document.getElementById('desktop').style.getPropertyValue('--pan-x')) || 0;
      const panY = parseFloat(document.getElementById('desktop').style.getPropertyValue('--pan-y')) || 0;
      
      const scaledX = (e.clientX - panX) / zoom;
      const scaledY = (e.clientY - panY) / zoom;
      
      dragOffset.x = scaledX - this.body.position.x;
      dragOffset.y = scaledY - this.body.position.y;
    };
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const zoom = parseFloat(document.getElementById('desktop').style.getPropertyValue('--zoom')) || 1;
        const panX = parseFloat(document.getElementById('desktop').style.getPropertyValue('--pan-x')) || 0;
        const panY = parseFloat(document.getElementById('desktop').style.getPropertyValue('--pan-y')) || 0;
        
        const scaledX = (e.clientX - panX) / zoom;
        const scaledY = (e.clientY - panY) / zoom;
        
        this.body.position.x = scaledX - dragOffset.x;
        this.body.position.y = scaledY - dragOffset.y;
      }
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
  
  close() {
    physicsSystem.removePhysicsWindow(this.element);
    this.element.remove();
  }
}