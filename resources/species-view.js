
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
    vscode.postMessage({ message: 'toggleSound', state: soundOn })
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
  let catled = document.getElementById('catled');

  switch (message.type) {
    case 'audio':
      playSound(message.domElementId);
      break;
    case 'mia':
      if ( catled !== null) {
        catled.className = '';
      }
      vscode.postMessage({ message: 'invokeMia' })
      playSound(message.domElementId);
      break;
    case 'mia-stop':
      if ( catled !== null) {
        catled.className = 'hidden';
      }
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

