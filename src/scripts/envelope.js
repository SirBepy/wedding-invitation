export function initEnvelope() {
  const envelope = document.getElementById('envelope')
  const btnOpen = document.getElementById('open')
  const btnReset = document.getElementById('reset')

  function open() {
    envelope.classList.add('open')
    envelope.classList.remove('close')
  }

  function close() {
    envelope.classList.add('close')
    envelope.classList.remove('open')
  }

  envelope.addEventListener('click', open)
  btnOpen.addEventListener('click', open)
  btnReset.addEventListener('click', close)
}
