import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import {getArea, getLength} from 'ol/sphere';
import Draw from 'ol/interaction/Draw';
import {unByKey} from 'ol/Observable';
import Overlay from 'ol/Overlay';

const MeasureTool = {
  /**
   * Currently drawn feature.
   * @type {module:ol/Feature~Feature}
   */
  sketch: null,

  /**
   * Overlay to show the help messages.
   * @type {module:ol/Overlay}
   */
  helpTooltip: null,


  /**
   * Overlay to show the measurement.
   * @type {module:ol/Overlay}
   */
  measureTooltip: null,

  measureToolLineStyle: null,
  measureToolPolygonStyle: null,
  helpEvent: null,

  setMeasureToolLineStyle(lineStyle) {
    this.measureToolLineStyle = lineStyle
  },
  getMeasureToolLineStyle() {
    return this.measureToolLineStyle
  },
  setMeasureToolPolygonStyle(polygonStyle) {
    this.measureToolPolygonStyle = polygonStyle
  },
  getMeasureToolPolygonStyle() {
    return this.measureToolPolygonStyle
  },
  formatLength(line) {
    let sourceProj = this.map.getView().getProjection();
    let length = getLength(line,{
      projection:sourceProj
    });
    let output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  },
  formatArea(polygon) {
    let sourceProj = this.map.getView().getProjection();
    let area = getArea(polygon,{
      projection:sourceProj
    });
    let output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  },
  addMeasureInteraction(opt) {
    let temp_this = this;
    let type
    let style
    if (opt.type == 'area') {
      type = 'Polygon'
      this.measureToolPolygonStyle = opt.style
      style = this.measureToolPolygonStyle
    } else {
      type = 'LineString'
      this.measureToolLineStyle = opt.style
      style = this.measureToolLineStyle
    }
    this.draw = new Draw({
      source: opt.source,
      type: type,
      style: style
    });
    this.map.addInteraction(this.draw);

    this.measureTooltip = new Overlay({
      element: opt.measureElement,
      offset: (opt.measureTooltipOffset ? opt.measureTooltipOffset : [0, -15]),
      positioning: (opt.measureTooltipPosition ? opt.measureTooltipPosition : 'bottom-center')
    });
    this.map.addOverlay(this.measureTooltip);


    this.helpTooltip = new Overlay({
      element: opt.helpElement,
      offset: (opt.helpTooltipOffset ? opt.helpTooltipOffset : [0, -15]),
      positioning: (opt.helpTooltipPosition ? opt.helpTooltipPosition : 'center-left')
    });
    this.map.addOverlay(this.helpTooltip);

    this.helpEvent = this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      temp_this.helpTooltip.setPosition(evt.coordinate);
    });

    let listener;

    this.draw.on('drawstart',
      function (evt) {
        // set sketch
        temp_this.sketch = evt.feature;

        /** @type {module:ol/coordinate~Coordinate|undefined} */
        let tooltipCoord = evt.coordinate;

        listener = temp_this.sketch.getGeometry().on('change', function (evt) {
          let geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = temp_this.formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = temp_this.formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          if (opt.changeCallback) {
            opt.changeCallback(output)
          }
          temp_this.measureTooltip.setPosition(tooltipCoord);
        });
      }, this);

    this.draw.on('drawend',
      function () {
        temp_this.measureTooltip.setOffset(opt.measureTooltipSaticOffset ? opt.measureTooltipSaticOffset : [0, -7]);
        let output = null
        let geom = temp_this.sketch.getGeometry()
        if (geom instanceof Polygon) {
          output = temp_this.formatArea(geom);
        } else if (geom instanceof LineString) {
          output = temp_this.formatLength(geom);
        }
        if (opt.callback) {
          let res = {
            output: output,
            feature: temp_this.sketch
          }
          opt.callback(res)
        }
        temp_this.sketch = null;
        unByKey(listener);
      }, this);
  },
  openMeasureTool(map, opt) {
    this.closeMeasureTool()
    this.map = map;
    this.addMeasureInteraction(opt);
  },
  closeMeasureTool() {
    if (this.draw && this.map) {
      this.map.removeInteraction(this.draw);
    }
    if (this.sketch) {
      this.sketch = null
    }
    if (this.helpTooltip) {
      this.helpTooltip = null
    }
    if (this.measureTooltip) {
      this.measureTooltip = null
    }
    if (this.measureToolLineStyle) {
      this.measureToolLineStyle = null
    }
    if (this.measureToolPolygonStyle) {
      this.measureToolPolygonStyle = null
    }
    if (this.helpEvent) {
      unByKey(this.helpEvent)
      this.helpEvent = null
    }

  }
}
export default MeasureTool
