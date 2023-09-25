const userTab= document.querySelector("[data-user-weather]");
const searchTab= document.querySelector("[search-weather]");
const UserContainer= document.querySelector(".weather-container");

const GrantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");

const Loading= document.querySelector(".loading-continer");
const userInfoContainer= document.querySelector(".user-info-container");

let oldTab= userTab; //default page  to be shown to user
const API_KEY= "1760f90918012494b56745efc5511fdf";

oldTab.classList.add("current-tab");
getFromSessionStorage(); 

function switchTab (newTab){ 
if(newTab!=oldTab){
oldTab.classList.remove("current-tab");
oldTab= newTab;
oldTab.classList.add("current-tab");

if(!searchForm.classList.contains("active")){
   userInfoContainer.classList.remove("active");
   GrantAccessContainer.classList.remove("active");
   searchForm.classList.add("active");
}
else {
    // was already on search tab
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    getFromSessionStorage();

}
}

}
// switch between user tab and search tab
userTab.addEventListener("click" , ()=>{
        switchTab(userTab);
});
searchTab.addEventListener("click" , ()=>{
        switchTab(searchTab);
});

// coordinates from local storage
function getFromSessionStorage(){
const  localCoord= sessionStorage.getItem("user-coordinates");
if(!localCoord){
    GrantAccessContainer.classList.add("active");
    
}
else {
    const coordinates= JSON.parse(localCoord);
    fetchUserWeatherInfo(coordinates);
}
}
function renderWeatherInfo(weatherInfo){
    const cityName= document.querySelector("[data-cityName]");
    const CountryIcon= document.querySelector("[data-country-icon]");
    const desc= document.querySelector("[data-weatherDescription]");
    const WeatherIcon = document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temperature]");
    const Windspeed= document.querySelector("[data-windspeed]");
    const Humidity= document.querySelector("[data-humidity]");
    const clouds= document.querySelector("[data-cloudiness]");
    // fetch the values from json file to be shown on UI 
    // fetch values 
    cityName.innerText= weatherInfo?.name; 
    CountryIcon.src= `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    WeatherIcon.src= `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0].icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    Windspeed.innerText= `${weatherInfo?.wind?.speed} kmph`;
    Humidity.innerText=` ${weatherInfo?.main?.humidity} %`;
    clouds.innerText=`${ weatherInfo?.clouds?.all} %`;

}
async function fetchUserWeatherInfo(coordinates){
    const  {lat, lon}= coordinates;
    // make grant access container invisible
    GrantAccessContainer.classList.remove("active");
    // make loader visible
    Loading.classList.add("active");
   try{
    const response= await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data= await response.json();
    Loading.classList.remove("active");
    userInfoContainer.classList.add("active");
        renderWeatherInfo(data);  
}
   catch (err){
    Loading.classList.remove("active");
// alert("Error Fetching Weather Details!");
   }

}


function getlocation(){
    if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(showposition);
    }
    else {
alert("No geolocation support available!")
    }
}
function showposition(position){
const usercoord={
    lat: position.coords.latitude,
    lon: position.coords.longitude,
}
sessionStorage.setItem("user-coordinates", JSON.stringify(usercoord));
fetchUserWeatherInfo(usercoord);
}

const GrantAcessButton= document.querySelector("[data-grant-access]");
GrantAcessButton.addEventListener("click", getlocation);

const searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{ 
e.preventDefault();
let cityName= searchInput.value;
if(cityName==="") return;
else {
    fetchSearchWeatherInfo(cityName);
}
})

async function fetchSearchWeatherInfo(city){
Loading.classList.add("active");
userInfoContainer.classList.remove("active");
GrantAccessContainer.classList.remove("active");
try{
    const response= await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data= await response.json();
    Loading.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(e){
    // alert("Invalid City!"); 
}
}