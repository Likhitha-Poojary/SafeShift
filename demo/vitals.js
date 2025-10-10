// Vitals page specific functionality
let heartRateChart;

document.addEventListener('DOMContentLoaded', function() {
    initializeVitalsCharts();
    updateVitalsPage();
});

function initializeVitalsCharts() {
    const ctx = document.getElementById('heartRateChart').getContext('2d');
    heartRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(12),
            datasets: [{
                label: 'Average Heart Rate',
                data: generateHeartRateData(12),
                borderColor: '#ea4335',
                backgroundColor: 'rgba(234, 67, 53, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    min: 50,
                    max: 90,
                    title: {
                        display: true,
                        text: 'BPM'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}

function updateVitalsPage() {
    updateVitalsTable();
    updateVitalsAlerts();
}

function updateVitalsTable() {
    const tbody = document.getElementById('vitalsTableBody');
    if (!tbody) return;

    tbody.innerHTML = driversData.map(driver => {
        const status = getHRStatus(driver.heartRate);
        const trend = getHRTrend(driver.heartRate);
        
        return `
            <tr>
                <td>
                    <div class="driver-info-small">
                        <strong>${driver.name}</strong>
                        <div>${driver.driverId}</div>
                    </div>
                </td>
                <td>
                    <div class="hr-value ${status}">
                        ${driver.heartRate} BPM
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${status}">
                        ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="trend-indicator ${trend}">
                        <i class="fas fa-arrow-${trend}"></i>
                    </div>
                </td>
                <td>${driver.lastUpdate}</td>
            </tr>
        `;
    }).join('');
}

function updateVitalsAlerts() {
    const alertsList = document.getElementById('vitalsAlertsList');
    if (!alertsList) return;

    const criticalDrivers = driversData.filter(driver => 
        driver.heartRate < 60 || driver.heartRate > 80
    );

    if (criticalDrivers.length === 0) {
        alertsList.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-check-circle"></i>
                <p>All vitals are within normal range</p>
            </div>
        `;
        return;
    }

    alertsList.innerHTML = criticalDrivers.map(driver => {
        const alertType = driver.heartRate < 60 ? 'Low' : 'High';
        return `
            <div class="alert-item critical">
                <div class="alert-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alertType} Heart Rate - ${driver.name}</div>
                    <div class="alert-description">
                        Heart rate: ${driver.heartRate} BPM (${alertType})
                    </div>
                </div>
                <div class="alert-time">${driver.lastUpdate}</div>
                <button class="btn-alert" onclick="acknowledgeVitalAlert(${driver.id})">
                    Acknowledge
                </button>
            </div>
        `;
    }).join('');
}

function getHRStatus(heartRate) {
    if (heartRate < 60) return 'danger';
    if (heartRate > 80) return 'warning';
    return 'active';
}

function getHRTrend(heartRate) {
    if (heartRate < 65) return 'down';
    if (heartRate > 75) return 'up';
    return 'right';
}

function generateTimeLabels(count) {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        labels.push(time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }
    return labels;
}

function generateHeartRateData(count) {
    const data = [];
    let baseHR = 72;
    for (let i = 0; i < count; i++) {
        const variation = Math.random() * 6 - 3;
        data.push(Math.round(baseHR + variation));
    }
    return data;
}

function acknowledgeVitalAlert(driverId) {
    // In real implementation, send acknowledgment to server
    console.log(`Acknowledged vital alert for driver ${driverId}`);
    updateVitalsAlerts();
}

function saveThresholds() {
    const minHR = document.getElementById('minHR').value;
    const maxHR = document.getElementById('maxHR').value;
    const criticalHR = document.getElementById('criticalHR').value;
    
    // In real implementation, save to server/localStorage
    localStorage.setItem('hrThresholds', JSON.stringify({
        min: minHR,
        max: maxHR,
        critical: criticalHR
    }));
    
    alert('Threshold settings saved successfully!');
}

// Load saved thresholds
function loadThresholds() {
    const saved = localStorage.getItem('hrThresholds');
    if (saved) {
        const thresholds = JSON.parse(saved);
        document.getElementById('minHR').value = thresholds.min;
        document.getElementById('maxHR').value = thresholds.max;
        document.getElementById('criticalHR').value = thresholds.critical;
    }
}

// Initialize when page loads
loadThresholds();