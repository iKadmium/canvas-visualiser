import { Renderer } from "./renderer";

const radius = 16;
const speed = 2;

export class SpectrumRenderer extends Renderer {
    public renderFrame(fftData: Uint8Array, canvasCtx: CanvasRenderingContext2D) {
        canvasCtx.fillStyle = 'white';

        const dataAverage = fftData.reduce((prev, current) => prev += current) / fftData.length;
        const v = dataAverage / 255.0;
        const height = this.height * v; 
        canvasCtx.beginPath();
        canvasCtx.arc(this.xCenter, this.y1 - height - radius, radius, 0, 2 * Math.PI);
        canvasCtx.fill();
    }

    public clear(context: CanvasRenderingContext2D): void {
        const data = context.getImageData(this.x0 + speed, this.y0, this.width - speed, this.height);
        context.putImageData(data, this.x0, this.y0);
        context.fillStyle = 'rgba(0,0,0,5%)'
        context.fillRect(this.x0, this.y0, this.width, this.height);
    }
}
