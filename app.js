let currentDate = document.getElementById("current-date");
let currentTime = document.getElementById("current-time");
let SelectCity = document.getElementById("city");
let cityName = document.getElementById("city-name");
let countdownText = document.getElementById("countdown-text");
let countdownTime = document.getElementById("countdown-time");
let fajrTime = document.getElementById("Fajr");
let sunriseTime = document.getElementById("Sunrise");
let dhuhrTime = document.getElementById("Dhuhr");
let asrTime = document.getElementById("Asr");
let maghribTime = document.getElementById("Maghrib");
let ishaTime = document.getElementById("Isha");
let dailyZekrContent = document.getElementById("daily-zekr-content");
let dailyZekrRepeat = document.getElementById("daily-zekr-repeat");
let dailyZekrSource = document.getElementById("daily-zekr-source");
let morningAzkarList = document.getElementById("morning-azkar-list");
let eveningAzkarList = document.getElementById("evening-azkar-list");
let themeToggle = document.getElementById("theme-toggle");
let themeToggleText = document.getElementById("theme-toggle-text");
let themeToggleIcon = document.getElementById("theme-toggle-icon");
let themeSwitchInput = document.querySelector(".ui-switch input[type='checkbox']");
let ramadanBanner = document.getElementById("ramadan-banner");
let ramadanSubtitle = document.getElementById("ramadan-subtitle");
const azkarApiUrl = "https://raw.githubusercontent.com/Seen-Arabic/Morning-And-Evening-Adhkar-DB/main/ar.json";
const ramadanStartDate = new Date(2026, 1, 18, 0, 0, 0, 0); // February 18, 2026
const ramadanEndDate = new Date(2026, 2, 19, 23, 59, 59, 999); // March 19, 2026
let latestAzkar = [];
document.getElementById("logo").onclick = function() {
    window.location.reload();
};

function updateThemeToggleUI(isDarkMode) {
    if (themeSwitchInput) {
        themeSwitchInput.checked = isDarkMode;
    }
    if (!themeToggleText || !themeToggleIcon || !themeToggle) return;
    themeToggleText.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    themeToggleIcon.textContent = isDarkMode ? "SUN" : "MOON";
    themeToggle.setAttribute("aria-pressed", String(isDarkMode));
}

function applyTheme(theme) {
    const isDarkMode = theme === "dark";
    document.body.classList.toggle("dark-mode", isDarkMode);
    updateThemeToggleUI(isDarkMode);
}

function getPreferredTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initializeTheme() {
    applyTheme(getPreferredTheme());
    if (themeSwitchInput) {
        themeSwitchInput.onchange = function() {
            const nextTheme = themeSwitchInput.checked ? "dark" : "light";
            applyTheme(nextTheme);
            localStorage.setItem("theme", nextTheme);
        };
    }
    if (!themeToggle) return;
    themeToggle.onclick = function() {
        const willBeDark = !document.body.classList.contains("dark-mode");
        const nextTheme = willBeDark ? "dark" : "light";
        applyTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    };
}

function getRamadanDayNumber(now = new Date()) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((now - ramadanStartDate) / msPerDay) + 1;
}

function initializeRamadanExperience() {
    const now = new Date();
    const isRamadanPeriod = now >= ramadanStartDate && now <= ramadanEndDate;
    document.body.classList.toggle("ramadan-mode", isRamadanPeriod);
    if (!ramadanBanner || !ramadanSubtitle) return;
    if (!isRamadanPeriod) return;
    const dayNumber = getRamadanDayNumber(now);
    ramadanSubtitle.textContent = `نسعد بزيارتكم في اليوم ${dayNumber} من رمضان. كل عام وأنتم بخير.`;
}

function formatTo12HourMM(timeString) {
    let [hours, minutes] = timeString.split(":").map(Number);
    let suffix = hours >= 12 ? "م" : "ص";
    hours = (hours % 12) || 12; // 0 -> 12
    return `${hours}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function formatTo12HourSS(timeString) {
    let [hours, minutes, seconds] = timeString.split(":").map(Number);
    let suffix = hours >= 12 ? "م" : "ص";
    hours = (hours % 12) || 12; // 0 -> 12
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${suffix}`;
}


const availableCities = [
    {displayName:'القاهرة',apiName:'Cairo',id:1},
    {displayName:'الفيوم',apiName:'Fayyum',id:2},
    {displayName:'مارسى مطروح',apiName:'Marsa Matruh',id:3},
    {displayName:'الاسماعيلية',apiName:'Ismailia',id:4},
    {displayName:'المحلة الكبرى',apiName:'El-Mahalla El-Kubra',id:5},
    {displayName:'الاسكندرية',apiName:'Alexandria',id:6},
    {displayName:'بورسعيد',apiName:'Port Said',id:7},
    {displayName:'أسيوط',apiName:'Asyut',id:8},
    {displayName:'طنطا',apiName:'Tanta',id:9},
    {displayName:'بلبيس',apiName:'Bilbais',id:10},
    {displayName:'الجيزة',apiName:'Gizeh',id:11},
    {displayName:'السويس',apiName:'Suez',id:12},
    {displayName:'الاقصر',apiName:'Luxor',id:13},
    {displayName:'المنصورة',apiName:'al-Mansura',id:14},
    {displayName:'الزقازيق',apiName:'Zagazig',id:15},
    {displayName:'العريش',apiName:'Arish',id:16},
    {displayName:'العاشر من رمضان',apiName:'10th of Ramadan City',id:17},
    {displayName:'الغردقة',apiName:'Hurghada',id:18},
    {displayName:'سوهاج',apiName:'Sohag',id:19},
    {displayName:'دمياط',apiName:'Damietta',id:20},
];

availableCities.map(city => {
    let option = document.createElement("option");
    option.value = city.apiName; // or city.id if you prefer
    option.text = city.displayName;
    option.setAttribute("data-display-name", city.displayName); // Store displayName
    SelectCity.add(option);
    return option;
});

// Restore cityName and selected city from localStorage on page load
window.onload = function() {
    initializeTheme();
    initializeRamadanExperience();
    const savedCityName = localStorage.getItem("selectedCityName");
    const savedCityApiName = localStorage.getItem("selectedCityApiName");
    if (savedCityApiName) {
        SelectCity.value = savedCityApiName;
    }
    if (savedCityName && cityName) {
        cityName.innerHTML = `<p>${savedCityName}</p>`;
    }
    getCurrentDateAndTime(); // Fetch timings for saved city
    fetchAzkarData();
};

// Update city name, save to localStorage, and fetch new timings on city change
SelectCity.onchange = function() {
    const selectedOption = SelectCity.options[SelectCity.selectedIndex];
    const displayName = selectedOption.getAttribute("data-display-name");
    const apiName = selectedOption.value;
    if (cityName) {
        cityName.innerHTML = `<p>${displayName}</p>`;
        localStorage.setItem("selectedCityName", displayName);
        localStorage.setItem("selectedCityApiName", apiName);
    }
    window.scrollTo(0, 0);
    getCurrentDateAndTime(); // Fetch timings for new city
};

function getTimes() { //امر لتحديد الوقت
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

let latestTimings = null; // Global variable to store timings

// Update getCurrentDateAndTime to use the current SelectCity.value
function getCurrentDateAndTime() {
    let response = axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${SelectCity.value}&country=Egypt&method=5`);
    response.then(response => {
        console.log(response.data.data.date.hijri.weekday.ar); //تحديد اليوم 
        console.log(response.data.data.date.hijri.day);  //تحديد اليوم كارقم 
        console.log(response.data.data.date.hijri.month.ar);  //تحديد الشهر  
        console.log(response.data.data.date.hijri.year);  //تحديد السنة  
        currentDate.innerHTML = `<p>${response.data.data.date.hijri.weekday.ar}، ${response.data.data.date.hijri.day} ${response.data.data.date.hijri.month.ar} ${response.data.data.date.hijri.year} هـ</p>`;
        console.log(response.data.data.timings);
        const prayerTimes = [
            { displayName: 'الفجر', apiName: 'Fajr' , id: 1 , Fajr : response.data.data.timings.Fajr},
            { displayName: 'الشروق', apiName: 'Sunrise' , id: 2 , Sunrise : response.data.data.timings.Sunrise},
            { displayName: 'الظهر', apiName: 'Dhuhr' , id: 3 , Dhuhr : response.data.data.timings.Dhuhr},
            { displayName: 'العصر', apiName: 'Asr' , id: 4 , Asr : response.data.data.timings.Asr},
            { displayName: 'المغرب', apiName: 'Maghrib' , id: 5 , Maghrib : response.data.data.timings.Maghrib},
            { displayName: 'العشاء', apiName: 'Isha' , id: 6 , Isha : response.data.data.timings.Isha},
        ]
        latestTimings = response.data.data.timings; // Save timings globally

        function updateCountdown() {
            let momentNow = moment();
            if (momentNow.isAfter(moment(prayerTimes[0].Fajr, "HH:mm")) && momentNow.isBefore(moment(prayerTimes[1].Sunrise, "HH:mm"))) {
                countdownText.innerHTML = `<p>متبقى حتى  ${prayerTimes[1].displayName}</p>`;
            }
            else if (momentNow.isAfter(moment(prayerTimes[1].Sunrise, "HH:mm")) && momentNow.isBefore(moment(prayerTimes[2].Dhuhr, "HH:mm"))) {
                countdownText.innerHTML = `<p>متبقى حتى صلاة  ${prayerTimes[2].displayName}</p>`;
            }
            else if (momentNow.isAfter(moment(prayerTimes[2].Dhuhr, "HH:mm")) && momentNow.isBefore(moment(prayerTimes[3].Asr, "HH:mm"))) {
                countdownText.innerHTML = `<p>متبقى حتى صلاة  ${prayerTimes[3].displayName}</p>`;
            }
            else if (momentNow.isAfter(moment(prayerTimes[3].Asr, "HH:mm")) && momentNow.isBefore(moment(prayerTimes[4].Maghrib, "HH:mm"))) {
                countdownText.innerHTML = `<p>متبقى حتى صلاة  ${prayerTimes[4].displayName}</p>`;
            }
            else if (momentNow.isAfter(moment(prayerTimes[4].Maghrib, "HH:mm")) && momentNow.isBefore(moment(prayerTimes[5].Isha, "HH:mm"))) {
                countdownText.innerHTML = `<p>متبقى حتى صلاة  ${prayerTimes[5].displayName}</p>`;
            }
            else {
                countdownText.innerHTML = `<p>متبقى حتى صلاة  ${prayerTimes[0].displayName}</p>`;
            }
        }
        updateCountdown();
        
        fajrTime.innerHTML = `<p>${formatTo12HourMM(prayerTimes[0].Fajr)}</p>`;
        sunriseTime.innerHTML = `<p>${formatTo12HourMM(prayerTimes[1].Sunrise)}</p>`;
        dhuhrTime.innerHTML = `<p>${formatTo12HourMM(prayerTimes[2].Dhuhr)}</p>`;
        asrTime.innerHTML = `<p>${formatTo12HourMM(prayerTimes[3].Asr)}</p>`;
        maghribTime.innerHTML = `<p>${formatTo12HourMM(prayerTimes[4].Maghrib)}</p>`;
        ishaTime.innerHTML = `<p>${formatTo12HourMM(prayerTimes[5].Isha)}</p>`;

    });
    response.catch(error => {
        console.log(error);
    });
}

// Move this function outside so it can use latestTimings
function timePeriod() {
    if (!latestTimings) return "--:--:--";
    let now = moment(getTimes(), "HH:mm:ss");
    let timings = latestTimings;
    let nextPrayerTime = null;

    if (now.isBefore(moment(timings.Fajr, "HH:mm"))) {
        nextPrayerTime = moment(timings.Fajr, "HH:mm");
    } else if (now.isBefore(moment(timings.Sunrise, "HH:mm"))) {
        nextPrayerTime = moment(timings.Sunrise, "HH:mm");
    } else if (now.isBefore(moment(timings.Dhuhr, "HH:mm"))) {
        nextPrayerTime = moment(timings.Dhuhr, "HH:mm");
    } else if (now.isBefore(moment(timings.Asr, "HH:mm"))) {
        nextPrayerTime = moment(timings.Asr, "HH:mm");
    } else if (now.isBefore(moment(timings.Maghrib, "HH:mm"))) {
        nextPrayerTime = moment(timings.Maghrib, "HH:mm");
    } else if (now.isBefore(moment(timings.Isha, "HH:mm"))) {
        nextPrayerTime = moment(timings.Isha, "HH:mm");
    } else {
        nextPrayerTime = moment(timings.Fajr, "HH:mm").add(1, "day");
    }

    let diff = nextPrayerTime.diff(now, "seconds");
    let duration = moment.utc(diff * 1000).format("HH:mm:ss");
    return duration;
}

function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function normalizeAdhkarText(text) {
    if (!text) return "";
    return text.replace(/\s+/g, " ").trim();
}

function getRepeatedText(count) {
    const parsedCount = Number(count);
    if (!parsedCount || parsedCount < 1) return "مرة واحدة";
    if (parsedCount === 1) return "مرة واحدة";
    if (parsedCount === 2) return "مرتان";
    return `${parsedCount} مرات`;
}

function getZekrText(item) {
    return normalizeAdhkarText(
        item?.content ||
        item?.arabicText ||
        item?.zekr ||
        ""
    );
}

function getZekrRepeat(item) {
    if (item?.count_description) return item.count_description;
    return getRepeatedText(item?.count ?? item?.repeat);
}

function getZekrType(item) {
    const rawType = item?.type;
    if (typeof rawType === "number") return rawType;
    if (typeof rawType === "string" && rawType.trim() !== "") {
        const lowered = rawType.toLowerCase().trim();
        if (lowered === "both") return 0;
        if (lowered === "morning") return 1;
        if (lowered === "evening") return 2;
        const parsed = Number(rawType);
        if (!Number.isNaN(parsed)) return parsed;
    }
    return -1;
}

function pickRotatedItems(items, seed, count) {
    if (!Array.isArray(items) || items.length === 0) return [];
    if (items.length <= count) return items;
    const picked = [];
    for (let i = 0; i < count; i++) {
        picked.push(items[(seed + i) % items.length]);
    }
    return picked;
}

function renderAzkarList(target, items, emptyMessage) {
    if (!target) return;
    target.innerHTML = "";
    if (!items.length) {
        target.innerHTML = `<li>${emptyMessage}</li>`;
        return;
    }
    items.forEach(item => {
        const li = document.createElement("li");
        const zekr = getZekrText(item);
        const repeat = getZekrRepeat(item);
        li.innerHTML = `${zekr}<span class="azkar-repeat">التكرار: ${repeat}</span>`;
        target.appendChild(li);
    });
}

function renderDailyZekr(item) {
    if (!dailyZekrContent || !dailyZekrRepeat || !dailyZekrSource) return;
    if (!item) {
        dailyZekrContent.textContent = "تعذر تحميل ذكر اليوم حاليا.";
        dailyZekrRepeat.textContent = "";
        dailyZekrSource.textContent = "";
        return;
    }
    dailyZekrContent.textContent = getZekrText(item);
    dailyZekrRepeat.textContent = `التكرار: ${getZekrRepeat(item)}`;
    // dailyZekrSource.textContent = "المصدر: API أذكار مجاني";
}

function buildMorningAzkar(azkar) {
    return azkar.filter(item => {
        const type = getZekrType(item);
        return type === 0 || type === 1;
    });
}

function buildEveningAzkar(azkar) {
    return azkar.filter(item => {
        const type = getZekrType(item);
        return type === 0 || type === 2;
    });
}

async function fetchAzkarData() {
    try {
        const response = await axios.get(azkarApiUrl);
        console.log('response of azkar>> ',response.data);
        if (!Array.isArray(response.data)) {
            throw new Error("Unexpected adhkar payload");
        }

        latestAzkar = response.data;
        const daySeed = getDayOfYear();
        const dailyItem = latestAzkar[daySeed % latestAzkar.length];
        const morningItems = buildMorningAzkar(latestAzkar);
        const eveningItems = buildEveningAzkar(latestAzkar);

        renderDailyZekr(dailyItem);
        renderAzkarList(
            morningAzkarList,
            pickRotatedItems(morningItems, daySeed, 6),
            "لا توجد أذكار صباح متاحة حاليا."
        );
        renderAzkarList(
            eveningAzkarList,
            pickRotatedItems(eveningItems, daySeed, 6),
            "لا توجد أذكار مساء متاحة حاليا."
        );
    } catch (error) {
        console.log("Adhkar API error:", error);
        renderDailyZekr(null);
        renderAzkarList(morningAzkarList, [], "تعذر تحميل أذكار الصباح الآن.");
        renderAzkarList(eveningAzkarList, [], "تعذر تحميل أذكار المساء الآن.");
    }
}

// Only one interval, outside the function
setInterval(() => {
    countdownTime.innerHTML = `<p>${timePeriod()}</p>`;
}, 1000);

function getCurrentTime() {
    const time = getTimes();
    currentTime.innerHTML = `<p>${formatTo12HourSS(time)}</p>`;
    setTimeout(getCurrentTime, 1000);
}

getCurrentTime();

