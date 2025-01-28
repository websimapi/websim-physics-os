import { Window } from './windows.js';
import { physicsSystem } from './physics.js';

// Create dock icons
const dockIcons = [
  {
    title: 'Notes',
    icon: `<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>`,
    onClick: () => new Window('Notes', '<textarea style="width: 100%; height: 200px;"></textarea>')
  },
  {
    title: 'Calculator',
    icon: `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v4h4v4h-4v-4H7v-4h4V5h4v4z"/></svg>`,
    onClick: () => new Window('Calculator', `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
        <button style="grid-column: span 4;">0</button>
        ${[1,2,3,'+',4,5,6,'-',7,8,9,'×','C','=','/'].map(key => 
          `<button>${key}</button>`
        ).join('')}
      </div>
    `)
  },
  {
    title: 'Browser',
    icon: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    onClick: () => new Window('Browser', '<iframe src="https://example.com" style="width: 100%; height: 400px; border: none;"></iframe>')
  },
  {
    title: 'Gravity',
    icon: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>`,
    onClick: () => {
      const content = document.createElement('div');
      content.innerHTML = `
        <div class="gravity-popup">
          <div class="gravity-buttons">
            <button onclick="window.setGravityDirection('up')">↑</button>
            <button onclick="window.setGravityDirection('down')">↓</button>
            <button onclick="window.setGravityDirection('left')">←</button>
            <button onclick="window.setGravityDirection('right')">→</button>
            <button onclick="window.setGravityDirection('none')">×</button>
          </div>
          <div class="gravity-strength">
            <input type="range" min="0" max="2" step="0.1" value="0" 
                   oninput="window.setGravityStrength(this.value)">
          </div>
        </div>
      `;
      
      if (document.querySelector('.gravity-popup')) {
        document.querySelector('.gravity-popup').remove();
      } else {
        const icon = document.querySelector('.dock-icon[title="Gravity"]');
        const rect = icon.getBoundingClientRect();
        content.querySelector('.gravity-popup').style.position = 'fixed';
        content.querySelector('.gravity-popup').style.bottom = '100px';
        content.querySelector('.gravity-popup').style.left = `${rect.left}px`;
        document.body.appendChild(content.querySelector('.gravity-popup'));
      }
    }
  },
  {
    title: 'Platform',
    icon: `<svg viewBox="0 0 24 24"><path d="M19 12H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H5v-4h14v4z"/></svg>`,
    onClick: () => {
      const content = document.createElement('div');
      content.innerHTML = `
        <div class="platform-controls">
          <button onclick="window.createPlatform('horizontal')">Horizontal Platform</button>
          <button onclick="window.createPlatform('vertical')">Vertical Platform</button>
          <button onclick="window.createPlatform('square')">Square Platform</button>
        </div>
      `;
      new Window('Platform Creator', content.innerHTML);
    }
  },
  {
    title: 'Reset',
    icon: `<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>`,
    onClick: () => window.resetSystem()
  }
];

const dock = document.getElementById('dock');

dockIcons.forEach(icon => {
  const iconElement = document.createElement('div');
  iconElement.className = 'dock-icon';
  iconElement.innerHTML = icon.icon;
  iconElement.title = icon.title;
  iconElement.onclick = () => {
    iconElement.style.transform = 'scale(0.9)';
    setTimeout(() => iconElement.style.transform = '', 100);
    icon.onClick();
  };
  dock.appendChild(iconElement);
});

const initialState = {
  zoom: 1,
  gravity: { x: 0, y: 0 },
  gravityStrength: 0
};

const desktop = document.getElementById('desktop');
desktop.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  const currentZoom = parseFloat(desktop.style.getPropertyValue('--zoom')) || 1;
  const newZoom = Math.max(0.2, Math.min(3, currentZoom * delta));
  desktop.style.setProperty('--zoom', newZoom);
});

window.resetSystem = () => {
  desktop.style.setProperty('--zoom', initialState.zoom);
  
  physicsSystem.setGravity(initialState.gravity.x, initialState.gravity.y);
  
  const strengthSlider = document.querySelector('.gravity-strength input');
  if (strengthSlider) {
    strengthSlider.value = initialState.gravityStrength;
  }
  
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    const title = win.querySelector('.window-title');
    if (title && !['Gravity Controls', 'Welcome'].includes(title.textContent)) {
      const closeBtn = win.querySelector('button');
      closeBtn.click();
    }
  });
  
  new Window('Welcome', '<h1>Welcome to Physics OS!</h1><p>Try dragging windows around and watch them collide! Use the Gravity Controls to add some fun physics!</p>');
};

// Add some initial windows with random positions
setTimeout(() => {
  new Window('Welcome', '<h1>Welcome to Physics OS!</h1><p>Try dragging windows around and watch them collide! Use the Gravity Controls to add some fun physics!</p>');
  
  new Window('Gravity Controls', `
    <div class="gravity-controls">
      <div class="gravity-buttons">
        <button onclick="window.setGravityDirection('up')">↑</button>
        <button onclick="window.setGravityDirection('down')">↓</button>
        <button onclick="window.setGravityDirection('left')">←</button>
        <button onclick="window.setGravityDirection('right')">→</button>
        <button onclick="window.setGravityDirection('none')" style="background: rgba(0,0,0,0.2);">×</button>
      </div>
      <div class="gravity-strength">
        <label>Strength: </label>
        <input type="range" min="0" max="2" step="0.1" value="0" 
               oninput="window.setGravityStrength(this.value)">
      </div>
      <button onclick="window.resetSystem()" class="reset-button">Reset System</button>
    </div>
  `);
}, 500);

window.setGravityDirection = (direction) => {
  switch(direction) {
    case 'up':
      physicsSystem.setGravity(0, -0.5);
      break;
    case 'down':
      physicsSystem.setGravity(0, 0.5);
      break;
    case 'left':
      physicsSystem.setGravity(-0.5, 0);
      break;
    case 'right':
      physicsSystem.setGravity(0.5, 0);
      break;
    case 'none':
      physicsSystem.setGravity(0, 0);
      break;
  }
};

window.setGravityStrength = (strength) => {
  const currentX = physicsSystem.engine.gravity.x;
  const currentY = physicsSystem.engine.gravity.y;
  const magnitude = Math.sqrt(currentX * currentX + currentY * currentY);
  
  if (magnitude === 0) {
    physicsSystem.setGravity(0, strength);
  } else {
    const scale = strength / magnitude;
    physicsSystem.setGravity(currentX * scale, currentY * scale);
  }
};

window.createPlatform = (type) => {
  const platform = document.createElement('div');
  platform.className = 'platform';
  
  switch(type) {
    case 'horizontal':
      platform.style.width = '300px';
      platform.style.height = '20px';
      break;
    case 'vertical':
      platform.style.width = '20px';
      platform.style.height = '300px';
      break;
    case 'square':
      platform.style.width = '100px';
      platform.style.height = '100px';
      break;
  }
  
  document.getElementById('desktop').appendChild(platform);
  
  // Center platform at mouse position
  const updatePosition = (e) => {
    const rect = platform.getBoundingClientRect();
    platform.style.left = `${e.clientX - rect.width/2}px`;
    platform.style.top = `${e.clientY - rect.height/2}px`;
  };
  
  const placeObject = (e) => {
    document.removeEventListener('mousemove', updatePosition);
    document.removeEventListener('click', placeObject);
    
    const rect = platform.getBoundingClientRect();
    const body = physicsSystem.createStaticPlatform(
      platform,
      rect.left + rect.width/2,
      rect.top + rect.height/2,
      rect.width,
      rect.height
    );
    
    // Make draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    platform.onmousedown = (e) => {
      isDragging = true;
      dragOffset.x = e.clientX - body.position.x;
      dragOffset.y = e.clientY - body.position.y;
    };
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        Matter.Body.setPosition(body, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Add delete on right click
    platform.oncontextmenu = (e) => {
      e.preventDefault();
      physicsSystem.removePhysicsWindow(platform);
      platform.remove();
    };
  };
  
  document.addEventListener('mousemove', updatePosition);
  document.addEventListener('click', placeObject);
};