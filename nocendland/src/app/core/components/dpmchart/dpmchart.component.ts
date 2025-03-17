import { AfterViewInit, Component, ElementRef, input, InputSignal, ViewChild } from '@angular/core';

@Component({
  selector: 'dpm-chart',
  templateUrl: './dpmchart.component.html',
  styleUrl: './dpmchart.component.scss'
})
export class DpmchartComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  public config: InputSignal<DPMchartConfig> = input.required<DPMchartConfig>();

  private context: CanvasRenderingContext2D | null = null;
  private width: number = 0;
  private height: number = 0;
  private barWidth: number = 0;
  private maxData: number = 0;

  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
    this.setCanvasProperties();
    this.setData();
  }

  private setCanvasProperties(): void {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');
    if (!this.context) return;

    this.width = canvas.width;
    this.height = canvas.height;

    // Configurar el ancho de la barra dependiendo de la orientación
    if (this.config().orientation === 'vertical') {
      this.barWidth = this.width / this.config().data.values.length;
      this.maxData = Math.max(...this.config().data.values);
    } else {
      this.barWidth = this.height / this.config().data.values.length;
      this.maxData = Math.max(...this.config().data.values);
    }

    this.context.clearRect(0, 0, this.width, this.height);
  }

  private getGradient(): CanvasGradient {
    const ctx = this.context!;
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 1)');  // Color superior de la barra
    gradient.addColorStop(1, 'rgba(153, 102, 255, 1)'); // Color inferior de la barra
    return gradient;
  }

  private drawRoundedBar(x: number, y: number, width: number, height: number): void {
    if (!this.context) return;
    const radius = 5; // Radio de las esquinas redondeadas

    this.context.beginPath();
    this.context.moveTo(x + radius, y);
    this.context.lineTo(x + width - radius, y);
    this.context.arcTo(x + width, y, x + width, y + height, radius);
    this.context.lineTo(x + width, y + height - radius);
    this.context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.context.lineTo(x + radius, y + height);
    this.context.arcTo(x, y + height, x, y + height - radius, radius);
    this.context.lineTo(x, y + radius);
    this.context.arcTo(x, y, x + radius, y, radius);
    this.context.closePath();
    this.context.fill();
  }

  private setData(): void {
    if (!this.context) return;

    // Dibujar las barras según la orientación
    if (this.config().orientation === 'vertical') {
      this.config().data.values.forEach((value, index) => {
        const barHeight = (value / this.maxData) * (this.height - 20);
        const x = index * this.barWidth;
        const y = this.height - barHeight;

        // Aplicar gradiente
        this.context!.fillStyle = this.getGradient();
        this.drawRoundedBar(x, y, this.barWidth - 10, barHeight);

        // Sombras para darle profundidad a las barras
        this.context!.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.context!.shadowBlur = 10;
        this.context!.shadowOffsetX = 4;
        this.context!.shadowOffsetY = 4;

        // Dibujar etiquetas
        this.context!.fillStyle = 'black';
        this.context!.textAlign = 'center';
        this.context!.fillText(this.config().labels[index] || '', x + this.barWidth / 2, this.height - 5);

        // Resetear sombras
        this.context!.shadowColor = 'transparent';
      });
    } else { // Si es 'horizontal'
      this.config().data.values.forEach((value, index) => {
        const barWidth = (value / this.maxData) * (this.width - 20);
        const x = 10; // Fijamos el X porque las barras son horizontales
        const y = index * this.barWidth;

        // Aplicar gradiente
        this.context!.fillStyle = this.getGradient();
        this.drawRoundedBar(x, y, barWidth, this.barWidth - 10);

        // Sombras para darle profundidad a las barras
        this.context!.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.context!.shadowBlur = 10;
        this.context!.shadowOffsetX = 4;
        this.context!.shadowOffsetY = 4;

        // Dibujar etiquetas
        this.context!.fillStyle = 'black';
        this.context!.textAlign = 'left';
        this.context!.fillText(this.config().labels[index] || '', x + 5, y + this.barWidth / 2);

        // Resetear sombras
        this.context!.shadowColor = 'transparent';
      });
    }
  }
}

export declare type DPMchartConfig = {
  data: DPMchartData
  labels: string[]
  orientation?: 'horizontal' | 'vertical' // Nueva propiedad de orientación
}

export declare type DPMchartData = {
  values: number[]
}
