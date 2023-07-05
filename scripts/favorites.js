var fav_superhero_list = document.getElementById('fav-superheroes-list');
var searchInput = document.getElementById('searchInput');
var go = document.getElementById('go');

var favorites_SH = JSON.parse(localStorage.getItem('fav_superHero'));//Favorite Superheroes List

//Search bar GO button
go.addEventListener('click', function () {
  var searchInput = document.getElementById('searchInput');
  let inputValue = searchInput.value.toLowerCase();
  let cnt = 0;
  const results1 = favorites_SH.map(superhero => {
    let present = superhero.name.toLowerCase().includes(inputValue);
    if(present) cnt++;
    return present ? superhero : undefined;
  });
  if(cnt > 0){
    fav_superhero_list_render(results1);
  }
  else{
    alert('No results found! Please Enter valid name')
  }
})

//Rendering favorite super heroes list
function fav_superhero_list_render(results) {
  if(favorites_SH.length === 0){
    fav_superhero_list.innerHTML = 'No superHero PRESENT.Sorry, go to home and add your superheroes to favorites.';
    fav_superhero_list.style.fontSize = '2rem';
    fav_superhero_list.style.margin = '15rem 0 0 59rem';
    fav_superhero_list.style.color = 'rebeccapurple';
    fav_superhero_list.style.fontStyle = 'italic';
    fav_superhero_list.style.background = '#ededed';
    fav_superhero_list.style.width = '82rem';
    fav_superhero_list.style.height = '3rem';
    fav_superhero_list.style.paddingTop = '3px';
    fav_superhero_list.style.border = '2px solid transparent';
    fav_superhero_list.style.borderRadius = '6px';
  }
  else{
    fav_superhero_list.innerHTML = '';

  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      let id = results[i].id;
      let imgPath = results[i].thumbnail.path + '.' + results[i].thumbnail.extension;
      let name = results[i].name;
      let desc = results[i].description;
      let li = document.createElement('li');
      li.innerHTML = `<div class="superhero">
      <div class="container">
        <div class="box">
          <div class="image">
            <img src=${imgPath} />
          </div>
          <div class="name_job">${name}</div>
          <div class="btns">
            <button style = 'color:black' class='delete-favorite' data-id='${id}'>Remove From Favorites</button>
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
      fav_superhero_list.appendChild(li);
    }
  }
}
}

fav_superhero_list_render(favorites_SH); //favorites superhero list render

//Profile details of a superhero
function profiledetails(pid) {
  pid = parseInt(pid)
  var profileDetails = document.getElementById(pid);
  let profile = favorites_SH.filter(function (sHero) {
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

function handleEvents(e){
  if(e.target.className === 'delete-favorite'){
    //Delete favorites superhero
    let reqId = parseInt(e.target.dataset.id);
    let sh = favorites_SH.filter(function(temp){
      return temp.id != reqId;
    })
    let sh1 = favorites_SH.filter(function(temp){
        return temp.id === reqId;
      });
    favorites_SH = sh;
    localStorage.setItem('fav_superHero', JSON.stringify(favorites_SH));
    alert(`Congratulations! ${sh1[0].name} has been deleted successfully from the favorites.`)

    fav_superhero_list_render(favorites_SH)
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
document.addEventListener('click', handleEvents);