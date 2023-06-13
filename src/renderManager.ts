import { FftRenderer } from "./fftRenderer";

const fftSize = 2048;

export class RenderManager {
    private frameRate: number = 60;
    private renderQuantumInSeconds: number;
    private durationInSeconds: number;
    private byteFrequencyData: Uint8Array;
    private offlineAudioContext: OfflineAudioContext;
    private analyserNode: AnalyserNode;
    private chunks: Blob[];

    constructor(private audio: AudioBuffer, protected canvas: HTMLCanvasElement, private progressBar: HTMLProgressElement, private renderers: FftRenderer[]) {
        const { length, sampleRate } = this.audio;
        this.offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
        const audioBufferSourceNode = new AudioBufferSourceNode(this.offlineAudioContext, { buffer: this.audio });
        this.analyserNode = new AnalyserNode(this.offlineAudioContext, { fftSize });
        audioBufferSourceNode.connect(this.analyserNode);
        audioBufferSourceNode.start();
        this.durationInSeconds = length / sampleRate;
        this.byteFrequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.renderQuantumInSeconds = 1 / this.frameRate;
        this.chunks = [];

        this.progressBar.max = this.durationInSeconds;
    }

    public start() {
        this.chunks = [];
        const promise = new Promise<Blob[]>((resolve) => {
            this.offlineAudioContext.addEventListener('complete', (_ev) => {
                resolve(this.chunks);
            });
        })
        this.analyze(1);
        return promise;
    }

    public analyze(index: number) {
        const suspendTime = this.renderQuantumInSeconds * index;

        if (suspendTime < this.durationInSeconds) {
            this.offlineAudioContext.suspend(suspendTime).then(() => {
                this.analyserNode.getByteFrequencyData(this.byteFrequencyData);

                const context = this.canvas.getContext('2d', { willReadFrequently: true });
                if (context) {
                    for (const renderer of this.renderers) {
                        renderer.clear(context);
                        renderer.renderFrame(this.byteFrequencyData, context);
                    }
                }
                this.canvas.toBlob((cb) => {
                    if (cb) {
                        this.chunks.push(cb);
                    }
                    this.updateProgressBar(suspendTime);
                    this.analyze(index + 1);
                })
            });
        }

        if (index === 1) {
            this.offlineAudioContext.startRendering();
        } else {
            this.offlineAudioContext.resume();
        }
    }

    private updateProgressBar(time: number): void {
        this.progressBar.value = time;
    }
}