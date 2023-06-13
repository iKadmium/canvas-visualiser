import { Renderer } from "./renderer";

export class LineRenderer extends Renderer {
    public renderFrame(fftData: Uint8Array, canvasCtx: CanvasRenderingContext2D) {
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(255, 255, 255)";

        canvasCtx.beginPath();

        const sliceWidth = this.width / fftData.length * 2;
        let x = this.x0;

        for (let i = 0; i < fftData.length / 2; i++) {
            const v = fftData[i] / 255;
            const y = this.yCenter + ((v - 0.5) * this.height * -1);

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.stroke();
    }
}
