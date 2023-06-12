const fftSize = 128;

export class Renderer {
    private frameRate: number = 60;

    constructor(private audio: AudioBuffer, private canvas: HTMLCanvasElement) {
    }

    public async start(frameRate: number = 30) {
        this.frameRate = frameRate;

        const { length, sampleRate } = this.audio;
        const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
        const audioBufferSourceNode = new AudioBufferSourceNode(offlineAudioContext, { buffer: this.audio });
        const analyserNode = new AnalyserNode(offlineAudioContext, { fftSize });

        audioBufferSourceNode.connect(analyserNode);
        audioBufferSourceNode.start();

        const renderQuantumInSeconds = 1 / this.frameRate;
        const durationInSeconds = length / sampleRate;
        const byteFrequencyData = new Uint8Array(analyserNode.frequencyBinCount);

        const analyze = (index: number) => {
            const suspendTime = renderQuantumInSeconds * index;

            if (suspendTime < durationInSeconds) {
                offlineAudioContext.suspend(suspendTime).then(() => {
                    analyserNode.getByteFrequencyData(byteFrequencyData);

                    // do something with byteFrequencyData in here ...
                    this.renderFrame(byteFrequencyData);

                    analyze(index + 1);
                });
            }

            if (index === 1) {
                offlineAudioContext.startRendering();
            } else {
                offlineAudioContext.resume();
            }
        };

        analyze(1);
    }

    public renderFrame(fftData: Uint8Array) {
        requestAnimationFrame(() => {
            const canvasCtx = this.canvas.getContext("2d");
            if (canvasCtx) {
                canvasCtx.fillStyle = "rgb(0, 0, 0)";
                canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = "rgb(255, 255, 255)";

                canvasCtx.beginPath();

                const sliceWidth = (this.canvas.width * 1.0) / fftData.length;
                let x = 0;

                for (let i = 0; i < fftData.length; i++) {
                    const v = fftData[i] / 128.0;
                    const y = (v * this.canvas.height) / 2;

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
                canvasCtx.stroke();

            }

        })
    }
}