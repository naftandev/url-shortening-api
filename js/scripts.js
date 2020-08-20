const $menu_button = document.getElementById('menu_button')
const $menu = document.getElementById('menu')
const $shortener = document.getElementById('shortener')
const $shorten = document.getElementById('shorten')
const $shortenedUrlsContainer = document.getElementById('shortenedUrlsContainer')
const URL_API = 'https://rel.ink/api/links/'

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

function showHideMenu() {
  $menu.style.maxHeight ? $menu.style.maxHeight = null : $menu.style.maxHeight = `${$menu.scrollHeight}px`
}

function showHideMenuContent() {
  $menu.style.maxHeight ? $menu.querySelector('.nav-items').style.opacity = '1' : $menu.querySelector('.nav-items').style.opacity = '0'
}

function checkRender(hash) {
  const urlRenders = document.querySelectorAll('.url-container')
  if (urlRenders.length > 0) {
    for (let i = 0; i < urlRenders.length; i++) {
      const check = urlRenders[i].querySelector('.shortened-url').textContent.indexOf(hash)
      if (check !== -1) {
        urlRenders[i].remove()
      }
    }
  }
}

function template(hash, original, date) {
  return(`
    <div class="url-container">
        <span class="original-url">${original}</span>
        <div class="separator separator--all"></div>
        <div class="shortened-url-wrapper">
            <span class="shortened-url">https://rel.ink/${hash}</span>
            <button class="button button--copy" type="button" title="Copy">Copy</button>
        </div>
    </div>
  `)
}

async function renderShortenedUrl(url) {
  // Render shortened URL
  const data = await getShortenedUrl(url)
  const { hashid: hash, url: original, created_at: date } = data
  const urlTemplate = template(hash, original, date)
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
}

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
      renderShortenedUrl(url)
    } else {
      $shortener.querySelector('.error').textContent = 'Please enter a valid link'
      $shortener.querySelector('.input').classList.add('error-input')
    }
  } else {
    $shortener.querySelector('.error').textContent = 'Please enter a link'
    $shortener.querySelector('.input').classList.add('error-input')
  }
}

$menu_button.addEventListener('click', showHideMenu)
$menu.addEventListener('transitionend', showHideMenuContent)
$shorten.addEventListener('click', shortenUrl)
