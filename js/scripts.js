const menu_button = document.getElementById('menu_button')
const menu = document.getElementById('menu')
const shortener = document.getElementById('shortener')
const shorten = document.getElementById('shorten')
const url = document.getElementById('url')

function showHideMenu() {
  if (menu.style.maxHeight) {
    menu.style.maxHeight = null
  } else {
    menu.style.maxHeight = `${menu.scrollHeight}px`
  }
}

function showHideMenuContent() {
  if (menu.style.maxHeight) {
    menu.querySelector('.nav-items').style.opacity = '1'
  } else {
    menu.querySelector('.nav-items').style.opacity = '0'
  }
}

function shortenUrl(event) {
  event.preventDefault()
  const data = new FormData(shortener)
  const url = data.get('url').replace(/\s+/g, '')
  if (url.length > 0) {
    try {
      const validUrl = new URL(url).href
      //
    } catch {
      console.log('Formato de URL no válido')
    }
  } else {
    console.log ('Ingrese una URL')
  }
}

menu_button.addEventListener('click', showHideMenu)
menu.addEventListener('transitionend', showHideMenuContent)
shorten.addEventListener('click', shortenUrl)
