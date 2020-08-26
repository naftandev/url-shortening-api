// Variables
const breakpoint = window.matchMedia('only screen and (min-width: 1024px)')
const URL_API = 'https://rel.ink/api/links/'
const $menu_button = document.getElementById('menu_button')
const $menu = document.getElementById('menu')
const $shortener = document.getElementById('shortener')
const $shorten = document.getElementById('shorten')
const $shortenedUrlsContainer = document.getElementById('shortenedUrlsContainer')

// Render storage
function renderStorage() {
  const cards = localStorage.getItem('cards')
  if (cards) {
    const urls = JSON.parse(cards)
    urls.map(data => {
      renderShortenedUrl(data)
    })
  }
}

// Add to local storage
function addLocalStorage(hash, url, origin) {
  if (origin) {
    const cards = localStorage.getItem('cards')
    if(cards) {
      const urls = JSON.parse(cards)
      const check = urls.find(({hashid}) => hashid === hash)
      if (!check) {
        urls.push({hashid: hash, url})
        localStorage.setItem('cards', JSON.stringify(urls))
      }
    } else {
      const urls = []
      urls.push({hashid: hash, url})
      localStorage.setItem('cards', JSON.stringify(urls))
    }
  }
}

// POST URL
async function getShortenedUrl(url) {
  let headers = new Headers()
  headers.append("Content-Type", "application/json")
  let body = JSON.stringify({ url: `${url}` })
  let requestOptions = {
    method: 'POST',
    headers,
    body
  }
  const response = await fetch(URL_API, requestOptions)
  const data = await response.json()
  return data
}

// Check if URL Render exist
function checkRender(hashid) {
  const urlRenders = document.querySelectorAll('.url-container')
  if (urlRenders.length > 0) {
    for (let i = 0; i < urlRenders.length; i++) {
      const check = urlRenders[i].querySelector('.shortened-url').textContent.indexOf(hashid)
      if (check !== -1) {
        urlRenders[i].remove()
      }
    }
  }
}

// Create URL template
function template(hashid, url) {
  return(`
    <div class="url-container">
        <span class="original-url" title="${url}">${url}</span>
        <div class="separator separator--all"></div>
        <span class="shortened-url">https://rel.ink/${hashid}</span>
        <button class="button button--copy" type="button" title="Copy">Copy</button>
    </div>
  `)
}

// Render URL
function renderShortenedUrl(data, origin) {
  // Render shortened URL
  const { hashid: hash, url } = data
  const urlTemplate = template(hash, url)
  checkRender(hash)
  $shortenedUrlsContainer.insertAdjacentHTML('afterbegin', urlTemplate)
  // Copy shortened URL
  const urlRender = $shortenedUrlsContainer.firstElementChild
  urlRender.querySelector('.button--copy').addEventListener('click', () => {
    const textarea = document.createElement('textarea')
    textarea.readOnly = true
    textarea.style.position = 'absolute'
    textarea.style.left = '-500px'
    textarea.value = urlRender.querySelector('.shortened-url').textContent
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea);
    // Feedback copy
    if (urlRender.querySelector('.button--copy').classList.contains('copyOut')) {
      urlRender.querySelector('.button--copy').classList.remove('copyOut')
    }
    urlRender.querySelector('.button--copy').classList.add('copyIn')
    urlRender.querySelector('.button--copy').textContent = 'Copied!'
    urlRender.querySelector('.button--copy').disabled = true
    setTimeout(() => {
      if (urlRender.querySelector('.button--copy').classList.contains('copyIn')) {
        urlRender.querySelector('.button--copy').classList.remove('copyIn')
      }
      urlRender.querySelector('.button--copy').classList.add('copyOut')
      urlRender.querySelector('.button--copy').textContent = 'Copy'
      urlRender.querySelector('.button--copy').disabled = false
    }, 1500)
  })
  $shortener.querySelector('.loader').classList.add('hide')
  addLocalStorage(hash, url, origin)
}

// Get shortened url
async function getData(url, origin) {
  const data = await getShortenedUrl(url)
  renderShortenedUrl(data, origin)
}

// Get and ckeck user URL
function shortenUrl(event) {
  event.preventDefault()
  // Get user URL
  const data = new FormData($shortener)
  const url = data.get('url').replace(/\s+/g, '')
  if (url.length > 0) {
    // Check valid URL
    var expression = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
      $shortener.querySelector('.error').textContent = ''
      $shortener.querySelector('.input').classList.remove('error-input')
      $shortener.querySelector('.loader').classList.remove('hide')
      getData(url, 'new')
    } else {
      $shortener.querySelector('.error').textContent = 'Please enter a valid link'
      $shortener.querySelector('.input').classList.add('error-input')
    }
  } else {
    $shortener.querySelector('.error').textContent = 'Please enter a link'
    $shortener.querySelector('.input').classList.add('error-input')
  }
}

// Show and hide menu
function showHideMenu() {
  $menu.style.maxHeight ? $menu.style.maxHeight = null : $menu.style.maxHeight = `${$menu.scrollHeight}px`
  $menu.addEventListener('transitionend', showHideMenuContent)
}

// Show and hide menu content
function showHideMenuContent() {
  $menu.style.maxHeight ? $menu.querySelector('.nav-items').style.opacity = '1' : $menu.querySelector('.nav-items').style.opacity = '0'
  $menu.removeEventListener('transitionend', showHideMenuContent)
}

// Check display size for menu design
function responsive(event) {
  if (event.matches) {
    $menu.querySelector('.nav-items').style.opacity = '1'
    $menu.style.maxHeight = null
    $menu_button.removeEventListener('click', showHideMenu)
  } else {
    $menu.querySelector('.nav-items').style.opacity = '0'
    $menu_button.addEventListener('click', showHideMenu)
  }
}

// Add events
$shorten.addEventListener('click', shortenUrl)
breakpoint.addEventListener('change', responsive)

responsive(breakpoint)
renderStorage()
