import { Renderer } from "./renderer";

const barCount = 16;

export class BarRenderer extends Renderer {
    public renderFrame(fftData: Uint8Array, canvasCtx: CanvasRenderingContext2D) {
        const gradient = canvasCtx.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(0.5, "white");
        gradient.addColorStop(1, "black");

        const sliceWidth = ((this.width) * 1.0) / barCount / 2;
        let x = sliceWidth / 2;

        canvasCtx.lineWidth = sliceWidth / 4;
        canvasCtx.lineCap = 'round';
        canvasCtx.strokeStyle = gradient;

        canvasCtx.beginPath();

        for (let i = 0; i < barCount; i++) {
            const fftPerBar = fftData.length / barCount;
            const slice = fftData.slice(i * fftPerBar, (i + 1) * fftPerBar - 1);
            const dataAverage = slice.reduce((prev, current) => prev += current) / fftPerBar;
            const v = dataAverage / 128.0;
            const yLength = (v * this.height) / 4;

            canvasCtx.moveTo(this.xCenter - x, this.y0 + this.height / 2 - yLength);
            canvasCtx.lineTo(this.xCenter - x, this.y0 + this.height / 2 + yLength);
            canvasCtx.moveTo(this.xCenter + x, this.y0 + this.height / 2 - yLength);
            canvasCtx.lineTo(this.xCenter + x, this.y0 + this.height / 2 + yLength);
            x += sliceWidth;
        }

        canvasCtx.stroke();
    }
}
