function checkSessionStorage(){if(null!==sessionStorage.getItem('searchVal')){const a=document.forms.searchForm,b=sessionStorage.getItem('searchVal');sessionStorage.removeItem('searchVal'),a.q.value=b,a.q.focus(),searchBeer(b,'name')}if(null!==sessionStorage.getItem('beerCards')){const a=JSON.parse(sessionStorage.getItem('beerCards')),b=JSON.parse(sessionStorage.getItem('resultMessage')),c=JSON.parse(sessionStorage.getItem('navigationButtons')),d=JSON.parse(sessionStorage.getItem('beersJSON')),f=document.getElementById('beer-container'),g=document.getElementById('results-container'),h=document.getElementById('page-navigation');g.innerHTML=b,f.innerHTML=a,h.innerHTML=c,50<d.length&&generateButtons(d.length,d)}}function activeButtons(a,b){a.classList.add('active'),a.classList.remove('white'),a.classList.remove('black-text');for(const c of b)c!==a&&(c.classList.add('white'),c.classList.add('black-text'),c.classList.remove('active'))}function setSearchButtonsListeners(){const a=document.getElementById('beer-search-btn'),b=document.getElementById('user-search-btn'),c=document.getElementById('filter-options'),d=document.forms.searchForm,f=document.getElementsByClassName('search-btn');a.addEventListener('click',function(){c.style.display='block',d.q.select(),d.q.focus(),activeButtons(this,f)}),b.addEventListener('click',function(){c.style.display='none',d.q.select(),d.q.focus(),activeButtons(this,f)})}function setFilterButtonsListeners(){const a=document.getElementsByClassName('filter-btn'),b=document.forms.searchForm;for(const c of a)c.addEventListener('click',function(){b.q.select(),b.q.focus(),activeButtons(this,a)})}function setSearchformListeners(){const a=document.forms.searchForm,b=document.getElementsByClassName('search-btn');a.q.addEventListener('keyup',function(){const c=document.getElementById('error-container');c.innerHTML=3>this.value.length?'Search needs to be at least three characters long':''}),a.addEventListener('submit',function(c){c.preventDefault();for(const d of b)d.classList.contains('active')&&checkSubmitValue(d.name)})}function checkSubmitValue(a){const b=document.forms.searchForm,c=b.q.value,d=document.getElementsByClassName('filter-btn');if(3<=c.length)if('beer'===a){let f;for(const g of d)g.classList.contains('active')&&(f=g.name);searchBeer(c,f)}else searchUser(c)}async function searchBeer(a,b){const c=document.getElementById('beer-container'),d=document.getElementById('results-container'),f=document.getElementById('loading-container'),g=document.getElementById('page-navigation');f.classList.add('active');try{const h=await fetch(`/search/beers/${b}/?q=${a}`),j=await h.json();if(1>j.length)clearContent(c),displayErrorMessage(a,'beer',b);else{let l;l=50<j.length?50:j.length,displayResultCount(a,j.length,1,l),clearContent(c),clearContent(g),j.forEach(async(m,n)=>{if(50>=n){const o=await generateBeerCard(m);await displayBeer(o)}}),50<j.length&&addNextButton(j.length,j)}sessionStorage.setItem('beersJSON',JSON.stringify(j)),sessionStorage.setItem('beerCards',JSON.stringify(c.innerHTML)),sessionStorage.setItem('resultMessage',JSON.stringify(d.innerHTML)),sessionStorage.setItem('navigationButtons',JSON.stringify(g.innerHTML))}catch(h){console.log(h)}f.classList.remove('active')}async function searchUser(a){const b=document.getElementById('beer-container'),c=document.getElementById('results-container'),d=document.getElementById('loading-container'),f=document.getElementById('page-navigation');d.classList.add('active');try{const g=await fetch(`/search/users/?q=${a}`),h=await g.json();if(1>h.length)clearContent(b),displayErrorMessage(a,'user');else{let k;k=50<h.length?50:h.length,displayResultCount(a,h.length,1,k),clearContent(b),clearContent(f),h.forEach(async(l,m)=>{if(50>=m){const n=generateUserCard(l);await displayBeer(n)}}),50<h.length&&addNextButton(h.length,h)}sessionStorage.setItem('beersJSON',JSON.stringify(h)),sessionStorage.setItem('beerCards',JSON.stringify(b.innerHTML)),sessionStorage.setItem('resultMessage',JSON.stringify(c.innerHTML)),sessionStorage.setItem('navigationButtons',JSON.stringify(f.innerHTML))}catch(g){console.log(g)}d.classList.remove('active')}async function generateBeerCard(a){let b,c,d,f,g,h,j,k;if(c=a.style_id?`<span class="chip">${a.style_name}</span>`:'',d=a.brewery_id?`<span class="chip">${a.brewery_name}</span>`:'',f=a.country_id?`<span class="chip">${a.country_name}</span>`:'',g=a.consumes&&0<a.consumes.length?`
      <i class="material-icons va-middle" aria-hidden="true">local_drink</i>
      <span class="card-subtitle va-middle">${a.consumes.length} drinks</span>
    `:'',h=a.ratings&&0<a.ratings.length?`
      <i class="material-icons va-middle" aria-hidden="true">star</i>
      <span class="card-subtitle va-middle">${a.ratings.length} ratings</span>
    `:'',j=a.reviews&&0<a.reviews.length?`
      <i class="material-icons va-middle" aria-hidden="true">rate_review</i>
      <span class="card-subtitle va-middle">${a.reviews.length} reviews</span>
    `:'',k=a.images&&0<a.images.length?`
      <i class="material-icons va-middle" aria-hidden="true">insert_photo</i>
      <span class="card-subtitle va-middle">${a.images.length} images</span>
    `:'',a.avg_rating){let m,n,o;switch(b='',m=0==a.avg_rating%1?'int':'float',m){case'int':n=a.avg_rating/1;for(let p=1;p<=n;p++)b+=`
               <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `;o=5-n;for(let p=1;p<=o;p++)b+=`
        <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `;break;case'float':n=a.avg_rating/1;for(let p=1;p<=Math.floor(n);p++)b+=`
          <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
        `;b+=`
         <svg class="va-middle" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <path d="M0 0h24v24H0V0z" id="a"/>
          </defs>
          <clipPath id="b">
            <use overflow="visible" xlink:href="#a"/>
          </clipPath>
          <path clip-path="url(#b)" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        </svg>
        `,o=Math.floor(5-n);for(let p=1;p<=o;p++)b+=`
        <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `;}b+=`
    <span class="va-middle card-subtitle">${a.avg_rating.toFixed(1)}</span>
    `}else b=`
     <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <svg class="va-middle" fill="#E8EDFA" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <span class="card-subtitle">N/A</span>
    `;const l=`
    <div class="row">
      <div class="card">
            <div class="card-content">
              <div class="card-title">
                <a class="beerraters-link" href="/beers/${a._id}">${a.name}</a>
              </div> 
              <div class="card-title">                  
                ${b}
              </div>
              <span class="mobile-inline-block">
                ${g}
              </span>
              <span class="mobile-inline-block">
                ${h}
              </span>
              <span class="mobile-inline-block">
                ${j}
              </span>
              <span class="mobile-inline-block">
                ${k}
              </span>
            </div>
            <div class="card-content bt-1">                 
              ${c}             
              ${d}                 
              ${f}
          </div>
        </div>
      </div>
      `;return l}function generateUserCard(a){let b,c,d,f;b=a.consumes&&0<a.consumes.length?`
      <i class="material-icons va-middle" aria-hidden="true">local_drink</i>
      <span class="card-subtitle va-middle">${a.consumes.length} drinks</span>
    `:'',c=a.ratings&&0<a.ratings.length?`
      <i class="material-icons va-middle" aria-hidden="true">star</i>
      <span class="card-subtitle va-middle">${a.ratings.length} ratings</span>
    `:'',d=a.reviews&&0<a.reviews.length?`
      <i class="material-icons va-middle" aria-hidden="true">rate_review</i>
      <span class="card-subtitle va-middle">${a.reviews.length} reviews</span>
    `:'',f=a.images&&0<a.images.length?`
      <i class="material-icons va-middle" aria-hidden="true">insert_photo</i>
      <span class="card-subtitle va-middle">${a.images.length} images</span>
    `:'';const g=`
    <div class="row">
      <div class="card">
            <div class="card-content">
              <div class="card-title">
                <a class="beerraters-link" href="/users/${a._id}">@${a.username}</a>
              </div>
            <span class="mobile-inline-block">
              ${b}
            </span>
            <span class="mobile-inline-block">
              ${c}
            </span>
            <span class="mobile-inline-block">
              ${d}
            </span>
            <span class="mobile-inline-block">
              ${f}
            </span>
          </div> 
        </div>
      </div>
      </div>
        `;return g}function displayBeer(a){const b=document.getElementById('beer-container');addContent(b,a),sessionStorage.setItem('beerCards',JSON.stringify(b.innerHTML))}function displayErrorMessage(a,b,c){const d=document.getElementById('results-container'),f=document.getElementById('page-navigation');let g,h;switch(c){case'name':g='Add this beer to our database <a class="beerraters-link" href="/beers/add">here!</a>',h=`beer <span style="font-weight: bold;">"${a}"</span>`;break;case'style':h=`any beers for style <span style="font-weight: bold;">"${a}"</span>`,g='';break;case'brewery':h=`any beers for brewery <span style="font-weight: bold;">"${a}"</span>`,g='';break;case'country':h=`any beers for country <span style="font-weight: bold;">"${a}"</span>`,g='';break;default:h=`user <span style="font-weight: bold;">"${a}"</span>`,g='';}const j=`
  <div class="row">
  <h4>Sorry, could not find ${h}</span></h4>
  <p>${g}</p>
  </div>
  `;clearContent(f),clearContent(d),addContent(d,j)}function displayResultCount(a,b,c,d){const f=document.getElementById('results-container'),g=`
    <div class="row">
      <h4 id="search-results">Results for <strong>"${a}"</strong>, showing <span id="start-value">${c}</span> - <span id="end-value">${d}</span> out of ${b}</h4>       
    </div>
  `;clearContent(f),addContent(f,g),sessionStorage.setItem('resultMessage',JSON.stringify(f.innerHTML))}function addContent(a,b){a.innerHTML+=b}function clearContent(a){a.innerHTML=''}function addNextButton(a,b){const c=document.getElementById('page-navigation');clearContent(c);const d=generateButton('next');addContent(c,d);const f=document.getElementById('next-btn');f.addEventListener('click',()=>{generateButtons(a,b)})}function generateButtons(a,b){const c=document.getElementById('page-navigation');let d=+document.getElementById('start-value').innerHTML,f=+document.getElementById('end-value').innerHTML;if(f+=50,f>a){d=50,f=a,newBeerCards(a,b,d,f);const g=generateButton('back');addContent(c,g);const h=buttonCalculations('back',d,f,a),j=document.getElementById('prev-btn');j.addEventListener('click',()=>{d=h.startValue,f=h.endValue,newBeerCards(a,b,d,f),clearContent(c);const k=generateButton('next');addContent(c,k);const l=document.getElementById('next-btn');l.addEventListener('click',()=>{generateButtons(a,b)})})}else d=51,f=100,newBeerCards(a,b,d,f),generateOtherButtons(a,b);sessionStorage.setItem('navigationButtons',JSON.stringify(c.innerHTML))}function generateOtherButtons(a,b){const c=document.getElementById('page-navigation');let g,d=+document.getElementById('start-value').innerHTML,f=+document.getElementById('end-value').innerHTML;if(clearContent(c),1!=d){let k=generateButton('back');addContent(c,k)}f!==a&&(g=generateButton('next'),addContent(c,g));const h=document.getElementById('prev-btn');h&&h.addEventListener('click',()=>{const k=buttonCalculations('back',d,f,a);d=k.startValue,f=k.endValue,newBeerCards(a,b,d,f),generateOtherButtons(a,b)});const j=document.getElementById('next-btn');j&&j.addEventListener('click',()=>{const k=buttonCalculations('next',d,f,a);d=k.startValue,f=k.endValue,newBeerCards(a,b,d,f),generateOtherButtons(a,b)}),sessionStorage.setItem('navigationButtons',JSON.stringify(c.innerHTML))}function buttonCalculations(a,b,c,d){return'next'===a?(b+=50,c+=50,c>d&&(c=d)):(c-=50,50>c&&(c=50),b-=50,1>b&&(b=1)),{endValue:c,startValue:b}}async function newBeerCards(a,b,c,d){const f=document.forms.searchForm,g=document.getElementById('beer-container'),h=b.slice(c,d);displayResultCount(f.q.value,a,c,d),clearContent(g),await h.forEach(async j=>{const k=await generateBeerCard(j);await displayBeer(k)}),window.scrollTo(0,50)}function generateButton(a){let b;return b='back'===a?`<a class="waves-effect waves-light btn" id="prev-btn">Previous</button>`:`<a class="waves-effect waves-light btn right" id="next-btn">Next</button>`,b}checkSessionStorage(),setSearchButtonsListeners(),setFilterButtonsListeners(),setSearchformListeners();