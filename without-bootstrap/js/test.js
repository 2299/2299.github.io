let page = 1;
let order = localStorage.getItem('order_filter')
// --------------- GET DATA FROM RAWG API !!!!! ---------------/
async function getGamesData(page) {
  let response = await fetch(`https://api.rawg.io/api/games?page=${page}&ordering=${order}`);
  let data = await response.json();

  console.log(data);
  return data;
}

// --------------- Decorator for pages ---------------/
function cachingDecorator(func) {
  let cache = new Map();

  return function (data) {
    if (cache.has(data)) {
      return cache.get(data);
    }
    let result = func(data);
    cache.set(data, result);
    return result;
  };
}
getGamesData = cachingDecorator(getGamesData);

// --------------- Create cards ---------------/ 
const createCard = function (value) {
  let whereToInsert = document.getElementById("main-cards"); //

  for (key in value.results) {
    // --------------- Adding new data ---------------
    let div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
    <div class="main-cards__card" style="background: url(${value.results[key].background_image}) center;  background-size: cover;">
      <div class="main-cards__favourite"><i class="far fa-bookmark"></i></div>
      <h2 class="main-cards__title">${value.results[key].name}</h2>
      <p class="text">Дата выпуска - ${value.results[key].released}</p>
      <span class="main-cards__rating">${value.results[key].metacritic}</span>
    </div> `;
    whereToInsert.appendChild(div);
  }
}


// --------------- Get the games and show them ---------------/
const createBlock = function () {
  getGamesData(page).then(function (value) {
    createCard(value);
  });
};


createBlock();

/*-------------------------------------TRASH----------------------------------*/
//--------------Старый вывод платформ-------/
// if (value.results[key].parent_platforms[keyS].platform.slug === 'xbox') {
//   gamePlatforms = '<div class="platform_xbox platform_display"></div> ' + gamePlatforms
// }
// else if(value.results[key].parent_platforms[keyS].platform.slug === 'playstation') {
//   gamePlatforms = '<div class="platform_playstation platform_display"></div> ' + gamePlatforms
// }
// else if(value.results[key].parent_platforms[keyS].platform.slug === 'pc') {
//   gamePlatforms = '<div class="platform_pc platform_display"></div> ' + gamePlatforms
// }
// else if(value.results[key].parent_platforms[keyS].platform.slug === 'mac') {
//   gamePlatforms = '<div class="platform_apple platform_display"></div> ' + gamePlatforms
// }
// else if(value.results[key].parent_platforms[keyS].platform.slug === 'android') {
//   gamePlatforms = '<div class="platform_android platform_display"></div> ' + gamePlatforms
// }
// else if(value.results[key].parent_platforms[keyS].platform.slug === 'linux') {
//   gamePlatforms = '<div class="platform_linux platform_display"></div> ' + gamePlatforms
// }
// else {
//   gamePlatforms = value.results[key].parent_platforms[keyS].platform.name + ' ' + gamePlatforms
// }
//-----------------------------------------------/

//--------------------Считывание игры по её номеру-----------------------------------
// const getDataByNumber = function() {
//   let num = document.getElementById('gameNumber').value
//   num = Number(num) - 1
//   console.log(num);
//   getGamesData(page).then(function(value) {
//     console.log(value.results[num]);
//     console.log(value.results[num].background_image)
//
//     document.getElementById('game-name').innerHTML = value.results[num].name;
//     document.getElementById('image-url').src = value.results[num].background_image;
//   });
// };
//-----------------------------------------------------------------------------------

//---------------------Удалить блоки-------------------------------------------------
// const deleteBlock = function () {
//   getGamesData(page).then(function(value) {
//     for (key in value.results){
//       let whereToInsert = document.getElementById('row-before')
//       whereToInsert.removeChild(whereToInsert.childNodes[0])
//     }
//   })
// }
//-----------------------------------------------------------------------------------

// let getPlatform = function() {
//   getGamesData(page).then(function(value) {
//     for (key in value.results) {
//       for (keyS in value.results[key].platforms) {
//        let gamePlatforms = {}
//        gamePlatforms = value.results[key].platforms[keyS].platform.name
//        return gamePlatforms
//       }
//     }
//   })
// }