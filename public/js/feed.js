const socket=io.connect('/',{transports:['websocket']});socket.on('news',async function(c){const d=document.getElementById('user-session-id').href.split('/')[4],e=await fetch(`/users/${d}/following`,{method:'get',credentials:'same-origin'}),f=await e.json(),g=f.following.map(h=>{return h._id});if(-1<g.indexOf(c.user_id)){const h=document.getElementById('activity-list'),j=new Date(c.created);c.created=j.toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'numeric'}),c.beer_name=20<c.beer_name.length?`${c.beer_name.substring(0,20)}...`:c.beer_name;const k=generateFeedTypeHtml(c),l=`
    <div class="col s12 m12 l4">
      <div class="card feed-item pulse" tabindex="0">
        <div class="card-content" style="height: 150px;">
          <span class="card-title">
            <i class="material-icons va-middle">account_circle</i>
            <a href="/users/${c.user_id}" class="va-middle">${c.username}</a>
          </span>
          <p>
            ${k}
          </p>
        </div>
        <div class="card-action">
          <span>
            <i class="material-icons va-middle">schedule</i>
            <span class="va-middle">${c.created}</span>
          </span>
        </div>
      </div>
    </div>
    `;h.insertAdjacentHTML('afterbegin',l),addFeedItemsListeners(document.getElementsByClassName('feed-item')[0])}});async function getUsersOnline(){const c=document.getElementById('following-list'),d=document.getElementById('user-session-id').href.split('/')[4],e=document.getElementById('following-amount'),f=`/users/${d}/following`;try{const g=await fetch(f,{method:'get',credentials:'same-origin'}),h=await g.json();e.innerHTML=h.following.length,h.following.forEach(async i=>{c.innerHTML+=!0===i.status?`<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${i._id}">${i.username}</a></span>
          </li>`:`<li class="collection-item avatar follower-list">
            <img src="/images/user-placeholder.png" class="circle responsive-img">
            <span class="title follower-span"><a href="/users/${i._id}">${i.username}</a></span>
          </li>`})}catch(g){console.log(g)}}async function getUserFollowing(){const c=document.getElementById('user-session-id').href.split('/')[4],d=`/users/${c}/following`;try{const e=await fetch(d,{method:'get',credentials:'same-origin'}),f=await e.json(),g=f.following.map(h=>{return h._id});getFeed(g)}catch(e){console.log(e)}}async function getFeed(c){const d=document.getElementById('activity-list');try{const e=await fetch('/feed',{method:'get',credentials:'same-origin'}),f=await e.json();f.sort((g,h)=>{return new Date(h.created)-new Date(g.created)}),f.forEach(g=>{const i=new Date(g.created);if(g.created=i.toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'numeric'}),g.beer_name=20<g.beer_name.length?`${g.beer_name.substring(0,20)}...`:g.beer_name,-1<c.indexOf(g.user_id)){const j=generateFeedTypeHtml(g);d.innerHTML+=`
        <div class="col s12 m12 l4">
          <div class="card" tabindex="0">
            <div class="card-content" style="height: 150px;">
              <span class="card-title">
                <i class="material-icons va-middle">account_circle</i>
                <a href="/users/${g.user_id}" class="va-middle">${g.username}</a>
              </span>
              <p>
                ${j}
              </p>
              </div>
              <div class="card-action">
                <span>
                  <i class="material-icons va-middle">schedule</i>
                  <span class="va-middle">${g.created}</span>
                </span>
              </div>
            </div>
        </div>
        `}})}catch(e){console.log(e)}}function addFeedItemsListeners(c){c.addEventListener('mouseover',function(){this.classList.remove('pulse')}),c.addEventListener('focus',function(){this.classList.remove('pulse')})}function generateFeedTypeHtml(c){let d;switch(c.type){case'consumed':d=`
      <i class="material-icons va-middle" aria-hidden="true">local_drink</i> <span class="va-middle">${c.type}</span>
      <a href="/beers/${c.beer_id}" class="va-middle">${c.beer_name}</a>
      `;break;case'reviewed':d=`
    <i class="material-icons va-middle" aria-hidden="true">rate_review</i>
    <span class="va-middle">${c.type}</span>
    <a href="/beers/${c.beer_id}" class="va-middle">${c.beer_name}</a>
    `;break;case'uploaded':d=`
    <i class="material-icons va-middle" aria-hidden="true">insert_photo</i>
    <span class="va-middle">${c.type} photo of</span>
    <a href="/beers/${c.beer_id}" class="va-middle">${c.beer_name}</a>
    `;break;default:d=`
    <i class="material-icons va-middle" aria-hidden="true">star</i>
    <span class="va-middle">${c.type.split(' ')[0]}
      <a href="/beers/${c.beer_id}">${c.beer_name}</a>
      <span>${c.type.split(' ')[1]}</span>
    </span>
    `;}return d}(async()=>{await Promise.all([getUserFollowing(),getUsersOnline()])})();