import { Renderer } from "./renderer";

const fftSize = 128;

export class RenderManager {
    private frameRate: number = 60;
    private renderQuantumInSeconds: number;
    private durationInSeconds: number;
    private byteFrequencyData: Uint8Array;
    private offlineAudioContext: OfflineAudioContext;
    private analyserNode: AnalyserNode;

    constructor(private audio: AudioBuffer, protected canvas: HTMLCanvasElement, private progressBar: HTMLProgressElement, private renderers: Renderer[]) {
        const { length, sampleRate } = this.audio;
        this.offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
        const audioBufferSourceNode = new AudioBufferSourceNode(this.offlineAudioContext, { buffer: this.audio });
        this.analyserNode = new AnalyserNode(this.offlineAudioContext, { fftSize });
        audioBufferSourceNode.connect(this.analyserNode);
        audioBufferSourceNode.start();
        this.durationInSeconds = length / sampleRate;
        this.byteFrequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.renderQuantumInSeconds = 1 / this.frameRate;

        this.progressBar.max = this.durationInSeconds;
    }

    public start() {
        const stream = this.canvas.captureStream(0);
        const recorder = new MediaRecorder(stream);
        this.offlineAudioContext.addEventListener('complete', (_ev) => {
            recorder.stop();
        });
        const promise = new Promise<Blob>((resolve) => {
            recorder.addEventListener('dataavailable', (ev) => {
                console.log('chunk');
                resolve(ev.data);
            })

        })
        recorder.start();
        this.analyze(1, stream);
        return promise;
    }

    public analyze(index: number, stream: MediaStream) {
        const suspendTime = this.renderQuantumInSeconds * index;

        if (suspendTime < this.durationInSeconds) {
            this.offlineAudioContext.suspend(suspendTime).then(() => {
                this.analyserNode.getByteFrequencyData(this.byteFrequencyData);

                requestAnimationFrame(() => {
                    const context = this.canvas.getContext('2d');
                    if (context) {
                        context.fillStyle = "rgb(0, 0, 0)";
                        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        for (const renderer of this.renderers) {
                            renderer.renderFrame(this.byteFrequencyData, context);
                        }
                    }
                    const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
                    track.requestFrame();
                    this.updateProgressBar(suspendTime);
                    this.analyze(index + 1, stream);

                });
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