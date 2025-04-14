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
                    description: 'Tashkent is the capital and largest city of Uzbekistan. It's known for its many museums and mix of modern and Soviet-era architecture.',
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
                    description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that's among the world's major commercial, financial and cultural centers.',
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
                    description: 'Vancouver, a bustling west coast seaport in British Columbia, is among Canada's densest, most ethnically diverse cities.',
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

    // Weather types
    const weatherTypes = ['rain', 'snow', 'fog'];
    
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
    
    // Helper functions for local storage
    function saveGameState() {
        try {
            const gameState = {
                achievements: achievementsEarned,
                completedRegions: Object.keys(regionData).filter(region => 
                    localStorage.getItem(`completed_${region}`) === 'true'
                ),
                visitedCities: []
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
                
                // Update achievement display
                updateAchievementDisplay();
            }
        } catch (e) {
            console.error("Error loading game state:", e);
            // If there's an error, use an empty achievements object
            achievementsEarned = {};
        }
    }
    
    // ===============================================
    // Game Initialization and Setup
    // ===============================================
    
    // Initialize the game
    function init() {
        try {
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
        } catch (e) {
            console.error("Error initializing game:", e);
            
            // Try to show a simple message if initialization fails
            const loadingScreen = document.querySelector('.loading');
            if (loadingScreen) {
                loadingScreen.innerHTML = '<p>Error loading the game. Please refresh the page.</p>';
            }
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Game control buttons
        startBtn.addEventListener('click', startGame);
        
        resetBtn.addEventListener('click', function() {
            if (gameActive) {
                resetRoute();
            }
        });
        
        validateBtn.addEventListener('click', validateRoute);
        hintBtn.addEventListener('click', showHint);
        
        // Settings
        regionSelect.addEventListener('change', function() {
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
            currentDifficulty = this.value;
            
            if (gameActive) {
                endGame();
                startGame();
            }
        });
        
        transportSelect.addEventListener('change', function() {
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
                changeMapTheme(this.dataset.theme);
            });
        });
        
        // Game mode buttons
        modeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
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
        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
        resetViewBtn.addEventListener('click', resetView);
        
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
        
        // Result panel buttons
        newGameBtn.addEventListener('click', function() {
            hideResultPanel();
            startGame();
        });
        
        shareBtn.addEventListener('click', shareResult);
        viewOptimalBtn.addEventListener('click', showOptimalRoute);
        closeResultBtn.addEventListener('click', hideResultPanel);
        
        // Hint panel buttons
        nextHintBtn.addEventListener('click', showNextHint);
        showSolutionBtn.addEventListener('click', showSolution);
        
        if (document.querySelector('.hint-panel .close-btn')) {
            document.querySelector('.hint-panel .close-btn').addEventListener('click', hideHintPanel);
        }
        
        // City info panel
        if (document.querySelector('.city-info-panel .close-btn')) {
            document.querySelector('.city-info-panel .close-btn').addEventListener('click', hideCityInfo);
        }
        
        // Achievements panel toggle
        if (document.querySelector('.achievements-panel .toggle-btn')) {
            document.querySelector('.achievements-panel .toggle-btn').addEventListener('click', function() {
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
    function startGame() {
        try {
            clearGameMap();
            gameActive = true;
            startTime = Date.now();
            elapsedTime = 0;
            selectedRoute = [];
            startCity = null;
            hintCount = 0;
            weatherEffects = Math.random() < 0.3; // 30% chance of weather effects
            weatherAffectedCities = [];
            
            // Reset map view
            resetView();
            
            // Start the timer
            if (timer) clearInterval(timer);
            timer = setInterval(updateTimer, 1000);
    
            // Load the selected region with appropriate difficulty
            loadRegion(currentRegion, currentDifficulty);
            
            // Add Earth effect
            addEarthEffect();
            
            // Apply weather effects if needed
            if (weatherEffects) {
                applyWeatherEffects();
            }
            
            // Update UI elements
            resetBtn.disabled = false;
            validateBtn.disabled = true;
            hintBtn.disabled = false;
            startBtn.disabled = true;
            updateRouteDisplay();
            
            // Apply current game mode UI
            updateGameModeUI(currentGameMode);
            
            // Animate the cities appearing
            if (typeof anime !== 'undefined') {
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
            visitedCountDisplay.textContent = '0';
            totalCitiesDisplay.textContent = cities.length;
            currentCostDisplay.textContent = '0';
            currentDistanceDisplay.textContent = '0';
            travelTimeDisplay.textContent = '0';
            
            // If timed mode, set timer constraints
            if (currentGameMode === 'timed' && timeDisplay && timeDisplay.parentElement) {
                // Add visual timer indication
                timeDisplay.parentElement.classList.add('timed-mode');
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
    }
    
    // Add 3D Earth effect to the map
    function addEarthEffect() {
        if (!gameMap) return;
        
        gameMap.classList.add('map-earth');
        
        // Add 3D movement effect based on mouse position
        gameMap.addEventListener('mousemove', function(e) {
            if (isMapDragging) return; // Skip tilt effect when dragging
            
            const rect = gameMap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate tilt based on mouse position (limited range)
            const tiltX = y / rect.height * 10;
            const tiltY = -x / rect.width * 10;
            
            gameMap.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Also adjust the light effect
            gameMap.style.backgroundImage = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.3) 70%)`;
        });
        
        // Reset transform when mouse leaves
        gameMap.addEventListener('mouseleave', function() {
            gameMap.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            gameMap.style.backgroundImage = 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)';
        });
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
    
    // Apply weather effects to the map
    function applyWeatherEffects() {
        if (!regionData[currentRegion]) return;
        
        const region = regionData[currentRegion];
        const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const weatherContainer = document.querySelector('.weather-effects');
        
        if (!weatherContainer) return;
        
        // Apply weather effect class
        weatherContainer.classList.add(weatherType);
        
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
        
        // Show weather notification
        showTooltip({
            pageX: window.innerWidth / 2,
            pageY: window.innerHeight / 2
        }, `Weather Alert: ${weatherType.charAt(0).toUpperCase() + weatherType.slice(1)} affecting some cities!`);
        setTimeout(hideTooltip, 3000);
    }
    
    // Create a city on the map
    function createCity(cityData) {
        if (!gameMap) return;
        
        const city = document.createElement('div');
        city.className = 'city';
        city.id = cityData.id;
        city.style.left = cityData.x + 'px';
        city.style.top = cityData.y + 'px';
        city.dataset.name = cityData.name;
        
        // Add transport icon
        const transport = transportData[currentTransport];
        if (transport) {
            city.dataset.transport = transport.icon;
        }
        
        // Add click event
        city.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                // Show city info on Ctrl/Cmd + click
                showCityInfo(cityData);
            } else {
                // Normal city selection
                handleCityClick(cityData);
            }
        });
        
        // Add right-click event for city info
        city.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showCityInfo(cityData);
        });
        
        // Add hover events for tooltip
        city.addEventListener('mouseenter', (e) => {
            const transport = transportData[currentTransport];
            showTooltip(e, `${cityData.name} ${transport ? transport.icon : ''}`);
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
        if (!gameMap) return;
        
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
        
        // Apply transport-specific styling
        const transport = transportData[currentTransport];
        
        // Add hover events for tooltip
        path.addEventListener('mouseenter', (e) => {
            if (!transport) return;
            
            const costFactor = transport.costFactor;
            const timeFactor = 1 / transport.speedFactor;
            
            let costDisplay = Math.round(pathData.cost * costFactor);
            let timeDisplay = Math.round(pathData.time * timeFactor * 10) / 10;
            let distanceDisplay = pathData.distance;
            
            // Check if weather affects this path
            if (weatherEffects && (weatherAffectedCities.includes(fromCity.id) || weatherAffectedCities.includes(toCity.id))) {
                costDisplay = Math.round(costDisplay * transport.weatherImpact);
                timeDisplay = Math.round(timeDisplay * transport.weatherImpact * 10) / 10;
            }
            
            showTooltip(e, `${fromCity.name} to ${toCity.name}:
                ${transport.icon} $${costDisplay} | ${distanceDisplay} km | ${timeDisplay} hrs`);
        });
        
        path.addEventListener('mousemove', (e) => {
            moveTooltip(e);
        });
        
        path.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        gameMap.appendChild(path);
        paths.push({
            ...pathData, 
            element: path, 
            from: fromCity, 
            to: toCity,
            weatherAffected: false
        });
    }
    
    // Create a route path between cities
    function createRoutePath(fromCity, toCity, index) {
        if (!gameMap) return;
        
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
        
        // Animate the route path with 3D effect
        if (typeof anime !== 'undefined') {
            anime({
                targets: routePath,
                opacity: [0, 1],
                translateZ: [0, 20, 0],
                duration: 800,
                easing: 'easeOutCubic'
            });
        } else {
            // Simple fallback animation if anime.js is not available
            routePath.style.opacity = 1;
        }
        
        // Add particle animation along path
        createPathAnimation(fromCity, toCity);
    }
    
    // Create particle animation along a path
    function createPathAnimation(fromCity, toCity) {
        if (!gameMap || typeof anime === 'undefined') return;
        
        const particle = document.createElement('div');
        particle.className = 'path-animation';
        gameMap.appendChild(particle);
        
        anime({
            targets: particle,
            left: [fromCity.x, toCity.x],
            top: [fromCity.y, toCity.y],
            opacity: [1, 0],
            easing: 'easeOutQuad',
            duration: 1000,
            complete: function() {
                particle.remove();
            }
        });
    }
    
    // Handle city click
    function handleCityClick(cityData) {
        if (!gameActive || !gameMap) return;
        
        const cityElement = document.getElementById(cityData.id);
        if (!cityElement) return;
        
        // If this is the first city, set it as the start
        if (selectedRoute.length === 0) {
            startCity = cityData;
            cityElement.classList.add('start');
            cityElement.classList.add('visited');
            selectedRoute.push(cityData);
            
            // Animate the start city with 3D effect
            if (typeof anime !== 'undefined') {
                anime({
                    targets: cityElement,
                    scale: [1, 1.2, 1],
                    translateZ: [0, 30, 0],
                    boxShadow: [
                        '0 0 0 4px rgba(46, 204, 113, 0.3)',
                        '0 0 0 8px rgba(46, 204, 113, 0.6)',
                        '0 0 0 4px rgba(46, 204, 113, 0.3)'
                    ],
                    duration: 800,
                    easing: 'easeOutElastic(1, .5)'
                });
            }
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
                
                // Animate the completion with 3D effect
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: cityElement,
                        scale: [1, 1.3, 1],
                        translateZ: [0, 50, 0],
                        boxShadow: [
                            '0 0 0 4px rgba(46, 204, 113, 0.3)',
                            '0 0 0 12px rgba(46, 204, 113, 0.6)',
                            '0 0 0 4px rgba(46, 204, 113, 0.3)'
                        ],
                        duration: 1000,
                        easing: 'easeOutElastic(1, .5)'
                    });
                }
            }
            // Otherwise, do nothing if already visited
            return;
        }
        // If there is a direct path to the city
        else if (hasDirectPath(selectedRoute[selectedRoute.length - 1], cityData)) {
            cityElement.classList.add('visited');
            
            // Animate the city selection with 3D effect
            if (typeof anime !== 'undefined') {
                anime({
                    targets: cityElement,
                    scale: [1, 1.2, 1],
                    translateZ: [0, 30, 0],
                    boxShadow: [
                        '0 0 0 4px rgba(52, 152, 219, 0.3)',
                        '0 0 0 8px rgba(52, 152, 219, 0.6)',
                        '0 0 0 4px rgba(52, 152, 219, 0.3)'
                    ],
                    duration: 600,
                    easing: 'easeOutElastic(1, .5)'
                });
            }
            
            // Create a path from the previous city
            const prevCity = selectedRoute[selectedRoute.length - 1];
            createRoutePath(prevCity, cityData, selectedRoute.length);
            
            // Add to route
            selectedRoute.push(cityData);
        }
        else {
            // No direct path, provide feedback
            if (typeof anime !== 'undefined') {
                anime({
                    targets: cityElement,
                    translateX: [0, -5, 5, -5, 5, 0],
                    duration: 500,
                    easing: 'easeInOutSine'
                });
            }
            
            showTooltip({
                pageX: cityElement.getBoundingClientRect().left,
                pageY: cityElement.getBoundingClientRect().top
            }, "No direct path available!");
            setTimeout(hideTooltip, 1500);
            return;
        }
        
        // Update route display
        updateRouteDisplay();
    }
    
    // Show city information panel
    function showCityInfo(cityData) {
        if (!cityInfoPanel || !cityData) return;
        
        // Update city info
        if (cityInfoName) cityInfoName.textContent = cityData.name;
        if (cityImage) cityImage.src = cityData.image;
        if (cityPopulation) cityPopulation.textContent = cityData.population;
        if (cityArea) cityArea.textContent = cityData.area;
        if (cityTimeZone) cityTimeZone.textContent = cityData.timeZone;
        if (cityDescription) cityDescription.textContent = cityData.description;
        
        // Show the panel
        cityInfoPanel.classList.remove('hidden');
        
        // Mark city as visited for achievement tracking
        try {
            localStorage.setItem(`visited_${cityData.id}`, 'true');
        } catch (e) {
            console.error("Error saving city visit:", e);
        }
        
        // Check for explorer achievement
        checkAchievement('explorer');
    }
    
    // Hide city information panel
    function hideCityInfo() {
        if (cityInfoPanel) {
            cityInfoPanel.classList.add('hidden');
        }
    }
    
    // Check if there is a direct path between two cities
    function hasDirectPath(fromCity, toCity) {
        if (!fromCity || !toCity) return false;
        
        return paths.some(path => 
            (path.from.id === fromCity.id && path.to.id === toCity.id) || 
            (path.from.id === toCity.id && path.to.id === fromCity.id)
        );
    }
    
    // Get path data between two cities
    function getPathData(fromCity, toCity) {
        if (!fromCity || !toCity) return null;
        
        const path = paths.find(path => 
            (path.from.id === fromCity.id && path.to.id === toCity.id) || 
            (path.from.id === toCity.id && path.to.id === fromCity.id)
        );
        
        if (!path) return null;
        
        const transport = transportData[currentTransport];
        if (!transport) return { cost: path.cost, time: path.time, distance: path.distance };
        
        let cost = path.cost * transport.costFactor;
        let time = path.time / transport.speedFactor;
        let distance = path.distance;
        
        // Apply weather effects if needed
        if (weatherEffects && path.weatherAffected) {
            cost *= transport.weatherImpact;
            time *= transport.weatherImpact;
        }
        
        return {
            cost: Math.round(cost),
            time: Math.round(time * 10) / 10,
            distance: distance
        };
    }
    
    // Calculate total route metrics
    function calculateRouteMetrics() {
        let totalCost = 0;
        let totalDistance = 0;
        let totalTime = 0;
        
        for (let i = 0; i < selectedRoute.length - 1; i++) {
            const pathData = getPathData(selectedRoute[i], selectedRoute[i + 1]);
            if (pathData) {
                totalCost += pathData.cost;
                totalDistance += pathData.distance;
                totalTime += pathData.time;
            }
        }
        
        return {
            cost: totalCost,
            distance: totalDistance,
            time: Math.round(totalTime * 10) / 10
        };
    }
    
    // Update the route display
    function updateRouteDisplay() {
        if (!routeList) return;
        
        routeList.innerHTML = '';
        
        const metrics = calculateRouteMetrics();
        
        selectedRoute.forEach((city, index) => {
            if (index > 0) {
                const prevCity = selectedRoute[index - 1];
                const pathData = getPathData(prevCity, city);
                
                if (pathData) {
                    const transport = transportData[currentTransport];
                    const transportIcon = transport ? transport.icon : '';
                    
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${prevCity.name} → ${city.name}</span> 
                        <span class="route-cost">${transportIcon} $${pathData.cost} | ${pathData.distance} km</span>
                    `;
                    routeList.appendChild(li);
                }
            }
        });
        
        // Update counters
        if (visitedCountDisplay) {
            visitedCountDisplay.textContent = selectedRoute.length === cities.length + 1 ? 
                cities.length : selectedRoute.length;
        }
        
        if (currentCostDisplay) currentCostDisplay.textContent = metrics.cost;
        if (currentDistanceDisplay) currentDistanceDisplay.textContent = metrics.distance;
        if (travelTimeDisplay) travelTimeDisplay.textContent = metrics.time;
    }
    
    // Update timer display
    function updateTimer() {
        if (!timeDisplay) return;
        
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        
        // Format time as MM:SS
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // If in timed mode, check for time limit
        if (currentGameMode === 'timed' && elapsedTime >= 180) { // 3 minute limit
            validateRoute();
        }
    }
    
    // Validate the route
    function validateRoute() {
        if (!gameActive) return;
        
        // Stop the timer
        clearInterval(timer);
        
        // Check if all cities are visited exactly once and route returns to start
        const isValid = selectedRoute.length === cities.length + 1 && 
                        selectedRoute[0].id === selectedRoute[selectedRoute.length - 1].id;
        
        // Get route metrics
        const metrics = calculateRouteMetrics();
        
        // Get optimal route data for comparison
        const region = regionData[currentRegion];
        if (!region) return;
        
        const optimalDistance = region.optimalDistance || 0;
        
        // Calculate efficiency percentage
        const efficiency = isValid ? Math.min(100, Math.round((optimalDistance / metrics.distance) * 100)) : 0;
        
        // Calculate final score
        let finalScore = 0;
        if (isValid) {
            const difficultyBonus = {
                'easy': 1.0,
                'medium': 1.2,
                'hard': 1.5
            }[currentDifficulty] || 1.0;
            
            const timeBonus = Math.max(0, 600 - elapsedTime) * 0.5; // 0.5 points per second under 10 minutes
            const efficiencyPoints = efficiency * 5;
            
            finalScore = Math.round((1000 - (metrics.cost / 2) + timeBonus + efficiencyPoints) * difficultyBonus);
            finalScore = Math.max(finalScore, 100); // Minimum score of 100 if valid
            
            // In timed mode, apply time penalty
            if (currentGameMode === 'timed') {
                const timeRatio = Math.min(1, 180 / Math.max(1, elapsedTime));
                finalScore = Math.round(finalScore * timeRatio);
            }
        }
        
        // Set result display
        if (finalTimeDisplay) finalTimeDisplay.textContent = timeDisplay ? timeDisplay.textContent : '00:00';
        if (finalCitiesDisplay) finalCitiesDisplay.textContent = cities.length;
        if (finalCostDisplay) finalCostDisplay.textContent = metrics.cost;
        if (finalDistanceDisplay) finalDistanceDisplay.textContent = metrics.distance;
        if (finalScoreDisplay) finalScoreDisplay.textContent = finalScore;
        if (yourDistanceDisplay) yourDistanceDisplay.textContent = `${metrics.distance} km`;
        if (optimalDistanceDisplay) optimalDistanceDisplay.textContent = `${optimalDistance} km`;
        if (efficiencyRatingDisplay) efficiencyRatingDisplay.textContent = `${efficiency}%`;
        
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
        
        if (routeFeedbackDisplay) routeFeedbackDisplay.textContent = feedback;
        
        // Mark this region as completed
        if (isValid) {
            try {
                localStorage.setItem(`completed_${currentRegion}`, 'true');
            } catch (e) {
                console.error("Error saving region completion:", e);
            }
        }
        
        // Check for achievements
        if (isValid) {
            checkAchievement('speed_demon');
            checkAchievement('perfectionist', finalScore, selectedRoute, currentDifficulty);
            checkAchievement('globetrotter');
            checkAchievement('weatherproof');
            checkAchievement('speed_run', finalScore, selectedRoute, currentDifficulty, currentGameMode);
        }
        
        // Create mini-map visualization
        createMiniMap();
        
        // Show result panel
        showResultPanel();
        
        // End the game
        endGame();
    }
    
    // Show the result panel
    function showResultPanel() {
        if (overlay) overlay.classList.add('show');
        if (resultPanel) resultPanel.classList.add('show');
    }
    
    // Hide the result panel
    function hideResultPanel() {
        if (overlay) overlay.classList.remove('show');
        if (resultPanel) resultPanel.classList.remove('show');
        if (newAchievementPanel) newAchievementPanel.classList.remove('show');
    }
    
    // Create mini-map for result visualization
    function createMiniMap() {
        if (!miniMap) return;
        
        miniMap.innerHTML = '';
        
        // Set mini-map theme
        miniMap.className = `mini-map map-${currentTheme}`;
        
        // Scale factor for mini-map
        const scaleFactor = 0.4;
        
        // Create cities
        cities.forEach(city => {
            const miniCity = document.createElement('div');
            miniCity.className = 'city mini';
            miniCity.style.left = (city.x * scaleFactor) + 'px';
            miniCity.style.top = (city.y * scaleFactor) + 'px';
            
            if (selectedRoute.some(routeCity => routeCity.id === city.id)) {
                miniCity.classList.add('visited');
            }
            
            if (startCity && city.id === startCity.id) {
                miniCity.classList.add('start');
            }
            
            miniMap.appendChild(miniCity);
        });
        
        // Create route paths
        for (let i = 0; i < selectedRoute.length - 1; i++) {
            const fromCity = selectedRoute[i];
            const toCity = selectedRoute[i + 1];
            
            const dx = toCity.x - fromCity.x;
            const dy = toCity.y - fromCity.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            const routePath = document.createElement('div');
            routePath.className = 'route-path visible';
            routePath.style.width = (distance * scaleFactor) + 'px';
            routePath.style.left = (fromCity.x * scaleFactor) + 'px';
            routePath.style.top = (fromCity.y * scaleFactor) + 'px';
            routePath.style.transform = `rotate(${angle}deg)`;
            
            miniMap.appendChild(routePath);
        }
    }
    
    // Reset the current route
    function resetRoute() {
        // Clear selected route
        selectedRoute = [];
        
        // Remove all route paths
        routePaths.forEach(path => {
            if (path && path.parentNode) {
                path.remove();
            }
        });
        routePaths = [];
        
        // Reset city styles
        document.querySelectorAll('.city').forEach(city => {
            city.classList.remove('visited', 'start');
        });
        
        // Reset UI
        if (routeList) routeList.innerHTML = '';
        if (visitedCountDisplay) visitedCountDisplay.textContent = '0';
        if (currentCostDisplay) currentCostDisplay.textContent = '0';
        if (currentDistanceDisplay) currentDistanceDisplay.textContent = '0';
        if (travelTimeDisplay) travelTimeDisplay.textContent = '0';
        if (validateBtn) validateBtn.disabled = true;
        
        // Reset start city
        startCity = null;
        
        // Animate reset
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.city',
                scale: [0.8, 1],
                opacity: [0.5, 1],
                duration: 500,
                easing: 'easeOutElastic(1, .5)'
            });
        }
    }
    
    // Show a hint
    function showHint() {
        if (!hintPanel || !hintText) return;
        
        const region = regionData[currentRegion];
        if (!region) return;
        
        // General hints first
        const generalHints = [
            "Try to create a loop that minimizes crossing paths.",
            "Cities with more connections often make better starting points.",
            "Weather conditions can significantly affect travel time and cost.",
            "Consider starting from cities at the edge of the map."
        ];
        
        // More specific hints later
        const specificHints = [
            `The optimal route has a total distance of approximately ${region.optimalDistance} km.`,
            "Try to visit clusters of nearby cities one after another.",
            `Consider ${region.cities[0].name} or ${region.cities[1].name} as a starting point.`,
            "The optimal route tends to follow the perimeter of the region."
        ];
        
        // Solution hint last
        const solutionHint = `The optimal route begins with: ${region.optimalRoute[0]} → ${region.optimalRoute[1]} → ${region.optimalRoute[2]}...`;
        
        // Determine which hint to show
        let hint;
        if (hintCount < generalHints.length) {
            hint = generalHints[hintCount];
        } else if (hintCount < generalHints.length + specificHints.length) {
            hint = specificHints[hintCount - generalHints.length];
        } else {
            hint = solutionHint;
        }
        
        // Update hint text
        hintText.textContent = hint;
        
        // Show hint panel
        hintPanel.classList.add('show');
        
        // Increment hint count
        hintCount++;
    }
    
    // Show next hint
    function showNextHint() {
        hintCount++;
        showHint();
    }
    
    // Show the optimal solution
    function showSolution() {
        // First reset the current route
        resetRoute();
        
        // Get optimal route for the region
        const region = regionData[currentRegion];
        if (!region || !region.optimalRoute) return;
        
        const optimalRoute = region.optimalRoute;
        
        // Find the corresponding city objects
        const routeCities = optimalRoute.map(cityId => 
            cities.find(city => city.id === cityId)
        ).filter(city => city); // Filter out any undefined cities
        
        // Show a message
        showTooltip({
            pageX: window.innerWidth / 2,
            pageY: window.innerHeight / 2
        }, "Showing optimal route solution...");
        setTimeout(hideTooltip, 3000);
        
        // Animate the solution path building
        let index = 0;
        
        function buildNextSegment() {
            if (index >= routeCities.length) {
                // Add the starting city again to complete the loop
                handleCityClick(routeCities[0]);
                
                // Hide hint panel
                hideHintPanel();
                return;
            }
            
            handleCityClick(routeCities[index]);
            index++;
            setTimeout(buildNextSegment, 800);
        }
        
        // Start building
        buildNextSegment();
    }
    
    // Hide hint panel
    function hideHintPanel() {
        if (hintPanel) {
            hintPanel.classList.remove('show');
        }
    }
    
    // Show tooltip
    function showTooltip(event, text) {
        if (!tooltip) return;
        
        tooltip.textContent = text;
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY + 10) + 'px';
        tooltip.style.opacity = '1';
    }
    
    // Move tooltip
    function moveTooltip(event) {
        if (!tooltip) return;
        
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY + 10) + 'px';
    }
    
    // Hide tooltip
    function hideTooltip() {
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }
    
    // Change map theme
    function changeMapTheme(theme) {
        if (!gameMap) return;
        
        gameMap.className = `map map-${theme}`;
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
    
    // Map zoom and pan functions
    function zoomIn() {
        if (zoomLevel < 2) {
            zoomLevel += 0.2;
            updateMapTransform();
        }
    }
    
    function zoomOut() {
        if (zoomLevel > 0.6) {
            zoomLevel -= 0.2;
            updateMapTransform();
        }
    }
    
    function resetView() {
        zoomLevel = 1;
        mapPan = { x: 0, y: 0 };
        updateMapTransform();
    }
    
    function updateMapTransform() {
        const cities = document.querySelectorAll('.city, .city-label');
        const paths = document.querySelectorAll('.path, .route-path');
        
        cities.forEach(city => {
            city.style.transform = `translate(-50%, -50%) scale(${zoomLevel}) translate(${mapPan.x}px, ${mapPan.y}px)`;
        });
        
        paths.forEach(path => {
            const currentTransform = path.style.transform;
            const rotateValue = currentTransform.match(/rotate\(([^)]+)\)/);
            const rotate = rotateValue ? rotateValue[0] : 'rotate(0deg)';
            
            path.style.transform = `${rotate} scale(${zoomLevel}) translate(${mapPan.x}px, ${mapPan.y}px)`;
        });
    }
    
    // Share result function
    function shareResult() {
        const metrics = calculateRouteMetrics();
        const score = finalScoreDisplay ? finalScoreDisplay.textContent : '0';
        
        const shareText = `I completed The Route Challenge in ${currentRegion} with a score of ${score}! Distance: ${metrics.distance}km, Cost: $${metrics.cost}`;
        
        // Copy to clipboard
        try {
            navigator.clipboard.writeText(shareText).then(() => {
                showTooltip({
                    pageX: window.innerWidth / 2,
                    pageY: window.innerHeight / 2
                }, "Result copied to clipboard! Share with your friends.");
                setTimeout(hideTooltip, 3000);
            });
        } catch (e) {
            console.error("Error copying to clipboard:", e);
            alert("Result: " + shareText);
        }
    }
    
    // Show optimal route
    function showOptimalRoute() {
        hideResultPanel();
        showSolution();
    }
    
    // Check for achievements
    function checkAchievement(achievementId, ...args) {
        // Skip if already earned
        if (achievementsEarned[achievementId]) return;
        
        const achievement = achievements[achievementId];
        if (achievement && achievement.check(...args)) {
            // Mark as earned
            achievementsEarned[achievementId] = true;
            
            // Update UI
            const achievementElement = document.querySelector(`.achievement[data-id="${achievementId}"]`);
            if (achievementElement) {
                const statusElement = achievementElement.querySelector('.achievement-status');
                if (statusElement) {
                    statusElement.textContent = '✅';
                    statusElement.classList.remove('locked');
                    statusElement.classList.add('unlocked');
                }
                
                // Animate
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: achievementElement,
                        scale: [1, 1.05, 1],
                        backgroundColor: ['#f5f5f5', '#e3f2fd', '#f5f5f5'],
                        duration: 1000,
                        easing: 'easeOutElastic(1, .5)'
                    });
                }
            }
            
            // Show achievement notification
            showAchievementNotification(achievement);
            
            // Save state
            saveGameState();
            
            return true;
        }
        
        return false;
    }
    
    // Show achievement notification
    function showAchievementNotification(achievement) {
        if (!newAchievementPanel || !achievement) return;
        
        if (achievementName) achievementName.textContent = achievement.name;
        if (achievementDescription) achievementDescription.textContent = achievement.description;
        
        const iconElement = document.querySelector('#newAchievement .achievement-icon');
        if (iconElement) iconElement.textContent = achievement.icon;
        
        newAchievementPanel.classList.add('show');
    }
    
    // Update achievement display
    function updateAchievementDisplay() {
        for (const [id, earned] of Object.entries(achievementsEarned)) {
            if (earned) {
                const achievementElement = document.querySelector(`.achievement[data-id="${id}"]`);
                if (achievementElement) {
                    const statusElement = achievementElement.querySelector('.achievement-status');
                    if (statusElement) {
                        statusElement.textContent = '✅';
                        statusElement.classList.remove('locked');
                        statusElement.classList.add('unlocked');
                    }
                }
            }
        }
    }
    
    // Initialize the game
    init();
});
