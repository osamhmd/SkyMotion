const $ = id => document.getElementById(id);

let lang = localStorage.getItem("smLang") || "en";
let unit = localStorage.getItem("smUnit") || "celsius";

let currentPlace = null;
let currentData = null;
let searchTimer = null;


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const T = {
    en: {
        live: "LIVE WEATHER",
        title: "Weather that<br><em>moves with you.</em>",
        subtitle: "Search a city or country and get a clear view of what the sky is doing now and next.",
        placeholder: "Search Cairo, Egypt, Dubai...",
        search: "Search",
        myLocation: "My location",
        favorite: "Favorite",
        share: "Share",
        humidity: "Humidity",
        wind: "Wind",
        visibility: "Visibility",
        pressure: "Pressure",
        airQuality: "Air Quality",
        uv: "UV Index",
        rainChance: "Rain chance",
        sunCycle: "Sun cycle",
        hourly: "Next 12 hours",
        forecast: "7-Day Forecast",
        trend: "Temperature trend",
        favorites: "Saved places",

        clearRecent: "Clear favorites",

        about: "About this project",
        aboutText: "A responsive weather dashboard built with HTML5, CSS3 and vanilla JavaScript. It uses public weather, geocoding and air-quality APIs, asynchronous requests, local storage and browser geolocation.",
        footer: "Live data from Open-Meteo • No API key required",
        feels: "Feels like",
        loading: "Getting live weather…",
        notFound: "No matching place found. Try a city or country name.",
        network: "Weather service is temporarily unavailable. Please try again.",
        copied: "Weather summary copied.",
        saved: "Saved to favorites.",
        removed: "Removed from favorites.",
        dayLight: "Daylight",
        daylight: "Daylight",
        night: "Night time",
        goodMorning: "Good morning",
        goodAfternoon: "Good afternoon",
        goodEvening: "Good evening",
        alertHeat: "High temperature",
        alertWind: "Strong wind",
        alertRain: "Heavy rain possible",
        alertStorm: "Thunderstorm conditions",
        countryNote: "Showing weather for a representative city in"
    },

    ar: {
        live: "طقس مباشر",
        title: "الطقس أمامك<br><em>يتحرك معك.</em>",
        subtitle: "ابحث باسم مدينة أو دولة وشاهد حالة الطقس الآن وما هو متوقع خلال الساعات والأيام القادمة.",
        placeholder: "ابحث: القاهرة، مصر، دبي...",
        search: "بحث",
        myLocation: "موقعي",
        favorite: "المفضلة",
        share: "مشاركة",
        humidity: "الرطوبة",
        wind: "الرياح",
        visibility: "الرؤية",
        pressure: "الضغط",
        airQuality: "جودة الهواء",
        uv: "مؤشر UV",
        rainChance: "احتمال المطر",
        sunCycle: "الشروق والغروب",
        hourly: "الـ 12 ساعة القادمة",
        forecast: "توقعات 7 أيام",
        trend: "اتجاه درجات الحرارة",
        favorites: "الأماكن المحفوظة",

        clearRecent: "مسح التفضيلات",

        about: "عن المشروع",
        aboutText: "لوحة طقس متجاوبة مبنية باستخدام HTML5 وCSS3 وJavaScript بدون أطر عمل، وتعتمد على واجهات عامة للطقس والبحث الجغرافي وجودة الهواء مع الطلبات غير المتزامنة والتخزين المحلي وتحديد الموقع.",
        footer: "بيانات مباشرة من Open-Meteo • بدون API Key",
        feels: "المحسوسة",
        loading: "جاري تحميل الطقس المباشر…",
        notFound: "لم نجد المكان. جرّب اسم مدينة أو دولة.",
        network: "خدمة الطقس غير متاحة مؤقتًا. حاول مرة أخرى.",
        copied: "تم نسخ ملخص الطقس.",
        saved: "تمت الإضافة للمفضلة.",
        removed: "تم الحذف من المفضلة.",
        daylight: "نهار",
        night: "وقت الليل",
        goodMorning: "صباح الخير",
        goodAfternoon: "نهارك سعيد",
        goodEvening: "مساء الخير",
        alertHeat: "درجة حرارة مرتفعة",
        alertWind: "رياح قوية",
        alertRain: "احتمال أمطار غزيرة",
        alertStorm: "أجواء عاصفة ورعدية",
        countryNote: "يتم عرض الطقس لمدينة ممثلة داخل"
    }
};


/* =========================================================
   WEATHER CODES
   ========================================================= */

const W = {
    0: ["Clear", "صحو", "☀️", "clear"],
    1: ["Mostly clear", "صحو غالبًا", "🌤️", "clear"],
    2: ["Partly cloudy", "غائم جزئيًا", "⛅", "cloud"],
    3: ["Overcast", "غائم", "☁️", "cloud"],

    45: ["Fog", "ضباب", "🌫️", "fog"],
    48: ["Fog", "ضباب", "🌫️", "fog"],

    51: ["Light drizzle", "رذاذ خفيف", "🌦️", "rain"],
    53: ["Drizzle", "رذاذ", "🌦️", "rain"],
    55: ["Heavy drizzle", "رذاذ كثيف", "🌧️", "rain"],

    61: ["Light rain", "أمطار خفيفة", "🌧️", "rain"],
    63: ["Rain", "أمطار", "🌧️", "rain"],
    65: ["Heavy rain", "أمطار غزيرة", "🌧️", "rain"],
    66: ["Freezing rain", "أمطار متجمدة", "🌧️", "rain"],
    67: ["Freezing rain", "أمطار متجمدة", "🌧️", "rain"],

    71: ["Light snow", "ثلوج خفيفة", "🌨️", "snow"],
    73: ["Snow", "ثلوج", "🌨️", "snow"],
    75: ["Heavy snow", "ثلوج كثيفة", "❄️", "snow"],
    77: ["Snow grains", "حبيبات ثلج", "❄️", "snow"],

    80: ["Rain showers", "زخات مطر", "🌦️", "rain"],
    81: ["Rain showers", "زخات مطر", "🌧️", "rain"],
    82: ["Heavy showers", "زخات غزيرة", "⛈️", "storm"],

    85: ["Snow showers", "زخات ثلج", "🌨️", "snow"],
    86: ["Heavy snow showers", "زخات ثلج كثيفة", "❄️", "snow"],

    95: ["Thunderstorm", "عاصفة رعدية", "⛈️", "storm"],
    96: ["Thunderstorm with hail", "عاصفة رعدية وبَرَد", "⛈️", "storm"],
    99: ["Severe thunderstorm", "عاصفة رعدية شديدة", "⛈️", "storm"]
};


/* =========================================================
   LANGUAGE
   ========================================================= */

function tr() {

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-t]").forEach(el => {
        el.textContent = T[lang][el.dataset.t];
    });

    document.querySelectorAll("[data-t-html]").forEach(el => {
        el.innerHTML = T[lang][el.dataset.tHtml];
    });

    document.querySelectorAll("[data-ph]").forEach(el => {
        el.placeholder = T[lang][el.dataset.ph];
    });

    $("langBtn").textContent = lang === "en" ? "AR" : "EN";

    renderRecent();
    renderFavorites();
}


/* =========================================================
   HELPERS
   ========================================================= */

function wc(code) {

    let a = W[code] || ["Weather", "طقس", "🌤️", "cloud"];

    return {
        label: lang === "ar" ? a[1] : a[0],
        icon: a[2],
        scene: a[3]
    };
}


async function getJSON(url) {

    let response = await fetch(url);

    if (!response.ok) {
        throw new Error("http");
    }

    return response.json();
}


function status(msg, ok = false) {

    $("status").textContent = msg;
    $("status").style.color = ok ? "#249c62" : "";
}


function fmtTime(iso) {

    return new Date(iso).toLocaleTimeString(
        lang === "ar" ? "ar-EG" : "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


function fmtDay(iso) {

    return new Date(iso + "T12:00:00").toLocaleDateString(
        lang === "ar" ? "ar-EG" : "en-US",
        {
            weekday: "short"
        }
    );
}


function fmtDate(iso) {

    return new Date(iso + "T12:00:00").toLocaleDateString(
        lang === "ar" ? "ar-EG" : "en-US",
        {
            day: "2-digit",
            month: "2-digit"
        }
    );
}


function countryFlag(code) {

    if (!code || code.length !== 2) {
        return "";
    }

    return [...code.toUpperCase()]
        .map(c => String.fromCodePoint(127397 + c.charCodeAt()))
        .join("");
}


/* =========================================================
   GEOCODING
   ========================================================= */

async function geocode(query, count = 6) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}` +
        `&count=${count}&language=${lang}&format=json`;

    const data = await getJSON(url);

    return data.results || [];
}


/* =========================================================
   SEARCH
   ========================================================= */

async function searchPlace(query) {

    status(T[lang].loading);

    try {

        let results = await geocode(query, 10);

        if (!results.length) {
            throw new Error("notfound");
        }

        let q = query.trim().toLowerCase();

        let exactCountry = results.find(
            x => (x.country || "").toLowerCase() === q
        );

        let place = exactCountry || results[0];

        await loadWeather(place);

        saveRecent(place);

    } catch (e) {

        $("dashboard").classList.add("hidden");

        status(
            e.message === "notfound"
                ? T[lang].notFound
                : T[lang].network
        );
    }
}


/* =========================================================
   LOAD WEATHER
   ========================================================= */

async function loadWeather(p) {

    const tempUnit = unit;
    const lat = p.latitude;
    const lon = p.longitude;

    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}` +
        `&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,is_day` +
        `&hourly=temperature_2m,weather_code,precipitation_probability,visibility` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max` +
        `&temperature_unit=${tempUnit}` +
        `&wind_speed_unit=kmh` +
        `&timezone=auto` +
        `&forecast_days=7`;

    const airURL =
        `https://air-quality-api.open-meteo.com/v1/air-quality?` +
        `latitude=${lat}` +
        `&longitude=${lon}` +
        `&current=us_aqi,pm2_5,pm10` +
        `&timezone=auto`;

    try {

        let [d, a] = await Promise.all([
            getJSON(weatherURL),
            getJSON(airURL).catch(() => ({
                current: {}
            }))
        ]);

        currentPlace = p;
        currentData = d;

        render(d, a, p);

        status("");

    } catch {

        throw new Error("network");
    }
}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function render(d, a, p) {

    const cur = d.current;
    const c = wc(cur.weather_code);

    const hourIndex = Math.max(
        0,
        d.hourly.time.findIndex(x => x >= cur.time)
    );

    const placeName = [
        p.name,
        p.admin1 && p.admin1 !== p.name ? p.admin1 : "",
        p.country
    ]
        .filter(Boolean)
        .join(", ");

    $("place").textContent =
        `${countryFlag(p.country_code)} ${placeName}`.trim();

    $("heroCity").textContent =
        p.name || p.country || "";

    $("description").textContent = c.label;

    $("weatherIcon").textContent = c.icon;
    $("heroIcon").textContent = c.icon;

    $("temperature").textContent =
        Math.round(cur.temperature_2m) + "°";

    $("heroTemp").textContent =
        Math.round(cur.temperature_2m) + "°";

    $("feelsLike").textContent =
        `${T[lang].feels} ${Math.round(cur.apparent_temperature)}°`;

    $("humidity").textContent =
        cur.relative_humidity_2m + "%";

    $("wind").textContent =
        Math.round(cur.wind_speed_10m) + " km/h";

    $("pressure").textContent =
        Math.round(cur.surface_pressure) + " hPa";

    $("visibility").textContent =
        Math.round(d.hourly.visibility[hourIndex] / 1000) + " km";

    $("rainChance").textContent =
        d.daily.precipitation_probability_max[0] + "%";

    $("uv").textContent =
        Math.round(d.daily.uv_index_max[0] * 10) / 10;

    $("date").textContent =
        new Date(cur.time).toLocaleDateString(
            lang === "ar" ? "ar-EG" : "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

    $("localTime").textContent =
        `${fmtTime(cur.time)} • ${d.timezone_abbreviation || d.timezone}`;

    const hr = new Date(cur.time).getHours();

    $("greeting").textContent =
        (
            hr < 12
                ? T[lang].goodMorning
                : hr < 18
                    ? T[lang].goodAfternoon
                    : T[lang].goodEvening
        ) +
        ", " +
        (p.name || "");

    renderAQ(a.current || {});
    renderSun(d);
    renderHourly(d, hourIndex);
    renderDaily(d);
    renderAlerts(d, c);

    setScene(c.scene, cur.is_day === 1);

    updateFavoriteButton();

    $("dashboard").classList.remove("hidden");
}


/* =========================================================
   AIR QUALITY
   ========================================================= */

function renderAQ(a) {

    let q = a.us_aqi;

    $("aqi").textContent =
        q == null ? "—" : Math.round(q);

    $("pm25").textContent =
        a.pm2_5 == null
            ? "—"
            : Math.round(a.pm2_5) + " μg/m³";

    $("pm10").textContent =
        a.pm10 == null
            ? "—"
            : Math.round(a.pm10) + " μg/m³";

    let label =
        q == null
            ? "—"
            : q <= 50
                ? (lang === "ar" ? "جيد" : "Good")
                : q <= 100
                    ? (lang === "ar" ? "متوسط" : "Moderate")
                    : q <= 150
                        ? (lang === "ar" ? "غير صحي للحساسين" : "Sensitive")
                        : q <= 200
                            ? (lang === "ar" ? "غير صحي" : "Unhealthy")
                            : (lang === "ar" ? "سيئ جدًا" : "Very poor");

    $("aqBadge").textContent = label;
}


/* =========================================================
   SUNRISE / SUNSET
   ========================================================= */

function renderSun(d) {

    let rise = new Date(d.daily.sunrise[0]);
    let set = new Date(d.daily.sunset[0]);
    let now = new Date(d.current.time);

    let pct = Math.max(
        0,
        Math.min(
            100,
            ((now - rise) / (set - rise)) * 100
        )
    );

    $("sunrise").textContent =
        fmtTime(d.daily.sunrise[0]);

    $("sunset").textContent =
        fmtTime(d.daily.sunset[0]);

    $("sunProgress").style.width =
        pct + "%";

    $("sunDot").style.left =
        (
            document.documentElement.dir === "rtl"
                ? 100 - pct
                : pct
        ) + "%";

    $("daylightText").textContent =
        now >= rise && now <= set
            ? T[lang].daylight
            : T[lang].night;
}


/* =========================================================
   HOURLY FORECAST
   ========================================================= */

function renderHourly(d, start) {

    $("hourly").innerHTML =
        d.hourly.time
            .slice(start, start + 12)
            .map((x, i) => {

                let k = start + i;
                let c = wc(d.hourly.weather_code[k]);

                return `
                    <div class="hour">
                        <p>${fmtTime(x)}</p>
                        <div class="wi">${c.icon}</div>
                        <h3>${Math.round(d.hourly.temperature_2m[k])}°</h3>
                        <p>💧 ${d.hourly.precipitation_probability[k]}%</p>
                    </div>
                `;
            })
            .join("");
}


/* =========================================================
   7 DAY FORECAST
   ========================================================= */

function renderDaily(d) {

    $("daily").innerHTML =
        d.daily.time
            .map((x, i) => {

                let c = wc(d.daily.weather_code[i]);

                return `
                    <div class="day">
                        <b>${fmtDay(x)}</b>

                        <span class="day-date">
                            ${fmtDate(x)}
                        </span>

                        <p class="wi">
                            ${c.icon}
                        </p>

                        <p>
                            ${c.label}
                        </p>

                        <b>
                            ${Math.round(d.daily.temperature_2m_max[i])}°
                            /
                            ${Math.round(d.daily.temperature_2m_min[i])}°
                        </b>
                    </div>
                `;
            })
            .join("");

    drawChart(
        d.daily.temperature_2m_max,
        d.daily.temperature_2m_min,
        d.daily.time
    );
}


/* =========================================================
   TEMPERATURE CHART
   ========================================================= */

function drawChart(maxs, mins, days) {

    const canvas = $("tempChart");
    const ctx = canvas.getContext("2d");

    const Wc = canvas.width;
    const H = canvas.height;
    const pad = 36;

    const all = maxs.concat(mins);

    const lo = Math.min(...all) - 2;
    const hi = Math.max(...all) + 2;

    ctx.clearRect(0, 0, Wc, H);

    let css = getComputedStyle(document.body);

    let muted =
        css.getPropertyValue("--muted");

    let accent =
        css.getPropertyValue("--accent");

    const pt = (v, i) => [
        pad +
        i *
        (Wc - pad * 2) /
        (maxs.length - 1),

        H -
        pad -
        (v - lo) *
        (H - pad * 2) /
        (hi - lo)
    ];

    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = muted;

    days.forEach((d, i) => {

        ctx.fillText(
            fmtDay(d),
            pt(maxs[i], i)[0],
            H - 8
        );
    });

    [
        [maxs, accent],
        [mins, muted]
    ].forEach(([arr, color]) => {

        ctx.beginPath();

        arr.forEach((v, i) => {

            let [x, y] = pt(v, i);

            if (i) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;

        ctx.stroke();

        arr.forEach((v, i) => {

            let [x, y] = pt(v, i);

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = color;

            ctx.fill();

            ctx.fillText(
                Math.round(v) + "°",
                x,
                y - 10
            );
        });
    });
}


/* =========================================================
   WEATHER ALERTS
   ========================================================= */

function renderAlerts(d, c) {

    let alerts = [];

    let max =
        d.daily.temperature_2m_max[0];

    let wind =
        d.current.wind_speed_10m;

    let rain =
        d.daily.precipitation_probability_max[0];

    if (c.scene === "storm") {
        alerts.push(
            "⚡ " + T[lang].alertStorm
        );
    }

    if (
        max >= 40 &&
        unit === "celsius"
    ) {
        alerts.push(
            "🌡 " + T[lang].alertHeat
        );
    }

    if (
        max >= 104 &&
        unit === "fahrenheit"
    ) {
        alerts.push(
            "🌡 " + T[lang].alertHeat
        );
    }

    if (wind >= 50) {
        alerts.push(
            "💨 " + T[lang].alertWind
        );
    }

    if (rain >= 80) {
        alerts.push(
            "🌧 " + T[lang].alertRain
        );
    }

    $("alertBox").textContent =
        alerts.join("  •  ");

    $("alertBox").classList.toggle(
        "hidden",
        !alerts.length
    );
}


/* =========================================================
   WEATHER BACKGROUND
   ========================================================= */

function setScene(scene, isDay) {

    document.body.dataset.weather = scene;

    document.body.dataset.time =
        isDay ? "day" : "night";

    let box = $("precipitation");

    box.innerHTML = "";

    if (
        scene === "rain" ||
        scene === "storm"
    ) {

        for (let i = 0; i < 75; i++) {

            let e =
                document.createElement("i");

            e.className = "drop";

            e.style.left =
                Math.random() * 100 + "%";

            e.style.animationDuration =
                (.65 + Math.random() * .8) + "s";

            e.style.animationDelay =
                (-Math.random() * 2) + "s";

            box.appendChild(e);
        }
    }

    if (scene === "snow") {

        for (let i = 0; i < 55; i++) {

            let e =
                document.createElement("i");

            e.className = "flake";

            e.textContent = "•";

            e.style.left =
                Math.random() * 100 + "%";

            e.style.animationDuration =
                (4 + Math.random() * 5) + "s";

            e.style.animationDelay =
                (-Math.random() * 6) + "s";

            e.style.fontSize =
                (10 + Math.random() * 16) + "px";

            box.appendChild(e);
        }
    }
}


/* =========================================================
   RECENT SEARCHES
   ========================================================= */

function saveRecent(p) {

    let a =
        JSON.parse(
            localStorage.getItem("smRecent") || "[]"
        );

    let o = {
        name: p.name,
        country: p.country,
        country_code: p.country_code,
        latitude: p.latitude,
        longitude: p.longitude,
        admin1: p.admin1
    };

    a = [
        o,
        ...a.filter(
            x =>
                x.name !== o.name ||
                x.country !== o.country
        )
    ].slice(0, 5);

    localStorage.setItem(
        "smRecent",
        JSON.stringify(a)
    );

    renderRecent();
}


function renderRecent() {

    let a =
        JSON.parse(
            localStorage.getItem("smRecent") || "[]"
        );

    $("recent").innerHTML =
        a.slice(0, 3)
            .map(
                (p, i) => `
                    <button
                        type="button"
                        data-i="${i}"
                    >
                        ${countryFlag(p.country_code)}
                        ${p.name}
                    </button>
                `
            )
            .join("");

    $("recent")
        .querySelectorAll("button")
        .forEach(b => {

            b.addEventListener(
                "click",
                () =>
                    loadWeather(
                        a[+b.dataset.i]
                    )
            );
        });
}


/* =========================================================
   FAVORITES
   ========================================================= */

function favs() {

    return JSON.parse(
        localStorage.getItem("smFavorites") || "[]"
    );
}


function renderFavorites() {

    let a = favs();

    $("favorites").innerHTML =
        a.map(
            (p, i) => `
                <button
                    type="button"
                    data-i="${i}"
                >
                    ${countryFlag(p.country_code)}
                    ${p.name}
                </button>
            `
        )
        .join("");

    $("favorites")
        .querySelectorAll("button")
        .forEach(b => {

            b.addEventListener(
                "click",
                () =>
                    loadWeather(
                        a[+b.dataset.i]
                    )
            );
        });
}


function updateFavoriteButton() {

    if (!currentPlace) {
        return;
    }

    let yes =
        favs().some(
            x =>
                x.name === currentPlace.name &&
                x.country === currentPlace.country
        );

    $("favoriteBtn").firstChild.nodeValue =
        yes ? "♥ " : "♡ ";
}


function toggleFavorite() {

    if (!currentPlace) {
        return;
    }

    let a = favs();

    let idx =
        a.findIndex(
            x =>
                x.name === currentPlace.name &&
                x.country === currentPlace.country
        );

    if (idx >= 0) {

        a.splice(idx, 1);

        status(
            T[lang].removed,
            true
        );

    } else {

        a.unshift({
            name: currentPlace.name,
            country: currentPlace.country,
            country_code: currentPlace.country_code,
            latitude: currentPlace.latitude,
            longitude: currentPlace.longitude,
            admin1: currentPlace.admin1
        });

        status(
            T[lang].saved,
            true
        );
    }

    localStorage.setItem(
        "smFavorites",
        JSON.stringify(
            a.slice(0, 8)
        )
    );

    renderFavorites();

    updateFavoriteButton();
}


/* =========================================================
   CLEAR FAVORITES
   ========================================================= */

function clearFavorites() {

    localStorage.removeItem(
        "smFavorites"
    );

    renderFavorites();

    updateFavoriteButton();

    status(
        lang === "ar"
            ? "تم مسح جميع الأماكن المحفوظة."
            : "All saved places have been cleared.",
        true
    );
}


/* =========================================================
   SEARCH SUGGESTIONS
   ========================================================= */

async function suggestions(q) {

    if (q.trim().length < 2) {

        $("suggestions")
            .classList
            .add("hidden");

        return;
    }

    try {

        let a =
            await geocode(q, 6);

        $("suggestions").innerHTML =
            a.map(
                (p, i) => `
                    <button
                        type="button"
                        data-i="${i}"
                    >
                        ${countryFlag(p.country_code)}
                        <b>${p.name}</b>
                        ${p.admin1 ? ", " + p.admin1 : ""}
                        ${p.country ? ", " + p.country : ""}
                    </button>
                `
            )
            .join("");

        $("suggestions")
            .classList
            .toggle(
                "hidden",
                !a.length
            );

        $("suggestions")
            .querySelectorAll("button")
            .forEach(b => {

                b.onclick = () => {

                    let p =
                        a[+b.dataset.i];

                    $("searchInput").value =
                        p.name;

                    $("suggestions")
                        .classList
                        .add("hidden");

                    loadWeather(p)
                        .then(
                            () =>
                                saveRecent(p)
                        );
                };
            });

    } catch {
    }
}


/* =========================================================
   SEARCH FORM
   ========================================================= */

$("searchForm")
    .addEventListener(
        "submit",
        e => {

            e.preventDefault();

            let q =
                $("searchInput")
                    .value
                    .trim();

            $("suggestions")
                .classList
                .add("hidden");

            if (q) {
                searchPlace(q);
            }
        }
    );


$("searchInput")
    .addEventListener(
        "input",
        e => {

            clearTimeout(
                searchTimer
            );

            searchTimer =
                setTimeout(
                    () =>
                        suggestions(
                            e.target.value
                        ),
                    300
                );
        }
    );


/* =========================================================
   LANGUAGE BUTTON
   ========================================================= */

$("langBtn").onclick = () => {

    lang =
        lang === "en"
            ? "ar"
            : "en";

    localStorage.setItem(
        "smLang",
        lang
    );

    tr();

    if (currentPlace) {
        loadWeather(currentPlace);
    }
};


/* =========================================================
   THEME BUTTON
   ========================================================= */

$("themeBtn").onclick = () => {

    document.body
        .classList
        .toggle("manual-dark");

    localStorage.setItem(
        "smTheme",
        document.body.classList.contains("manual-dark")
            ? "dark"
            : "light"
    );

    $("themeBtn").textContent =
        document.body.classList.contains("manual-dark")
            ? "☀"
            : "☾";

    if (currentData) {

        drawChart(
            currentData.daily.temperature_2m_max,
            currentData.daily.temperature_2m_min,
            currentData.daily.time
        );
    }
};


/* =========================================================
   TEMPERATURE UNIT
   ========================================================= */

$("cBtn").onclick = () => {

    unit = "celsius";

    localStorage.setItem(
        "smUnit",
        unit
    );

    setUnits();

    if (currentPlace) {
        loadWeather(currentPlace);
    }
};


$("fBtn").onclick = () => {

    unit = "fahrenheit";

    localStorage.setItem(
        "smUnit",
        unit
    );

    setUnits();

    if (currentPlace) {
        loadWeather(currentPlace);
    }
};


function setUnits() {

    $("cBtn")
        .classList
        .toggle(
            "active",
            unit === "celsius"
        );

    $("fBtn")
        .classList
        .toggle(
            "active",
            unit === "fahrenheit"
        );
}


/* =========================================================
   FAVORITE BUTTON
   ========================================================= */

$("favoriteBtn").onclick =
    toggleFavorite;


/* =========================================================
   CLEAR FAVORITES BUTTON
   ========================================================= */

$("clearRecentBtn").onclick =
    clearFavorites;


/* =========================================================
   SHARE
   ========================================================= */

$("shareBtn").onclick =
    async () => {

        if (
            !currentPlace ||
            !currentData
        ) {
            return;
        }

        let c =
            wc(
                currentData.current.weather_code
            );

        let txt =
            `${currentPlace.name}, ` +
            `${currentPlace.country || ""} • ` +
            `${Math.round(currentData.current.temperature_2m)}° • ` +
            `${c.label}`;

        try {

            if (navigator.share) {

                await navigator.share({
                    title: "SkyMotion Weather",
                    text: txt
                });

            } else {

                await navigator.clipboard.writeText(
                    txt
                );

                status(
                    T[lang].copied,
                    true
                );
            }

        } catch {
        }
    };


/* =========================================================
   GEOLOCATION
   ========================================================= */

$("locationBtn").onclick = () => {

    if (!navigator.geolocation) {

        status(
            T[lang].network
        );

        return;
    }

    status(
        T[lang].loading
    );

    navigator.geolocation.getCurrentPosition(

        async pos => {

            let p = {
                name:
                    lang === "ar"
                        ? "موقعي"
                        : "My location",

                country: "",
                country_code: "",

                latitude:
                    pos.coords.latitude,

                longitude:
                    pos.coords.longitude
            };

            try {

                await loadWeather(p);

            } catch {

                status(
                    T[lang].network
                );
            }
        },

        () =>
            status(
                lang === "ar"
                    ? "تعذر الوصول للموقع. يمكنك البحث باسم المدينة."
                    : "Location access was unavailable. Search by city instead."
            )
    );
};


/* =========================================================
   3D TILT EFFECT
   ========================================================= */

document
    .querySelectorAll(".tilt")
    .forEach(card => {

        card.addEventListener(
            "mousemove",
            e => {

                if (
                    matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                let r =
                    card.getBoundingClientRect();

                let x =
                    (e.clientX - r.left) /
                    r.width -
                    .5;

                let y =
                    (e.clientY - r.top) /
                    r.height -
                    .5;

                card.style.transform =
                    `perspective(900px) ` +
                    `rotateX(${-y * 3}deg) ` +
                    `rotateY(${x * 3}deg)`;
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";
            }
        );
    });


/* =========================================================
   INITIAL SETTINGS
   ========================================================= */

if (
    localStorage.getItem("smTheme") === "dark"
) {

    document.body
        .classList
        .add("manual-dark");

    $("themeBtn").textContent =
        "☀";
}

tr();

setUnits();

renderRecent();

renderFavorites();


/* =========================================================
   INITIAL WEATHER
   ========================================================= */

let first =
    JSON.parse(
        localStorage.getItem("smRecent") || "[]"
    )[0];

if (first) {

    loadWeather(first);

} else {

    searchPlace("Cairo");
}
