SKYMOTION WEATHER — Portfolio Edition
=====================================
Tech: HTML5, CSS3, Vanilla JavaScript
APIs: Open-Meteo Forecast, Geocoding and Air Quality
API key: Not required

HOW TO RUN
1. Extract this ZIP.
2. Open index.html in a browser.
3. For the best experience (especially browser geolocation), run with VS Code Live Server.

FEATURES
- Dynamic weather background: rain, thunderstorms/lightning, snow, fog, clouds and clear sky
- Day/night scene follows the searched location's weather data
- City/country search with live suggestions
- Current weather + next 12 hours + 7-day forecast
- Temperature trend chart drawn with Canvas
- Air Quality (US AQI, PM2.5, PM10)
- UV index, rain probability, sunrise/sunset progress
- Weather alerts for heat, strong wind, heavy rain and thunderstorms
- Arabic/English + RTL/LTR
- Celsius/Fahrenheit
- Dark/light preference
- Favorites and recent searches stored locally
- Share weather summary
- Browser geolocation
- Responsive mobile/desktop layout
- Motion and subtle 3D hover effects

NOTE ABOUT COUNTRY SEARCH
Weather is point-based, not country-wide. If a country name is searched, the geocoder returns a representative matching populated/admin location. For precise weather, search a city.

LONGEVITY
The frontend has no expiring API key. It will keep working while the Open-Meteo public endpoints used by the project remain available and compatible. Hosting/domain availability is separate.

V2 UPDATE
- Stronger continuous sun/moon movement and pulsing light
- Independent moving cloud layers
- Continuous rain and snow background animations
- Each 7-day forecast card now shows weekday + calendar date
