import { Renderer } from "./renderer";

export class PolarLineRenderer extends Renderer {
    public renderFrame(fftData: Uint8Array, canvasCtx: CanvasRenderingContext2D) {
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(255, 255, 255)";
        const radius = this.width > this.height ? this.width / 2 : this.height / 2;

        canvasCtx.beginPath();
        const goodFftLength = fftData.length / 2;

        for (let i = 0; i < goodFftLength; i++) {
            const asin = Math.sin((i / goodFftLength) * Math.PI * 2);
            const acos = Math.cos((i / goodFftLength) * Math.PI * 2);
            const v = fftData[i] / 255;

            const x = this.xCenter + (asin * ((radius / 4) + (v * radius / 4)));
            const y = this.yCenter + (acos * ((radius / 4) + (v * radius / 4)));

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        }

        canvasCtx.stroke();
    }
}
