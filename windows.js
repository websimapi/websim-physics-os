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
      dragOffset.x = e.clientX - this.body.position.x;
      dragOffset.y = e.clientY - this.body.position.y;
    };
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        this.body.position.x = e.clientX - dragOffset.x;
        this.body.position.y = e.clientY - dragOffset.y;
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