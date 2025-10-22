// Travel Website Main JavaScript
// Handles all interactive components and animations

// Global variables
let currentQuizStep = 0;
let quizAnswers = {};
let destinations = [];
let filteredDestinations = [];

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeQuiz();
    initializeDestinationFilters();
    initializeRoutePlanner();
    initializeScrollAnimations();
    loadDestinationsData();
});

// Animation Initialization
function initializeAnimations() {
    // Initialize Anime.js animations
    if (typeof anime !== 'undefined') {
        // Hero section fade in
        anime({
            targets: '.hero-content',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 1000,
            easing: 'easeOutQuad',
            delay: 500
        });

        // Floating elements animation
        anime({
            targets: '.floating-element',
            translateY: [-10, 10],
            duration: 3000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });
    }

    // Initialize Typed.js for hero text
    if (typeof Typed !== 'undefined' && document.getElementById('hero-typed')) {
        new Typed('#hero-typed', {
            strings: [
                'Discover Your Perfect Indian Adventure',
                'Explore Hidden Gems & Budget Destinations',
                'Plan Your Dream Trip Within Budget'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Travel Quiz Functionality
function initializeQuiz() {
    const quizContainer = document.getElementById('travel-quiz');
    if (!quizContainer) return;

    const quizQuestions = [
        {
            id: 'budget',
            question: 'What\'s your approximate budget per person?',
            type: 'radio',
            options: [
                { value: 'budget', label: '₹5,000 - ₹15,000 (Budget)' },
                { value: 'mid', label: '₹15,000 - ₹35,000 (Mid-range)' },
                { value: 'luxury', label: '₹35,000+ (Luxury)' }
            ]
        },
        {
            id: 'travel_style',
            question: 'What type of traveler are you?',
            type: 'radio',
            options: [
                { value: 'adventure', label: 'Adventure Seeker' },
                { value: 'culture', label: 'Culture Explorer' },
                { value: 'relaxation', label: 'Relaxation Lover' },
                { value: 'foodie', label: 'Food Enthusiast' }
            ]
        },
        {
            id: 'duration',
            question: 'How long do you want to travel?',
            type: 'radio',
            options: [
                { value: 'weekend', label: 'Weekend (2-3 days)' },
                { value: 'week', label: 'One Week' },
                { value: 'extended', label: 'Extended (2+ weeks)' }
            ]
        },
        {
            id: 'interests',
            question: 'What interests you most?',
            type: 'checkbox',
            options: [
                { value: 'mountains', label: 'Mountains & Hills' },
                { value: 'beaches', label: 'Beaches & Coast' },
                { value: 'wildlife', label: 'Wildlife & Nature' },
                { value: 'heritage', label: 'Heritage & History' },
                { value: 'spiritual', label: 'Spiritual & Wellness' }
            ]
        },
        {
            id: 'group_size',
            question: 'Who are you traveling with?',
            type: 'radio',
            options: [
                { value: 'solo', label: 'Solo' },
                { value: 'couple', label: 'Couple' },
                { value: 'friends', label: 'Friends' },
                { value: 'family', label: 'Family' }
            ]
        },
        {
            id: 'climate',
            question: 'When do you plan to travel?',
            type: 'radio',
            options: [
                { value: 'winter', label: 'Winter (Oct-Feb)' },
                { value: 'summer', label: 'Summer (Mar-Jun)' },
                { value: 'monsoon', label: 'Monsoon (Jul-Sep)' }
            ]
        }
    ];

    renderQuizStep(quizQuestions, 0);
}

function renderQuizStep(questions, step) {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer || step >= questions.length) {
        showQuizResults();
        return;
    }

    const question = questions[step];
    let optionsHTML = '';

    question.options.forEach((option, index) => {
        if (question.type === 'radio') {
            optionsHTML += `
                <label class="quiz-option block p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-all duration-300">
                    <input type="radio" name="${question.id}" value="${option.value}" class="sr-only">
                    <span class="text-gray-700">${option.label}</span>
                </label>
            `;
        } else if (question.type === 'checkbox') {
            optionsHTML += `
                <label class="quiz-option block p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-all duration-300">
                    <input type="checkbox" name="${question.id}" value="${option.value}" class="sr-only">
                    <span class="text-gray-700">${option.label}</span>
                </label>
            `;
        }
    });

    const progressPercent = ((step + 1) / questions.length) * 100;

    quizContainer.innerHTML = `
        <div class="quiz-step bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-sm text-gray-500">Question ${step + 1} of ${questions.length}</span>
                    <span class="text-sm text-orange-500">${Math.round(progressPercent)}% Complete</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
                </div>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800 mb-8">${question.question}</h3>
            
            <div class="space-y-4 mb-8">
                ${optionsHTML}
            </div>
            
            <div class="flex justify-between">
                <button onclick="previousQuizStep()" class="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors ${step === 0 ? 'invisible' : ''}">
                    ← Previous
                </button>
                <button onclick="nextQuizStep()" class="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    ${step === questions.length - 1 ? 'Get Results' : 'Next →'}
                </button>
            </div>
        </div>
    `;

    // Add click handlers for options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const input = this.querySelector('input');
            
            if (input.type === 'radio') {
                document.querySelectorAll(`input[name="${input.name}"]`).forEach(radio => {
                    radio.closest('.quiz-option').classList.remove('border-orange-500', 'bg-orange-50');
                });
            }
            
            this.classList.toggle('border-orange-500', input.checked);
            this.classList.toggle('bg-orange-50', input.checked);
        });
    });

    // Animate step transition
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.quiz-step',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
}

function nextQuizStep() {
    const currentInputs = document.querySelectorAll(`#quiz-container input:checked`);
    if (currentInputs.length === 0) {
        alert('Please select an option before continuing.');
        return;
    }

    // Save current answers
    const questionId = currentInputs[0].name;
    const values = Array.from(currentInputs).map(input => input.value);
    quizAnswers[questionId] = values.length === 1 ? values[0] : values;

    currentQuizStep++;
    const questions = getQuizQuestions();
    renderQuizStep(questions, currentQuizStep);
}

function previousQuizStep() {
    if (currentQuizStep > 0) {
        currentQuizStep--;
        const questions = getQuizQuestions();
        renderQuizStep(questions, currentQuizStep);
    }
}

function getQuizQuestions() {
    return [
        {
            id: 'budget',
            question: 'What\'s your approximate budget per person?',
            type: 'radio',
            options: [
                { value: 'budget', label: '₹5,000 - ₹15,000 (Budget)' },
                { value: 'mid', label: '₹15,000 - ₹35,000 (Mid-range)' },
                { value: 'luxury', label: '₹35,000+ (Luxury)' }
            ]
        },
        {
            id: 'travel_style',
            question: 'What type of traveler are you?',
            type: 'radio',
            options: [
                { value: 'adventure', label: 'Adventure Seeker' },
                { value: 'culture', label: 'Culture Explorer' },
                { value: 'relaxation', label: 'Relaxation Lover' },
                { value: 'foodie', label: 'Food Enthusiast' }
            ]
        },
        {
            id: 'duration',
            question: 'How long do you want to travel?',
            type: 'radio',
            options: [
                { value: 'weekend', label: 'Weekend (2-3 days)' },
                { value: 'week', label: 'One Week' },
                { value: 'extended', label: 'Extended (2+ weeks)' }
            ]
        },
        {
            id: 'interests',
            question: 'What interests you most?',
            type: 'checkbox',
            options: [
                { value: 'mountains', label: 'Mountains & Hills' },
                { value: 'beaches', label: 'Beaches & Coast' },
                { value: 'wildlife', label: 'Wildlife & Nature' },
                { value: 'heritage', label: 'Heritage & History' },
                { value: 'spiritual', label: 'Spiritual & Wellness' }
            ]
        },
        {
            id: 'group_size',
            question: 'Who are you traveling with?',
            type: 'radio',
            options: [
                { value: 'solo', label: 'Solo' },
                { value: 'couple', label: 'Couple' },
                { value: 'friends', label: 'Friends' },
                { value: 'family', label: 'Family' }
            ]
        },
        {
            id: 'climate',
            question: 'When do you plan to travel?',
            type: 'radio',
            options: [
                { value: 'winter', label: 'Winter (Oct-Feb)' },
                { value: 'summer', label: 'Summer (Mar-Jun)' },
                { value: 'monsoon', label: 'Monsoon (Jul-Sep)' }
            ]
        }
    ];
}

function showQuizResults() {
    const recommendations = generateRecommendations(quizAnswers);
    const quizContainer = document.getElementById('quiz-container');
    
    quizContainer.innerHTML = `
        <div class="quiz-results bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">Your Perfect Destinations</h2>
                <p class="text-gray-600">Based on your preferences, here are our top recommendations:</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                ${recommendations.map(dest => `
                    <div class="destination-card bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                        <img src="${dest.image}" alt="${dest.name}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">${dest.name}</h3>
                            <p class="text-gray-600 text-sm mb-4">${dest.description}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-orange-500 font-bold">${dest.budget}</span>
                                <button onclick="planRoute('${dest.name}')" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                    Plan Route
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="text-center">
                <button onclick="restartQuiz()" class="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-4">
                    Retake Quiz
                </button>
                <a href="destinations.html" class="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors inline-block">
                    Explore All Destinations
                </a>
            </div>
        </div>
    `;

    // Animate results
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.destination-card',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            delay: anime.stagger(200),
            easing: 'easeOutQuad'
        });
    }
}

function generateRecommendations(answers) {
    // Sample destinations data - in real app, this would come from API
    const destinations = [
        {
            name: 'Shoja, Himachal Pradesh',
            description: 'Hidden gem in Himalayas with pristine beauty and hiking trails',
            budget: '₹8,000-12,000',
            image: 'https://kimi-web-img.moonshot.cn/img/specialplacesofindia.com/e927100620f72b823419ae084bcbc082beba04d9.png',
            tags: ['budget', 'adventure', 'mountains', 'winter']
        },
        {
            name: 'Kerala Backwaters',
            description: 'Serene houseboat experience through lush green canals',
            budget: '₹15,000-25,000',
            image: 'https://kimi-web-img.moonshot.cn/img/static.toiimg.com/8ba748eb30c2766e2729bb9735b99b991e13e9a1.jpg',
            tags: ['mid', 'relaxation', 'beaches', 'winter', 'monsoon']
        },
        {
            name: 'Goa Beaches',
            description: 'Sun, sand, and seafood with vibrant nightlife',
            budget: '₹12,000-20,000',
            image: 'https://kimi-web-img.moonshot.cn/img/thewandertherapy.com/a841b6032ff419bbed4aacff3667b12359e6cb4b.jpg',
            tags: ['mid', 'relaxation', 'beaches', 'winter']
        },
        {
            name: 'Auli, Uttarakhand',
            description: 'Skiing capital of India with breathtaking Himalayan views',
            budget: '₹18,000-30,000',
            image: 'https://kimi-web-img.moonshot.cn/img/getwallpapers.com/7a24b995b1b49005b106c5d0fbcb6aa4353ab0d4.jpg',
            tags: ['luxury', 'adventure', 'mountains', 'winter']
        },
        {
            name: 'Mawlynnong, Meghalaya',
            description: 'Asia\'s cleanest village with living root bridges',
            budget: '₹10,000-15,000',
            image: 'https://kimi-web-img.moonshot.cn/img/cdn1.matadornetwork.com/e1ce55425e6fa16dcfee85acb9eb8483a161e4b5.jpg',
            tags: ['budget', 'culture', 'mountains', 'monsoon']
        }
    ];

    // Simple recommendation logic based on quiz answers
    let scored = destinations.map(dest => {
        let score = 0;
        
        // Budget matching
        if (answers.budget === 'budget' && dest.tags.includes('budget')) score += 3;
        if (answers.budget === 'mid' && dest.tags.includes('mid')) score += 3;
        if (answers.budget === 'luxury' && dest.tags.includes('luxury')) score += 3;
        
        // Travel style matching
        if (answers.travel_style === 'adventure' && dest.tags.includes('adventure')) score += 2;
        if (answers.travel_style === 'culture' && dest.tags.includes('culture')) score += 2;
        if (answers.travel_style === 'relaxation' && dest.tags.includes('relaxation')) score += 2;
        
        // Climate matching
        if (answers.climate && dest.tags.includes(answers.climate)) score += 2;
        
        // Interests matching
        if (Array.isArray(answers.interests)) {
            answers.interests.forEach(interest => {
                if (dest.tags.includes(interest)) score += 1;
            });
        }
        
        return { ...dest, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

function restartQuiz() {
    currentQuizStep = 0;
    quizAnswers = {};
    const questions = getQuizQuestions();
    renderQuizStep(questions, 0);
}

function planRoute(destination) {
    localStorage.setItem('selectedDestination', destination);
    window.location.href = 'route-planner.html';
}

// Destination Filters
function initializeDestinationFilters() {
    const filterContainer = document.getElementById('filter-container');
    if (!filterContainer) return;

    const filters = {
        budget: ['budget', 'mid', 'luxury'],
        region: ['north', 'south', 'east', 'west', 'central', 'northeast'],
        activity: ['adventure', 'culture', 'nature', 'relaxation', 'food'],
        season: ['winter', 'summer', 'monsoon']
    };

    let filtersHTML = '<div class="space-y-6">';
    
    Object.entries(filters).forEach(([key, values]) => {
        filtersHTML += `
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-3 capitalize">${key}</h3>
                <div class="space-y-2">
                    ${values.map(value => `
                        <label class="flex items-center">
                            <input type="checkbox" name="${key}" value="${value}" class="mr-3 text-orange-500 focus:ring-orange-500">
                            <span class="text-gray-700 capitalize">${value}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    filtersHTML += `
        <div class="pt-4">
            <button onclick="applyFilters()" class="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Apply Filters
            </button>
        </div>
    </div>`;

    filterContainer.innerHTML = filtersHTML;
}

function applyFilters() {
    const filters = {};
    
    // Collect all filter values
    document.querySelectorAll('#filter-container input:checked').forEach(input => {
        if (!filters[input.name]) filters[input.name] = [];
        filters[input.name].push(input.value);
    });

    filterDestinations(filters);
}

function filterDestinations(filters) {
    // Filter logic - in real app, this would filter the destinations array
    console.log('Applying filters:', filters);
    
    // Show filtered results with animation
    const destinationGrid = document.getElementById('destination-grid');
    if (destinationGrid) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.destination-card',
                opacity: [1, 0],
                scale: [1, 0.8],
                duration: 300,
                complete: function() {
                    // Update grid content here
                    anime({
                        targets: '.destination-card',
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 400,
                        delay: anime.stagger(100)
                    });
                }
            });
        }
    }
}

// Route Planner
function initializeRoutePlanner() {
    const routeForm = document.getElementById('route-form');
    if (!routeForm) return;

    // Pre-fill destination if coming from quiz
    const selectedDestination = localStorage.getItem('selectedDestination');
    if (selectedDestination && document.getElementById('destination')) {
        document.getElementById('destination').value = selectedDestination;
    }

    routeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateRoute();
    });
}

function calculateRoute() {
    const formData = new FormData(document.getElementById('route-form'));
    const routeData = Object.fromEntries(formData);

    // Sample route calculation - in real app, this would call an API
    const routeResults = {
        origin: routeData.origin,
        destination: routeData.destination,
        dates: `${routeData.startDate} to ${routeData.endDate}`,
        transportation: {
            flight: { cost: 8500, duration: '2h 30m', type: 'Direct Flight' },
            train: { cost: 2800, duration: '18h 45m', type: 'Overnight Train' },
            bus: { cost: 1200, duration: '24h 15m', type: 'AC Volvo Bus' }
        },
        accommodation: [
            { type: 'Budget Hotel', cost: 1200, rating: 3.5 },
            { type: 'Mid-range Hotel', cost: 2800, rating: 4.2 },
            { type: 'Luxury Resort', cost: 6500, rating: 4.8 }
        ],
        food: {
            budget: 400,
            mid: 800,
            luxury: 1500
        },
        activities: [
            { name: 'Local Sightseeing', cost: 800 },
            { name: 'Adventure Activities', cost: 2000 },
            { name: 'Cultural Experiences', cost: 1200 }
        ]
    };

    displayRouteResults(routeResults);
}

function displayRouteResults(results) {
    const resultsContainer = document.getElementById('route-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
        <div class="bg-white rounded-2xl p-8 shadow-xl">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Your Travel Plan</h3>
            
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 class="text-lg font-semibold text-gray-700 mb-4">Transportation Options</h4>
                    <div class="space-y-4">
                        ${Object.entries(results.transportation).map(([key, option]) => `
                            <div class="transport-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-all" onclick="selectTransport('${key}')">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h5 class="font-semibold capitalize">${key}</h5>
                                        <p class="text-sm text-gray-600">${option.type} • ${option.duration}</p>
                                    </div>
                                    <span class="text-lg font-bold text-orange-500">₹${option.cost}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold text-gray-700 mb-4">Accommodation</h4>
                    <div class="space-y-4">
                        ${results.accommodation.map((hotel, index) => `
                            <div class="hotel-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-all" onclick="selectHotel(${index})">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h5 class="font-semibold">${hotel.type}</h5>
                                        <p class="text-sm text-gray-600">Rating: ${hotel.rating}/5</p>
                                    </div>
                                    <span class="text-lg font-bold text-orange-500">₹${hotel.cost}/night</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-8 p-6 bg-orange-50 rounded-xl">
                <h4 class="text-lg font-semibold text-gray-700 mb-4">Estimated Total Cost</h4>
                <div class="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p class="text-2xl font-bold text-orange-500" id="transport-cost">₹0</p>
                        <p class="text-sm text-gray-600">Transportation</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-orange-500" id="hotel-cost">₹0</p>
                        <p class="text-sm text-gray-600">Accommodation</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-orange-500" id="total-cost">₹0</p>
                        <p class="text-sm text-gray-600">Total Estimate</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Animate results
    if (typeof anime !== 'undefined') {
        anime({
            targets: '#route-results > div',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
}

function selectTransport(type) {
    document.querySelectorAll('.transport-option').forEach(option => {
        option.classList.remove('border-orange-500', 'bg-orange-50');
    });
    event.currentTarget.classList.add('border-orange-500', 'bg-orange-50');
    
    // Update cost calculation
    updateTotalCost();
}

function selectHotel(index) {
    document.querySelectorAll('.hotel-option').forEach(option => {
        option.classList.remove('border-orange-500', 'bg-orange-50');
    });
    event.currentTarget.classList.add('border-orange-500', 'bg-orange-50');
    
    // Update cost calculation
    updateTotalCost();
}

function updateTotalCost() {
    // Sample calculation - in real app, this would be more complex
    const transportCost = 2800; // Default train
    const hotelCost = 2800; // Default mid-range
    const totalCost = transportCost + (hotelCost * 3); // 3 nights
    
    document.getElementById('transport-cost').textContent = `₹${transportCost}`;
    document.getElementById('hotel-cost').textContent = `₹${hotelCost * 3}`;
    document.getElementById('total-cost').textContent = `₹${totalCost}`;
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll animation class
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Load Destinations Data
function loadDestinationsData() {
    // Sample destinations data
    destinations = [
        {
            id: 1,
            name: 'Shoja, Himachal Pradesh',
            region: 'north',
            budget: 'budget',
            activities: ['adventure', 'nature'],
            season: 'winter',
            image: 'https://kimi-web-img.moonshot.cn/img/specialplacesofindia.com/e927100620f72b823419ae084bcbc082beba04d9.png',
            description: 'Hidden gem in Himalayas with pristine beauty',
            rating: 4.5,
            bestTime: 'October to March',
            hiddenGems: ['Jalori Pass trek', 'Waterfall hike', 'Local village experience']
        },
        {
            id: 2,
            name: 'Kerala Backwaters',
            region: 'south',
            budget: 'mid',
            activities: ['relaxation', 'nature'],
            season: 'winter',
            image: 'https://kimi-web-img.moonshot.cn/img/static.toiimg.com/8ba748eb30c2766e2729bb9735b99b991e13e9a1.jpg',
            description: 'Serene houseboat experience through lush canals',
            rating: 4.8,
            bestTime: 'November to February',
            hiddenGems: ['Kumbalangi village', 'Pathiramanal island', 'Local toddy shops']
        },
        {
            id: 3,
            name: 'Goa Beaches',
            region: 'west',
            budget: 'mid',
            activities: ['relaxation', 'food'],
            season: 'winter',
            image: 'https://kimi-web-img.moonshot.cn/img/thewandertherapy.com/a841b6032ff419bbed4aacff3667b12359e6cb4b.jpg',
            description: 'Sun, sand, and seafood with vibrant nightlife',
            rating: 4.6,
            bestTime: 'November to February',
            hiddenGems: ['Butterfly Beach', 'Cabo de Rama fort', 'Local fish markets']
        }
    ];

    filteredDestinations = [...destinations];
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    if (typeof anime !== 'undefined') {
        anime({
            targets: notification,
            opacity: [0, 1],
            translateX: [100, 0],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
    
    setTimeout(() => {
        if (typeof anime !== 'undefined') {
            anime({
                targets: notification,
                opacity: [1, 0],
                translateX: [0, 100],
                duration: 300,
                easing: 'easeOutQuad',
                complete: () => notification.remove()
            });
        } else {
            notification.remove();
        }
    }, 3000);
}

// Surprise Me Feature
function surpriseMe() {
    const surpriseDestinations = [
        'Chatpal, Jammu & Kashmir',
        'Askot, Uttarakhand',
        'Nelliyampathy, Kerala',
        'Kemmangundi, Karnataka',
        'Yuksom, Sikkim'
    ];
    
    const randomDestination = surpriseDestinations[Math.floor(Math.random() * surpriseDestinations.length)];
    
    showNotification(`Discover ${randomDestination} - A hidden gem!`, 'success');
    
    // Animate surprise button
    const surpriseBtn = document.querySelector('[onclick="surpriseMe()"]');
    if (surpriseBtn && typeof anime !== 'undefined') {
        anime({
            targets: surpriseBtn,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
}

// Export functions for global access
window.nextQuizStep = nextQuizStep;
window.previousQuizStep = previousQuizStep;
window.restartQuiz = restartQuiz;
window.planRoute = planRoute;
window.applyFilters = applyFilters;
window.selectTransport = selectTransport;
window.selectHotel = selectHotel;
window.surpriseMe = surpriseMe;