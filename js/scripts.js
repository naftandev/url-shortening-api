const $menu_button = document.getElementById('menu_button')
const $menu = document.getElementById('menu')
const $shortener = document.getElementById('shortener')
const $shorten = document.getElementById('shorten')
const $shortenedUrlsContainer = document.getElementById('shortenedUrlsContainer')
const URL_API = 'https://rel.ink/api/links/'

function showHideMenu() {
  if ($menu.style.maxHeight) {
    $menu.style.maxHeight = null
  } else {
    $menu.style.maxHeight = `${$menu.scrollHeight}px`
  }
}

function showHideMenuContent() {
  if ($menu.style.maxHeight) {
    $menu.querySelector('.nav-items').style.opacity = '1'
  } else {
    $menu.querySelector('.nav-items').style.opacity = '0'
  }
}

function template(hash, original, date) {
  return(`
    <div class="url-container">
        <span class="original-url">${original}</span>
        <div class="separator separator--all"></div>
        <div class="shortened-url">
            <span>https://rel.ink/${hash}</span>
            <button id="copy" class="button button--copy" type="button" title="Copy">Copy</button>
        </div>
    </div>
  `)
}

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
  const { hashid: hash, url: original, created_at: date } = data
  const urlTemplate = template(hash, original, date)
  $shortenedUrlsContainer.insertAdjacentHTML('afterbegin', urlTemplate)
}

function shortenUrl(event) {
  event.preventDefault()
  const data = new FormData($shortener)
  const url = data.get('url').replace(/\s+/g, '')
  if (url.length > 0) {
    var expression = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
      $shortener.querySelector('.error').textContent = ''
      $shortener.querySelector('.input').classList.remove('error-label')
      getShortenedUrl(url)
    } else {
      $shortener.querySelector('.error').textContent = 'Please enter a valid link'
      $shortener.querySelector('.input').classList.add('error-label')
    }
  } else {
    $shortener.querySelector('.error').textContent = 'Please enter a link'
    $shortener.querySelector('.input').classList.add('error-label')
  }
}

$menu_button.addEventListener('click', showHideMenu)
$menu.addEventListener('transitionend', showHideMenuContent)
$shorten.addEventListener('click', shortenUrl)
