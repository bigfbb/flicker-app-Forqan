const KEY = "1268fb4f19e35fcb49e9d0332f9ee970";
let carouselExampleIndicators = document.getElementById('carouselExampleIndicators')
const searchingDiv = document.querySelector('.searchingDiv');
searchingDiv.style.display = "none"
const carouselinner = document.querySelector('.carousel-inner');
const radio = document.querySelectorAll("input[type=radio]");
// const radion = document.querySelectorAll("input[x=150]");
const btn = document.getElementById("search");

btn.addEventListener("click", function () {
    removeImages();
    searchingDiv.style.display = "flex";
    animation.play();
    setMessage('');
    const input = getInputValues();
    const url = `https://www.flickr.com/services/rest/?api_key=${KEY}&method=flickr.photos.search&text=${input.term}&format=json&nojsoncallback=1&per_page=${input.number}&page=1`;
    fetch(url)
        .then(function (response) {
            searchingDiv.style.display = "none"
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                throw "Something went wrong. :( Try again!";
            }
        })
        .then(function (data) {
            console.log(data);
            const arrayOfPhotos = data.photos.photo;
            const h2 = document.querySelector("#message");
            h2.style.display = "none";
            for (let i = 0; i < input.number; i++) {
                const imgUrl = getImageUrl(arrayOfPhotos[i], input.size);
                //  console.log(arrayOfPhotos[i]);
                //  displayImg(imgUrl, input.size);
                let dive = document.createElement('div');
                dive.classList.add('carousel-item');
                carouselinner.appendChild(dive);
                let image = document.createElement('img');
                image.classList.add('d-block', 'w-100');
                dive.appendChild(image);
                image.src = imgUrl;
                if (i === 0) {
                    dive.classList.add('active');

                }
            }
            if (input.size === "m") {
                carouselExampleIndicators.style.width = "10rem";
            } else if (input.size === "z") {
                carouselExampleIndicators.style.width = "58rem";
            } else {
                carouselExampleIndicators.style.width = "90%";
            }
        })

        .catch(function (error) {
            console.log(error);
            setMessage("Something went wrong. :( Try again!");
        });
});

function getInputValues() {
    const inputValues = {};
    inputValues.term = document.getElementById("search_term").value;
    inputValues.number = document.getElementById("search_number").value;

    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked === true) {
            inputValues.size = radio[i].value;
            inputValues.x = radio[i].getAttribute('data-x');
            console.log(inputValues)
            break;
        }
    }
    return inputValues;
}
function removeImages() {
    const imgs = document.querySelectorAll(".carousel-inner *");
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].remove();
    }
}

function getImageUrl(photoObject, size) {
    const imgUrl = `https://live.staticflickr.com/${photoObject.server}/${photoObject.id}_${photoObject.secret}_${size}.jpg`;
    return imgUrl;
}


function setMessage(message) {
    const h2 = document.querySelector("#message");
    h2.style.display = "block";
    h2.innerText = message;
}

const animation = anime({
    targets: '.searchingDiv div',
    translateX: [300, 400],
    delay: anime.stagger(50, { from: 'center' }),
    loop: true
});

