import { Renderer } from "./renderer";

export abstract class FftRenderer extends Renderer {
    public abstract renderFrame(fftData: Uint8Array, canvasCtx: CanvasRenderingContext2D): void;
}