export abstract class Renderer {
    protected width: number;
    protected height: number;
    protected xCenter: number;
    protected yCenter: number;

    constructor(protected x0: number, protected y0: number, protected x1: number, protected y1: number) {
        this.width = this.x1 - this.x0;
        this.height = this.y1 - this.y0;
        this.xCenter = this.x0 + this.width / 2;
        this.yCenter = this.y0 + this.height / 2;
    }

    public clear(context: CanvasRenderingContext2D) {
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(this.x0, this.y0, this.width, this.height);
    }
}