const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    // title, image
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top"
              alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle ="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-show-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}
// 載入電影的數量 (amount = 數量)
// math.ceil(數字) => 讓數字無條件進位
function renderPaginator(amount){
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 0 ; page < numberOfPages ; page++ ){
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page=${page + 1}>${page + 1}</a></li>
    `    
  }
  paginator.innerHTML = rawHTML

}

// page -> 
function getMoviesByPage(page){
  const data = filteredMovies.length ? filteredMovies : movies
  // 以上那句是指 如果filteredMovies是有長度(也就是有東西的話),那就給我賦值為filterMovies;如果沒有的話就給我movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    // response.data.results
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `
      <img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fuid">
    `
  })
}

function addToFavorite(id) {
  function isMovieIdMatched(movie) {
    return movie.id === id
  }
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find(isMovieIdMatched)

  // movie 部分如果是箭頭函式的話寫成
  // const movie = movies.find((movie) => movie.id === id)
  if (list.some(isMovieIdMatched)){
    return alert("這部已經加過了喔")
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-show-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event){
  if(event.target.tagName !== 'A') return
  // 上一句的意思是 如果點擊的目標不是<a></a> , 就不執行這行程式
  // tagName 就是指標籤
  else {
    const page = Number(event.target.dataset.page)
    renderMovieList(getMoviesByPage(page))
  }
})


searchForm.addEventListener('submit', function onSearchFormSubmited(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  // if (!keyword.length) {
  //   return alert('Please enter a valid string')
  // }

  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie)
    }
  }

  if (filteredMovies.length === 0) {
    return alert('The movie cannot find')
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

axios.get(INDEX_URL).then(response => {
  // Array(80)
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
})

// 在加上新的功能時,其實會很容易讓前面的功能出現異常(例如卡bug)
// 所以寫完一個新功能之後,要回去檢查一下舊的項目,然後盡量讓function維持單一的作用
// 以降低function的複雜性

// 第一次跟著寫的檔案

// 有很多不會的地方

// 漢宇加油!!!