// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a short delay
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading');
        anime({
            targets: loadingScreen,
            opacity: 0,
            duration: 800,
            easing: 'easeOutQuad',
            complete: function() {
                loadingScreen.style.display = 'none';
            }
        });
    }, 1500);
    
    // Game variables
    let gameActive = false;
    let timer = null;
    let startTime = 0;
    let elapsedTime = 0;
    let currentRegion = 'eastAsia';
    let currentTheme = 'political';
    let cities = [];
    let paths = [];
    let routePaths = [];
    let selectedRoute = [];
    let startCity = null;
    
    // DOM elements
    const gameMap = document.getElementById('gameMap');
    const routeList = document.getElementById('routeList');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const validateBtn = document.getElementById('validateBtn');
    const regionSelect = document.getElementById('regionSelect');
    const currentRegionDisplay = document.getElementById('currentRegion');
    const visitedCountDisplay = document.getElementById('visitedCount');
    const totalCitiesDisplay = document.getElementById('totalCities');
    const currentCostDisplay = document.getElementById('currentCost');
    const timeDisplay = document.getElementById('timeDisplay');
    const resultPanel = document.querySelector('.result-panel');
    const overlay = document.querySelector('.overlay');
    const finalTimeDisplay = document.getElementById('finalTime');
    const finalCitiesDisplay = document.getElementById('finalCities');
    const finalCostDisplay = document.getElementById('finalCost');
    const finalScoreDisplay = document.getElementById('finalScore');
    const routeFeedbackDisplay = document.getElementById('routeFeedback');
    const newGameBtn = document.getElementById('newGameBtn');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const themeOptions = document.querySelectorAll('.theme-option');
    const tooltip = document.querySelector('.tooltip');
    
    // Region data - Cities and connections
    const regionData = {
        eastAsia: {
            cities: [
                { id: 'seoul', name: 'Seoul', x: 300, y: 150 },
                { id: 'tokyo', name: 'Tokyo', x: 450, y: 180 },
                { id: 'beijing', name: 'Beijing', x: 250, y: 100 },
                { id: 'shanghai', name: 'Shanghai', x: 350, y: 220 },
                { id: 'taipei', name: 'Taipei', x: 380, y: 280 },
                { id: 'hongkong', name: 'Hong Kong', x: 320, y: 320 },
                { id: 'manila', name: 'Manila', x: 400, y: 380 }
            ],
            paths: [
                { from: 'seoul', to: 'tokyo', cost: 30 },
                { from: 'seoul', to: 'beijing', cost: 25 },
                { from: 'seoul', to: 'shanghai', cost: 35 },
                { from: 'beijing', to: 'tokyo', cost: 40 },
                { from: 'beijing', to: 'shanghai', cost: 30 },
                { from: 'shanghai', to: 'tokyo', cost: 45 },
                { from: 'shanghai', to: 'taipei', cost: 25 },
                { from: 'shanghai', to: 'hongkong', cost: 30 },
                { from: 'taipei', to: 'tokyo', cost: 35 },
                { from: 'taipei', to: 'hongkong', cost: 20 },
                { from: 'taipei', to: 'manila', cost: 30 },
                { from: 'hongkong', to: 'manila', cost: 25 }
            ]
        },
        europe: {
            cities: [
                { id: 'london', name: 'London', x: 150, y: 150 },
                { id: 'paris', name: 'Paris', x: 200, y: 200 },
                { id: 'berlin', name: 'Berlin', x: 300, y: 120 },
                { id: 'rome', name: 'Rome', x: 280, y: 280 },
                { id: 'madrid', name: 'Madrid', x: 100, y: 300 },
                { id: 'athens', name: 'Athens', x: 380, y: 320 },
                { id: 'moscow', name: 'Moscow', x: 450, y: 80 }
            ],
            paths: [
                { from: 'london', to: 'paris', cost: 20 },
                { from: 'london', to: 'berlin', cost: 35 },
                { from: 'paris', to: 'berlin', cost: 25 },
                { from: 'paris', to: 'madrid', cost: 30 },
                { from: 'paris', to: 'rome', cost: 35 },
                { from: 'berlin', to: 'moscow', cost: 45 },
                { from: 'berlin', to: 'rome', cost: 40 },
                { from: 'rome', to: 'athens', cost: 30 },
                { from: 'rome', to: 'madrid', cost: 45 },
                { from: 'madrid', to: 'london', cost: 40 },
                { from: 'athens', to: 'moscow', cost: 50 }
            ]
        },
        centralAsia: {
            cities: [
                { id: 'tashkent', name: 'Tashkent', x: 350, y: 200 },
                { id: 'almaty', name: 'Almaty', x: 420, y: 150 },
                { id: 'bishkek', name: 'Bishkek', x: 380, y: 120 },
                { id: 'dushanbe', name: 'Dushanbe', x: 330, y: 250 },
                { id: 'ashgabat', name: 'Ashgabat', x: 280, y: 300 },
                { id: 'kabul', name: 'Kabul', x: 400, y: 300 },
                { id: 'islamabad', name: 'Islamabad', x: 450, y: 350 }
            ],
            paths: [
                { from: 'tashkent', to: 'almaty', cost: 25 },
                { from: 'tashkent', to: 'bishkek', cost: 30 },
                { from: 'tashkent', to: 'dushanbe', cost: 20 },
                { from: 'tashkent', to: 'ashgabat', cost: 35 },
                { from: 'almaty', to: 'bishkek', cost: 15 },
                { from: 'bishkek', to: 'dushanbe', cost: 40 },
                { from: 'dushanbe', to: 'kabul', cost: 30 },
                { from: 'dushanbe', to: 'ashgabat', cost: 25 },
                { from: 'ashgabat', to: 'kabul', cost: 45 },
                { from: 'kabul', to: 'islamabad', cost: 20 },
                { from: 'islamabad', to: 'dushanbe', cost: 35 }
            ]
        }
    };
    
    // Game initialization
    function initGame() {
        clearGameMap();
        gameActive = true;
        startTime = Date.now();
        elapsedTime = 0;
        selectedRoute = [];
        startCity = null;
        
        // Start the timer
        if (timer) clearInterval(timer);
        timer = setInterval(updateTimer, 1000);
        
        // Load the selected region
        loadRegion(currentRegion);
        
        // Update UI elements
        resetBtn.disabled = false;
        validateBtn.disabled = true;
        startBtn.disabled = true;
        updateRouteDisplay();
        
        // Animate the cities appearing
        anime({
            targets: '.city',
            scale: [0, 1],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'spring(1, 80, 10, 0)'
        });
        
        // Animate the paths appearing
        anime({
            targets: '.path',
            opacity: [0, 0.6],
            scale: [0, 1],
            delay: anime.stagger(50),
            easing: 'easeOutExpo'
        });
        
        // Update counters
        visitedCountDisplay.textContent = '0';
        totalCitiesDisplay.textContent = cities.length;
        currentCostDisplay.textContent = '0';
    }
    
    // Clear the game map
    function clearGameMap() {
        gameMap.innerHTML = '';
        routeList.innerHTML = '';
        cities = [];
        paths = [];
        routePaths = [];
    }
    
    // Load region data
    function loadRegion(region) {
        const data = regionData[region];
        
        // Create cities
        data.cities.forEach(city => {
            createCity(city);
        });
        
        // Create paths
        data.paths.forEach(path => {
            createPath(path);
        });
        
        currentRegionDisplay.textContent = getRegionDisplayName(region);
    }
    
    // Get the display name for a region
    function getRegionDisplayName(region) {
        switch(region) {
            case 'eastAsia': return 'East Asia';
            case 'europe': return 'Europe';
            case 'centralAsia': return 'Central Asia';
            default: return 'Unknown Region';
        }
    }
    
    // Create a city on the map
    function createCity(cityData) {
        const city = document.createElement('div');
        city.className = 'city';
        city.id = cityData.id;
        city.style.left = cityData.x + 'px';
        city.style.top = cityData.y + 'px';
        city.dataset.name = cityData.name;
        
        // Add click event
        city.addEventListener('click', () => handleCityClick(cityData));
        
        // Add hover events for tooltip
        city.addEventListener('mouseenter', (e) => {
            showTooltip(e, `${cityData.name}`);
        });
        
        city.addEventListener('mousemove', (e) => {
            moveTooltip(e);
        });
        
        city.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        // Create city label
        const label = document.createElement('div');
        label.className = 'city-label';
        label.textContent = cityData.name;
        label.style.left = cityData.x + 'px';
        label.style.top = cityData.y + 'px';
        
        gameMap.appendChild(city);
        gameMap.appendChild(label);
        cities.push(cityData);
    }
    
    // Create a path between cities
    function createPath(pathData) {
        const fromCity = cities.find(city => city.id === pathData.from);
        const toCity = cities.find(city => city.id === pathData.to);
        
        if (!fromCity || !toCity) return;
        
        // Calculate path properties
        const dx = toCity.x - fromCity.x;
        const dy = toCity.y - fromCity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create path element
        const path = document.createElement('div');
        path.className = 'path';
        path.style.width = distance + 'px';
        path.style.left = fromCity.x + 'px';
        path.style.top = fromCity.y + 'px';
        path.style.transform = `rotate(${angle}deg)`;
        
        // Add hover events for tooltip
        path.addEventListener('mouseenter', (e) => {
            showTooltip(e, `${fromCity.name} to ${toCity.name}: ${pathData.cost} units`);
        });
        
        path.addEventListener('mousemove', (e) => {
            moveTooltip(e);
        });
        
        path.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        gameMap.appendChild(path);
        paths.push({...pathData, element: path, from: fromCity, to: toCity});
    }
    
    // Create a route path between cities
    function createRoutePath(fromCity, toCity, index) {
        const dx = toCity.x - fromCity.x;
        const dy = toCity.y - fromCity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create route path element
        const routePath = document.createElement('div');
        routePath.className = 'route-path';
        routePath.style.width = distance + 'px';
        routePath.style.left = fromCity.x + 'px';
        routePath.style.top = fromCity.y + 'px';
        routePath.style.transform = `rotate(${angle}deg)`;
        routePath.dataset.index = index;
        
        gameMap.appendChild(routePath);
        routePaths.push(routePath);
        
        // Animate the route path
        anime({
            targets: routePath,
            opacity: 1,
            duration: 600,
            easing: 'easeOutCubic'
        });
    }
    
    // Handle city click
    function handleCityClick(cityData) {
        if (!gameActive) return;
        
        const cityElement = document.getElementById(cityData.id);
        
        // If this is the first city, set it as the start
        if (selectedRoute.length === 0) {
            startCity = cityData;
            cityElement.classList.add('start');
            cityElement.classList.add('visited');
            selectedRoute.push(cityData);
            
            // Animate the start city
            anime({
                targets: cityElement,
                scale: [1, 1.2, 1],
                boxShadow: [
                    '0 0 0 4px rgba(46, 204, 113, 0.3)',
                    '0 0 0 8px rgba(46, 204, 113, 0.6)',
                    '0 0 0 4px rgba(46, 204, 113, 0.3)'
                ],
                duration: 800,
                easing: 'easeOutElastic(1, .5)'
            });
        } 
        // Check if the city is already in the route
        else if (selectedRoute.some(city => city.id === cityData.id)) {
            // If clicking on start city and all other cities are visited, complete the route
            if (cityData.id === startCity.id && selectedRoute.length === cities.length) {
                // Add the start city to complete the route
                selectedRoute.push(startCity);
                
                // Create the final route path
                const lastCity = selectedRoute[selectedRoute.length - 2];
                createRoutePath(lastCity, startCity, selectedRoute.length - 1);
                
                // Enable validate button
                validateBtn.disabled = false;
                
                // Update the route display
                updateRouteDisplay();
                
                // Animate the completion
                anime({
                    targets: cityElement,
                    scale: [1, 1.3, 1],
                    boxShadow: [
                        '0 0 0 4px rgba(46, 204, 113, 0.3)',
                        '0 0 0 12px rgba(46, 204, 113, 0.6)',
                        '0 0 0 4px rgba(46, 204, 113, 0.3)'
                    ],
                    duration: 1000,
                    easing: 'easeOutElastic(1, .5)'
                });
            }
            // Otherwise, do nothing if already visited
            return;
        }
        // If there is a direct path to the city
        else if (hasDirectPath(selectedRoute[selectedRoute.length - 1], cityData)) {
            cityElement.classList.add('visited');
            
            // Animate the city selection
            anime({
                targets: cityElement,
                scale: [1, 1.2, 1],
                boxShadow: [
                    '0 0 0 4px rgba(52, 152, 219, 0.3)',
                    '0 0 0 8px rgba(52, 152, 219, 0.6)',
                    '0 0 0 4px rgba(52, 152, 219, 0.3)'
                ],
                duration: 600,
                easing: 'easeOutElastic(1, .5)'
            });
            
            // Create a path from the previous city
            const prevCity = selectedRoute[selectedRoute.length - 1];
            createRoutePath(prevCity, cityData, selectedRoute.length);
            
            // Add to route
            selectedRoute.push(cityData);
        }
        else {
            // No direct path, provide feedback
            anime({
                targets: cityElement,
                translateX: [0, -5, 5, -5, 5, 0],
                duration: 500,
                easing: 'easeInOutSine'
            });
            
            showTooltip(event, "No direct path available!");
            setTimeout(hideTooltip, 1500);
            return;
        }
        
        // Update route display
        updateRouteDisplay();
    }
    
    // Check if there is a direct path between two cities
    function hasDirectPath(fromCity, toCity) {
        return paths.some(path => 
            (path.from.id === fromCity.id && path.to.id === toCity.id) || 
            (path.from.id === toCity.id && path.to.id === fromCity.id)
        );
    }
    
    // Get path cost between two cities
    function getPathCost(fromCity, toCity) {
        const path = paths.find(path => 
            (path.from.id === fromCity.id && path.to.id === toCity.id) || 
            (path.from.id === toCity.id && path.to.id === fromCity.id)
        );
        
        return path ? path.cost : 0;
    }
    
    // Calculate total route cost
    function calculateRouteCost() {
        let totalCost = 0;
        
        for (let i = 0; i < selectedRoute.length - 1; i++) {
            totalCost += getPathCost(selectedRoute[i], selectedRoute[i + 1]);
        }
        
        return totalCost;
    }
    
    // Update the route display
    function updateRouteDisplay() {
        routeList.innerHTML = '';
        let totalCost = 0;
        
        selectedRoute.forEach((city, index) => {
            if (index > 0) {
                const prevCity = selectedRoute[index - 1];
                const cost = getPathCost(prevCity, city);
                totalCost += cost;
                
                const li = document.createElement('li');
                li.innerHTML = `<span>${prevCity.name} → ${city.name}</span> <span class="route-cost">${cost}</span>`;
                routeList.appendChild(li);
            }
        });
        
        // Update counters
        visitedCountDisplay.textContent = selectedRoute.length === cities.length + 1 ? 
            cities.length : selectedRoute.length;
        currentCostDisplay.textContent = totalCost;
    }
    
    // Update timer display
    function updateTimer() {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        
        // Format time as MM:SS
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Validate the route
    function validateRoute() {
        if (!gameActive) return;
        
        // Stop the timer
        clearInterval(timer);
        
        // Check if all cities are visited exactly once and route returns to start
        const isValid = selectedRoute.length === cities.length + 1 && 
                        selectedRoute[0].id === selectedRoute[selectedRoute.length - 1].id;
        
        // Calculate final score
        const totalCost = calculateRouteCost();
        const timeBonus = Math.max(0, 600 - elapsedTime) * 2; // 2 points per second under 10 minutes
        const finalScore = isValid ? Math.max(1000 - totalCost + timeBonus, 100) : 0;
        
        // Set result display
        finalTimeDisplay.textContent = timeDisplay.textContent;
        finalCitiesDisplay.textContent = cities.length;
        finalCostDisplay.textContent = totalCost;
        finalScoreDisplay.textContent = finalScore;
        
        // Generate feedback message
        let feedback = "";
        
        if (!isValid) {
            feedback = "Invalid route! Make sure to visit all cities exactly once and return to the start.";
        } else if (finalScore > 900) {
            feedback = "Outstanding! You found an incredibly efficient route!";
        } else if (finalScore > 700) {
            feedback = "Great job! Your route planning skills are impressive!";
        } else if (finalScore > 500) {
            feedback = "Good work! There's still room for optimization.";
        } else {
            feedback = "Not bad for a start. Try to find more efficient connections!";
        }
        
        routeFeedbackDisplay.textContent = feedback;
        
        // Show result panel
        overlay.classList.add('show');
        resultPanel.classList.add('show');
        
        // End the game
        gameActive = false;
        resetBtn.disabled = true;
        validateBtn.disabled = true;
        startBtn.disabled = false;
    }
    
    // Reset the current route
    function resetRoute() {
        // Clear selected route
        selectedRoute = [];
        
        // Remove all route paths
        routePaths.forEach(path => {
            path.remove();
        });
        routePaths = [];
        
        // Reset city styles
        document.querySelectorAll('.city').forEach(city => {
            city.classList.remove('visited', 'start');
        });
        
        // Reset UI
        routeList.innerHTML = '';
        visitedCountDisplay.textContent = '0';
        currentCostDisplay.textContent = '0';
        validateBtn.disabled = true;
        
        // Reset start city
        startCity = null;
    }
    
    // Show tooltip
    function showTooltip(event, text) {
        tooltip.textContent = text;
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY + 10) + 'px';
        tooltip.style.opacity = '1';
    }
    
    // Move tooltip
    function moveTooltip(event) {
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY + 10) + 'px';
    }
    
    // Hide tooltip
    function hideTooltip() {
        tooltip.style.opacity = '0';
    }
    
    // Change map theme
    function changeMapTheme(theme) {
        gameMap.className = `map-${theme}`;
        currentTheme = theme;
        
        // Update theme selector
        themeOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // Event listeners
    startBtn.addEventListener('click', initGame);
    
    resetBtn.addEventListener('click', function() {
        resetRoute();
        
        // Animate reset
        anime({
            targets: '.city',
            scale: [0.8, 1],
            opacity: [0.5, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    });
    
    validateBtn.addEventListener('click', validateRoute);
    
    regionSelect.addEventListener('change', function() {
        currentRegion = this.value;
        currentRegionDisplay.textContent = getRegionDisplayName(currentRegion);
        
        if (gameActive) {
            // Reset the game with new region
            clearInterval(timer);
            gameActive = false;
            resetBtn.disabled = true;
            validateBtn.disabled = true;
            startBtn.disabled = false;
        }
    });
    
    newGameBtn.addEventListener('click', function() {
        overlay.classList.remove('show');
        resultPanel.classList.remove('show');
        initGame();
    });
    
    closeResultBtn.addEventListener('click', function() {
        overlay.classList.remove('show');
        resultPanel.classList.remove('show');
    });
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            changeMapTheme(this.dataset.theme);
        });
    });
    
    // Initialize with default settings
    currentRegionDisplay.textContent = getRegionDisplayName(currentRegion);
    totalCitiesDisplay.textContent = regionData[currentRegion].cities.length;
});
