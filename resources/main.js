
//@ts-check

const vscode = acquireVsCodeApi();   
let soundOn = false;

const soundButton = (document.getElementById('sound-button'));

if(soundButton) {
    soundButton.innerHTML = `<span class="codicon codicon-${ soundOn ? 'mute':'unmute'}"></span>`;
    soundButton.addEventListener('click', event => {
        soundOn = !soundOn;
        soundButton.title = `${ soundOn ? 'Mute':'Unmute'}`;
        soundButton.innerHTML = `<span class="codicon codicon-${ soundOn ? 'mute':'unmute'}"></span>`;
        audioQuack();
    })
}

const quackGptButton = (document.getElementById('quackgpt-button'));

if(quackGptButton) {
    quackGptButton.addEventListener('click', event => {
        let _quackGptInput = vscode.postMessage({ message: 'askQuackGPT' })
    })
}

window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    console.log(message);
    switch (message.type) {
        case 'audioQuack':
            {
                audioQuack();
                break;
            }
    }
});

function audioQuack() {
    if (!soundOn) {
        return;
    }

    const audio = document.querySelector('audio');
    if(audio) {
        audio.play();
    }
}

