var superhero_li = document.getElementById('superheroes-list')
var searchInput = document.getElementById('searchInput');
var go = document.getElementById('go');

var results = ''; //superheroes list

//Search bar GO button
go.addEventListener('click', function () {
  var searchInput = document.getElementById('searchInput');
  let inputValue = searchInput.value.toLowerCase();
  let cnt = 0;
  const results1 = results.map(superhero => {
    let present = superhero.name.toLowerCase().includes(inputValue);
    if (present) cnt++;
    return present ? superhero : undefined;
  });
  if (cnt > 0) {
    superhero_list_render(results1);
  }
  else {
    alert('No results found! Please Enter valid name')
  }
})

//API to call all the superheroes from marvel
async function fetchdetails() {
  let ts = new Date().getTime();
  let url = `https://gateway.marvel.com:443/v1/public/characters?limit=100&ts=1687506679909&apikey=e87961910e4b3dc107be2c88c022ad08&hash=90f5f206bffd371637962144c903c1e8`;
  let response = await fetch(url);
  let data = await response.json();
  console.log(data.data.results)

  results = data.data.results
  superhero_list_render(results)
}

fetchdetails() //API called here

//Rendering super heroes list
function superhero_list_render(results) {
  superhero_li.innerHTML = '';

  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      let id = results[i].id;
      let imgPath = results[i].thumbnail.path + '.' + results[i].thumbnail.extension;
      let name = results[i].name;
      let desc = results[i].description;
      let li = document.createElement('li');
      li.innerHTML = `<div class="superhero">
      <div class="container" id='container'>
        <div class="box">
          <div class="image">
            <img src=${imgPath} />
          </div>
          <div class="name_job">${name}</div>
          <div class="btns">
            <button style = 'color:black' class='favorite' data-id='${id}'>Add to Favorites</button>
            <button class='profile' data-id='${id}'>GO to Profile</button>
          </div>
        </div>
       
          </div>
        </div>
      </div>
    </div>
    <div id='${id}'>
    </div>
    `;

      superhero_li.appendChild(li);
    }
  }
}

//Profile details of a superhero
function profiledetails(pid) {
  pid = parseInt(pid)
  var profileDetails = document.getElementById(pid);
  let profile = results.filter(function (sHero) {
    return sHero.id === pid;
  })

  let imgPath = profile[0].thumbnail.path + '.' + profile[0].thumbnail.extension;
  let comicsnames = '', eventsnames = '', storiesnames = '', seriesnames = '';

  profile[0].comics.items.forEach(function(comic){
              comicsnames += comic.name + ', '          
  });

  profile[0].events.items.forEach(function(event){
    eventsnames += event.name + ', '          
  });

  profile[0].stories.items.forEach(function(story){
    storiesnames += story.name + ', '          
  });

  profile[0].series.items.forEach(function(series_){
    seriesnames += series_.name + ', '          
  });

  profileDetails.innerHTML = `
    <div class="container">
    <div class="row">
      <div class="profile-nav">
          <div class="panel">
              <div class="user-heading round">
                  <a href="#">
                      <img src=${imgPath} alt="">
                  </a>
                  <h1>${profile[0].name}</h1>
                  <p>${'Last modified: ' + profile[0].modified}</p>
              </div>
          </div>
      </div>
      <div class="panel">
          <div class="bio-graph-heading">
          ${profile[0].description.length != 0 ? profile[0].description : 'No Description Available'}
          </div>
          <div class="panel-body bio-graph-info">
              <h1>Bio Graph</h1>
              <div class="">
                  <div class="bio-row">
                      <p><span>Comics </span>: ${comicsnames.length === 0 ? comicsnames: 'No Data Present'}</p>
                  </div>
                  <div class="bio-row">
                      <p><span>Events </span>: ${eventsnames != 0 ? eventsnames: 'No Data Present'}</p>
                  </div>
                  <div class="bio-row">
                      <p><span>Series </span>: ${seriesnames != 0 ? seriesnames: 'No Data Present'}</p>
                  </div>
                  <div class="bio-row">
                      <p><span>Stories</span>: ${storiesnames != 0 ? storiesnames: 'No Data Present'}</p>
                  </div>
                  <div class="bio-row">
              </div>
          </div>
      </div>
      <div >
        <button class='closeProfile' data-id='${pid}'>Close</button>
      </div>
  </div>
  </div>
  </div>
    `
}

//to close profile
function closeProfiledetails(pid) {
  pid = parseInt(pid)
  var profileDetails = document.getElementById(pid);

  profileDetails.innerHTML = ''
}

var favorites_SH = JSON.parse(localStorage.getItem('fav_superHero'));
function handleEvents(e) {
  if (e.target.className === 'favorite') {
    //Superhero is added to favorites and saved in localstorage for persistency
    let reqId = parseInt(e.target.dataset.id);
    let sh_present = false;
    if (favorites_SH && favorites_SH.length > 0) {
      favorites_SH.forEach(fav_sh => {
        if (fav_sh.id === reqId) {
          sh_present = true;
        }
      });
    }
    if (!sh_present || !favorites_SH) {
      let sh = results.filter(function (temp) {
        return temp.id === reqId;
      })
      favorites_SH = []
      favorites_SH.push(sh[0]);
      localStorage.setItem('fav_superHero', JSON.stringify(favorites_SH));
      alert(`Congratulations! ${sh[0].name} has been added successfully to the favorites.`);
    }
    else {
      alert('Sorry! unable to add to favorites. SuperHero already added.')
    }
  } else if (e.target.className === 'profile') {
    //For opening of profile details
    profiledetails(e.target.dataset.id)
  }
  else if (e.target.className === 'closeProfile') {
    //For closing of profile details
    closeProfiledetails(e.target.dataset.id)
  }
}

//TO handle events
document.addEventListener('click', handleEvents)