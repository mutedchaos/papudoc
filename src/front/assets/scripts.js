if (document.location.search.includes('refresh')) {


  let last = ''
  setInterval(async function () {
    const res = await fetch(document.location.href)
    const text = await res.text()
    if (last !== text) {
      last = text
      document.body.innerHTML = text
    }

  }, 500)
}