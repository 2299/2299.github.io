let page = 1;
let order = localStorage.getItem('order_filter')
// --------------- GET DATA FROM RAWG API !!!!! ---------------/
async function getGamesData(page) {
  let response = await fetch(`https://api.rawg.io/api/games?page=${page}&ordering=${order}`);
  let data = await response.json();

  console.log(data);
  return data;
}
// --------------- Handling keypress in search bar w/ timeOut 1s ---------------/
let timer,
  timeoutVal = 1000;
const gameName = document.getElementById("gameNumber");
const search = document.getElementById("showSearch");
gameName.addEventListener("keyup", handleKeyUp);

document.addEventListener("click", (event) => {
  search.classList.remove("show");
});

function handleKeyUp(e) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    if (gameName.value.length < 3) {
      console.log("malo");
    } else {
      const url = `https://api.rawg.io/api/games?search=${gameName.value}&search_exact=true`;
      search.classList.add("show");
      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((data) => drawData(data));
    }
  }, timeoutVal);
}

// --------------- Adding dropdown items --------------- /
function drawData (data) {
  let whereToInsert = document.getElementById("showSearch"); // get location to insert data
  let countTags =  whereToInsert.getElementsByTagName('a').length;
  if (countTags > 0){
    for (let i = 0; i < countTags; i++) {
      whereToInsert.removeChild(whereToInsert.childNodes[0]);
    }
  }

  for (key in data.results) {
    console.log(data.results[key].name);
    // adding new data
    let li = document.createElement("li");
    li.innerHTML = `<a class="dropdown-item" style="font-size: 12px;" href="${data.results[key].background_image}">${data.results[key].name}  ${(data.results[key].metacritic)!=null ? '- ' + data.results[key].metacritic : ''}</a>`;
    whereToInsert.insertBefore(li, whereToInsert.childNodes[0]);
  }
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

// --------------- Update page witn new data ---------------/
const updateBlock = function (getPage) {
  window.scrollTo(0, 0);
  let nextPage = (
                 getPage == "next" ? page = page + 1 : 
                 getPage == "previous" ? page = page - 1 : 
                 page 
                 )// change page
  let whereToInsert = document.getElementById("col-before"); //

  const button = document.getElementById("previousButton");
  if (page > 1) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
  document.querySelector("body").classList.remove("loaded"); // adding preloading for page
  getGamesData(nextPage).then(function (value) {
    //Удаление текущих страниц
    for (key in value.results) {
      whereToInsert.removeChild(whereToInsert.childNodes[1]);
    }
    for (key in value.results) {
      // --------------- Adding new data ---------------
      let div = document.createElement("div");
      div.className = "col";
      div.innerHTML = `
      <div class="card text-white bg-dark h-100">
        <img id="test" src="${value.results[key].background_image}" class="card-img-top game-image" alt="...">
          <div class="card-body">
            <h5 class="card-title game-title">${value.results[key].name} ${getRating(value.results[key].metacritic)} </h5>
            <div class="game-info">
              <p class="card-text">Жанр: ${getGenres(value)}</p>
              <p class="card-text">Дата выхода: ${value.results[key].released}</p>
              <b class="platforms" id="platforms">Платформы: ${getPlatforms(value)}</b>
              <p class="card-text"><small class="text-muted">Последнее обновление ${value.results[key].updated.split("T", 1)}</small></p>
            </div>
          </div>
      
        <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
        <button type="button" style="font-size: 0.875rem;" onclick="addToFavourites(${
            value.results[key].id
          })" class="btn btn-secondary">Добавить в избранное</button>
        </div>
       </div> `;
      whereToInsert.appendChild(div);
      document.querySelector("body").classList.add("loaded"); // adding preloader
      // Preload while pageis downloading
      let img = document.getElementsByTagName("img")[0];
      img.onload = () => {
        document.querySelector("body").classList.add("loaded");
      };
    }
  });
};

const orderbyFilter = function (order) {
  switch (order) {
    case 'popularity':
      localStorage.setItem('order_filter', '');
      break;

    case 'name':
      localStorage.setItem('order_filter', 'name&metacritic=70,100&dates=2010-01-01,2022-12-31');
      break;
    
    case 'released':
      localStorage.setItem('order_filter', '-released&metacritic=70,100');
      break;

    case 'metacritic':
      localStorage.setItem('order_filter', '-metacritic&metacritic=85,100');
      break;
  }
  document.location.reload()
}

// --------------- Get the games and show them ---------------/
const createBlock = function () {
  getFavouritesCount();
  getGamesData(page).then(function (value) {
    for (key in value.results) {
      // --------------- Create and insert new data ---------------
      let div = document.createElement("div");
      let whereToInsert = document.getElementById("col-before");
      div.className = "col";
      div.innerHTML = `
        <div class="card text-white bg-dark h-100">
          <img id="test" src="${value.results[key].background_image}" class="card-img-top game-image" alt="...">
          <div class="card-body">
            <h5 class="card-title game-title">${value.results[key].name} ${getRating(value.results[key].metacritic)} </h5>
            <div class="game-info">
              <p class="card-text">Жанр: ${getGenres(value)}</p>
              <p class="card-text">Дата выхода: ${value.results[key].released}</p>
              <b class="platforms" id="platforms">Платформы: ${getPlatforms(value)}</b>
              <p class="card-text"><small class="text-muted">Последнее обновление ${value.results[key].updated.split("T", 1)}</small></p>
            </div>
          </div>
          
            <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
              <button type="button" style="font-size: 0.875rem;" onclick="addToFavourites(${
                value.results[key].id
              })" class="btn btn-secondary">Добавить в избранное</button>
            </div>
        </div>  
        `;
      whereToInsert.appendChild(div);
      // console.log(value.results[key])

      // <button class="btn btn-secondary detailed-info" type="button" data-bs-toggle="collapse" data-bs-target="#id${value.results[key].id}" aria-expanded="false" aria-controls="id${value.results[key].id}">Подробнее</button>
      // <div class="collapse multi-collapse" id="id${value.results[key].id}">
      //   <div class="card text-white bg-dark mb-3">
      //     Потом добавлю
      //   </div>
      // </div>
    }
    // Preload while pageis downloading 
    let img = document.getElementsByTagName("img")[0];
    img.onload = () => {
      document.querySelector("body").classList.add("loaded");
    };
  });
};

function showFavourites() {
  let names = [];
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) && !localStorage.getItem('order_filter')){
      continue; // need to skip 'setItems' , 'getItem' etc . . .
    }
    let obj = JSON.parse(localStorage.getItem(key));
    if (obj.hasOwnProperty("name")) {
      names.push(obj.name);
    }
  }
  alert("Ваши игры - " + names.join(", "));
}

function getFavouritesCount() {
  let count = 0;
  let changedSpan = document.getElementById("favourite-counter");
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) || key == 'order_filter') {
      continue;
    }
    console.log(key);

    count++;
  }
  if (count != 0) {
    changedSpan.innerHTML = count;
  } else {
    changedSpan.remove();
  }
}

const getRating = function (data) {
  let rating = (data > 80) ? '<span id="rating" class="rating_good">'+ data +'</span>' :
               (data < 40) ? '<span id="rating" class="ratring_bad">' + data + '</span>' :
               (data == 'null') ? '<span id="rating" class="rating_bad"> 0 </span>' :
               '<span id="rating" class="rating_normal">' + data + '</span>'
    return rating
}

const getGenres = function (value) {
  let genres = [];
  for (keyS in value.results[key].genres) {
    genres.push(value.results[key].genres[keyS].name);
  }
  return genres.join(", ");
};

const getCount = function () {
  getGamesData(page).then(function (value) {
    // document.getElementById('quantityGames').innerHTML = value.count + ' '
    document.getElementById("gameNumber").placeholder =
      "В базе данных " + value.count + " игр";
  });
};

const getPlatforms = function (value) {
  let gamePlatforms = [];
  for (keyS in value.results[key].parent_platforms) {
    let slugValue = value.results[key].parent_platforms[keyS].platform.slug;
    switch (slugValue) {
      case "xbox":
        gamePlatforms =
          '<div class="platform_xbox platform_display"></div> ' + gamePlatforms;
        break;

      case "playstation":
        gamePlatforms =
          '<div class="platform_playstation platform_display"></div> ' +
          gamePlatforms;
        break;

      case "pc":
        gamePlatforms =
          '<div class="platform_pc platform_display"></div> ' + gamePlatforms;
        break;

      case "ios":
        gamePlatforms =
          '<div class="platform_ios platform_display"></div> ' + gamePlatforms;
        break;

      case "mac":
        gamePlatforms =
          '<div class="platform_mac platform_display"></div> ' + gamePlatforms;
        break;

      case "android":
        gamePlatforms =
          '<div class="platform_android platform_display"></div> ' +
          gamePlatforms;
        break;

      case "linux":
        gamePlatforms =
          '<div class="platform_linux platform_display"></div> ' +
          gamePlatforms;
        break;

      case "nintendo":
        gamePlatforms =
          '<div class="platform_nintendo platform_display"></div> ' +
          gamePlatforms;
        break;

      default:
        gamePlatforms =
          value.results[key].parent_platforms[keyS].platform.name +
          " " +
          gamePlatforms;
    }
  }

  return gamePlatforms;
};

function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let hh = String(today.getHours()).padStart(2, '0');
  let min = String(today.getMinutes()).padStart(2, '0');
  let yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy + ', ' + hh + ':' + min;
  return today
}

const addToFavourites = function (id) {
  const url = "https://api.rawg.io/api/games/";
  let gameId = id;

  fetch(url + gameId)
    .then((response) => response.json())
    .then((data) => toJSON(data));
  let currentTime = getDate();
  //
  const toJSON = function (data) {
    if (localStorage.getItem(gameId) !== null) {
      alert("Эта игра уже добавлена");
    } else {
      data["whenAdded"] = currentTime;
      let serialObj = JSON.stringify(data);
      localStorage.setItem(gameId, serialObj);
      alert("Вы успешно добавили " + data.name + " в избранное");
      getFavouritesCount();
    }
  };
};


// --------------- Showing the button after scrolldown ---------------/
window.onscroll = () => {
  toTopButton();
};
// --------------- Show to top button ---------------/
const toTopButton = () => {
  const button = document.getElementById("myBtn");
  const condition =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
      ? (button.style.visibility = "visible")
      : (button.style.visibility = "hidden");
};

getCount();
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