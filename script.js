// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // ===============================================
    // Game Configuration and Variables
    // ===============================================
    
    // Game state variables
    let gameActive = false;
    let timer = null;
    let startTime = 0;
    let elapsedTime = 0;
    let currentRegion = 'eastAsia';
    let currentTheme = 'political';
    let currentDifficulty = 'medium';
    let currentTransport = 'car';
    let currentGameMode = 'standard';
    let cities = [];
    let paths = [];
    let routePaths = [];
    let selectedRoute = [];
    let startCity = null;
    let weatherEffects = false;
    let weatherAffectedCities = [];
    let zoomLevel = 1;
    let mapPan = { x: 0, y: 0 };
    let hintCount = 0;
    let achievementsEarned = {};
    let isMapDragging = false;
    let lastMousePosition = { x: 0, y: 0 };
    let tutorialActive = false;
    let tutorialStep = 0;
    let soundEnabled = true;
    
    // DOM Elements
    const gameMap = document.getElementById('gameMap');
    const routeList = document.getElementById('routeList');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const validateBtn = document.getElementById('validateBtn');
    const hintBtn = document.getElementById('hintBtn');
    const regionSelect = document.getElementById('regionSelect');
    const difficultySelect = document.getElementById('difficultySelect');
    const transportSelect = document.getElementById('transportSelect');
    const visitedCountDisplay = document.getElementById('visitedCount');
    const totalCitiesDisplay = document.getElementById('totalCities');
    const currentCostDisplay = document.getElementById('currentCost');
    const currentDistanceDisplay = document.getElementById('currentDistance');
    const travelTimeDisplay = document.getElementById('travelTime');
    const timeDisplay = document.getElementById('timeDisplay');
    const resultPanel = document.querySelector('.result-panel');
    const overlay = document.querySelector('.overlay');
    const finalTimeDisplay = document.getElementById('finalTime');
    const finalCitiesDisplay = document.getElementById('finalCities');
    const finalCostDisplay = document.getElementById('finalCost');
    const finalDistanceDisplay = document.getElementById('finalDistance');
    const finalScoreDisplay = document.getElementById('finalScore');
    const yourDistanceDisplay = document.getElementById('yourDistance');
    const optimalDistanceDisplay = document.getElementById('optimalDistance');
    const efficiencyRatingDisplay = document.getElementById('efficiencyRating');
    const routeFeedbackDisplay = document.getElementById('routeFeedback');
    const newGameBtn = document.getElementById('newGameBtn');
    const shareBtn = document.getElementById('shareBtn');
    const viewOptimalBtn = document.getElementById('viewOptimalBtn');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const hintPanel = document.querySelector('.hint-panel');
    const hintText = document.getElementById('hintText');
    const nextHintBtn = document.getElementById('nextHintBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');
    const cityInfoPanel = document.querySelector('.city-info-panel');
    const cityInfoName = document.getElementById('cityInfoName');
    const cityImage = document.getElementById('cityImage');
    const cityPopulation = document.getElementById('cityPopulation');
    const cityArea = document.getElementById('cityArea');
    const cityTimeZone = document.getElementById('cityTimeZone');
    const cityDescription = document.getElementById('cityDescription');
    const achievementsPanel = document.querySelector('.achievements-panel');
    const themeOptions = document.querySelectorAll('.theme-option');
    const tooltip = document.querySelector('.tooltip');
    const miniMap = document.getElementById('miniMap');
    const newAchievementPanel = document.getElementById('newAchievement');
    const achievementName = document.getElementById('achievementName');
    const achievementDescription = document.getElementById('achievementDescription');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetViewBtn = document.getElementById('resetViewBtn');
    
    // Extended Region data - Cities and connections
    const regionData = {
        eastAsia: {
            cities: [
                { 
                    id: 'seoul', 
                    name: 'Seoul', 
                    x: 300, 
                    y: 150,
                    population: '9.7 million',
                    area: '605.2 km²',
                    timeZone: 'UTC+9',
                    description: 'Seoul, the capital of South Korea, is a huge metropolis where modern skyscrapers, high-tech subways, and pop culture meet Buddhist temples, palaces, and street markets.',
                    image: 'https://via.placeholder.com/300x200?text=Seoul'
                },
                { 
                    id: 'tokyo', 
                    name: 'Tokyo', 
                    x: 450, 
                    y: 180,
                    population: '13.9 million',
                    area: '2,194 km²',
                    timeZone: 'UTC+9',
                    description: 'Tokyo, Japan\'s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.',
                    image: 'https://via.placeholder.com/300x200?text=Tokyo'
                },
                { 
                    id: 'beijing', 
                    name: 'Beijing', 
                    x: 250, 
                    y: 100,
                    population: '21.5 million',
                    area: '16,410 km²',
                    timeZone: 'UTC+8',
                    description: 'Beijing, China\'s sprawling capital, has history stretching back 3 millennia. Yet it\'s known as much for modern architecture as its ancient sites.',
                    image: 'https://via.placeholder.com/300x200?text=Beijing'
                },
                { 
                    id: 'shanghai', 
                    name: 'Shanghai', 
                    x: 350, 
                    y: 220,
                    population: '26.3 million',
                    area: '6,340 km²',
                    timeZone: 'UTC+8',
                    description: 'Shanghai, on China\'s central coast, is the country\'s biggest city and a global financial hub.',
                    image: 'https://via.placeholder.com/300x200?text=Shanghai'
                },
                { 
                    id: 'taipei', 
                    name: 'Taipei', 
                    x: 380, 
                    y: 280,
                    population: '2.6 million',
                    area: '271.8 km²',
                    timeZone: 'UTC+8',
                    description: 'Taipei, the capital of Taiwan, is a modern metropolis with Japanese colonial lanes, busy shopping streets and contemporary buildings.',
                    image: 'https://via.placeholder.com/300x200?text=Taipei'
                },
                { 
                    id: 'hongkong', 
                    name: 'Hong Kong', 
                    x: 320, 
                    y: 320,
                    population: '7.5 million',
                    area: '1,104 km²',
                    timeZone: 'UTC+8',
                    description: 'Hong Kong is an autonomous territory, and former British colony, in southeastern China. Its vibrant, densely populated urban center is a major port and global financial hub.',
                    image: 'https://via.placeholder.com/300x200?text=Hong+Kong'
                },
                { 
                    id: 'manila', 
                    name: 'Manila', 
                    x: 400, 
                    y: 380,
                    population: '1.8 million',
                    area: '42.88 km²',
                    timeZone: 'UTC+8',
                    description: 'Manila, the capital of the Philippines, is a densely populated bayside city on the island of Luzon, which mixes Spanish colonial architecture with modern skyscrapers.',
                    image: 'https://via.placeholder.com/300x200?text=Manila'
                }
            ],
            paths: [
                { from: 'seoul', to: 'tokyo', cost: 30, distance: 1160, time: 2.5 },
                { from: 'seoul', to: 'beijing', cost: 25, distance: 950, time: 2 },
                { from: 'seoul', to: 'shanghai', cost: 35, distance: 840, time: 2 },
                { from: 'beijing', to: 'tokyo', cost: 40, distance: 2100, time: 3.5 },
                { from: 'beijing', to: 'shanghai', cost: 30, distance: 1070, time: 2 },
                { from: 'shanghai', to: 'tokyo', cost: 45, distance: 1770, time: 3 },
                { from: 'shanghai', to: 'taipei', cost: 25, distance: 690, time: 1.5 },
                { from: 'shanghai', to: 'hongkong', cost: 30, distance: 1210, time: 2.5 },
                { from: 'taipei', to: 'tokyo', cost: 35, distance: 2100, time: 3.5 },
                { from: 'taipei', to: 'hongkong', cost: 20, distance: 810, time: 2 },
                { from: 'taipei', to: 'manila', cost: 30, distance: 1170, time: 2.5 },
                { from: 'hongkong', to: 'manila', cost: 25, distance: 1130, time: 2.5 }
            ],
            optimalRoute: ['seoul', 'beijing', 'shanghai', 'taipei', 'tokyo', 'manila', 'hongkong', 'seoul'],
            optimalDistance: 7150,
            weatherProne: ['manila', 'hongkong', 'taipei'] // Cities prone to weather events
        },
        europe: {
            cities: [
                { 
                    id: 'london', 
                    name: 'London', 
                    x: 150, 
                    y: 150,
                    population: '8.9 million',
                    area: '1,572 km²',
                    timeZone: 'UTC+0/+1',
                    description: 'London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times.',
                    image: 'https://via.placeholder.com/300x200?text=London'
                },
                { 
                    id: 'paris', 
                    name: 'Paris', 
                    x: 200, 
                    y: 200,
                    population: '2.1 million',
                    area: '105.4 km²',
                    timeZone: 'UTC+1/+2',
                    description: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture.',
                    image: 'https://via.placeholder.com/300x200?text=Paris'
                },
                { 
                    id: 'berlin', 
                    name: 'Berlin', 
                    x: 300, 
                    y: 120,
                    population: '3.7 million',
                    area: '891.8 km²',
                    timeZone: 'UTC+1/+2',
                    description: 'Berlin, Germany\'s capital, dates to the 13th century. The city is known for its art scene, nightlife, and modern architecture.',
                    image: 'https://via.placeholder.com/300x200?text=Berlin'
                },
                { 
                    id: 'rome', 
                    name: 'Rome', 
                    x: 280, 
                    y: 280,
                    population: '2.8 million',
                    area: '1,285 km²',
                    timeZone: 'UTC+1/+2',
                    description: 'Rome, Italy\'s capital, is a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture on display.',
                    image: 'https://via.placeholder.com/300x200?text=Rome'
                },
                { 
                    id: 'madrid', 
                    name: 'Madrid', 
                    x: 100, 
                    y: 300,
                    population: '3.2 million',
                    area: '604.3 km²',
                    timeZone: 'UTC+1/+2',
                    description: 'Madrid, Spain\'s central capital, is a city of elegant boulevards and expansive, manicured parks.',
                    image: 'https://via.placeholder.com/300x200?text=Madrid'
                },
                { 
                    id: 'athens', 
                    name: 'Athens', 
                    x: 380, 
                    y: 320,
                    population: '664,000',
                    area: '412 km²',
                    timeZone: 'UTC+2/+3',
                    description: 'Athens is the capital of Greece. It was also at the heart of Ancient Greece, a powerful civilization and empire.',
                    image: 'https://via.placeholder.com/300x200?text=Athens'
                },
                { 
                    id: 'moscow', 
                    name: 'Moscow', 
                    x: 450, 
                    y: 80,
                    population: '12.5 million',
                    area: '2,511 km²',
                    timeZone: 'UTC+3',
                    description: 'Moscow, on the Moskva River in western Russia, is the nation\'s cosmopolitan capital. In its historic core is the Kremlin, a complex that\'s home to the president and tsarist treasures in the Armoury.',
                    image: 'https://via.placeholder.com/300x200?text=Moscow'
                }
            ],
            paths: [
                { from: 'london', to: 'paris', cost: 20, distance: 335, time: 1.5 },
                { from: 'london', to: 'berlin', cost: 35, distance: 930, time: 2 },
                { from: 'paris', to: 'berlin', cost: 25, distance: 880, time: 1.5 },
                { from: 'paris', to: 'madrid', cost: 30, distance: 1050, time: 2 },
                { from: 'paris', to: 'rome', cost: 35, distance: 1100, time: 2 },
                { from: 'berlin', to: 'moscow', cost: 45, distance: 1610, time: 2.5 },
                { from: 'berlin', to: 'rome', cost: 40, distance: 1180, time: 2 },
                { from: 'rome', to: 'athens', cost: 30, distance: 1050, time: 2 },
                { from: 'rome', to: 'madrid', cost: 45, distance: 1360, time: 2.5 },
                { from: 'madrid', to: 'london', cost: 40, distance: 1260, time: 2.5 },
                { from: 'athens', to: 'moscow', cost: 50, distance: 2230, time: 3.5 }
            ],
            optimalRoute: ['london', 'paris', 'madrid', 'rome', 'athens', 'moscow', 'berlin', 'london'],
            optimalDistance: 9420,
            weatherProne: ['london', 'moscow', 'athens'] // Cities prone to weather events
        },
        centralAsia: {
            cities: [
                { 
                    id: 'tashkent', 
                    name: 'Tashkent', 
                    x: 350, 
                    y: 200,
                    population: '2.4 million',
                    area: '334.8 km²',
                    timeZone: 'UTC+5',
                    description: 'Tashkent is the capital and largest city of Uzbekistan. It\'s known for its many museums and mix of modern and Soviet-era architecture.',
                    image: 'https://via.placeholder.com/300x200?text=Tashkent'
                },
                { 
                    id: 'almaty', 
                    name: 'Almaty', 
                    x: 420, 
                    y: 150,
                    population: '1.9 million',
                    area: '682 km²',
                    timeZone: 'UTC+6',
                    description: 'Almaty, Kazakhstan\'s largest metropolis, is set in the foothills of mountains. The city served as the country\'s capital until 1997.',
                    image: 'https://via.placeholder.com/300x200?text=Almaty'
                },
                { 
                    id: 'bishkek', 
                    name: 'Bishkek', 
                    x: 380, 
                    y: 120,
                    population: '1 million',
                    area: '169.9 km²',
                    timeZone: 'UTC+6',
                    description: 'Bishkek, the capital of Kyrgyzstan, is a city with Soviet-style architecture and monuments celebrating Kyrgyz culture.',
                    image: 'https://via.placeholder.com/300x200?text=Bishkek'
                },
                { 
                    id: 'dushanbe', 
                    name: 'Dushanbe', 
                    x: 330, 
                    y: 250,
                    population: '863,400',
                    area: '126.6 km²',
                    timeZone: 'UTC+5',
                    description: 'Dushanbe is the capital and largest city of Tajikistan. The name means "Monday" in Tajik, as it grew from a village that hosted a popular Monday market.',
                    image: 'https://via.placeholder.com/300x200?text=Dushanbe'
                },
                { 
                    id: 'ashgabat', 
                    name: 'Ashgabat', 
                    x: 280, 
                    y: 300,
                    population: '1 million',
                    area: '440 km²',
                    timeZone: 'UTC+5',
                    description: 'Ashgabat is the capital and largest city of Turkmenistan. It\'s known for its white marble buildings and grand monuments.',
                    image: 'https://via.placeholder.com/300x200?text=Ashgabat'
                },
                { 
                    id: 'kabul', 
                    name: 'Kabul', 
                    x: 400, 
                    y: 300,
                    population: '4.4 million',
                    area: '275 km²',
                    timeZone: 'UTC+4:30',
                    description: 'Kabul is the capital and largest city of Afghanistan, located in the eastern section of the country.',
                    image: 'https://via.placeholder.com/300x200?text=Kabul'
                },
                { 
                    id: 'islamabad', 
                    name: 'Islamabad', 
                    x: 450, 
                    y: 350,
                    population: '1.1 million',
                    area: '906 km²',
                    timeZone: 'UTC+5',
                    description: 'Islamabad is the capital city of Pakistan, and is the ninth largest city in the country. The city is noted for its high standards of living, safety, and abundance of greenery.',
                    image: 'https://via.placeholder.com/300x200?text=Islamabad'
                },
                { 
                    id: 'kokand', 
                    name: 'Kokand', 
                    x: 320, 
                    y: 180,
                    population: '250,000',
                    area: '40 km²',
                    timeZone: 'UTC+5',
                    description: 'Kokand is a city in Fergana Region in eastern Uzbekistan. It was the capital of the Kokand Khanate in the 18th and 19th centuries. The historic city has many mosques and madrasas.',
                    image: 'https://via.placeholder.com/300x200?text=Kokand'
                }
            ],
            paths: [
                { from: 'tashkent', to: 'almaty', cost: 25, distance: 810, time: 2 },
                { from: 'tashkent', to: 'bishkek', cost: 30, distance: 750, time: 1.5 },
                { from: 'tashkent', to: 'dushanbe', cost: 20, distance: 510, time: 1 },
                { from: 'tashkent', to: 'ashgabat', cost: 35, distance: 890, time: 2 },
                { from: 'tashkent', to: 'kokand', cost: 15, distance: 230, time: 0.5 },
                { from: 'kokand', to: 'bishkek', cost: 20, distance: 500, time: 1 },
                { from: 'kokand', to: 'dushanbe', cost: 18, distance: 470, time: 1 },
                { from: 'almaty', to: 'bishkek', cost: 15, distance: 240, time: 0.5 },
                { from: 'bishkek', to: 'dushanbe', cost: 40, distance: 970, time: 2 },
                { from: 'dushanbe', to: 'kabul', cost: 30, distance: 750, time: 1.5 },
                { from: 'dushanbe', to: 'ashgabat', cost: 25, distance: 670, time: 1.5 },
                { from: 'ashgabat', to: 'kabul', cost: 45, distance: 1070, time: 2 },
                { from: 'kabul', to: 'islamabad', cost: 20, distance: 470, time: 1 },
                { from: 'islamabad', to: 'dushanbe', cost: 35, distance: 930, time: 2 }
            ],
            optimalRoute: ['tashkent', 'kokand', 'bishkek', 'almaty', 'dushanbe', 'islamabad', 'kabul', 'ashgabat', 'tashkent'],
            optimalDistance: 5820,
            weatherProne: ['kabul', 'ashgabat', 'dushanbe'] // Cities prone to weather events
        },
        northAmerica: {
            cities: [
                { 
                    id: 'newyork', 
                    name: 'New York', 
                    x: 300, 
                    y: 150,
                    population: '8.4 million',
                    area: '783.8 km²',
                    timeZone: 'UTC-5/-4',
                    description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that\'s among the world\'s major commercial, financial and cultural centers.',
                    image: 'https://via.placeholder.com/300x200?text=New+York'
                },
                { 
                    id: 'losangeles', 
                    name: 'Los Angeles', 
                    x: 100, 
                    y: 200,
                    population: '4 million',
                    area: '1,302 km²',
                    timeZone: 'UTC-8/-7',
                    description: 'Los Angeles is a sprawling Southern California city and the center of the nation\'s film and television industry.',
                    image: 'https://via.placeholder.com/300x200?text=Los+Angeles'
                },
                { 
                    id: 'chicago', 
                    name: 'Chicago', 
                    x: 230, 
                    y: 120,
                    population: '2.7 million',
                    area: '606.1 km²',
                    timeZone: 'UTC-6/-5',
                    description: 'Chicago, on Lake Michigan in Illinois, is among the largest cities in the U.S. Known for its bold architecture, it has a skyline punctuated by skyscrapers.',
                    image: 'https://via.placeholder.com/300x200?text=Chicago'
                },
                { 
                    id: 'toronto', 
                    name: 'Toronto', 
                    x: 320, 
                    y: 100,
                    population: '2.9 million',
                    area: '630.2 km²',
                    timeZone: 'UTC-5/-4',
                    description: 'Toronto, the capital of the province of Ontario, is a major Canadian city along Lake Ontario\'s northwestern shore.',
                    image: 'https://via.placeholder.com/300x200?text=Toronto'
                },
                { 
                    id: 'mexico', 
                    name: 'Mexico City', 
                    x: 200, 
                    y: 300,
                    population: '8.9 million',
                    area: '1,485 km²',
                    timeZone: 'UTC-6/-5',
                    description: 'Mexico City is the densely populated, high-altitude capital of Mexico. It\'s known for its Templo Mayor, the baroque Catedral Metropolitana, and the Palacio Nacional.',
                    image: 'https://via.placeholder.com/300x200?text=Mexico+City'
                },
                { 
                    id: 'vancouver', 
                    name: 'Vancouver', 
                    x: 120, 
                    y: 80,
                    population: '675,000',
                    area: '115 km²',
                    timeZone: 'UTC-8/-7',
                    description: 'Vancouver, a bustling west coast seaport in British Columbia, is among Canada\'s densest, most ethnically diverse cities.',
                    image: 'https://via.placeholder.com/300x200?text=Vancouver'
                },
                { 
                    id: 'miami', 
                    name: 'Miami', 
                    x: 350, 
                    y: 280,
                    population: '470,000',
                    area: '143.1 km²',
                    timeZone: 'UTC-5/-4',
                    description: 'Miami is an international city at Florida\'s southeastern tip. Its Cuban influence is reflected in the cafes and cigar shops that line Calle Ocho in Little Havana.',
                    image: 'https://via.placeholder.com/300x200?text=Miami'
                }
            ],
            paths: [
                { from: 'newyork', to: 'chicago', cost: 30, distance: 1270, time: 2.5 },
                { from: 'newyork', to: 'toronto', cost: 25, distance: 800, time: 1.5 },
                { from: 'newyork', to: 'miami', cost: 40, distance: 2100, time: 3 },
                { from: 'chicago', to: 'toronto', cost: 20, distance: 700, time: 1.5 },
                { from: 'chicago', to: 'losangeles', cost: 50, distance: 3000, time: 4 },
                { from: 'chicago', to: 'mexico', cost: 45, distance: 2700, time: 3.5 },
                { from: 'toronto', to: 'vancouver', cost: 55, distance: 3350, time: 5 },
                { from: 'losangeles', to: 'vancouver', cost: 35, distance: 2000, time: 3 },
                { from: 'losangeles', to: 'mexico', cost: 40, distance: 2500, time: 3 },
                { from: 'mexico', to: 'miami', cost: 35, distance: 2100, time: 3 },
                { from: 'miami', to: 'losangeles', cost: 60, distance: 3700, time: 5 }
            ],
            optimalRoute: ['newyork', 'toronto', 'chicago', 'mexico', 'losangeles', 'vancouver', 'chicago', 'miami', 'newyork'],
            optimalDistance: 18550,
            weatherProne: ['miami', 'vancouver', 'chicago'] // Cities prone to weather events
        },
        southAmerica: {
            cities: [
                { 
                    id: 'bogota', 
                    name: 'Bogotá', 
                    x: 200, 
                    y: 150,
                    population: '7.4 million',
                    area: '1,775 km²',
                    timeZone: 'UTC-5',
                    description: 'Bogotá is Colombia\'s high-altitude capital. La Candelaria, its cobblestoned center, features colonial-era landmarks like the neoclassical performance hall Teatro Colón.',
                    image: 'https://via.placeholder.com/300x200?text=Bogota'
                },
                { 
                    id: 'lima', 
                    name: 'Lima', 
                    x: 150, 
                    y: 220,
                    population: '10.7 million',
                    area: '2,672 km²',
                    timeZone: 'UTC-5',
                    description: 'Lima, the capital of Peru, lies on the country\'s arid Pacific coast. Despite its colonial center, it\'s a bustling metropolis with a vibrant and renowned food scene.',
                    image: 'https://via.placeholder.com/300x200?text=Lima'
                },
                { 
                    id: 'santiago', 
                    name: 'Santiago', 
                    x: 180, 
                    y: 350,
                    population: '6.8 million',
                    area: '641 km²',
                    timeZone: 'UTC-4/-3',
                    description: 'Santiago, Chile\'s capital and largest city, sits in a valley surrounded by the snow-capped Andes and the Chilean Coast Range.',
                    image: 'https://via.placeholder.com/300x200?text=Santiago'
                },
                { 
                    id: 'buenosaires', 
                    name: 'Buenos Aires', 
                    x: 280, 
                    y: 380,
                    population: '3.1 million',
                    area: '203 km²',
                    timeZone: 'UTC-3',
                    description: 'Buenos Aires is Argentina\'s big, cosmopolitan capital city. Its center is the Plaza de Mayo, lined with stately 19th-century buildings including Casa Rosada, the iconic, balconied presidential palace.',
                    image: 'https://via.placeholder.com/300x200?text=Buenos+Aires'
                },
                { 
                    id: 'riodejaneiro', 
                    name: 'Rio de Janeiro', 
                    x: 350, 
                    y: 300,
                    population: '6.7 million',
                    area: '1,221 km²',
                    timeZone: 'UTC-3',
                    description: 'Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain.',
                    image: 'https://via.placeholder.com/300x200?text=Rio+de+Janeiro'
                },
                { 
                    id: 'saopaulo', 
                    name: 'São Paulo', 
                    x: 320, 
                    y: 330,
                    population: '12.3 million',
                    area: '1,521 km²',
                    timeZone: 'UTC-3',
                    description: 'São Paulo, Brazil\'s vibrant financial center, is among the world\'s most populous cities, with numerous cultural institutions and a rich architectural tradition.',
                    image: 'https://via.placeholder.com/300x200?text=Sao+Paulo'
                },
                { 
                    id: 'caracas', 
                    name: 'Caracas', 
                    x: 250, 
                    y: 100,
                    population: '2 million',
                    area: '433 km²',
                    timeZone: 'UTC-4',
                    description: 'Caracas, Venezuela\'s capital, is a commercial and cultural center located in a northern mountain valley.',
                    image: 'https://via.placeholder.com/300x200?text=Caracas'
                }
            ],
            paths: [
                { from: 'bogota', to: 'caracas', cost: 20, distance: 1000, time: 2 },
                { from: 'bogota', to: 'lima', cost: 30, distance: 1900, time: 3 },
                { from: 'caracas', to: 'riodejaneiro', cost: 50, distance: 3700, time: 5 },
                { from: 'lima', to: 'santiago', cost: 25, distance: 2500, time: 3.5 },
                { from: 'lima', to: 'riodejaneiro', cost: 55, distance: 4000, time: 5.5 },
                { from: 'santiago', to: 'buenosaires', cost: 20, distance: 1400, time: 2 },
                { from: 'buenosaires', to: 'saopaulo', cost: 25, distance: 1700, time: 2.5 },
                { from: 'riodejaneiro', to: 'saopaulo', cost: 15, distance: 430, time: 1 },
                { from: 'saopaulo', to: 'bogota', cost: 45, distance: 4300, time: 6 },
                { from: 'santiago', to: 'saopaulo', cost: 35, distance: 3000, time: 4 },
                { from: 'riodejaneiro', to: 'buenosaires', cost: 30, distance: 2100, time: 3 }
            ],
            optimalRoute: ['bogota', 'caracas', 'riodejaneiro', 'saopaulo', 'buenosaires', 'santiago', 'lima', 'bogota'],
            optimalDistance: 15030,
            weatherProne: ['riodejaneiro', 'bogota', 'caracas'] // Cities prone to weather events
        },
        africa: {
            cities: [
                { 
                    id: 'cairo', 
                    name: 'Cairo', 
                    x: 350, 
                    y: 100,
                    population: '9.5 million',
                    area: '3,085 km²',
                    timeZone: 'UTC+2',
                    description: 'Cairo, Egypt\'s sprawling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum.',
                    image: 'https://via.placeholder.com/300x200?text=Cairo'
                },
                { 
                    id: 'lagos', 
                    name: 'Lagos', 
                    x: 200, 
                    y: 200,
                    population: '14.8 million',
                    area: '1,171 km²',
                    timeZone: 'UTC+1',
                    description: 'Lagos is a major port city on Nigeria\'s coast. It is known for its beach resorts, boutiques and nightlife.',
                    image: 'https://via.placeholder.com/300x200?text=Lagos'
                },
                { 
                    id: 'nairobi', 
                    name: 'Nairobi', 
                    x: 350, 
                    y: 250,
                    population: '4.4 million',
                    area: '696 km²',
                    timeZone: 'UTC+3',
                    description: 'Nairobi is Kenya\'s capital city. In addition to its urban core, it has Nairobi National Park, a large game reserve known for breeding endangered black rhinos and home to giraffes, zebras and lions.',
                    image: 'https://via.placeholder.com/300x200?text=Nairobi'
                },
                { 
                    id: 'johannesburg', 
                    name: 'Johannesburg', 
                    x: 300, 
                    y: 380,
                    population: '5.8 million',
                    area: '1,645 km²',
                    timeZone: 'UTC+2',
                    description: 'Johannesburg, South Africa\'s biggest city and capital of Gauteng province, began as a 19th-century gold-mining settlement.',
                    image: 'https://via.placeholder.com/300x200?text=Johannesburg'
                },
                { 
                    id: 'capetown', 
                    name: 'Cape Town', 
                    x: 250, 
                    y: 420,
                    population: '4.6 million',
                    area: '2,455 km²',
                    timeZone: 'UTC+2',
                    description: 'Cape Town is a port city on South Africa\'s southwest coast, on a peninsula beneath the imposing Table Mountain.',
                    image: 'https://via.placeholder.com/300x200?text=Cape+Town'
                },
                { 
                    id: 'casablanca', 
                    name: 'Casablanca', 
                    x: 150, 
                    y: 120,
                    population: '3.4 million',
                    area: '220 km²',
                    timeZone: 'UTC+1',
                    description: 'Casablanca is a port city and commercial hub in western Morocco, fronting the Atlantic Ocean. The city\'s French colonial legacy is seen in its downtown area.',
                    image: 'https://via.placeholder.com/300x200?text=Casablanca'
                },
                { 
                    id: 'addisababa', 
                    name: 'Addis Ababa', 
                    x: 380, 
                    y: 180,
                    population: '3.4 million',
                    area: '527 km²',
                    timeZone: 'UTC+3',
                    description: 'Addis Ababa, Ethiopia\'s sprawling capital in the highlands bordering the Great Rift Valley, is the country\'s commercial and cultural hub.',
                    image: 'https://via.placeholder.com/300x200?text=Addis+Ababa'
                }
            ],
            paths: [
                { from: 'cairo', to: 'addisababa', cost: 30, distance: 2400, time: 3.5 },
                { from: 'cairo', to: 'casablanca', cost: 40, distance: 3600, time: 5 },
                { from: 'casablanca', to: 'lagos', cost: 35, distance: 2900, time: 4 },
                { from: 'lagos', to: 'addisababa', cost: 30, distance: 3600, time: 5 },
                { from: 'lagos', to: 'nairobi', cost: 40, distance: 4200, time: 6 },
                { from: 'addisababa', to: 'nairobi', cost: 20, distance: 1100, time: 2 },
                { from: 'nairobi', to: 'johannesburg', cost: 35, distance: 3500, time: 4.5 },
                { from: 'johannesburg', to: 'capetown', cost: 25, distance: 1400, time: 2 },
                { from: 'capetown', to: 'lagos', cost: 50, distance: 5600, time: 7 },
                { from: 'johannesburg', to: 'cairo', cost: 45, distance: 6200, time: 8 },
                { from: 'casablanca', to: 'capetown', cost: 55, distance: 7500, time: 9 }
            ],
            optimalRoute: ['cairo', 'addisababa', 'nairobi', 'johannesburg', 'capetown', 'lagos', 'casablanca', 'cairo'],
            optimalDistance: 24700,
            weatherProne: ['lagos', 'addisababa', 'nairobi'] // Cities prone to weather events
        }
    };

    // Transport data
    const transportData = {
        car: {
            name: 'Car',
            icon: '🚗',
            speedFactor: 1,
            costFactor: 1,
            weatherImpact: 1.5 // High impact of weather
        },
        plane: {
            name: 'Airplane',
            icon: '✈️',
            speedFactor: 5,
            costFactor: 3,
            weatherImpact: 2 // Very high impact of weather
        },
        train: {
            name: 'Train',
            icon: '🚆',
            speedFactor: 2,
            costFactor: 1.5,
            weatherImpact: 1.2 // Moderate impact of weather
        },
        ship: {
            name: 'Ship',
            icon: '🚢',
            speedFactor: 0.8,
            costFactor: 0.7,
            weatherImpact: 1.8 // High impact of weather
        }
    };

    // Sound effects for game events
    const soundEffects = {
        cityClick: 'sounds/city-click.mp3',
        pathSelect: 'sounds/path-select.mp3',
        routeComplete: 'sounds/route-complete.mp3',
        routeInvalid: 'sounds/route-invalid.mp3',
        achievement: 'sounds/achievement.mp3',
        weatherAlert: 'sounds/weather-alert.mp3',
        gameStart: 'sounds/game-start.mp3',
        gameEnd: 'sounds/game-end.mp3',
        buttonClick: 'sounds/button-click.mp3'
    };

    // Enhanced weather types with realistic impacts
    const weatherTypes = [
        {
            type: 'rain',
            name: 'Rain',
            description: 'Heavy rainfall makes travel slower and more expensive.',
            icon: '🌧️',
            transportEffect: {
                car: 1.7,
                plane: 1.5,
                train: 1.3,
                ship: 1.6
            },
            sound: 'sounds/rain.mp3'
        },
        {
            type: 'snow',
            name: 'Snow',
            description: 'Snowfall significantly impacts road travel and can delay flights.',
            icon: '❄️',
            transportEffect: {
                car: 2.0,
                plane: 1.8,
                train: 1.5,
                ship: 1.3
            },
            sound: 'sounds/snow.mp3'
        },
        {
            type: 'fog',
            name: 'Fog',
            description: 'Dense fog reduces visibility and slows all transportation.',
            icon: '🌫️',
            transportEffect: {
                car: 1.5,
                plane: 2.1,
                train: 1.4,
                ship: 1.8
            },
            sound: 'sounds/fog.mp3'
        },
        {
            type: 'storm',
            name: 'Storm',
            description: 'Severe storms create dangerous travel conditions.',
            icon: '⛈️',
            transportEffect: {
                car: 1.8,
                plane: 2.5,
                train: 1.6,
                ship: 2.2
            },
            sound: 'sounds/storm.mp3'
        },
        {
            type: 'heatwave',
            name: 'Heatwave',
            description: 'Extreme heat can cause equipment failures and delays.',
            icon: '🔥',
            transportEffect: {
                car: 1.4,
                plane: 1.3,
                train: 1.7,
                ship: 1.2
            },
            sound: 'sounds/heatwave.mp3'
        }
    ];
    
    // Tutorial steps
    const tutorialSteps = [
        {
            title: "Welcome to The Route Challenge!",
            message: "This game challenges you to solve the Traveling Salesman Problem - finding the optimal route through multiple cities. Let's get started!",
            target: ".game-container",
            position: "center"
        },
        {
            title: "Select Your Region",
            message: "First, choose a geographic region to explore. Each region has its own set of cities and connections.",
            target: "#regionSelect",
            position: "right"
        },
        {
            title: "Choose Your Difficulty",
            message: "Select a difficulty level. Higher difficulties have fewer available paths between cities.",
            target: "#difficultySelect",
            position: "right"
        },
        {
            title: "Select Your Transport",
            message: "Choose your mode of transportation. Each has different speed and cost factors, and reacts differently to weather conditions.",
            target: "#transportSelect",
            position: "right"
        },
        {
            title: "Game Modes",
            message: "Try different game modes: Standard mode is a classic experience, Timed mode adds a time challenge, and Expert mode has limited path visibility.",
            target: ".game-modes",
            position: "bottom"
        },
        {
            title: "Start the Game",
            message: "Click 'Start New Game' when you're ready to begin your journey!",
            target: "#startBtn",
            position: "right"
        },
        {
            title: "City Selection",
            message: "Click on cities to build your route. You must visit all cities exactly once and return to your starting point.",
            target: "#gameMap",
            position: "left"
        },
        {
            title: "City Information",
            message: "Right-click on any city (or Ctrl+click) to view detailed information about it.",
            target: "#gameMap",
            position: "right"
        },
        {
            title: "Route Building",
            message: "Your route will appear here as you select cities. Watch your distance, cost, and travel time increase.",
            target: ".route-list",
            position: "left"
        },
        {
            title: "Weather Effects",
            message: "Weather may affect certain cities, increasing travel costs and time. Watch for weather indicators on the map!",
            target: ".weather-effects",
            position: "center"
        },
        {
            title: "Complete Your Route",
            message: "After visiting all cities, return to your starting city to complete the route.",
            target: "#validateBtn",
            position: "right"
        },
        {
            title: "You're Ready!",
            message: "Now you know the basics! Remember, the goal is to find the most efficient route. Good luck!",
            target: ".game-container",
            position: "center"
        }
    ];
    
    // Achievement definitions
    const achievements = {
        speed_demon: {
            name: 'Speed Demon',
            description: 'Complete a route in under 1 minute',
            icon: '🚀',
            check: () => elapsedTime < 60
        },
        perfectionist: {
            name: 'Perfectionist',
            description: 'Find the optimal route on hard difficulty',
            icon: '✨',
            check: (score, route, difficulty) => {
                const region = regionData[currentRegion];
                return difficulty === 'hard' && 
                       JSON.stringify(route.map(city => city.id)) === 
                       JSON.stringify([...region.optimalRoute, region.optimalRoute[0]]);
            }
        },
        globetrotter: {
            name: 'Globetrotter',
            description: 'Complete routes in all regions',
            icon: '🌍',
            check: () => {
                const regions = Object.keys(regionData);
                return regions.every(region => localStorage.getItem(`completed_${region}`) === 'true');
            }
        },
        weatherproof: {
            name: 'Weatherproof',
            description: 'Complete a route with active weather effects',
            icon: '☔',
            check: () => weatherEffects
        },
        speed_run: {
            name: 'Speed Run',
            description: 'Complete a timed challenge with at least 800 points',
            icon: '⏱️',
            check: (score, route, difficulty, mode) => mode === 'timed' && score >= 800
        },
        explorer: {
            name: 'Explorer',
            description: 'Visit all city info panels in a region',
            icon: '🔍',
            check: () => {
                const region = regionData[currentRegion];
                return region.cities.every(city => localStorage.getItem(`visited_${city.id}`) === 'true');
            }
        }
    };
    
    // Helper function for sound effects
    function playSound(soundFile) {
        if (!soundEnabled) return;
        
        try {
            const sound = new Audio(soundFile);
            sound.volume = 0.5;
            sound.play().catch(e => console.warn("Failed to play sound:", e));
        } catch (e) {
            console.warn("Error playing sound:", e);
        }
    }
    
    // Toggle sound function
    function toggleSound() {
        soundEnabled = !soundEnabled;
        
        // Update UI
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (soundToggleBtn) {
            soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
            soundToggleBtn.title = soundEnabled ? 'Sound On' : 'Sound Off';
        }
        
        // Play feedback sound if enabling
        if (soundEnabled) {
            playSound(soundEffects.buttonClick);
        }
    }
    
    // Helper functions for local storage and save/load
    function saveGameState() {
        try {
            const gameState = {
                achievements: achievementsEarned,
                completedRegions: Object.keys(regionData).filter(region => 
                    localStorage.getItem(`completed_${region}`) === 'true'
                ),
                visitedCities: [],
                settings: {
                    soundEnabled: soundEnabled,
                    currentTheme: currentTheme
                }
            };
            
            localStorage.setItem('routeChallenge_gameState', JSON.stringify(gameState));
        } catch (e) {
            console.error("Error saving game state:", e);
        }
    }
    
    function loadGameState() {
        try {
            const savedState = localStorage.getItem('routeChallenge_gameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                achievementsEarned = gameState.achievements || {};
                
                // Load settings if available
                if (gameState.settings) {
                    soundEnabled = gameState.settings.soundEnabled !== undefined ? 
                        gameState.settings.soundEnabled : true;
                    
                    if (gameState.settings.currentTheme) {
                        changeMapTheme(gameState.settings.currentTheme);
                    }
                }
                
                // Update achievement display
                updateAchievementDisplay();
                
                // Update sound toggle button
                const soundToggleBtn = document.getElementById('soundToggleBtn');
                if (soundToggleBtn) {
                    soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
                    soundToggleBtn.title = soundEnabled ? 'Sound On' : 'Sound Off';
                }
            }
        } catch (e) {
            console.error("Error loading game state:", e);
            // If there's an error, use an empty achievements object
            achievementsEarned = {};
        }
    }
    
    // Save current game progress
    function saveCurrentGame() {
        if (!gameActive || selectedRoute.length === 0) {
            showNotification("No active game to save!");
            return;
        }
        
        try {
            const gameProgress = {
                region: currentRegion,
                theme: currentTheme,
                difficulty: currentDifficulty,
                transport: currentTransport,
                gameMode: currentGameMode,
                selectedRoute: selectedRoute.map(city => city.id),
                startCity: startCity ? startCity.id : null,
                elapsedTime: elapsedTime,
                weatherEffects: weatherEffects,
                weatherAffectedCities: weatherAffectedCities,
                timestamp: Date.now()
            };
            
            localStorage.setItem('routeChallenge_savedGame', JSON.stringify(gameProgress));
            showNotification("Game saved successfully!");
            
            playSound(soundEffects.buttonClick);
        } catch (e) {
            console.error("Error saving game progress:", e);
            showNotification("Failed to save game!");
        }
    }
    
    // Load saved game
    function loadSavedGame() {
        try {
            const savedGame = localStorage.getItem('routeChallenge_savedGame');
            if (!savedGame) {
                showNotification("No saved game found!");
                return false;
            }
            
            const gameProgress = JSON.parse(savedGame);
            
            // Check if saved game is still valid
            if (!gameProgress || !gameProgress.region || !gameProgress.selectedRoute) {
                showNotification("Saved game is corrupted or invalid!");
                return false;
            }
            
            // End current game if active
            if (gameActive) {
                endGame();
            }
            
            // Set game settings from saved game
            currentRegion = gameProgress.region;
            currentTheme = gameProgress.theme || 'political';
            currentDifficulty = gameProgress.difficulty || 'medium';
            currentTransport = gameProgress.transport || 'car';
            currentGameMode = gameProgress.gameMode || 'standard';
            elapsedTime = gameProgress.elapsedTime || 0;
            weatherEffects = gameProgress.weatherEffects || false;
            weatherAffectedCities = gameProgress.weatherAffectedCities || [];
            
            // Update UI to match settings
            if (regionSelect) regionSelect.value = currentRegion;
            if (difficultySelect) difficultySelect.value = currentDifficulty;
            if (transportSelect) transportSelect.value = currentTransport;
            
            // Update game mode buttons
            modeBtns.forEach(btn => {
                if (btn.dataset.mode === currentGameMode) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Change map theme
            changeMapTheme(currentTheme);
            
            // Start the game (this will load the region and cities)
            startGame(true); // true indicates it's a loaded game
            
            // Restore route from saved IDs
            const routeIds = gameProgress.selectedRoute || [];
            const cityMap = {};
            
            // Create a map of city ID to city object
            cities.forEach(city => {
                cityMap[city.id] = city;
            });
            
            // Find start city
            if (gameProgress.startCity && cityMap[gameProgress.startCity]) {
                startCity = cityMap[gameProgress.startCity];
                const startCityElement = document.getElementById(startCity.id);
                if (startCityElement) {
                    startCityElement.classList.add('start');
                    startCityElement.classList.add('visited');
                }
            }
            
            // Clear existing route
            selectedRoute = [];
            
            // Recreate the route
            if (startCity) {
                selectedRoute.push(startCity);
                
                for (let i = 0; i < routeIds.length; i++) {
                    if (routeIds[i] === startCity.id) continue; // Skip start city in the route IDs
                    
                    const cityId = routeIds[i];
                    if (cityMap[cityId]) {
                        const city = cityMap[cityId];
                        const cityElement = document.getElementById(city.id);
                        
                        if (cityElement) {
                            cityElement.classList.add('visited');
                            
                            // Create route path from previous city
                            if (selectedRoute.length > 0) {
                                const prevCity = selectedRoute[selectedRoute.length - 1];
                                createRoutePath(prevCity, city, selectedRoute.length);
                            }
                            
                            // Add to route
                            selectedRoute.push(city);
                        }
                    }
                }
            }
            
            // Update route display
            updateRouteDisplay();
            
            // Check if route is complete
            if (selectedRoute.length === cities.length + 1) {
                validateBtn.disabled = false;
            }
            
            // Start timer from saved elapsed time
            startTime = Date.now() - (elapsedTime * 1000);
            timer = setInterval(updateTimer, 1000);
            
            // Apply weather effects if needed
            if (weatherEffects) {
                applyWeatherEffects();
            }
            
            showNotification("Game loaded successfully!");
            playSound(soundEffects.gameStart);
            return true;
        } catch (e) {
            console.error("Error loading saved game:", e);
            showNotification("Failed to load game!");
            return false;
        }
    }
    
    // Show notification
    function showNotification(message, duration = 3000) {
        // Create container if it doesn't exist
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, duration);
    }
    
    // ===============================================
    // Game Initialization and Setup
    // ===============================================
    
    // Initialize the game
    function init() {
        try {
            // Create the UI elements for new features
            createNewUIElements();
            
            // Hide loading screen after delay
            setTimeout(() => {
                const loadingScreen = document.querySelector('.loading');
                if (!loadingScreen) return;
                
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loadingScreen,
                        opacity: 0,
                        duration: 800,
                        easing: 'easeOutQuad',
                        complete: function() {
                            loadingScreen.style.display = 'none';
                        }
                    });
                } else {
                    // Fallback if anime.js isn't loaded
                    loadingScreen.style.opacity = 0;
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 800);
                }
            }, 2000);
            
            // Load saved game state
            loadGameState();
            
            // Set up event listeners
            setupEventListeners();
            
            // Show preview of selected region
            clearGameMap();
            loadRegion(currentRegion, currentDifficulty);
            addEarthEffect();
            
            // Check if first time playing
            if (!localStorage.getItem('routeChallenge_tutorialCompleted')) {
                // Delay the tutorial to let the game load first
                setTimeout(startTutorial, 2500);
            }
        } catch (e) {
            console.error("Error initializing game:", e);
            
            // Try to show a simple message if initialization fails
            const loadingScreen = document.querySelector('.loading');
            if (loadingScreen) {
                loadingScreen.innerHTML = '<p>Error loading the game. Please refresh the page.</p>';
            }
        }
    }
    
    // Create new UI elements for enhanced features
    function createNewUIElements() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Create tutorial container
        const tutorialContainer = document.createElement('div');
        tutorialContainer.className = 'tutorial-container';
        tutorialContainer.innerHTML = `
            <div class="tutorial-panel">
                <div class="tutorial-header">
                    <h3 id="tutorialTitle">Tutorial</h3>
                    <button id="tutorialCloseBtn" class="close-btn">×</button>
                </div>
                <div class="tutorial-content">
                    <p id="tutorialMessage">Welcome to The Route Challenge!</p>
                </div>
                <div class="tutorial-buttons">
                    <button id="tutorialPrevBtn" class="btn small">Previous</button>
                    <div class="tutorial-indicator">
                        <span id="tutorialCurrentStep">1</span>/<span id="tutorialTotalSteps">${tutorialSteps.length}</span>
                    </div>
                    <button id="tutorialNextBtn" class="btn primary small">Next</button>
                </div>
            </div>
            <div class="tutorial-overlay"></div>
        `;
        document.body.appendChild(tutorialContainer);
        
        // Create game controls toolbar
        const gameToolbar = document.createElement('div');
        gameToolbar.className = 'game-toolbar';
        gameToolbar.innerHTML = `
            <button id="soundToggleBtn" title="Toggle Sound" class="toolbar-btn">🔊</button>
            <button id="saveGameBtn" title="Save Game" class="toolbar-btn">💾</button>
            <button id="loadGameBtn" title="Load Game" class="toolbar-btn">📂</button>
            <button id="tutorialBtn" title="Tutorial" class="toolbar-btn">❓</button>
        `;
        
        // Add to the game container
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.insertBefore(gameToolbar, gameContainer.firstChild);
        }
        
        // Create weather info panel
        const weatherInfoPanel = document.createElement('div');
        weatherInfoPanel.className = 'weather-info-panel hidden';
        weatherInfoPanel.innerHTML = `
            <div class="panel-content">
                <div class="weather-icon" id="weatherIcon"></div>
                <h4 id="weatherName">Weather Condition</h4>
                <p id="weatherDescription">Weather description will appear here.</p>
                <div class="weather-effects-list">
                    <h5>Impact on Transport</h5>
                    <ul id="weatherEffectsList"></ul>
                </div>
            </div>
        `;
        document.body.appendChild(weatherInfoPanel);
        
        // Add atmosphere container for enhanced globe effect
        const atmosphereContainer = document.createElement('div');
        atmosphereContainer.className = 'globe-atmosphere';
        
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.appendChild(atmosphereContainer);
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Game control buttons
        startBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            startGame();
        });
        
        resetBtn.addEventListener('click', function() {
            if (gameActive) {
                playSound(soundEffects.buttonClick);
                resetRoute();
            }
        });
        
        validateBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            validateRoute();
        });
        
        hintBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            showHint();
        });
        
        // New toolbar buttons
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (soundToggleBtn) {
            soundToggleBtn.addEventListener('click', function() {
                toggleSound();
                playSound(soundEffects.buttonClick);
            });
        }
        
        const saveGameBtn = document.getElementById('saveGameBtn');
        if (saveGameBtn) {
            saveGameBtn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                saveCurrentGame();
            });
        }
        
        const loadGameBtn = document.getElementById('loadGameBtn');
        if (loadGameBtn) {
            loadGameBtn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                loadSavedGame();
            });
        }
        
        const tutorialBtn = document.getElementById('tutorialBtn');
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                startTutorial();
            });
        }
        
        // Tutorial buttons
        const tutorialCloseBtn = document.getElementById('tutorialCloseBtn');
        if (tutorialCloseBtn) {
            tutorialCloseBtn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                endTutorial();
            });
        }
        
        const tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
        if (tutorialPrevBtn) {
            tutorialPrevBtn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                showTutorialStep(tutorialStep - 1);
            });
        }
        
        const tutorialNextBtn = document.getElementById('tutorialNextBtn');
        if (tutorialNextBtn) {
            tutorialNextBtn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                showTutorialStep(tutorialStep + 1);
            });
        }
        
        // Weather panel close button
        const weatherPanel = document.querySelector('.weather-info-panel');
        if (weatherPanel) {
            const closeBtn = weatherPanel.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    weatherPanel.classList.add('hidden');
                    playSound(soundEffects.buttonClick);
                });
            }
        }
        
        // Settings
        regionSelect.addEventListener('change', function() {
            playSound(soundEffects.buttonClick);
            currentRegion = this.value;
            
            if (gameActive) {
                endGame();
            }
            
            // Preview the selected region
            clearGameMap();
            loadRegion(currentRegion, currentDifficulty);
            addEarthEffect();
        });
        
        difficultySelect.addEventListener('change', function() {
            playSound(soundEffects.buttonClick);
            currentDifficulty = this.value;
            
            if (gameActive) {
                endGame();
                startGame();
            }
        });
        
        transportSelect.addEventListener('change', function() {
            playSound(soundEffects.buttonClick);
            currentTransport = this.value;
            const transport = transportData[currentTransport];
            
            // Update transport icons on all cities
            document.querySelectorAll('.city').forEach(city => {
                city.dataset.transport = transport.icon;
            });
            
            // If route exists, update the route display with new costs
            if (selectedRoute.length > 0) {
                updateRouteDisplay();
            }
        });
        
        // Theme selection
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                changeMapTheme(this.dataset.theme);
                saveGameState(); // Save theme preference
            });
        });
        
        // Game mode buttons
        modeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                modeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentGameMode = this.dataset.mode;
                
                // If game is active, restart with new mode
                if (gameActive) {
                    endGame();
                    startGame();
                }
                
                // Update UI based on selected mode
                updateGameModeUI(currentGameMode);
            });
        });
        
        // Map controls
        zoomInBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            zoomIn();
        });
        
        zoomOutBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            zoomOut();
        });
        
        resetViewBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            resetView();
        });
        
        // Map dragging
        gameMap.addEventListener('mousedown', function(e) {
            if (e.button === 0) { // Left mouse button
                isMapDragging = true;
                lastMousePosition = { x: e.clientX, y: e.clientY };
                gameMap.style.cursor = 'grabbing';
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isMapDragging) {
                const dx = e.clientX - lastMousePosition.x;
                const dy = e.clientY - lastMousePosition.y;
                
                mapPan.x += dx / zoomLevel;
                mapPan.y += dy / zoomLevel;
                
                updateMapTransform();
                
                lastMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isMapDragging) {
                isMapDragging = false;
                gameMap.style.cursor = 'grab';
            }
        });
        
        // Touch support for dragging
        gameMap.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                isMapDragging = true;
                lastMousePosition = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY 
                };
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchmove', function(e) {
            if (isMapDragging && e.touches.length === 1) {
                const dx = e.touches[0].clientX - lastMousePosition.x;
                const dy = e.touches[0].clientY - lastMousePosition.y;
                
                mapPan.x += dx / zoomLevel;
                mapPan.y += dy / zoomLevel;
                
                updateMapTransform();
                
                lastMousePosition = { 
                    x: e.touches[0].clientX, 
                    y: e.touches[0].clientY 
                };
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', function() {
            isMapDragging = false;
        });
        
        // Result panel buttons
        newGameBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            hideResultPanel();
            startGame();
        });
        
        shareBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            shareResult();
        });
        
        viewOptimalBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            hideResultPanel();
            showOptimalRoute();
        });
        
        closeResultBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            hideResultPanel();
        });
        
        // Hint panel buttons
        nextHintBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            showNextHint();
        });
        
        showSolutionBtn.addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            showSolution();
        });
        
        if (document.querySelector('.hint-panel .close-btn')) {
            document.querySelector('.hint-panel .close-btn').addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                hideHintPanel();
            });
        }
        
        // City info panel
        if (document.querySelector('.city-info-panel .close-btn')) {
            document.querySelector('.city-info-panel .close-btn').addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                hideCityInfo();
            });
        }
        
        // Achievements panel toggle
        if (document.querySelector('.achievements-panel .toggle-btn')) {
            document.querySelector('.achievements-panel .toggle-btn').addEventListener('click', function() {
                playSound(soundEffects.buttonClick);
                achievementsPanel.classList.toggle('collapsed');
            });
        }
    }
    
    // Update UI based on game mode
    function updateGameModeUI(mode) {
        // Remove all mode-specific classes
        gameMap.classList.remove('timed-mode-map', 'expert-mode-map');
        if (timeDisplay && timeDisplay.parentElement) {
            timeDisplay.parentElement.classList.remove('timed-mode');
        }
        
        switch(mode) {
            case 'timed':
                if (timeDisplay && timeDisplay.parentElement) {
                    timeDisplay.parentElement.classList.add('timed-mode');
                }
                break;
            case 'expert':
                gameMap.classList.add('expert-mode-map');
                break;
            // Standard mode is default, no special UI needed
        }
    }
    
    // Start a new game
    function startGame(isLoadedGame = false) {
        try {
            if (!isLoadedGame) {
                // Only clear and reset if not loading a saved game
                clearGameMap();
                gameActive = true;
                startTime = Date.now();
                elapsedTime = 0;
                selectedRoute = [];
                startCity = null;
                hintCount = 0;
                weatherEffects = Math.random() < 0.3; // 30% chance of weather effects
                weatherAffectedCities = [];
            }
            
            gameActive = true;
            
            // Reset map view if not loading
            if (!isLoadedGame) {
                resetView();
            }
    
            // Start the timer
            if (timer) clearInterval(timer);
            timer = setInterval(updateTimer, 1000);
    
            // Load the selected region with appropriate difficulty
            if (!isLoadedGame) {
                loadRegion(currentRegion, currentDifficulty);
                
                // Add Earth effect
                addEarthEffect();
                
                // Apply weather effects if needed
                if (weatherEffects) {
                    applyWeatherEffects();
                }
            }
            
            // Update UI elements
            resetBtn.disabled = false;
            validateBtn.disabled = !(selectedRoute.length === cities.length + 1);
            hintBtn.disabled = false;
            startBtn.disabled = true;
            
            if (!isLoadedGame) {
                updateRouteDisplay();
            }
            
            // Apply current game mode UI
            updateGameModeUI(currentGameMode);
            
            // Animate the cities appearing if not loading
            if (!isLoadedGame && typeof anime !== 'undefined') {
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
            }
            
            // Update counters
            if (!isLoadedGame) {
                visitedCountDisplay.textContent = '0';
                totalCitiesDisplay.textContent = cities.length;
                currentCostDisplay.textContent = '0';
                currentDistanceDisplay.textContent = '0';
                travelTimeDisplay.textContent = '0';
            }
            
            // If timed mode, set timer constraints
            if (currentGameMode === 'timed' && timeDisplay && timeDisplay.parentElement) {
                // Add visual timer indication
                timeDisplay.parentElement.classList.add('timed-mode');
            }
            
            // Play start game sound
            if (!isLoadedGame) {
                playSound(soundEffects.gameStart);
            }
        } catch (e) {
            console.error("Error starting game:", e);
            // If there's an error, try to reset to a valid state
            endGame();
        }
    }
    
    // End the current game
    function endGame() {
        gameActive = false;
        clearInterval(timer);
        resetBtn.disabled = true;
        validateBtn.disabled = true;
        hintBtn.disabled = true;
        startBtn.disabled = false;
        
        // Clear timed mode indication if needed
        if (currentGameMode === 'timed' && timeDisplay && timeDisplay.parentElement) {
            timeDisplay.parentElement.classList.remove('timed-mode');
        }
        
        // Play end game sound
        playSound(soundEffects.gameEnd);
    }
    
    // Clear the game map
    function clearGameMap() {
        if (!gameMap) return;
        
        gameMap.innerHTML = '';
        if (routeList) routeList.innerHTML = '';
        cities = [];
        paths = [];
        routePaths = [];
        
        // Add weather effects container back
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-effects';
        gameMap.appendChild(weatherContainer);
        
        // Add map controls back
        const mapControls = document.createElement('div');
        mapControls.className = 'map-controls';
        mapControls.innerHTML = `
            <button id="zoomInBtn" class="map-control-btn">+</button>
            <button id="zoomOutBtn" class="map-control-btn">-</button>
            <button id="resetViewBtn" class="map-control-btn">⟲</button>
        `;
        gameMap.appendChild(mapControls);
        
        // Reattach event listeners to map controls
        document.getElementById('zoomInBtn').addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            zoomIn();
        });
        
        document.getElementById('zoomOutBtn').addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            zoomOut();
        });
        
        document.getElementById('resetViewBtn').addEventListener('click', function() {
            playSound(soundEffects.buttonClick);
            resetView();
        });
    }
    
    // Add enhanced 3D Earth effect to the map
    function addEarthEffect() {
        if (!gameMap) return;
        
        gameMap.classList.add('map-earth');
        
        // Add 3D rotation and lighting effects
        const rotateMap = () => {
            if (!gameMap) return;
            
            const centerX = gameMap.offsetWidth / 2;
            const centerY = gameMap.offsetHeight / 2;
            
            // Create a subtle auto-rotation effect
            let angle = 0;
            let radius = 10;
            
            function animateRotation() {
                if (!gameActive) return; // Stop animation when game is not active
                
                angle += 0.01;
                const x = Math.sin(angle) * radius;
                const y = Math.cos(angle) * radius;
                
                // Apply 3D rotation if not being dragged
                if (!isMapDragging) {
                    gameMap.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
                    
                    // Apply dynamic lighting effect
                    const lightX = centerX + Math.sin(angle) * centerX * 0.8;
                    const lightY = centerY + Math.cos(angle) * centerY * 0.8;
                    gameMap.style.backgroundImage = `radial-gradient(circle at ${lightX}px ${lightY}px, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 70%)`;
                }
                
                requestAnimationFrame(animateRotation);
            }
            
            // Start auto-rotation
            requestAnimationFrame(animateRotation);
        };
        
        // Add 3D movement effect based on mouse position
        gameMap.addEventListener('mousemove', function(e) {
            if (isMapDragging) return; // Skip tilt effect when dragging
            
            const rect = gameMap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate tilt based on mouse position (enhanced range)
            const tiltX = (y / rect.height) * 15;
            const tiltY = (-x / rect.width) * 15;
            
            // Add smooth transition for mouse movement
            gameMap.style.transition = 'transform 0.3s ease-out';
            gameMap.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Dynamic lighting follows cursor position
            gameMap.style.backgroundImage = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.4) 70%)`;
        });
        
        // Add subtle bounce effect when cities are clicked
        gameMap.addEventListener('click', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: gameMap,
                    scale: [1, 0.98, 1],
                    duration: 300,
                    easing: 'easeOutElastic(1, .5)'
                });
            }
        });
        
        // Reset transform when mouse leaves
        gameMap.addEventListener('mouseleave', function() {
            gameMap.style.transition = 'transform 1s ease-out, background-image 1s ease-out';
            gameMap.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            gameMap.style.backgroundImage = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)';
            
            // Restart auto-rotation when mouse leaves
            rotateMap();
        });
        
        // Add 3D stars/atmosphere effect
        addGlobeAtmosphere();
        
        // Start rotation
        rotateMap();
    }
    
    // Add atmosphere effect to the globe
    function addGlobeAtmosphere() {
        const atmosphere = document.querySelector('.globe-atmosphere');
        if (!atmosphere) return;
        
        // Clear any existing stars
        atmosphere.innerHTML = '';
        
        // Add stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${3 + Math.random() * 7}s`;
            
            // Vary star sizes
            const size = 1 + Math.random() * 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            atmosphere.appendChild(star);
        }
        
        // Add cloud layers if not in expert mode
        if (currentGameMode !== 'expert') {
            for (let i = 0; i < 3; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'globe-cloud';
                cloud.style.animationDelay = `${i * 2}s`;
                cloud.style.opacity = 0.1 + (Math.random() * 0.1);
                atmosphere.appendChild(cloud);
            }
        }
    }
    
    // Load region data with appropriate difficulty
    function loadRegion(region, difficulty) {
        if (!regionData[region] || !gameMap) return;
        
        const data = regionData[region];
        const difficultyFactor = getDifficultyFactor(difficulty);
        
        // Create cities
        data.cities.forEach(city => {
            createCity(city);
        });
        
        // Create paths based on difficulty
        let pathsToBuild = [...data.paths];
        
        if (difficulty === 'hard') {
            // Remove some paths to make it harder
            pathsToBuild = pathsToBuild.filter(() => Math.random() > 0.2);
        } else if (difficulty === 'easy') {
            // Add some extra paths to make it easier
            const existingPaths = new Set();
            data.paths.forEach(path => {
                existingPaths.add(`${path.from}-${path.to}`);
                existingPaths.add(`${path.to}-${path.from}`);
            });
            
            // Try to add a few extra paths
            for (let i = 0; i < data.cities.length; i++) {
                for (let j = i + 1; j < data.cities.length; j++) {
                    const cityA = data.cities[i];
                    const cityB = data.cities[j];
                    
                    if (!existingPaths.has(`${cityA.id}-${cityB.id}`) && Math.random() < 0.3) {
                        // Calculate a reasonable distance
                        const dx = cityB.x - cityA.x;
                        const dy = cityB.y - cityA.y;
                        const distance = Math.sqrt(dx * dx + dy * dy) * 10;
                        const cost = Math.round(distance / 40);
                        const time = Math.round(distance / 500 * 10) / 10;
                        
                        pathsToBuild.push({
                            from: cityA.id,
                            to: cityB.id,
                            cost: cost,
                            distance: Math.round(distance),
                            time: time
                        });
                        
                        existingPaths.add(`${cityA.id}-${cityB.id}`);
                        existingPaths.add(`${cityB.id}-${cityA.id}`);
                    }
                }
            }
        }
        
        // Create all paths
        pathsToBuild.forEach(path => {
            createPath(path);
        });
    }
    
    // Get difficulty factor based on selected difficulty
    function getDifficultyFactor(difficulty) {
        switch(difficulty) {
            case 'easy': return 1.2;
            case 'medium': return 1.0;
            case 'hard': return 0.8;
            default: return 1.0;
        }
    }
    
    // Apply enhanced weather effects to the map
    function applyWeatherEffects(specifiedWeatherType = null) {
        if (!regionData[currentRegion]) return;
        
        const region = regionData[currentRegion];
        
        // Select a weather type randomly if not specified
        let weatherType;
        if (specifiedWeatherType) {
            weatherType = weatherTypes.find(w => w.type === specifiedWeatherType) || weatherTypes[0];
        } else {
            weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        }
        
        const weatherContainer = document.querySelector('.weather-effects');
        
        if (!weatherContainer) return;
        
        // Apply weather effect class
        weatherContainer.className = 'weather-effects';
        weatherContainer.classList.add(weatherType.type);
        
        // Mark weather-affected cities
        weatherAffectedCities = region.weatherProne ? region.weatherProne.slice() : [];
        
        // Mark cities as weather affected
        weatherAffectedCities.forEach(cityId => {
            const cityElement = document.getElementById(cityId);
            if (cityElement) {
                cityElement.classList.add('weather-affected');
                
                // Also mark connected paths
                paths.forEach(path => {
                    if (path.from.id === cityId || path.to.id === cityId) {
                        path.element.classList.add('weather-affected');
                        path.weatherAffected = true;
                    }
                });
            }
        });
        
        // Play weather sound effect
        playSound(weatherType.sound || soundEffects.weatherAlert);
        
        // Show weather notification
        showNotification(`${weatherType.icon} Weather Alert: ${weatherType.name} is affecting some cities!`, 5000);
        
        // Update weather info panel
        updateWeatherInfoPanel(weatherType);
        
        // Show the weather info panel
        setTimeout(() => {
            const weatherInfoPanel = document.querySelector('.weather-info-panel');
            if (weatherInfoPanel) {
                weatherInfoPanel.classList.remove('hidden');
            }
        }, 1000);
    }
    
    // Update weather info panel with details
    function updateWeatherInfoPanel(weatherType) {
        const weatherInfoPanel = document.querySelector('.weather-info-panel');
        if (!weatherInfoPanel) return;
        
        const weatherTitle = document.getElementById('weatherTitle');
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherName = document.getElementById('weatherName');
        const weatherDescription = document.getElementById('weatherDescription');
        const weatherEffectsList = document.getElementById('weatherEffectsList');
        
        if (weatherTitle) weatherTitle.textContent = `Weather Alert: ${weatherType.name}`;
        if (weatherIcon) weatherIcon.textContent = weatherType.icon;
        if (weatherName) weatherName.textContent = weatherType.name;
        if (weatherDescription) weatherDescription.textContent = weatherType.description;
        
        // Clear existing effects
        if (weatherEffectsList) {
            weatherEffectsList.innerHTML = '';
            
            // Add transport-specific effects
            Object.entries(weatherType.transportEffect).forEach(([transport, factor]) => {
                const transportData = this.transportData[transport];
                if (!transportData) return;
                
                const li = document.createElement('li');
                li.innerHTML = `${transportData.icon} ${transportData.name}: ${Math.round((factor - 1) * 100)}% slower & more expensive`;
                
                // Highlight current transport
                if (transport === currentTransport) {
                    li.classList.add('current-transport');
                }
                
                weatherEffectsList.appendChild(li);
            });
        }
    }
