import { BarRenderer } from "./barRenderer";
import { RenderManager } from "./renderManager";
import * as JsZip from 'jszip';

let renderManager: RenderManager;

document.addEventListener('DOMContentLoaded', (_ev) => {
	const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
	const input = document.querySelector<HTMLInputElement>('#fileInput');
	const startButton = document.querySelector<HTMLButtonElement>('#start');
	const progressBar = document.querySelector<HTMLProgressElement>('#progress');

	const audioElement = document.createElement('audio');
	let audioFile: File | undefined;

	if (!startButton || !input || !canvas || !progressBar) {
		throw new Error('could not find some elements')
	}

	input.addEventListener('change', (_ev) => {
		if (input.value && input.files && input.files.length == 1) {
			const file = input.files[0];
			const canPlay = audioElement.canPlayType(file.type);
			if (canPlay === 'maybe' || canPlay === 'probably') {
				audioFile = file;
			}
		} else {
			audioFile = undefined;
		}
		startButton.disabled = !audioFile;
	})

	startButton.addEventListener('click', async (_ev) => {
		if (audioFile) {
			startButton.disabled = true;
			const buffer = await audioFile.arrayBuffer();
			const tempContext = new AudioContext();
			const data = await tempContext.decodeAudioData(buffer);

			const renderers = [
				// new BarRenderer(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height),
				// new LineRenderer(0, canvas.height / 2, canvas.width / 2, canvas.height),
				// new PolarLineRenderer(canvas.width / 2, 0, canvas.width, canvas.height / 2)
				new BarRenderer(0, 0, canvas.width, canvas.height),
			];
			renderManager = new RenderManager(data, canvas, progressBar, renderers);
			const blobs = await renderManager.start();
			startButton.disabled = false;

			const zip = new JsZip();
			let index = 0;

			for (const blob of blobs) {
				zip.file(`frame${index}.png`, blob);
				index++;
			}
			const output = await zip.generateAsync({ type: 'blob' });
			const blobUrl = URL.createObjectURL(output);
			const link = document.createElement("a"); // Or maybe get it from the current document
			link.href = blobUrl;
			link.download = "file.zip";
			link.innerHTML = "Click here to download the file";
			document.body.appendChild(link); // Or append it whereever you want
			link.click();
		}
	})
})