const apiKye = 'PutYourApiKeyHere';
const BaseURL = 'https://api.themoviedb.org/3/';
// const GetMovieVideo = `https://api.themoviedb.org/3/movie/631842/videos?api_key=${apiKye}&language=en-US`;

const $burger = document.getElementsByClassName('burger')[0];
const $options = document.getElementsByClassName('options')[0];
const $LinksInOptions = document.querySelectorAll('.options > div');


const GetMovieVideo = `https://api.themoviedb.org/3/movie/PlaceMovieIdHere/videos?api_key=${apiKye}&language=en-US`;
const mainContainr = document.getElementsByClassName('main-container')[0];
const $VideoContainr = document.getElementsByClassName('video')[0];
const navbar = document.getElementsByClassName('container')[0];
const $logo = document.getElementsByClassName('logo')[0];
const $loader = document.getElementsByClassName('ContainerForLoader')[0];
var CardOrLogoClicked = false;

var page = 1;
var url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKye}&language=en-us&page=PutTheNoOfPageHere`;

const urls = new function () {
    this.zlanguage = `en-us`,
        this.home = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKye}&language=${this.zlanguage}&page=PutTheNoOfPageHere`,
        this.popular = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKye}&language=${this.zlanguage}&page=PutTheNoOfPageHere`,
        this.upcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKye}&language=${this.zlanguage}&page=PutTheNoOfPageHere`
}

// Start of code to show movie when clicked on card div
mainContainr.onclick = async (e) => {
    if (e.target.closest(`[data-movieId]`) === null) {
        return;
    }
    CardOrLogoClicked = true;
    var Id = e.target.closest(`[data-movieId]`);
    var URLToGetMovies = GetMovieVideo.replace('PlaceMovieIdHere', `${Id.dataset.movieid}`);
    URLToGetMovies = URLToGetMovies.replace(/language=en-US/, `language=${urls.zlanguage}`);
    await axios.get(URLToGetMovies)
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
    if (e.target.matches('[data-Language]')) {
        document.querySelector('.dropDownButton > .text').innerText = e.target.innerText;
        urls.zlanguage = `${e.target.dataset.language}`;
        page = 1;
    }
    else if (e.target.matches('[data-links]')) {
        url = urls[e.target.dataset.links];
        page = 1;
    }
    //start of code to redirect user back to list of movies when user click on logo
    else if (e.target.matches('[data-logo]')) {
        mainContainr.style.display = 'grid';
        $VideoContainr.innerHTML = ``;
        $VideoContainr.style.display = "none";
        CardOrLogoClicked = true;
        return;
    }
    //End of code to redirect user back to list of movies when user click on logo
    else {
        return;
    }
    url = url.replace(/language=.*(?=&page)/, `language=${urls.zlanguage}`);
    mainContainr.innerHTML = ``;
    createHTML(url.replace(/PutTheNoOfPageHere/, `${page}`));
}
//End of Code that is triger when we click anywhere on Navbar


window.onload = () => {
    createHTML();
}

// Start of Function to create cards
async function createHTML(url = urls.home.replace(/PutTheNoOfPageHere/, `${page}`)) {
    $loader.style.display = 'flex';
    await axios.get(url)
        .then((result) => {
            result.data.results.forEach(element => {
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
            });
        });
    $loader.style.display = 'none';
}
// End of Function to create cards



// Code for infinite scroll

window.addEventListener('scroll', () => {
    if (CardOrLogoClicked === true) {
        CardOrLogoClicked === false;
        return;
    }

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
        }
        else {
            value.style.animation = `LinksInOptionsAnimation 0.5s ease forwards ${index / 5 + 0.5}s`;
        }
    })
}

