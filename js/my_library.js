function showFavourites() {
  let count = 0;
  let names = [];
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue; // need to skip 'setItems' , 'getItem' etc . . .
    }
    let value = JSON.parse(localStorage.getItem(key));
    console.log(value);
        // --------------- Create and insert new data ---------------
        let div = document.createElement("div");
        let whereToInsert = document.getElementById("col-before");
        div.className = "col";
        div.innerHTML = `
          <div class="card text-white bg-dark h-100">
            <img id="test" src="${value.background_image}" class="card-img-top game-image" >
            <div class="card-body">
              <h5 class="card-title game-title">${value.name} ${getRating(value.metacritic)} </h5>
              <div class="game-info">
                <p class="card-text">Жанр: ${getGenres(value)}</p>
                <p class="card-text">Дата выхода: ${value.released}</p>
                <b class="platforms" id="platforms">Платформы: ${getPlatforms(value)}</b>
                <p class="card-text"><small class="text-muted">Добавлено ${value.whenAdded}</small></p>
              </div>
            </div>
            
            <div class="btn-group btn-group-lg" role="group" aria-label="Basic example">
            <button type="button" style="font-size: 0.875rem;" onclick="localStorage.removeItem(${
                value.id
              }); document.location.reload()" class="btn btn-secondary">Удалить из избранного</button>
            </div>
          </div>  
          `;
        whereToInsert.appendChild(div);
        // console.log(value.r esults[key])
  
        // <button class="btn btn-secondary detailed-info" type="button" data-bs-toggle="collapse" data-bs-target="#id${value.results[key].id}" aria-expanded="false" aria-controls="id${value.results[key].id}">Подробнее</button>
        // <div class="collapse multi-collapse" id="id${value.results[key].id}">
        //   <div class="card text-white bg-dark mb-3">
        //     Потом добавлю
        //   </div>
        // </div>

    // if (obj.hasOwnProperty("name")) {
    //   names.push(obj.name);
    //   count++;
    // }
  }
}

function getFavouritesCount() {
  let count = 0;
  let changedSpan = document.getElementsByTagName("span")[0];
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    count++;
  }
  if (count != 0) {
    changedSpan.innerHTML = count;
  } else {
    changedSpan.remove();
  }
}

function getFavouritesCount() {
    let count = 0;
    let changedSpan = document.getElementsByTagName("span")[0];
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) {
        continue;
      }
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
    for (keyS in value.genres) {
      genres.push(value.genres[keyS].name);
    }
    return genres.join(", ");
  };

  
const getPlatforms = function (value) {
    let gamePlatforms = [];
    for (keyS in value.parent_platforms) {
      let slugValue = value.parent_platforms[keyS].platform.slug;
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
    console.log(today)
}
getFavouritesCount();
showFavourites()