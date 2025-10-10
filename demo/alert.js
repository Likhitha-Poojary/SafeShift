// Alerts page specific functionality
let alertStatsChart;
const alertHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeAlertsPage();
    initializeAlertStats();
    loadAlertHistory();
});

function initializeAlertsPage() {
    updateAlertsPage();
    setupAlertControls();
}

function updateAlertsPage() {
    updateActiveAlerts();
    updateAlertHistory();
    updateAlertStats();
}

function updateActiveAlerts() {
    const activeAlertsList = document.getElementById('activeAlertsList');
    const activeAlertsCount = document.getElementById('activeAlertsCount');
    
    if (!activeAlertsList) return;

    // Find drivers with critical status
    const criticalDrivers = driversData.filter(driver => 
        driver.status === 'danger' || driver.fatigueScore > 75
    );

    // Update count
    if (activeAlertsCount) {
        activeAlertsCount.textContent = criticalDrivers.length;
    }

    if (criticalDrivers.length === 0) {
        activeAlertsList.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-check-circle"></i>
                <p>No active alerts</p>
                <small>All systems are operating normally</small>
            </div>
        `;
        return;
    }

    activeAlertsList.innerHTML = criticalDrivers.map(driver => {
        const alertType = getAlertType(driver);
        const alertLevel = getAlertLevel(driver);
        
        return `
            <div class="alert-item ${alertLevel}">
                <div class="alert-icon">
                    <i class="fas ${getAlertIcon(alertType)}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alertType} Alert - ${driver.name}</div>
                    <div class="alert-description">
                        ${getAlertDescription(driver, alertType)}
                    </div>
                    <div class="alert-driver-info">
                        <span>${driver.driverId}</span> • 
                        <span>${driver.vehicle}</span> • 
                        <span>${driver.location}</span>
                    </div>
                </div>
                <div class="alert-time">${driver.lastUpdate}</div>
                <div class="alert-actions">
                    <button class="btn-alert" onclick="acknowledgeAlert(${driver.id})">
                        <i class="fas fa-check"></i> Ack
                    </button>
                    <button class="btn-alert btn-call" onclick="callDriver(${driver.id})">
                        <i class="fas fa-phone"></i> Call
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateAlertHistory() {
    const historyList = document.getElementById('alertHistoryList');
    if (!historyList) return;

    const typeFilter = document.getElementById('alertTypeFilter')?.value || 'all';
    const timeFilter = document.getElementById('timeFilter')?.value || '24h';

    const filteredHistory = alertHistory.filter(alert => {
        // Filter by type
        if (typeFilter !== 'all' && alert.type !== typeFilter) return false;
        
        // Filter by time
        const alertTime = new Date(alert.timestamp);
        const now = new Date();
        let timeDiff;
        
        switch(timeFilter) {
            case '24h':
                timeDiff = 24 * 60 * 60 * 1000;
                break;
            case '7d':
                timeDiff = 7 * 24 * 60 * 60 * 1000;
                break;
            case '30d':
                timeDiff = 30 * 24 * 60 * 60 * 1000;
                break;
            default:
                timeDiff = 24 * 60 * 60 * 1000;
        }
        
        return (now - alertTime) < timeDiff;
    });

    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <div class="no-history">
                <i class="fas fa-history"></i>
                <p>No alert history found</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = filteredHistory.map(alert => `
        <div class="history-alert-item ${alert.level}">
            <div class="alert-history-icon">
                <i class="fas ${getAlertIcon(alert.type)}"></i>
            </div>
            <div class="alert-history-content">
                <div class="alert-history-title">${alert.title}</div>
                <div class="alert-history-description">${alert.description}</div>
                <div class="alert-history-meta">
                    ${alert.driver} • ${new Date(alert.timestamp).toLocaleString()}
                </div>
            </div>
            <div class="alert-history-status ${alert.acknowledged ? 'acknowledged' : 'pending'}">
                ${alert.acknowledged ? 'Acknowledged' : 'Pending'}
            </div>
        </div>
    `).join('');
}

function updateAlertStats() {
    if (!alertStatsChart) return;

    const fatigueCount = alertHistory.filter(a => a.type === 'fatigue').length;
    const vitalsCount = alertHistory.filter(a => a.type === 'vitals').length;
    const motionCount = alertHistory.filter(a => a.type === 'motion').length;
    const otherCount = alertHistory.filter(a => !['fatigue', 'vitals', 'motion'].includes(a.type)).length;
    
    const total = fatigueCount + vitalsCount + motionCount + otherCount;
    
    alertStatsChart.data.datasets[0].data = [
        fatigueCount, vitalsCount, motionCount, otherCount
    ];
    
    alertStatsChart.update();
    
    // Update breakdown percentages
    if (total > 0) {
        document.querySelectorAll('.breakdown-value').forEach((el, index) => {
            const values = [
                Math.round((fatigueCount / total) * 100),
                Math.round((vitalsCount / total) * 100),
                Math.round((motionCount / total) * 100),
                Math.round((otherCount / total) * 100)
            ];
            el.textContent = values[index] + '%';
        });
    }
}

function initializeAlertStats() {
    const ctx = document.getElementById('alertStatsChart')?.getContext('2d');
    if (!ctx) return;

    alertStatsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fatigue', 'Vitals', 'Motion', 'Other'],
            datasets: [{
                data: [45, 30, 20, 5],
                backgroundColor: [
                    '#ea4335',
                    '#f9ab00',
                    '#1a73e8',
                    '#34a853'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function getAlertType(driver) {
    if (driver.fatigueScore > 75) return 'Fatigue';
    if (driver.heartRate < 60) return 'Low Heart Rate';
    if (driver.heartRate > 80) return 'High Heart Rate';
    return 'General';
}

function getAlertLevel(driver) {
    if (driver.fatigueScore > 80 || driver.heartRate < 55) return 'critical';
    if (driver.fatigueScore > 70 || driver.heartRate < 60) return 'warning';
    return 'info';
}

function getAlertIcon(alertType) {
    switch(alertType.toLowerCase()) {
        case 'fatigue': return 'fa-bed';
        case 'low heart rate':
        case 'high heart rate': return 'fa-heartbeat';
        case 'motion': return 'fa-running';
        default: return 'fa-exclamation-triangle';
    }
}

function getAlertDescription(driver, alertType) {
    switch(alertType) {
        case 'Fatigue':
            return `Fatigue score: ${driver.fatigueScore}% - Driver may be drowsy`;
        case 'Low Heart Rate':
            return `Heart rate: ${driver.heartRate} BPM - Below normal range`;
        case 'High Heart Rate':
            return `Heart rate: ${driver.heartRate} BPM - Above normal range`;
        default:
            return `Driver requires attention - Status: ${driver.status}`;
    }
}

function acknowledgeAlert(driverId) {
    const driver = driversData.find(d => d.id === driverId);
    if (driver) {
        // Add to history
        alertHistory.unshift({
            type: getAlertType(driver).toLowerCase(),
            level: getAlertLevel(driver),
            title: `${getAlertType(driver)} Alert Acknowledged`,
            description: getAlertDescription(driver, getAlertType(driver)),
            driver: driver.name,
            timestamp: new Date().toISOString(),
            acknowledged: true
        });
        
        // Keep only last 100 alerts
        if (alertHistory.length > 100) {
            alertHistory.pop();
        }
        
        showNotification(`Alert for ${driver.name} acknowledged`);
        updateAlertsPage();
    }
}

function callDriver(driverId) {
    const driver = driversData.find(d => d.id === driverId);
    if (driver) {
        showNotification(`Calling ${driver.name}...`);
        // In real implementation, initiate phone call
    }
}

function setupAlertControls() {
    const markAllRead = document.getElementById('markAllRead');
    const clearAlerts = document.getElementById('clearAlerts');
    const typeFilter = document.getElementById('alertTypeFilter');
    const timeFilter = document.getElementById('timeFilter');

    if (markAllRead) {
        markAllRead.addEventListener('click', function() {
            driversData.forEach(driver => {
                if (driver.status === 'danger') {
                    acknowledgeAlert(driver.id);
                }
            });
            showNotification('All alerts marked as read');
        });
    }

    if (clearAlerts) {
        clearAlerts.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all alert history?')) {
                alertHistory.length = 0;
                updateAlertHistory();
                showNotification('Alert history cleared');
            }
        });
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', updateAlertHistory);
    }

    if (timeFilter) {
        timeFilter.addEventListener('change', updateAlertHistory);
    }
}

function loadAlertHistory() {
    // Generate some sample alert history
    const alertTypes = ['fatigue', 'vitals', 'motion'];
    const levels = ['critical', 'warning'];
    
    for (let i = 0; i < 20; i++) {
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const driver = driversData[Math.floor(Math.random() * driversData.length)];
        const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        alertHistory.push({
            type: type,
            level: level,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert`,
            description: `Driver ${driver.name} experienced ${type} issues`,
            driver: driver.name,
            timestamp: timestamp.toISOString(),
            acknowledged: Math.random() > 0.3
        });
    }
    
    // Sort by timestamp (newest first)
    alertHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function saveAlertSettings() {
    const emailAlerts = document.getElementById('emailAlerts').checked;
    const smsAlerts = document.getElementById('smsAlerts').checked;
    const pushAlerts = document.getElementById('pushAlerts').checked;
    const fatigueThreshold = document.getElementById('fatigueThreshold').value;
    const hrThreshold = document.getElementById('hrThreshold').value;
    
    const settings = {
        email: emailAlerts,
        sms: smsAlerts,
        push: pushAlerts,
        fatigueThreshold: fatigueThreshold,
        hrThreshold: hrThreshold
    };
    
    localStorage.setItem('alertSettings', JSON.stringify(settings));
    showNotification('Alert settings saved successfully!');
}

// Load saved settings
function loadAlertSettings() {
    const saved = localStorage.getItem('alertSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('emailAlerts').checked = settings.email;
        document.getElementById('smsAlerts').checked = settings.sms;
        document.getElementById('pushAlerts').checked = settings.push;
        document.getElementById('fatigueThreshold').value = settings.fatigueThreshold;
        document.getElementById('hrThreshold').value = settings.hrThreshold;
    }
}

loadAlertSettings();