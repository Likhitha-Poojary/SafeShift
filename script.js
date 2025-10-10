// Initialize charts and dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    simulateRealTimeData();
    setupEventListeners();
});

// Chart instances
let hrChart, motionChart;

// Initialize all charts
function initializeCharts() {
    // Heart Rate Chart
    const hrCtx = document.getElementById('hrChart').getContext('2d');
    hrChart = new Chart(hrCtx, {
        type: 'line',
        data: {
            labels: ['-5m', '-4m', '-3m', '-2m', '-1m', 'Now'],
            datasets: [{
                label: 'Heart Rate',
                data: [68, 70, 72, 71, 72, 72],
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
                }
            },
            scales: {
                y: {
                    min: 60,
                    max: 90,
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Motion Chart
    const motionCtx = document.getElementById('motionChart').getContext('2d');
    motionChart = new Chart(motionCtx, {
        type: 'bar',
        data: {
            labels: ['X', 'Y', 'Z'],
            datasets: [{
                label: 'Acceleration',
                data: [0.12, -0.08, 9.75],
                backgroundColor: [
                    'rgba(26, 115, 232, 0.7)',
                    'rgba(52, 168, 83, 0.7)',
                    'rgba(249, 171, 0, 0.7)'
                ],
                borderColor: [
                    'rgb(26, 115, 232)',
                    'rgb(52, 168, 83)',
                    'rgb(249, 171, 0)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Simulate real-time data updates
function simulateRealTimeData() {
    setInterval(() => {
        updateHeartRate();
        updateMotionData();
        updateFatigueScore();
        updateLocation();
        updateEnvironment();
        updateLastUpdateTime();
    }, 3000);
}

// Update heart rate with random variation
function updateHeartRate() {
    const currentHR = parseInt(document.getElementById('heartRate').textContent);
    const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const newHR = Math.max(60, Math.min(85, currentHR + variation));
    
    document.getElementById('heartRate').textContent = newHR;
    
    // Update chart
    hrChart.data.datasets[0].data.push(newHR);
    hrChart.data.datasets[0].data.shift();
    hrChart.update();
    
    // Update status
    updateHRStatus(newHR);
}

// Update heart rate status indicator
function updateHRStatus(hr) {
    const statusElement = document.getElementById('hrStatus');
    if (hr < 65 || hr > 80) {
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Abnormal</span>';
        statusElement.style.background = '#fef7e0';
        statusElement.style.color = '#f9ab00';
        document.getElementById('vitalsAlert').style.display = 'block';
    } else {
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>Normal</span>';
        statusElement.style.background = '#e6f4ea';
        statusElement.style.color = '#34a853';
        document.getElementById('vitalsAlert').style.display = 'none';
    }
}

// Update motion data
function updateMotionData() {
    const movements = ['Normal', 'Slight', 'Moderate', 'High'];
    const currentMovement = document.getElementById('headMovement').textContent;
    let newMovement;
    
    // Occasionally introduce abnormal movement
    if (Math.random() < 0.1) {
        newMovement = 'Irregular';
        document.getElementById('vibrationStatus').textContent = 'Active';
        document.getElementById('vibrationStatus').style.color = '#ea4335';
        
        // Show distraction alert
        document.getElementById('distractionAlert').style.display = 'flex';
        document.getElementById('distractionAlert').className = 'alert-item danger';
    } else {
        newMovement = movements[Math.floor(Math.random() * 3)];
        document.getElementById('vibrationStatus').textContent = 'Inactive';
        document.getElementById('vibrationStatus').style.color = '#34a853';
    }
    
    document.getElementById('headMovement').textContent = newMovement;
    
    // Update stillness duration
    const currentStillness = parseFloat(document.getElementById('stillnessDuration').textContent);
    const newStillness = (Math.random() * 1.5).toFixed(1);
    document.getElementById('stillnessDuration').textContent = newStillness + 's';
    
    // Update motion chart with random data
    motionChart.data.datasets[0].data = [
        (Math.random() * 0.3).toFixed(2),
        (Math.random() * 0.2 - 0.1).toFixed(2),
        9.75 + (Math.random() * 0.1 - 0.05)
    ];
    motionChart.update();
}

// Update fatigue score
function updateFatigueScore() {
    const currentScore = parseInt(document.getElementById('fatigueValue').textContent);
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    let newScore = Math.max(10, Math.min(85, currentScore + variation));
    
    // Increase fatigue score if stillness is high
    const stillness = parseFloat(document.getElementById('stillnessDuration').textContent);
    if (stillness > 3) {
        newScore = Math.min(85, newScore + 5);
    }
    
    document.getElementById('fatigueValue').textContent = newScore + '%';
    
    // Update gauge fill (visual representation)
    const gaugeFill = document.getElementById('fatigueFill');
    if (newScore < 40) {
        gaugeFill.style.background = 'conic-gradient(var(--secondary) 0% ' + newScore + '%, #f0f0f0 ' + newScore + '% 100%)';
    } else if (newScore < 70) {
        gaugeFill.style.background = 'conic-gradient(var(--secondary) 0% 30%, var(--warning) 30% ' + newScore + '%, #f0f0f0 ' + newScore + '% 100%)';
    } else {
        gaugeFill.style.background = 'conic-gradient(var(--secondary) 0% 30%, var(--warning) 30% 70%, var(--danger) 70% ' + newScore + '%, #f0f0f0 ' + newScore + '% 100%)';
        
        // Show fatigue alert if score is high
        if (newScore > 75) {
            document.getElementById('fatigueAlert').style.display = 'flex';
            document.getElementById('fatigueAlert').className = 'alert-item danger';
            document.getElementById('driverStatus').textContent = 'Fatigued';
            document.getElementById('driverStatus').className = 'driver-status status-danger';
        }
    }
}

// Update location data
function updateLocation() {
    const speeds = [65, 68, 70, 72, 75, 68, 65, 70];
    const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
    document.getElementById('currentSpeed').textContent = randomSpeed + ' km/h';
    
    // Update GPS time
    const now = new Date();
    document.getElementById('gpsUpdate').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
}

// Update environment data
function updateEnvironment() {
    const tempVariation = (Math.random() * 2 - 1).toFixed(1);
    const currentTemp = parseFloat(document.getElementById('temperature').textContent);
    const newTemp = (currentTemp + parseFloat(tempVariation)).toFixed(1);
    document.getElementById('temperature').textContent = newTemp + '°C';
    
    // Small variations in other environmental factors
    const pressureVariation = Math.floor(Math.random() * 5) - 2;
    const currentPressure = parseInt(document.getElementById('pressure').textContent);
    document.getElementById('pressure').textContent = (currentPressure + pressureVariation) + ' hPa';
    
    const humidityVariation = Math.floor(Math.random() * 5) - 2;
    const currentHumidity = parseInt(document.getElementById('humidity').textContent);
    const newHumidity = Math.max(30, Math.min(80, currentHumidity + humidityVariation));
    document.getElementById('humidity').textContent = newHumidity + '%';
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString([], options);
}

// Setup event listeners for buttons
function setupEventListeners() {
    document.getElementById('simulateAlert').addEventListener('click', simulateAlert);
    document.getElementById('resetSystem').addEventListener('click', resetSystem);
    document.getElementById('vibrationTest').addEventListener('click', testVibration);
    
    // Alert acknowledgment
    document.querySelectorAll('.btn-alert').forEach(button => {
        button.addEventListener('click', function() {
            const alertItem = this.closest('.alert-item');
            alertItem.style.display = 'none';
        });
    });
}

// Simulate a fatigue alert
function simulateAlert() {
    // Set high fatigue score
    document.getElementById('fatigueValue').textContent = '82%';
    
    // Update gauge
    const gaugeFill = document.getElementById('fatigueFill');
    gaugeFill.style.background = 'conic-gradient(var(--secondary) 0% 30%, var(--warning) 30% 70%, var(--danger) 70% 82%, #f0f0f0 82% 100%)';
    
    // Show alerts
    document.getElementById('fatigueAlert').style.display = 'flex';
    document.getElementById('fatigueAlert').className = 'alert-item danger';
    document.getElementById('distractionAlert').style.display = 'flex';
    document.getElementById('distractionAlert').className = 'alert-item warning';
    
    // Update driver status
    document.getElementById('driverStatus').textContent = 'Fatigued';
    document.getElementById('driverStatus').className = 'driver-status status-danger';
    
    // Update vitals alert
    document.getElementById('vitalsAlert').style.display = 'block';
    
    // Show notification
    showNotification('Fatigue alert simulated');
}

// Reset system to normal state
function resetSystem() {
    // Reset fatigue score
    document.getElementById('fatigueValue').textContent = '32%';
    
    // Reset gauge
    const gaugeFill = document.getElementById('fatigueFill');
    gaugeFill.style.background = 'conic-gradient(var(--secondary) 0% 32%, #f0f0f0 32% 100%)';
    
    // Hide alerts
    document.getElementById('fatigueAlert').style.display = 'none';
    document.getElementById('distractionAlert').style.display = 'none';
    
    // Reset driver status
    document.getElementById('driverStatus').textContent = 'Active';
    document.getElementById('driverStatus').className = 'driver-status status-active';
    
    // Reset vitals alert
    document.getElementById('vitalsAlert').style.display = 'none';
    
    // Reset vibration status
    document.getElementById('vibrationStatus').textContent = 'Inactive';
    document.getElementById('vibrationStatus').style.color = '#34a853';
    
    // Show notification
    showNotification('System reset to normal state');
}

// Test vibration alert
function testVibration() {
    document.getElementById('vibrationStatus').textContent = 'Testing...';
    document.getElementById('vibrationStatus').style.color = '#f9ab00';
    
    setTimeout(() => {
        document.getElementById('vibrationStatus').textContent = 'Inactive';
        document.getElementById('vibrationStatus').style.color = '#34a853';
        showNotification('Vibration test completed');
    }, 2000);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.background = '#202124';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}