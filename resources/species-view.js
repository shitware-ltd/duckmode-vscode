
//@ts-check
// This code is loaded within the SpeciesView webview, and because of the
// context isolation it needs to be in this explictly loaded file.

const vscode = acquireVsCodeApi();
let soundOn = false;

const soundButton = (document.getElementById('sound-button'));

if(soundButton) {
  soundButton.innerHTML = `<span class="codicon codicon-${ soundOn ? 'mute':'unmute'}"></span>`;
  soundButton.addEventListener('click', event => {
    soundOn = !soundOn;
    soundButton.title = `${ soundOn ? 'Mute':'Unmute'}`;
    soundButton.innerHTML = `<span class="codicon codicon-${ soundOn ? 'mute':'unmute'}"></span>`;
    playSound('audio-quack');
  })
}

const quackGptButton = (document.getElementById('quackgpt-button'));

if (quackGptButton) {
  quackGptButton.addEventListener('click', event => {
      let _quackGptInput = vscode.postMessage({ message: 'askQuackGPT' })
  })
}

window.addEventListener('message', event => {
  const message = event.data;
  switch (message.type) {
    case 'audio':
      playSound(message.domElementId);
      break;
  }
});

/**
 * @param {string} [domElementId]
 */
function playSound(domElementId) {

  if (!soundOn || !domElementId) {
    return;
  }

  const audio = document.getElementById(domElementId);
  if (audio && audio instanceof HTMLAudioElement) {
    audio.play();
  }
}

