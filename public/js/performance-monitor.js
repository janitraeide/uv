// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0
    };
    
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.isMonitoring = false;
    
    // Only enable in development
    this.isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  }

  start() {
    if (!this.isDevelopment || this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitor();
    this.createUI();
  }

  stop() {
    this.isMonitoring = false;
    this.removeUI();
  }

  monitor() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameCount++;
    
    // Calculate FPS every second
    if (deltaTime >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.metrics.frameTime = Math.round(deltaTime / this.frameCount * 100) / 100;
      
      // Keep FPS history for averaging
      this.fpsHistory.push(this.metrics.fps);
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      // Memory usage (if available)
      if (performance.memory) {
        this.metrics.memoryUsage = Math.round(
          performance.memory.usedJSHeapSize / 1048576 * 100
        ) / 100;
      }
      
      this.updateUI();
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    requestAnimationFrame(() => this.monitor());
  }

  createUI() {
    if (document.getElementById('perf-monitor')) return;
    
    const monitor = document.createElement('div');
    monitor.id = 'perf-monitor';
    monitor.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      min-width: 150px;
      backdrop-filter: blur(5px);
    `;
    
    document.body.appendChild(monitor);
  }

  updateUI() {
    const monitor = document.getElementById('perf-monitor');
    if (!monitor) return;
    
    const avgFPS = this.fpsHistory.length > 0 
      ? Math.round(this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length)
      : this.metrics.fps;
    
    const fpsColor = this.metrics.fps >= 55 ? '#00ff00' : 
                     this.metrics.fps >= 30 ? '#ffff00' : '#ff0000';
    
    monitor.innerHTML = `
      <div style="color: ${fpsColor}">FPS: ${this.metrics.fps} (avg: ${avgFPS})</div>
      <div>Frame: ${this.metrics.frameTime}ms</div>
      ${this.metrics.memoryUsage ? `<div>Memory: ${this.metrics.memoryUsage}MB</div>` : ''}
      <div style="font-size: 10px; margin-top: 5px; opacity: 0.7;">
        ${this.getPerformanceStatus()}
      </div>
    `;
  }

  getPerformanceStatus() {
    const avgFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length
      : this.metrics.fps;
    
    if (avgFPS >= 55) return '✅ Excellent';
    if (avgFPS >= 45) return '🟡 Good';
    if (avgFPS >= 30) return '🟠 Fair';
    return '🔴 Poor';
  }

  removeUI() {
    const monitor = document.getElementById('perf-monitor');
    if (monitor) {
      monitor.remove();
    }
  }

  // Public method to get current metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Method to log performance warnings
  checkPerformance() {
    const avgFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length
      : this.metrics.fps;
    
    if (avgFPS < 30) {
      console.warn('⚠️ Low FPS detected:', avgFPS);
      console.log('💡 Performance tips:');
      console.log('- Check for heavy animations');
      console.log('- Reduce shader complexity');
      console.log('- Optimize images');
      console.log('- Check for memory leaks');
    }
    
    if (this.metrics.memoryUsage > 100) {
      console.warn('⚠️ High memory usage:', this.metrics.memoryUsage + 'MB');
    }
  }
}

// Auto-start in development
const perfMonitor = new PerformanceMonitor();

// Export for manual control
window.perfMonitor = perfMonitor;

// Auto-start monitoring in development
if (perfMonitor.isDevelopment) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => perfMonitor.start(), 2000); // Start after initial load
  });
}

export default PerformanceMonitor;
