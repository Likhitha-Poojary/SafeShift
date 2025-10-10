// Motion page specific functionality
let accelerationChart, gyroscopeChart;
let motionDemoInterval;

document.addEventListener('DOMContentLoaded', function() {
    initializeMotionCharts();
    updateMotionPage();
    setupMotionDemo();
});

function initializeMotionCharts() {
    // Acceleration Chart
    const accelCtx = document.getElementById('accelerationChart').getContext('2d');
    accelerationChart = new Chart(accelCtx, {
        type: 'line',
        data: {
            labels: generateMotionTimeLabels(10),
            datasets: [
                {
                    label: 'X',
                    data: generateMotionData(10, -0.5, 0.5),
                    borderColor: '#1a73e8',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Y',
                    data: generateMotionData(10, -0.3, 0.3),
                    borderColor: '#34a853',
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Z',
                    data: generateMotionData(10, 9.7, 9.9),
                    borderColor: '#f9ab00',
                    backgroundColor: 'rgba(249, 171, 0, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'm/s²'
                    }
                }
            }
        }
    });

    // Gyroscope Chart
    const gyroCtx = document.getElementById('gyroscopeChart').getContext('2d');
    gyroscopeChart = new Chart(gyroCtx, {
        type: 'line',
        data: {
            labels: generateMotionTimeLabels(10),
            datasets: [
                {
                    label: 'X',
                    data: generateMotionData(10, -10, 10),
                    borderColor: '#1a73e8',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Y',
                    data: generateMotionData(10, -8, 8),
                    borderColor: '#34a853',
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Z',
                    data: generateMotionData(10, -5, 5),
                    borderColor: '#f9ab00',
                    backgroundColor: 'rgba(249, 171, 0, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '°/s'
                    }
                }
            }
        }
    });
}

function updateMotionPage() {
    updateMotionMetrics();
    updateMotionDriversList();
    updateMotionCharts();
}

function updateMotionMetrics() {
    // Simulate random motion data updates
    const movements = ['Normal', 'Slight', 'Moderate', 'High', 'Irregular'];
    const randomMovement = movements[Math.floor(Math.random() * movements.length)];
    
    const stillness = (Math.random() * 4).toFixed(1);
    const motionScore = Math.floor(Math.random() * 30 + 70);
    
    document.getElementById('headMovement').textContent = randomMovement;
    document.getElementById('stillnessDuration').textContent = stillness + 's';
    document.getElementById('motionScore').textContent = motionScore + '%';
    
    // Randomly trigger vibration alert
    if (Math.random() < 0.1) {
        document.getElementById('vibrationStatus').textContent = 'Active';
        document.getElementById('vibrationStatus').style.color = '#ea4335';
    } else {
        document.getElementById('vibrationStatus').textContent = 'Inactive';
        document.getElementById('vibrationStatus').style.color = '#34a853';
    }
}

function updateMotionDriversList() {
    const list = document.getElementById('motionDriversList');
    if (!list) return;

    list.innerHTML = driversData.map(driver => {
        const motionStatus = getMotionStatus(driver.fatigueScore);
        return `
            <div class="motion-driver-item">
                <div class="driver-avatar-small">
                    <i class="fas fa-user"></i>
                </div>
                <div class="driver-motion-info">
                    <div class="driver-name">${driver.name}</div>
                    <div class="motion-status">${motionStatus}</div>
                </div>
                <div class="motion-score ${motionStatus.toLowerCase()}">
                    ${driver.fatigueScore}%
                </div>
            </div>
        `;
    }).join('');
}

function updateMotionCharts() {
    // Update acceleration chart
    accelerationChart.data.datasets[0].data = generateMotionData(10, -0.5, 0.5);
    accelerationChart.data.datasets[1].data = generateMotionData(10, -0.3, 0.3);
    accelerationChart.data.datasets[2].data = generateMotionData(10, 9.7, 9.9);
    accelerationChart.update();

    // Update gyroscope chart
    gyroscopeChart.data.datasets[0].data = generateMotionData(10, -10, 10);
    gyroscopeChart.data.datasets[1].data = generateMotionData(10, -8, 8);
    gyroscopeChart.data.datasets[2].data = generateMotionData(10, -5, 5);
    gyroscopeChart.update();
}

function getMotionStatus(fatigueScore) {
    if (fatigueScore > 75) return 'Critical';
    if (fatigueScore > 60) return 'Warning';
    return 'Normal';
}

function generateMotionTimeLabels(count) {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 1000);
        labels.push(time.toLocaleTimeString([], {second: '2-digit'}));
    }
    return labels;
}

function generateMotionData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(+(min + Math.random() * (max - min)).toFixed(2));
    }
    return data;
}

function setupMotionDemo() {
    const startBtn = document.getElementById('startMotionDemo');
    const stopBtn = document.getElementById('stopMotionDemo');

    startBtn.addEventListener('click', function() {
        motionDemoInterval = setInterval(updateMotionPage, 1000);
        startBtn.disabled = true;
        stopBtn.disabled = false;
    });

    stopBtn.addEventListener('click', function() {
        clearInterval(motionDemoInterval);
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
}

function saveMotionSettings() {
    const stillness = document.getElementById('stillnessThreshold').value;
    const sensitivity = document.getElementById('movementSensitivity').value;
    const intensity = document.getElementById('vibrationIntensity').value;
    
    localStorage.setItem('motionSettings', JSON.stringify({
        stillness: stillness,
        sensitivity: sensitivity,
        intensity: intensity
    }));
    
    alert('Motion settings saved successfully!');
}

// Update slider values
document.getElementById('stillnessThreshold').addEventListener('input', function(e) {
    document.getElementById('stillnessValue').textContent = e.target.value + ' seconds';
});

document.getElementById('movementSensitivity').addEventListener('input', function(e) {
    const value = e.target.value;
    let sensitivity = 'Low';
    if (value > 7) sensitivity = 'High';
    else if (value > 4) sensitivity = 'Medium';
    document.getElementById('sensitivityValue').textContent = sensitivity;
});

document.getElementById('vibrationIntensity').addEventListener('input', function(e) {
    const value = e.target.value;
    let intensity = 'Low';
    if (value > 7) intensity = 'High';
    else if (value > 4) intensity = 'Medium';
    document.getElementById('intensityValue').textContent = intensity;
});

// Load saved settings
function loadMotionSettings() {
    const saved = localStorage.getItem('motionSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('stillnessThreshold').value = settings.stillness;
        document.getElementById('movementSensitivity').value = settings.sensitivity;
        document.getElementById('vibrationIntensity').value = settings.intensity;
        
        // Trigger input events to update labels
        document.getElementById('stillnessThreshold').dispatchEvent(new Event('input'));
        document.getElementById('movementSensitivity').dispatchEvent(new Event('input'));
        document.getElementById('vibrationIntensity').dispatchEvent(new Event('input'));
    }
}

loadMotionSettings();