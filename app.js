const apiKye = ;
const BaseURL = 'https://api.themoviedb.org/3/';
// const GetMovieVideo = `https://api.themoviedb.org/3/movie/631842/videos?api_key=${apiKye}&language=en-US`;

const $burger = document.getElementsByClassName('burger')[0];
const $options = document.getElementsByClassName('options')[0];
const $LinksInOptions = document.querySelectorAll('.options > .optionsandlinksContainer > div');
const $searchBar = document.querySelectorAll('.options  > input');
const $ErrorMessageForSearch = document.getElementsByClassName('errorMessage')[0];


const GetMovieVideo = `https://api.themoviedb.org/3/movie/PlaceMovieIdHere/videos?api_key=${apiKye}&language=en-US`;
const mainContainr = document.getElementsByClassName('main-container')[0];
const $VideoContainr = document.getElementsByClassName('video')[0];
const navbar = document.getElementsByClassName('container')[0];
const $logo = document.getElementsByClassName('logo')[0];
const $loader = document.getElementsByClassName('ContainerForLoader')[0];
var CardOrLogoClicked = false;
var SerachIsErrorOut = false;
var page = 1;
var url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKye}&language=en-us&page=PutTheNoOfPageHere`;

const urls = new function () {
    this.zlanguage = `en-us`,
        this.home = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKye}&language=${this.zlanguage}&page=PutTheNoOfPageHere`,
        this.popular = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKye}&language=${this.zlanguage}&page=PutTheNoOfPageHere`,
        this.upcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKye}&language=${this.zlanguage}&page=PutTheNoOfPageHere`
}

// Start of code to show movie when clicked on card div
mainContainr.onclick =  (e) => {
    if (e.target.closest(`[data-movieId]`) === null) {
        return;
    }
    $searchBar[0].setAttribute('disabled',true);
    CardOrLogoClicked = true;
    var Id = e.target.closest(`[data-movieId]`);
    var URLToGetMovies = GetMovieVideo.replace('PlaceMovieIdHere', `${Id.dataset.movieid}`);
    URLToGetMovies = URLToGetMovies.replace(/language=en-US/, `language=${urls.zlanguage}`);
     axios.get(URLToGetMovies)
        .then(result => {
            var VideoLink = result.data.results.find(GetVideoLinkI);
            ShowVideo(VideoLink.key);
        })
        .catch(err => {
            var selectedlanguage = document.querySelector('.dropDownButton > .text').innerText;
            $VideoContainr.innerHTML = `For selected movie there is no trailer available in ${selectedlanguage} language, Please select any other language.`;
            $VideoContainr.style.display = "flex";
            mainContainr.style.display = 'none';
        });

}

function GetVideoLinkI(element) {
    return element.type === "Trailer";
}

function ShowVideo(VideoLink) {
    mainContainr.style.display = 'none';
    $VideoContainr.innerHTML = ``;
    var iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("src", "https://www.youtube.com/embed/" + VideoLink + "?rel=0&showinfo=0&autoplay=1");
    $VideoContainr.append(iframe);
    $VideoContainr.style.display = "block";
}
// End of code to show movie when clicked on card div

//Start of Code that is triger when we click anywhere on Navbar
navbar.onclick = (e) => {
    if(e.target.tagName === "INPUT"){
        return;
    }
    else if (e.target.matches('[data-Language]')) {
        document.querySelector('.dropDownButton > .text').innerText = e.target.innerText;
        urls.zlanguage = `${e.target.dataset.language}`;
        page = 1;
    }
    else if (e.target.matches('[data-links]')) {
        url = urls[e.target.dataset.links];
        page = 1;
    }
    //start of code to redirect user back to list of movies when user click on logo
    else if (e.target.matches('[data-logo]')  && SerachIsErrorOut === false) {
        mainContainr.style.display = 'grid';
        $VideoContainr.innerHTML = ``;
        $VideoContainr.style.display = "none";
        CardOrLogoClicked = true;
        $searchBar[0].removeAttribute('disabled');
        return;
    }
    //End of code to redirect user back to list of movies when user click on logo
    else {
        return;
    }
    $VideoContainr.innerHTML = ``;
    $VideoContainr.style.display = "none";
    $searchBar[0].removeAttribute('disabled');
    $ErrorMessageForSearch.style.display = 'none';
    mainContainr.style.display = 'grid';
    url = url.replace(/language=.*(?=&page)/, `language=${urls.zlanguage}`);
    mainContainr.innerHTML = ``;
    createHTML(url.replace(/PutTheNoOfPageHere/, `${page}`));
}
//End of Code that is triger when we click anywhere on Navbar

window.onload = () => {
    createHTML();
}

// Start of Function to create cards
function createHTML(url = urls.home.replace(/PutTheNoOfPageHere/, `${page}`)) {
    SerachIsErrorOut = false;
    $loader.style.display = 'flex';
     axios.get(url)
        .then((result) => {
            if (result.data.results.length === 0) {
                $ErrorMessageForSearch.style.display = 'flex';
                mainContainr.style.display = 'none';
                SerachIsErrorOut = true;
            }
            else{
                $ErrorMessageForSearch.style.display = 'none';
            }
            result.data.results.forEach(element => {
                console.log((element.original_title === 'All Ladies Do It')?element:null);
                console.log((element.adult === 'true')?element:null);
                if(element.adult === true){
                    console.log(element);
                    return;
                }
                var cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                cardDiv.setAttribute(`data-movieId`, element.id);

                var firstDiv = document.createElement('div');

                var h3 = document.createElement('h3');
                h3.textContent = element.title;
    
                var FirstPTag = document.createElement('p');
                FirstPTag.classList.add('release');
                FirstPTag.textContent = `Released: ${element.release_date}`;
                firstDiv.append(h3, FirstPTag);

                var imgDiv = document.createElement('div');
                imgDiv.classList.add('image');
                var img = document.createElement('img');
                img.setAttribute('src', (element.poster_path === null ? `./Images/Default_Image.png` :
                    `https://image.tmdb.org/t/p/w500/${element.poster_path}`));
                imgDiv.appendChild(img);
                cardDiv.append(firstDiv, imgDiv);


                cardDiv.innerHTML += `            
            <div class="card-footer">
                <div class="heart"><span style="font-size: 2rem;">&#10084;</span> <p id="heart-text">${element.vote_average}</p></div>
                <div class="view">
                     <div style="width:  2em;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M.2 10a11 11 0 0 1 19.6 0A11 11 0 0 1 .2 10zm9.8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg></div> 
                     <div id="view-text">${element.vote_count}</div>
                </div>
            </div>
        
        `;
                mainContainr.appendChild(cardDiv);
            })
        });
    $loader.style.display = 'none';
}
// End of Function to create cards


// Code for infinite scroll

window.addEventListener('scroll', () => {
    // if (CardOrLogoClicked === true) {
    //     // CardOrLogoClicked === false;
    //     // return;
    // }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        page = page + 1;
        createHTML(url.replace(/PutTheNoOfPageHere/, `${page}`));
    }
});

// JS for responsive designs
$burger.onclick = () => {
    $options.classList.toggle('optionsClicked');
    $burger.classList.toggle('burger-Clicked');
    $LinksInOptions.forEach((value, index) => {
        if (value.style.animation) {
            value.style.animation = '';
            $searchBar[0].style.animation = '';
        }
        else {
            if(index === 3){
                $searchBar[0].style.animation = `LinksInOptionsAnimation 0.5s ease forwards ${4 / 5 + 0.5}s`;    
            }
            value.style.animation = `LinksInOptionsAnimation 0.5s ease forwards ${index / 5 + 0.5}s`;
        }
    });
}

function search (text) {
    $ErrorMessageForSearch.style.display = 'none';
    mainContainr.style.display = 'grid';
    if(text === ''){
        mainContainr.innerHTML = ``;
        createHTML();
        return;
    }
    mainContainr.innerHTML = ``;
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKye}&query=${text}&language=${urls.zlanguage}&page=PutTheNoOfPageHere`;
    createHTML(url.replace(/PutTheNoOfPageHere/, `${page}`));
}


$searchBar[0].addEventListener('input', (e) => {
    updateDebounceText(e.target.value);
});

const updateDebounceText = debounce((text) => { 
    search(text);
});

function debounce(cb, delay = 2000){
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    }
}

