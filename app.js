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
document.getElementById("logo").onclick = function() {
    window.location.reload();
};

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
    {displayName:'المحلة الكبرى',apiName:'El-Mahalla El-Kubra',id:1},
    {displayName:'الفيوم',apiName:'Fayyum',id:2},
    {displayName:'مارسى مطروح',apiName:'Marsa Matruh',id:3},
    {displayName:'الاسماعيلية',apiName:'Ismailia',id:4},
    {displayName:'القاهرة',apiName:'Cairo',id:5},
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
    const savedCityName = localStorage.getItem("selectedCityName");
    const savedCityApiName = localStorage.getItem("selectedCityApiName");
    if (savedCityApiName) {
        SelectCity.value = savedCityApiName;
    }
    if (savedCityName && cityName) {
        cityName.innerHTML = `<p>${savedCityName}</p>`;
    }
    getCurrentDateAndTime(); // Fetch timings for saved city
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

    if (now.isBefore(moment(timings.Sunrise, "HH:mm"))) {
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