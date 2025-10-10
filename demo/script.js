// Sample drivers data
const driversData = [
    {
        id: 1,
        name: "John Driver",
        driverId: "DRV-001",
        vehicle: "Truck #7892",
        status: "active",
        heartRate: 72,
        fatigueScore: 32,
        location: "Highway 401",
        speed: "68 km/h",
        shiftDuration: "6.5 hrs",
        distanceToday: "342 km",
        lastUpdate: "Just now"
    },
    {
        id: 2,
        name: "Sarah Wilson",
        driverId: "DRV-002",
        vehicle: "Van #4561",
        status: "warning",
        heartRate: 58,
        fatigueScore: 68,
        location: "City Center",
        speed: "45 km/h",
        shiftDuration: "8.2 hrs",
        distanceToday: "189 km",
        lastUpdate: "2 min ago"
    },
    {
        id: 3,
        name: "Mike Chen",
        driverId: "DRV-003",
        vehicle: "Truck #9234",
        status: "active",
        heartRate: 75,
        fatigueScore: 25,
        location: "Industrial Zone",
        speed: "72 km/h",
        shiftDuration: "4.1 hrs",
        distanceToday: "456 km",
        lastUpdate: "1 min ago"
    },
    {
        id: 4,
        name: "Emma Rodriguez",
        driverId: "DRV-004",
        vehicle: "Truck #5678",
        status: "danger",
        heartRate: 52,
        fatigueScore: 82,
        location: "Rural Route 7",
        speed: "38 km/h",
        shiftDuration: "9.5 hrs",
        distanceToday: "278 km",
        lastUpdate: "Just now"
    },
    {
        id: 5,
        name: "David Kim",
        driverId: "DRV-005",
        vehicle: "Van #2345",
        status: "active",
        heartRate: 69,
        fatigueScore: 28,
        location: "Suburban Area",
        speed: "55 km/h",
        shiftDuration: "5.3 hrs",
        distanceToday: "156 km",
        lastUpdate: "3 min ago"
    }
];

// Auto-refresh functionality
let autoRefreshInterval;

function startAutoRefresh() {
    // Show refresh indicator
    showRefreshIndicator();
    
    // Set interval for auto-refresh (10 seconds)
    autoRefreshInterval = setInterval(() => {
        updateAllData();
        showRefreshIndicator();
    }, 10000);
}

function showRefreshIndicator() {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.refresh-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'refresh-indicator';
    indicator.innerHTML = '<i class="fas fa-sync-alt"></i> Updating...';
    document.body.appendChild(indicator);
    
    // Remove after 2 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 2000);
}

function updateAllData() {
    // Update drivers data with random variations
    driversData.forEach(driver => {
        // Random heart rate variation
        const hrVariation = Math.floor(Math.random() * 5) - 2;
        driver.heartRate = Math.max(50, Math.min(90, driver.heartRate + hrVariation));
        
        // Random fatigue score variation
        const fatigueVariation = Math.floor(Math.random() * 10) - 5;
        driver.fatigueScore = Math.max(10, Math.min(95, driver.fatigueScore + fatigueVariation));
        
        // Update status based on fatigue score
        if (driver.fatigueScore > 75) {
            driver.status = 'danger';
        } else if (driver.fatigueScore > 60) {
            driver.status = 'warning';
        } else {
            driver.status = 'active';
        }
        
        // Update last update time
        driver.lastUpdate = 'Just now';
    });
    
    // Update UI based on current page
    updateCurrentPage();
}

function updateCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            updateDashboard();
            break;
        case 'drivers.html':
            updateDriversPage();
            break;
        case 'vitals.html':
            updateVitalsPage();
            break;
        // Add other pages as needed
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    startAutoRefresh();
    updateCurrentPage();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { driversData, updateAllData };
}

// Add to the updateCurrentPage function in script.js
function updateCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            if (typeof updateDashboard === 'function') updateDashboard();
            break;
        case 'drivers.html':
            if (typeof updateDriversPage === 'function') updateDriversPage();
            break;
        case 'vitals.html':
            if (typeof updateVitalsPage === 'function') updateVitalsPage();
            break;
        case 'motion.html':
            if (typeof updateMotionPage === 'function') updateMotionPage();
            break;
        case 'location.html':
            if (typeof updateLocationPage === 'function') updateLocationPage();
            break;
        case 'alerts.html':
            if (typeof updateAlertsPage === 'function') updateAlertsPage();
            break;
    }
}

// Add notification function to script.js
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.refresh-indicator');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'refresh-indicator';
    notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}