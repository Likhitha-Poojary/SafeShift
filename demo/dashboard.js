// Dashboard specific functions
function updateDashboard() {
    updateStats();
    updateDriversGrid();
}

function updateStats() {
    const totalDrivers = driversData.length;
    const normalVitals = driversData.filter(d => d.heartRate >= 60 && d.heartRate <= 80).length;
    const activeAlerts = driversData.filter(d => d.status === 'danger').length;
    const totalDistance = driversData.reduce((sum, d) => sum + parseInt(d.distanceToday), 0);
    
    document.getElementById('totalDrivers').textContent = totalDrivers;
    document.getElementById('normalVitals').textContent = normalVitals;
    document.getElementById('activeAlerts').textContent = activeAlerts;
    document.getElementById('totalDistance').textContent = totalDistance.toLocaleString();
}

function updateDriversGrid() {
    const grid = document.getElementById('driversGrid');
    if (!grid) return;
    
    grid.innerHTML = driversData.map(driver => `
        <div class="driver-card">
            <div class="driver-card-header">
                <div class="driver-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="driver-info">
                    <h3>${driver.name}</h3>
                    <p>${driver.driverId} • ${driver.vehicle}</p>
                    <span class="status-badge status-${driver.status}">
                        ${driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                    </span>
                </div>
            </div>
            <div class="driver-metrics">
                <div class="driver-metric">
                    <div class="metric-value">${driver.heartRate}</div>
                    <div class="metric-label">Heart Rate</div>
                </div>
                <div class="driver-metric">
                    <div class="metric-value">${driver.fatigueScore}%</div>
                    <div class="metric-label">Fatigue</div>
                </div>
                <div class="driver-metric">
                    <div class="metric-value">${driver.speed}</div>
                    <div class="metric-label">Speed</div>
                </div>
                <div class="driver-metric">
                    <div class="metric-value">${driver.shiftDuration}</div>
                    <div class="metric-label">Shift</div>
                </div>
            </div>
            <div class="driver-location">
                <i class="fas fa-map-marker-alt"></i>
                ${driver.location}
            </div>
        </div>
    `).join('');
}   