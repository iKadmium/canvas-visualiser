import { Renderer } from "./renderer";
const barCount = 33;

export class ProgressBarRenderer extends Renderer {
    public renderFrame(canvasCtx: CanvasRenderingContext2D) {
        const gradient = canvasCtx.createLinearGradient(this.x0, this.yCenter, this.x1, this.yCenter);
        gradient.addColorStop(0, "hsl(0 0% 25%)");
        gradient.addColorStop(0.5, "white");
        gradient.addColorStop(1, "hsl(0 0% 25%)");

        const sliceWidth = ((this.width) * 1.0) / barCount;
       
        canvasCtx.lineWidth = sliceWidth / 8;
        canvasCtx.lineCap = 'round';
        canvasCtx.strokeStyle = gradient;

        canvasCtx.beginPath();

        for (let i = 0; i < barCount; i++) {
            const yLength = this.height * 0.25 * this.getTickLength(i);
            canvasCtx.moveTo(this.x0 + sliceWidth * i + sliceWidth / 2, this.yCenter);
            canvasCtx.lineTo(this.x0 + sliceWidth * i + sliceWidth / 2, this.yCenter + yLength);
            canvasCtx.moveTo(this.x0 + sliceWidth * i + sliceWidth / 2, this.yCenter);
            canvasCtx.lineTo(this.x0 + sliceWidth * i + sliceWidth / 2, this.yCenter - yLength);
        }

        canvasCtx.stroke();
    }

    private getTickLength(index: number): number {
        if (index % 4 === 0) {
            return 1;
        } else if(index % 2 === 0) {
            return 0.5;
        } else {
            return 0.25;
        }
    }
}
