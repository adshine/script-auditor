const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// Directories to watch
const watchDirs = [
  'src',
  'public',
  'styles',
  'pages',
  'components',
  'lib'
];

// File patterns to ignore
const ignorePatterns = [
  '**/node_modules/**',
  '**/.git/**',
  '**/.next/**',
  '**/out/**',
  '**/build/**',
  '**/dist/**'
];

// Debounce function to prevent multiple rapid deployments
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to trigger Netlify deployment
const triggerDeploy = debounce(() => {
  console.log('🚀 Changes detected, triggering Netlify deployment...');
  
  exec('netlify deploy --build --prod', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Deployment error:', error);
      return;
    }
    if (stderr) {
      console.error('⚠️ Deployment warnings:', stderr);
    }
    console.log('✅ Deployment output:', stdout);
  });
}, 5000); // Wait 5 seconds after last change before deploying

// Initialize watcher
const watcher = chokidar.watch(watchDirs, {
  ignored: ignorePatterns,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

// Add event listeners
watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    triggerDeploy();
  })
  .on('change', path => {
    console.log(`File ${path} has been changed`);
    triggerDeploy();
  })
  .on('unlink', path => {
    console.log(`File ${path} has been removed`);
    triggerDeploy();
  });

console.log('👀 Watching for file changes...'); 