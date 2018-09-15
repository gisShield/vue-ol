import ol from 'ol/Map'
import OlMap from 'ol/Map'
import 'ol/ol.css'
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import MultiPoint from 'ol/geom/MultiPoint';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Circle from 'ol/geom/Circle';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import {Icon, Style, Fill, Stroke, Text} from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import {defaults as defaultInteractions, Modify, Select, Draw} from 'ol/interaction';
import DragZoom from 'ol/interaction/DragZoom';
import {defaults as defaultControls} from 'ol/control';
import {click, pointerMove, always} from 'ol/events/condition';
import Attribution from 'ol/control/Attribution';
import FullScreen from 'ol/control/FullScreen';
import MousePosition from 'ol/control/MousePosition';
import OverviewMap from 'ol/control/OverviewMap';
import Rotate from 'ol/control/Rotate';
import ScaleLine from 'ol/control/ScaleLine';
import Zoom from 'ol/control/Zoom';
import ZoomSlider from 'ol/control/ZoomSlider';
import {Observable, unByKey} from 'ol/Observable';
import {createStringXY} from 'ol/coordinate';
import Overlay from 'ol/Overlay';
import MeasureTool from './measureTool'


const VueOpenlayers = {
  /**
   * map object
   */
  map: null,
  /**
   * all layers of this map
   */
  layers: new Map(),
  /**
   * all style of this map
   */
  styles: new Map(),
  /**
   * The selected feature
   */
  selectedFeatures: null,
  /**
   *  the select interaction
   */
  select: new Select(),
  /**
   * all controls of the map
   */
  controls: new Map(),
  /**
   * all popups of the map
   */
  popups: new Map(),
  /**
   * the contextmenu of the map
   */
  contextmenu: null,
  /**
   * get the map
   * @returns  {ol/Map}
   */
  getFMap() {
    return this.map
  },
  /**
   * get view
   * @returns {module:ol/View}
   */
  getFView() {
    return this.map.getView()
  },
  /**
   * set view
   * @param opt {Object}
   */
  setFView(opt) {
    let view = new View({
      projection: opt.projection ? opt.projection : 'EPSG:3857',
      minZoom: opt.minZoom ? opt.minZoom : 1,
      maxZoom: opt.maxZoom ? opt.maxZoom : 20,
      zoom: opt.zoom ? opt.zoom : 10,
      center: opt.center
    })
    return view
  },
  /**
   * get layer by name
   * @param name {String} name of layer
   * @returns {null|ol/Layer}
   */
  getFLayer(name) {
    let layer = null
    if (name) {
      layer = this.layers.get(name)
    }
    return layer
  },
  /**
   * get source by layer
   * @param layer {ol/Layer}
   * @returns {*}
   */
  getFSource(layer) {
    let source = null
    if (layer) {
      if (Object.prototype.toString.call(layer) === "[object String]") {
        layer = this.getFLayer(layer)
      }
      if (layer && (layer instanceof VectorLayer)) {
        source = layer.getSource()
      }
    }
    return source
  },
  /**
   * Get the center of the map
   * @returns {module:ol/coordinate~Coordinate|undefined}
   */
  getFCenter() {
    return this.map.getView().getCenter()
  },
  /**
   * Get the center of the map
   * @param center {[lng,lat]}
   */
  setFCenter(center) {
    if (center && Object.prototype.toString.call(center) === '[object Array]') {
      let view = this.map.getView()
      view.setCenter(center)

    }
  },
  /**
   * get the zoom of map
   * @returns {number|undefined} zoom
   */
  getFZoom() {
    return this.map.getView().getZoom()
  },
  /**
   *  set the center of the map
   * @param zoom {Number}
   */
  setFZoom(zoom) {
    if (zoom) {
      let view = this.map.getView()
      view.setZoom(zoom)
    }
  },
  /**
   * pan to a point and a zoom level
   * @param center {[lng,lat]}
   * @param zoom  {NUmber}
   */
  panTo(center, zoom) {
    let view = this.map.getView()
    view.animate({zoom: zoom}, {center: center});
  },
  /**
   *  get coordinate from feature
   * @param feature
   * @returns {*}
   */
  getCoordinateByFeature(feature) {
    let points = null
    if (feature) {
      let geom = feature.getGeometry();
      if (geom instanceof Circle) {
        points = geom.getCenter().join(",") + "," + geom.getRadius();
      } else if (geom instanceof LineString) {
        points = geom.getCoordinates().join(",");
      } else if (geom instanceof Polygon) {
        points = geom.getCoordinates().join(",");
      }
    }
    return points
  },
  /**
   * open dragzoom tool
   * @param type
   */
  openDragzoom(type) {
    let opt = {
      condition: always,
      // out: true, // 此处为设置拉框完成时放大还是缩小
    }
    if (type === 'out') {
      opt.out = true
    }
    let dragZoom = new DragZoom(opt);
    this.map.addInteraction(dragZoom);
    return dragZoom
  },
  /**
   * close dragzoom tool
   * @param dragZoom
   */
  closeDragzoom(dragZoom) {
    if (dragZoom) {
      this.map.removeInteraction(dragZoom)
    }
  },
  /**
   * add map control
   * @param opt
   */
  setFControl(opt) {
    let control = null
    switch (opt.type) {
      case 'attribution':
        control = this._initAttributionControl(opt)
        break
      case 'fullscreen':
        control = this._initFullScreenControl(opt)
        break
      case 'mouseposition':
        control = this._initMousePositionControl(opt)
        break
      case 'overview':
        control = this._initOverviewMapControl(opt)
        break
      case 'rotate':
        control = this._initRotateControl(opt)
        break
      case 'scaleline':
        control = this._initScaleLineControl(opt)
        break
      case 'zoom':
        control = this._initZoomControl(opt)
        break
      case 'zoomslider':
        control = this._initZoomSliderControl(opt)
        break
    }
    // console.log(control)
    if (control) {
      this.controls.set(opt.name, control)
      this.map.addControl(control)
    }
  },
  /**
   * add map controls
   * @param opts
   */
  setFControls(opts) {
    if (Object.prototype.toString.call(opts) === "[object Array]") {
      opts.forEach((item, index) => {
        this.setFControl(item)
      })
    }
  },
  /**
   * delete map control
   * @param control
   */
  removeFControl(control) {
    if (Object.prototype.toString.call(control) === "[object String]") {
      let con = this.controls.get(control)
      this.map.removeControl(con)
      this.controls.delete(control)
    }
  },
  /**
   * delete map controls
   * @param controls
   */
  removeFControls(controls) {
    if (controls) {
      if (Object.prototype.toString.call(controls) === "[object Array]") {
        controls.forEach((item, index) => {
          this.removeFControl(item)
        })
      } else {
        this.removeFControl(controls)
      }
    }
  },
  /**
   * Initializes the attribution control
   * @param opt
   * @private
   */
  _initAttributionControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }
    if (opt.hasOwnProperty('collapsible') && opt.collapsible) {
      topt.collapsible = opt.collapsible
    }
    if (opt.hasOwnProperty('collapsed') && opt.collapsed) {
      topt.collapsed = opt.collapsed
    }
    if (opt.hasOwnProperty('tipLabel') && opt.tipLabel) {
      topt.tipLabel = opt.tipLabel
    }
    if (opt.hasOwnProperty('collapseLabel') && opt.collapseLabel) {
      topt.collapseLabel = opt.collapseLabel
    }
    if (opt.hasOwnProperty('label') && opt.label) {
      topt.label = opt.label
    }
    let control = new Attribution(topt)
    return control
  },
  /**
   * Initializes the fullScreen control
   * @param opt
   * @private
   */
  _initFullScreenControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('label') && opt.label) {
      topt.label = opt.label
    }
    if (opt.hasOwnProperty('labelActive') && opt.labelActive) {
      topt.labelActive = opt.labelActive
    }
    if (opt.hasOwnProperty('tipLabel') && opt.tipLabel) {
      topt.tipLabel = opt.tipLabel
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }
    if (opt.hasOwnProperty('source') && opt.source) {
      topt.source = opt.source
    }

    let control = new FullScreen(topt)
    return control
  },
  /**
   * Initializes the mousePosition control
   * @param opt
   * @private
   */
  _initMousePositionControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('coordinateFormat') && opt.coordinateFormat) {
      topt.coordinateFormat = createStringXY(Number(opt.coordinateFormat))
    }
    if (opt.hasOwnProperty('projection') && opt.projection) {
      topt.projection = opt.projection
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }
    if (opt.hasOwnProperty('undefinedHTML') && opt.undefinedHTML) {
      topt.undefinedHTML = opt.undefinedHTML
    }

    let control = new MousePosition(topt)
    return control

  },
  /**
   * Initializes the overviewMap control
   * @param opt
   * @private
   */
  _initOverviewMapControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('collapsed') && opt.collapsed) {
      topt.collapsed = opt.collapsed
    }
    if (opt.hasOwnProperty('collapseLabel') && opt.collapseLabel) {
      topt.collapseLabel = opt.collapseLabel
    }
    if (opt.hasOwnProperty('collapsible') && opt.collapsible) {
      topt.collapsible = opt.collapsible
    }
    if (opt.hasOwnProperty('label') && opt.label) {
      topt.label = opt.label
    }
    if (opt.hasOwnProperty('layers') && opt.layers) {
      topt.layers = opt.layers
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }
    if (opt.hasOwnProperty('tipLabel') && opt.tipLabel) {
      topt.tipLabel = opt.tipLabel
    }
    if (opt.hasOwnProperty('view') && opt.view) {
      topt.view = opt.view
    }
    // console.log(topt)
    let control = new OverviewMap(topt)
    return control
  },
  /**
   * Initializes the rotate control
   * @param opt
   * @private
   */
  _initRotateControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('label') && opt.label) {
      topt.label = opt.label
    }
    if (opt.hasOwnProperty('tipLabel') && opt.tipLabel) {
      topt.tipLabel = opt.tipLabel
    }
    if (opt.hasOwnProperty('duration') && opt.duration) {
      topt.duration = opt.duration
    }
    if (opt.hasOwnProperty('autoHide') && opt.autoHide) {
      topt.autoHide = opt.autoHide
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }


    let control = new Rotate(topt)
    return control
  },
  /**
   * Initializes the scaleLine control
   * @param opt
   * @private
   */
  _initScaleLineControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('minWidth') && opt.minWidth) {
      topt.minWidth = opt.minWidth
    }
    if (opt.hasOwnProperty('units') && opt.units) {
      topt.units = opt.units
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }

    let control = new ScaleLine(topt)
    return control
  },
  /**
   * Initializes the zoom control
   * @param opt
   * @private
   */
  _initZoomControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('duration') && opt.duration) {
      topt.duration = opt.duration
    }
    if (opt.hasOwnProperty('zoomInLabel') && opt.zoomInLabel) {
      topt.zoomInLabel = opt.zoomInLabel
    }
    if (opt.hasOwnProperty('zoomOutLabel') && opt.zoomOutLabel) {
      topt.zoomOutLabel = opt.zoomOutLabel
    }
    if (opt.hasOwnProperty('zoomInTipLabel') && opt.zoomInTipLabel) {
      topt.zoomInTipLabel = opt.zoomInTipLabel
    }
    if (opt.hasOwnProperty('zoomOutTipLabel') && opt.zoomOutTipLabel) {
      topt.zoomOutTipLabel = opt.zoomOutTipLabel
    }
    if (opt.hasOwnProperty('delta') && opt.delta) {
      topt.delta = opt.delta
    }
    if (opt.hasOwnProperty('target') && opt.target) {
      topt.target = opt.target
    }

    let control = new Zoom(topt)
    return control
  },
  /**
   * Initializes the zoom slider control
   * @param opt
   * @private
   */
  _initZoomSliderControl(opt) {
    let topt = {};
    if (opt.hasOwnProperty('className') && opt.className) {
      topt.className = opt.className
    }
    if (opt.hasOwnProperty('duration') && opt.duration) {
      topt.duration = opt.duration
    }

    let control = new ZoomSlider(topt)
    return control
  },
  /**
   * The operation of layers
   * */

  /**
   * add layer
   * @param name {String}
   * @param layer {ol/layer}
   */
  addFLayer(name, layer) {
    // 判断是不是参数数组
    if (name && layer && this.map) {
      if (this.layers.has(name)) {
        console.log(' name already exist')
        return
      }
      this.map.addLayer(layer)
      this.layers.set(name, layer)
    }
  },
  /**
   * delete layer
   * @param name {String}
   */
  removeFLayer(name) {
    if (name) {
      if (!this.layers.has(name)) {
        console.log(' name not exist')
        return
      }
      this.map.removeLayer(this.layers.get(name))
      this.layers.delete(name)
    }
  },
  /**
   * Initializes the layer
   * @param opt {Object}
   * @returns {ol/Layer}
   */
  setFLayer(opt) {
    let layer = null;
    if (opt) {
      let source = this.setFSource(opt);
      // console.log("source")
      // console.log(source)
      if (source) {
        switch (opt.layerType) {
          case 'tile':
            layer = new TileLayer({
              source: source
            })
            break
          case 'image':
            layer = new ImageLayer({
              source: source
            })
            break
          case 'vector':
            let style = this.getFStyle(opt.style);
            let layeropt = {
              source: source,
            }
            if (style) {
              layeropt.style = style
            }
            if (opt.hasOwnProperty('opacity')) {
              layeropt.opacity = opt.opacity
            }
            if (opt.hasOwnProperty('extent')) {
              layeropt.extent = opt.extent
            }
            if (opt.hasOwnProperty('zIndex')) {
              layeropt.zIndex = opt.zIndex
            }
            if (opt.hasOwnProperty('renderMode')) {
              layeropt.renderMode = opt.renderMode
            }
            layer = new VectorLayer(layeropt)
            break
        }
      }

    }
    return layer;
  },
  /**
   * Initializes the source
   * @param opt {Object}
   * @returns {ol/Source}
   */
  setFSource(opt) {
    let source = null;
    if (opt) {
      switch (opt.sourceType) {
        case 'osm':
          source = new OSM({
            wrapX: false
          });
          break
        case 'xyz':
          if (opt.url) {
            source = new XYZ({
              wrapX: false,
              url: opt.url
            });
          } else {
            source = new XYZ({
              wrapX: false,
              tileUrlFunction: opt.tileUrlFunction
            });
          }
          if (opt.hasOwnProperty('maxZoom')) source.setMaxZoom(opt.maxZoom);
          if (opt.hasOwnProperty('minZoom')) source.setMinZoom(opt.minZoom);
          if (opt.hasOwnProperty('projection')) source.setProjection(opt.projection);
          break
        case 'wms':
          if (opt.url) {
            source = new TileWMS({
              wrapX: false,
              url: opt.url,
              params: opt.params,
              serverType: opt.serverType
            });
          } else {
            source = new TileWMS({
              wrapX: false,
              params: opt.params,
              serverType: opt.serverType,
              tileUrlFunction: opt.tileUrlFunction
            });
          }
          if (opt.hasOwnProperty('projection')) source.setProjection(opt.projection);
          break
        case 'wmts':
          source = new WMTS({
            wrapX: false,
            url: opt.url,
            layer: opt.layer,
            style: opt.style,
            version: opt.version,
            format: opt.format,
            projection: opt.projection
          });
          break
        case 'vector':
          let vectorOpt = {wrapX: false}
          if (opt.url) {
            vectorOpt.url = opt.url
          } else if (opt.loader) {
            vectorOpt.loader = opt.loader
          }
          if (opt.hasOwnProperty('strategy')) {
            vectorOpt.strategy = opt.strategy
          }
          if (opt.hasOwnProperty('format')) {
            vectorOpt.format = opt.format
          }
          if (opt.hasOwnProperty('useSpatialIndex')) {
            vectorOpt.useSpatialIndex = opt.useSpatialIndex
          }
          source = new VectorSource(vectorOpt)
          break
      }
    }
    return source;
  },
  /**
   * Initializes the style
   * @param opt {Object}
   * @returns {ol/Style}
   */
  setFStyle(opt) {
    let fill = null
    let stroke = null
    let text = null
    let img = null
    let style = new Style({});
    if (opt.fill) {
      fill = new Fill({
        color: opt.fill.color ? opt.fill.color : "#000"
      })
      style.setFill(fill)
    }
    if (opt.stroke) {
      stroke = new Stroke({
        color: opt.stroke.color ? opt.stroke.color : "#000",
        width: opt.stroke.width ? opt.stroke.width : 2
      })
      if (opt.stroke.hasOwnProperty('lineCap')) stroke.setLineCap(opt.stroke.lineCap);
      if (opt.stroke.hasOwnProperty('lineJoin')) stroke.setLineJoin(opt.stroke.lineJoin);
      if (opt.stroke.hasOwnProperty('lineDash')) stroke.setLineDash(opt.stroke.lineDash);
      if (opt.stroke.hasOwnProperty('lineDashOffset')) stroke.setLineDashOffset(opt.stroke.lineDashOffset);
      style.setStroke(stroke)

    }
    if (opt.text) {
      text = new Text({
        text: opt.text.text
      })
      if (opt.text.hasOwnProperty('offsetX')) stroke.setOffsetY(opt.stroke.offsetX);
      if (opt.text.hasOwnProperty('offsetY')) stroke.setOffsetX(opt.stroke.offsetY);
      if (opt.text.hasOwnProperty('font')) stroke.setFont(opt.stroke.font);
      style.setText(text)
    }
    if (opt.img) {
      if (opt.img.type === 'icon') {
        img = new Icon({
          src: opt.img.src,
          offset: opt.img.offset ? opt.img.offset : [0, 0],
          opacity: opt.img.opacity ? opt.img.opacity : 1,
          size: opt.img.size,
          crossOrigin: 'anonymous'
        })
      } else if (opt.img.type === 'circle') {
        let circle_opt = {
          radius: opt.img.radius
        }
        if (opt.img.hasOwnProperty('fillcolor')) {
          let imgFill = new Fill({
            color: opt.img.fillcolor
          })
          circle_opt.fill = imgFill
        }
        img = new CircleStyle(circle_opt)
      } else if (opt.img.type === 'regular') {

      }
      style.setImage(img)
    }
    this.styles.set(opt.styleName, style)
    return style
  },
  /**
   * Initializes the style function
   * @param feature {ol/Feature}
   * @returns {ol/Style}
   */
  setFStyleFunction(feature) {
    let style = null
    if (feature && feature.get('sname')) {
      let name = feature.get('sname');
      if (this.styles.has(name)) {
        style = this.styles.get(name)
      }
    }
    return style
  },
  /**
   * get style by name
   * @param opt {String|ol/Style}
   * @returns {ol/Style}
   */
  getFStyle(opt) {
    let style = null
    if (Object.prototype.toString.call(opt) === "[object String]") {
      style = this.styles.get(opt)
    } else if (opt instanceof Style) {
      style = opt
    }
    return style
  },

  /**
   * The operation of features
   * */


  /**
   * Initializes a feature
   * @param opt
   * @param layer
   */
  setFFeature(opt, layer) {
    let feature = null
    if (opt && layer) {
      if (!this.layers.has(layer)) {
        return
      }
      let geom = this.setFGeometry(opt);
      if (geom != null) {
        feature = new Feature(geom)
        feature.setId(opt.id)
        if (opt.hasOwnProperty('data')) {
          feature.set('data', opt.data)
        }
        if (opt.style) {
          let style = null
          if (Object.prototype.toString.call(opt.style) === '[object String]') {
            style = this.styles.get(opt.style)
          } else {
            style = opt.style
          }
          feature.setStyle(style)
        }
        this.layers.get(layer).getSource().addFeature(feature)
      }
    }
  },
  /**
   * Initializes a list of feature
   * @param opt
   * @param layer
   */
  setFFeatures(opt, layer) {
    if (Object.prototype.toString.call(opt) === '[object Array]') {
      for (let i = 0; i < opt.length; i++) {
        this.setFFeature(opt[i], layer)
      }
    } else {
      this.setFFeature(opt, layer)
    }
  },
  /**
   * Initializes a geometry
   * @param opt
   * @returns {*}
   */
  setFGeometry(opt) {
    let geom = null;
    switch (opt.type) {
      case 'point':
        geom = new Point(opt.coordinates)
        break
      case 'mpoint':
        geom = new MultiPoint(opt.coordinates)
        break
      case 'line':
        geom = new LineString(opt.coordinates)
        break
      case 'mline':
        geom = new MultiLineString(opt.coordinates)
        break
      case 'linearring':
        geom = new LinearRing(opt.coordinates)
        break
      case 'polygon':
        geom = new Polygon(opt.coordinates)
        break
      case 'mpolygon':
        geom = new MultiPolygon(opt.coordinates)
        break
      case 'circle':
        geom = new Circle(opt.coordinates, opt.radius)
        break
      case 'collection':
        geom = new GeometryCollection(opt.geometries)
        break
    }
    return geom;
  },
  /**
   * Initializes a popup
   * @param opt
   * @returns {V}
   * @private
   */
  _setFPopup(opt) {
    let overlay
    let overlayOpt = {
      position: opt.position,
      element: opt.element,
      autoPan: opt.autoPan,
      autoPanAnimation: {
        duration: 250
      }
    }
    overlay = new Overlay(overlayOpt);
    this.map.addOverlay(overlay);
    let res = {
      element: opt.element,
      overlay: overlay
    }
    this.popups.set(opt.key, res)
    return res
  },
  /**
   * Initializes popups
   * @param opt
   * @returns {Array}
   */
  setFPopups(opt) {
    let pops = []
    if (Object.prototype.toString.call(opt) === '[object Array]') {
      opt.forEach((item, index) => {
        let pop = this._setFPopup(item)
        if (pop) {
          pops.push(pop)
        }
      })

    } else {
      let pop = this._setFPopup(opt)
      if (pop) {
        pops.push(pop)
      }

    }
    return pops
  },
  /**
   * close a popup
   * @param pop
   * @private
   */
  _closeFPopup(pop) {
    if (this.popups.has(pop)) {
      let res = this.popups.get(pop)
      res.overlay.setPosition(undefined);
      this.popups.delete(pop)
    }
  },
  /**
   * close  popups
   * @param pops
   */
  closeFPopups(pops) {
    if (Object.prototype.toString.call(pops) === '[object Array]') {
      pops.forEach((item, index) => {
        this._closeFPopup(item)
      })
    } else {
      this._closeFPopup(pops)
    }
  },
  /**
   * remove some feature from a layer
   * @param feature
   * @param layer
   */
  removeFFeature(feature, layer) {
    if (feature && layer) {
      if (Object.prototype.toString.call(layer) === '[object String]') {
        layer = this.layers.get(layer)
      }
      if (Object.prototype.toString.call(feature) === '[object String]') {
        feature = layer.getSource().getFeatureById(feature)
      }
      if (layer.getSource().hasFeature(feature)) {
        layer.getSource().removeFeature(feature)
      }

    }
  },
  /**
   * clear a layer
   * @param layer
   */
  clearFFeature(layer) {
    if (layer) {
      if (Object.prototype.toString.call(layer) === '[object String]') {
        layer = this.layers.get(layer)
      }
      layer.getSource().clear()
    }
  },
  /**
   * Initialize the draw rectangle tool
   * @param source
   * @private
   */
  _initRectInteraction(source) {
    let draw = new Draw({
      source: source,
      type: 'LineString',
      geometryFunction: function (coordinates, geometry) {
        let start = coordinates[0];
        let end = coordinates[1];
        if (!geometry) {
          geometry = new Polygon([[start, [start[0], end[1]], end, [end[0], start[1]], start]]);
        }
        geometry.setCoordinates([[start, [start[0], end[1]], end, [end[0], start[1]], start]]);
        return geometry;
      },
      maxPoints: 2
    });
    return draw
  },
  /**
   * Initialize the draw and modify  tool
   * @param opt
   */
  setFInteraction(opt) {
    if (opt.type === 'draw') {
      let type
      switch (opt.drawType) {
        case 'point':
          type = 'Point'
          break
        case 'line':
          type = 'LineString'
          break
        case 'polygon':
          type = 'Polygon'
          break
        case 'circle':
          type = 'Circle'
          break
        case 'rect':
          type = 'rect'
          break
      }
      let layer = this.getFLayer(opt.layer)
      // console.log(layer);
      if (layer) {
        let dopt = {
          type: type,
          source: layer.getSource(),
        };
        // console.log(layer.getSource());
        if (opt.hasOwnProperty('style')) {
          dopt.style = opt.style
        }
        let draw = null
        if (type == 'rect') {
          draw = this._initRectInteraction(layer.getSource())
        } else {
          draw = new Draw(dopt)
        }
        let temp_this = this
        draw.on('drawend', function (evt) {
          // console.log("绘制结束");
          temp_this.map.removeInteraction(draw);
          let res = {
            feature: evt.feature,
            coordinate: temp_this.getCoordinateByFeature(evt.feature)
          }
          if (opt.callback) {
            opt.callback(res)
          }
        })
        this.map.addInteraction(draw);
        return draw
      }
    } else if (opt.type === 'modify') {
      this.select.setActive(true);
      this.selectedFeatures = this.select.getFeatures();
      let temp_this = this
      let mopt = {
        features: temp_this.select.getFeatures(),
        insertVertexCondition: function () {
          // prevent new vertices to be added to the polygons
          return !temp_this.select.getFeatures().getArray().every(function (feature) {
            return feature.getGeometry().getType().match(/Polygon/);
          });
        }
      }
      if (opt.hasOwnProperty('style')) {
        mopt.style = opt.style
      }
      let modify = new Modify(mopt);
      this.map.addInteraction(modify);
      this.select.once('select', function (event) {
        let feature = event.selected[0];
        let res = {}
        if (feature) {
          res = {
            feature: feature,
            coordinate: temp_this.getCoordinateByFeature(feature)
          }
        }
        if (opt.callback) {
          opt.callback(res)
        }
      });
      return modify
    }
  },
  /**
   * delete the draw  or  modify  tool
   * @param interaction
   */
  removeFInteraction(interaction) {
    if (interaction instanceof Modify) {
      this.map.removeInteraction(interaction)
      this.select.setActive(false)
    } else if (interaction instanceof Draw) {
      this.map.removeInteraction(interaction)
    }
  },
  /**
   * open measure tool
   * @param opt
   */
  openMeasureTool(opt) {
    MeasureTool.openMeasureTool(this.map, opt)
  },
  /**
   * close measure tool
   */
  closeMeasureTool() {
    MeasureTool.closeMeasureTool()

  },
  /**
   * Initialize the contextMenu
   * @param opt
   * @returns {{contextmenu, click}}
   */
  setFContextMenu(opt) {
    let temp_this = this
    let key = this.map.on('contextmenu', function (evt) {
      evt.preventDefault();
      // console.log('右键菜单')
      // console.log(evt)
      if (temp_this.contextmenu) {
        temp_this.contextmenu.setPosition(evt.coordinate)
      } else {
        if (opt.callback) {
          opt.callback(true)
        }
        temp_this.contextmenu = new Overlay({
          element: opt.element,
          offset: (opt.offset ? opt.offset : [0, -15]),
          positioning: (opt.positioning ? opt.positioning : 'center-left')
        });
      }
      // console.log(opt.element)
      // console.log(evt.coordinate)
      temp_this.contextmenu.setPosition(evt.coordinate)
      temp_this.map.addOverlay(temp_this.contextmenu)
    })
    let key2 = this.map.on('click', function (evt) {
      evt.preventDefault();
      if (temp_this.contextmenu) {
        temp_this.contextmenu.setPosition(undefined)
      }
    })
    return {contextmenu: key, click: key2}
  },
  /**
   * close contextMenu and restate
   * @param keys
   */
  closeFContextMenu(keys) {
    if (keys.hasOwnProperty('contextmenu')) {
      unByKey(keys.contextmenu)
    }
    if (keys.hasOwnProperty('click')) {
      unByKey(keys.click)
    }
    if (this.contextmenu) {
      this.contextmenu.setPosition(undefined)
    }
  },
  /*地图事件相关操作*/
  /**
   * bind feture events
   * @param opt
   */
  setFFeatureEvent(opt) {
    let select = null
    let res = {};
    if (opt) {
      switch (opt.type) {
        case 'singleclick':
          select = new Select({multi: opt.multi ? opt.multi : false});
          select.on('select', function (e) {
            // console.log(e);
            if (opt.callback) {
              res = {
                features: e.selected,
                all: e
              }
              opt.callback(res)
            }
          })
          break
        case 'pointermove':
          select = new Select({
            condition: pointerMove,
            multi: opt.multi ? opt.multi : false
          });
          select.on('select', function (e) {
            if (opt.callback) {
              res = {
                features: e.selected,
                all: e
              }
              opt.callback(res)
            }
          })
          break
      }
      this.map.addInteraction(select)
    }
    return select
  },
  /**
   * unbind feture events
   * @param eventid
   */
  removeFFeatureEvent(eventid) {
    this.map.removeInteraction(eventid)
  },
  /**
   * bind map events
   * @param opt
   */
  setFMapEvent(opt) {
    let event = null
    let res = null
    if (opt) {
      event = this.map.on(opt.type, function (evt) {
        if (opt.callback) {
          res = {
            coordinate: evt.coordinate,
            pixel: evt.pixel,
            type: evt.type,
            all: evt
          }
          opt.callback(res)
        }
      })
    }
    return event
  },
  /**
   * unbind map events
   * @param eventid
   */
  removeFMapEvent(eventid) {
    if (eventid) {
      unByKey(eventid)
    }
  },

  /**
   * Initializes the  component
   */
  init(opts) {
    if (this.map) {
      console.log(" Map already exist")
      return
    }
    this.map = new OlMap({
      target: opts.element,
      view: this.setFView(opts),
      layers: [],
      controls: defaultControls({
        attribution: false,
        rotate: false,
        zoom: false
      }).extend([])
    })
    this.select.setActive(false)
    this.map.addInteraction(this.select);
    return this.map
  }
};
export default VueOpenlayers
