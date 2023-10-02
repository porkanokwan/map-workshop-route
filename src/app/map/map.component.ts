import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import MapView from '@arcgis/core/views/MapView.js';
import Map from '@arcgis/core/Map.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import * as route from '@arcgis/core/rest/route';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters.js';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewRef', { static: true })
  mapViewRef!: ElementRef<HTMLDivElement>;
  map!: any;
  mapView!: any;
  graphicsLayer!: any;
  routeUrl =
    'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';
  // 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route'; // ใช้ได้ใน SanDiego เท่านั้น
  directionText: { text: string; path: number[][] }[] = [];
  routeParams!: any;

  ngOnInit(): void {
    this.initializeMap();
  }

  async initializeMap() {
    this.graphicsLayer = new GraphicsLayer();

    this.map = new Map({
      basemap: 'streets-night-vector',
      layers: [this.graphicsLayer],
    });

    const mapViewProperties = {
      container: this.mapViewRef.nativeElement,
      center: [-118.31966, 34.13375],
      map: this.map,
      zoom: 10,
    };
    this.mapView = new MapView(mapViewProperties);

    // create routeParams
    this.routeParams = new RouteParameters({
      stops: new FeatureSet(), // รับแค่ point graphics
      returnDirections: true,
    });

    this.createPoint();

    // await this.mapView.when(); เป็น function ที่ใช้ระหว่างรอ load map จะทำอะไร
    return this.mapView;
  }

  createPoint() {
    this.mapView.on('click', (event: any) => {
      // ดักไว้กัน bug
      if (!event.mapPoint) {
        return;
      }

      let symbolMaker = {
        type: 'simple-marker',
        color:
          this.graphicsLayer.graphics.length === 0
            ? 'red'
            : 'rgb(122, 165, 247)',
        outline: {
          width: 1,
          color: 'white',
        },
      };
      const pointStart = new Graphic({
        geometry: event.mapPoint,
        symbol: symbolMaker,
      });

      // เพิ่ม graphics point ลง map ทำได้ 2 วิธีใช้อันไหนก็ได้
      // this.mapView.graphics.add(pointStart); // ถ้าใช้วิธีนี้เพิ่ม graphics เวลา check ว่ามี graphics อยู่กี่อันแล้วต้องใช้ this.mapView.graphics.length
      this.graphicsLayer.add(pointStart); // ถ้าใช้วิธีนี้เพิ่ม graphics เวลา check ว่ามี graphics อยู่กี่อันแล้วต้องใช้ this.graphicsLayer.graphics.length
      console.log(
        this.mapView.graphics.length,
        this.graphicsLayer.graphics.length
      );

      // Add point graphics to routeParams
      this.routeParams.stops.features.push(pointStart);
    });
  }

  getRoute() {
    // ใช้วิธี this.graphicsLayer.graphics.toArray() นี้ไม่ได้ เพราะ graphicsLayer ถูก add route graphics เข้าไปด้วยทำให้พอเอาไปเข้า route.solve อีกรอบแล้วจะ error เนื่องจาก graphics ไม่ตรงที่กำหนด
    // const routeParams: any = new RouteParameters({
    //   stops: new FeatureSet({
    //     features: this.graphicsLayer.graphics.toArray(),
    //   }),
    //   returnDirections: true,
    // });
    console.log(
      this.graphicsLayer.graphics.toArray(),
      this.routeParams.stops.features
    );
    if (this.routeParams.stops.features.length > 1) {
      route.solve(this.routeUrl, this.routeParams).then((response) => {
        this.showRoute(response);
      });
    }
  }

  // Adds the solved route to the map as a graphic
  showRoute(data: any) {
    const routeResult = data.routeResults[0].route;
    // Define the symbology used to display the rout
    routeResult.symbol = {
      type: 'simple-line', // autocasts as SimpleLineSymbol()
      color: 'yellow',
      width: 5,
    };

    // Add Route Graphics
    this.graphicsLayer.add(routeResult);
    console.log(data.routeResults[0].directions.features);
    // get direction Text for show
    this.directionText = data.routeResults[0].directions.features.map(
      (item: any) => ({ text: item.attributes.text, path: item.geometry.paths })
    );
  }

  onClearGraphic() {
    if (this.graphicsLayer.graphics.length > 0) {
      // เรา add graphics เข้า graphicsLayer เลยต้องลบจาก graphicsLayer ถ้าเรา add เข้า mapView.graphics อันนี้ต้องลบจาก mapView
      this.graphicsLayer.removeAll();
      this.routeParams.stops.features = [];
      this.directionText = [];
    }
  }

  onClickGoTo(directionObj: { text: string; path: number[][] }) {
    this.mapView.goTo({ center: directionObj.path, zoom: 15 });
  }

  ngOnDestroy(): void {
    if (this.mapView) {
      // Destroy the map view.
      this.mapView.container = null;
    }
  }
}
