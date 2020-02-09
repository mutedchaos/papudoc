if (document.location.search.includes('refresh')) {


  let last = ''
  setInterval(async function () {
    const res = await fetch(document.location.href)
    const text = await res.text()
    if (last !== text) {
      last = text
      document.body.innerHTML = text
      highlightNavPosition()
    }

  }, 500)
}

window.addEventListener('scroll', highlightNavPosition)
window.addEventListener('domcontentloaded', highlightNavPosition)

function highlightNavPosition() {
  const scrollTop = document.body.scrollTop
  const headings = document.querySelectorAll('h2')
  const headingsAboveWatershed = [...headings].filter(heading =>
    heading.offsetTop < window.innerHeight / 2 + scrollTop
  )
  const heading = headingsAboveWatershed.length ? headingsAboveWatershed[headingsAboveWatershed.length - 1] : headings[0]

  const links = document.querySelectorAll('#navbar a')
  links.forEach(function (link) {
    if (link.getAttribute('href').substring(1) === heading.getAttribute('data-anchor')) {
      link.classList.add('selected')
    } else {
      link.classList.remove('selected')
    }
  })
}