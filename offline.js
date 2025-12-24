// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.error('ServiceWorker registration failed: ', err);
      });
  });
}

// Show offline indicator
function showOfflineMessage() {
  const message = document.createElement('div');
  message.id = 'offline-message';
  message.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    z-index: 1000;
  `;
  message.textContent = 'You are currently offline';
  document.body.appendChild(message);
  
  // Remove after 3 seconds
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Check connection status
window.addEventListener('online', () => {
  console.log('Back online');
});

window.addEventListener('offline', () => {
  console.log('You are offline');
  showOfflineMessage();
});

// Initial check
if (!navigator.onLine) {
  showOfflineMessage();
}
