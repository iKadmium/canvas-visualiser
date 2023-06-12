import { Renderer } from "./renderer";

let renderer: Renderer;

document.addEventListener('DOMContentLoaded', (_ev) => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
  const input = document.querySelector<HTMLInputElement>('#fileInput');
  const startButton = document.querySelector<HTMLButtonElement>('#start');

  const audioElement = document.createElement('audio');
  let audioFile: File | undefined;

  if (!startButton || !input || !canvas) {
    throw new Error('could not find some elements')
  }

  input.addEventListener('change', (_ev) => {
    if (input.value && input.files && input.files.length == 1) {
      const file = input.files[0];
      const canPlay = audioElement.canPlayType(file.type);
      if(canPlay === 'maybe' || canPlay === 'probably'){
        audioFile = file;
      }
    } else {
      audioFile = undefined;
    }
    startButton.disabled = !audioFile;
  })

  startButton.addEventListener('click', async (_ev) => {
    if(audioFile){
      const buffer = await audioFile.arrayBuffer();
      const tempContext = new AudioContext();
      const data = await tempContext.decodeAudioData(buffer);
      
      renderer = new Renderer(data, canvas);
      renderer.start();
    }
  })
})