import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-route-tool',
  templateUrl: './route-tool.component.html',
  styleUrls: ['./route-tool.component.css'],
})
export class RouteToolComponent {
  @Input() mapDirection: { text: string; path: number[][] }[] = [];
  @Input() isStartRoute: boolean = false;
  @Output() onClickClearGraphic = new EventEmitter();
  @Output() onClickCreateRoute = new EventEmitter();
  @Output() onClickToDirection = new EventEmitter<{
    text: string;
    path: number[][];
  }>();
  id!: number;

  onClickClearButton() {
    this.onClickClearGraphic.emit();
  }

  onClickStartRoute() {
    this.onClickCreateRoute.emit();
  }

  onClickDirection(event: any) {
    this.id = +(<HTMLDivElement>event.target).id;
    let directionObj = this.mapDirection.find((item, idx) => this.id === idx);
    this.onClickToDirection.emit(directionObj);
  }
}
