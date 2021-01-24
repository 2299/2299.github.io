// window.addEventListener('load',function(){
//   document.querySelector('body').classList.add("loaded")  
// });
let page = 1;
//Берём данные с API
async function getGamesData(page) {
    let response = await fetch(`https://api.rawg.io/api/games?page=${page}`)
    let data = await response.json()

    console.log(data);
    return data
}

let getCurrentGameData = function() {
  let url = 'https://api.rawg.io/api/games/'
  let id = document.getElementById("gameNumber").value;

  fetch(url+id)
    .then(response => response.json())
    .then(data => document.getElementById('viewgamedata').innerHTML = 
    `<div class="card text-white bg-dark mb-3" style="">
      <img src="${data.background_image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <p class="card-text">${data.description}</p>
      </div>
      <ul class="list-group list-group-flush ">
        <li class="list-group-item text-white bg-dark">Рейтинг сайта - ${data.rating} </li>
      </ul>
      <div class="card-body">
        <a href="${(data.website.length > 1) ? data.website +  '"class="card-link">Ссылка на сайт игры</a>' : '#"class="card-link">Нет веб-сайта </a>'}
        <a href="${(data.metacritic_url.length > 1) ? data.metacritic_url + '"class="card-link">Ссылка на MetaCritic</a> '  : '#"class="card-link">Нет страницы на Metacritic </a>'} 
      </div>
    </div>`);
    
}
//Декоратор для загрузки данных с https://api.rawg.io/api/games
function cachingDecorator(func) {
  let cache = new Map();
  return function(data) {
  if (cache.has(data)) {
    return cache.get(data)
  }
  let result = func(data)
  cache.set(data, result)
  return result;
  };
}

getGamesData = cachingDecorator(getGamesData);

//Количество игр в БД
const getCount = function() {
  getGamesData(page).then(function(value) {
    document.getElementById('quantityGames').innerHTML = value.count + ' '
    document.getElementById('gameNumber').placeholder = 'В базе данных ' + value.count + ' игр'
  });
};
getCount();

const updateBlock = function (getPage) {
  let nextPage = (getPage == 'next') ? page = page + 1 : page = page - 1 //Смена страницы
  let whereToInsert = document.getElementById('row-before') //Ищем, куда добавлять блоки
  let preload = () => document.querySelector('body').classList.add("loaded") //Функция preloaderа
  
  const button = document.getElementById('previousButton')
  if (page > 1) {button.disabled = false} else {button.disabled = true} 

  document.querySelector('body').classList.remove("loaded") //Отобразить прелоадер для прогрузки файлов  
  getGamesData(nextPage).then(function(value) {
    //Удаление текущих страниц
    for (key in value.results){
      whereToInsert.removeChild(whereToInsert.childNodes[0])
    }
    for (key in value.results){
      //-----------Добавление новых данных---------------
      let div = document.createElement('div')
      div.className = 'col'
      div.innerHTML = `
        <div class="card text-white bg-dark mb-3" style="max-width: 18rem">
          <img src="${value.results[key].background_image}" class="card-img-top" >
          <div class="card-body">
            <h5 class="card-title">${value.results[key].name}</h5>
            <p class="card-text">Дата выхода: ${value.results[key].released}</p>
            <b class="platforms">Платформы: ${getPlatforms(value)} </b>
          </div>
        </div>`
        whereToInsert.insertBefore(div, whereToInsert.childNodes[0])
        // console.log(value.results[key])
      }
   })
   setTimeout(preload, 500)
}

const createBlock = function() {
  getGamesData(page).then(function(value) {
    for (key in value.results){
    
  //-------Создаём и добавляем данные---------------
      let div = document.createElement('div')
      let whereToInsert = document.getElementById('row-before')
      div.className = 'col'
      div.innerHTML = `
        <div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
          <img src="${value.results[key].background_image}" class="card-img-top game-image" >
          <div class="card-body">
            <h5 class="card-title">${value.results[key].name}</h5>
            <p class="card-text">Жанр: ${getGenres(value)}</p>
            <p class="card-text">Дата выхода: ${value.results[key].released}</p>
            <b class="platforms" id="platforms">Платформы: ${getPlatforms(value)} </b>
            <p class="card-text"><small class="text-muted">Последнее обновление ${value.results[key].updated.split("T", 1)}</small></p>
            <button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#id${value.results[key].id}" aria-expanded="false" aria-controls="id${value.results[key].id}">Подробнее</button>
              <div class="collapse multi-collapse" id="id${value.results[key].id}">
                <div class="card text-white bg-dark mb-3">
                  Потом добавлю
                </div>
              </div>
        </div>`
      whereToInsert.insertBefore(div, whereToInsert.childNodes[0])
      // console.log(value.results[key])
    }
  })
}

const getGenres = function(value){
  let genres = []
  for (keyS in value.results[key].genres) {
    genres = value.results[key].genres[keyS].name + ' ' + genres
  }
  return genres
}

const getPlatforms = function(value) {
  let gamePlatforms = []
    for (keyS in value.results[key].parent_platforms) {
      let slugValue = value.results[key].parent_platforms[keyS].platform.slug
      switch (slugValue) {
        case 'xbox':
          gamePlatforms = '<div class="platform_xbox platform_display"></div> ' + gamePlatforms
          break;
      
        case 'playstation':
          gamePlatforms = '<div class="platform_playstation platform_display"></div> ' + gamePlatforms
          break;
        
        case 'pc':
          gamePlatforms = '<div class="platform_pc platform_display"></div> ' + gamePlatforms
          break;

        case 'ios':
          gamePlatforms = '<div class="platform_ios platform_display"></div> ' + gamePlatforms
          break;

        case 'mac':
          gamePlatforms = '<div class="platform_mac platform_display"></div> ' + gamePlatforms
          break;

        case 'android':
          gamePlatforms = '<div class="platform_android platform_display"></div> ' + gamePlatforms
          break;

        case 'linux':
          gamePlatforms = '<div class="platform_linux platform_display"></div> ' + gamePlatforms
          break;
        
        case 'nintendo':
          gamePlatforms = '<div class="platform_nintendo platform_display"></div> ' + gamePlatforms
          break;
      
        default:
          gamePlatforms = value.results[key].parent_platforms[keyS].platform.name + ' ' + gamePlatforms
      }
    }
  
  return gamePlatforms
}

createBlock()


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