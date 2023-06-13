import { Renderer } from "./renderer";

export class PlayHeadRenderer extends Renderer {
    public renderFrame(canvasCtx: CanvasRenderingContext2D) {
        const radius = this.height > this.width ? this.width / 2 : this.height / 2;
        
        const gradient = canvasCtx.createLinearGradient(this.x0, this.yCenter, this.x1, this.yCenter);
        gradient.addColorStop(0, "hsl(0 0% 25%)");
        gradient.addColorStop(0.5, "white");
        gradient.addColorStop(1, "hsl(0 0% 25%)");

        canvasCtx.lineWidth = 50;
        canvasCtx.lineCap = 'round';
        canvasCtx.strokeStyle = gradient;
        canvasCtx.fillStyle = gradient;

        canvasCtx.beginPath();

        // canvasCtx.moveTo(this.x0, this.y0);
        // canvasCtx.lineTo(this.x1, this.yCenter);
        // canvasCtx.lineTo(this.x0, this.y1);
        // canvasCtx.lineTo(this.x0, this.y0);

        canvasCtx.arc(this.xCenter, this.yCenter, radius, 0, 2 * Math.PI);

        canvasCtx.stroke();
        // canvasCtx.fill();
    }

}
