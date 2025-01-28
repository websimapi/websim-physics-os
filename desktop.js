import { Window } from './windows.js';

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

// Add some initial windows with random positions
setTimeout(() => {
  new Window('Welcome', '<h1>Welcome to Physics OS!</h1><p>Try dragging windows around and watch them collide!</p>');
}, 500);