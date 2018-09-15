## API

> 详细介绍该组件的功能接口以及参数列表，并加上简单的示例，用来帮助开发者快速上手使用，每项均包括
>
> - 参数：用来介绍方法中参数以及返回值，如果发现参数为`ol/`开头的说明这是openlayers本身的对象
> - 方法：提供的功能接口
> - 示例：针对每个方法提供的简单示例，如果出现有标注Vue页面，说明是需要修改Vue页面中的html语句

### 一、基本操作

#### 参数

- ##### ViewOpt

| 参数名     | 类型   | 必填 | 默认值    | 说明                                                         |
| ---------- | ------ | ---- | --------- | ------------------------------------------------------------ |
| projection | String | 否   | EPSG:3857 | 坐标系，详细参考：[Openalyer的Projection](http://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html) |
| minZoom    | Number | 否   | 1         | 最小层级                                                     |
| maxZoom    | Number | 否   | 20        | 最大层级                                                     |
| zoom       | Number | 否   | 10        | 初始层级                                                     |
| center     | LngLat | 是   |           | 中心点                                                       |

#### 方法

| 方法                             | 返回值    | 描述                     |
| -------------------------------- | --------- | ------------------------ |
| getFMap()                        | ol/Map    | 返回Map对象              |
| getFView()                       | ol/View   | 返回View对象             |
| setFView(opt:ViewOpt)            |           | 设置当前Map的View视图    |
| getFLayer(name:String)           | ol/Layer  | 通过名称获取已加载的图层 |
| getFSource(layer:ol/Layer)       | ol/Source | 获取该图层的数据源对象   |
| getFCenter()                     | LngLat    | 获取当前地图中心点       |
| setFCenter(center:LngLat)        |           | 设置当前地图中心点       |
| getFZoom()                       | Number    | 获取当前地图层级         |
| setFZoom(zoom:Number)            |           | 设置当前地图层级         |
| panTo(center:LngLat,zoom:Number) |           | 平移至某个点和某个层级   |

#### 示例



### 二、控件

#### 参数

- ControlOpt

  > 这个参数是所有控件参数的基类，剩下的属于该类的扩展，例如添加属性控件，参数里要有ControlOpt中和AttributionOpt中的参数。

  | 参数名 | 类型   | 必填 | 默认值 | 说明                                                         |
  | ------ | ------ | ---- | ------ | ------------------------------------------------------------ |
  | type   | String | 是   |        | 控件类型<br>attribution:属性控件<br>fullscreen:全屏控件<br>mouseposition:鼠标定位控件<br>overview:缩略图控件<br>rotate:旋转控件<br>scaleline:比例尺控件<br>zoom:缩放控件<br>zoomslider:缩放滑动控件 |
  | name   | String | 是   |        | 控件名称                                                     |


- ##### AttributionOpt

  | 参数名        | 类型                  | 必填 | 默认值         | 说明                 |
  | ------------- | --------------------- | ---- | -------------- | -------------------- |
  | className     | String                | 否   | ol-attribution | 绑定的样式名         |
  | target        | HTMLElement \| String | 否   |                | dom节点              |
  | collapsibleB  | Boolean               | 否   | true           | 指定是否可以折叠属性 |
  | collapsed     | Boolean               | 否   | true           | 是否初始化时折叠     |
  | tipLabel      | String                | 否   | Attributions   | 提示的文本           |
  | collapseLabel | String \| HTMLElement | 否   | »              | 展开显示文本         |
  | label         | String                | 否   | i              | 折叠显示文本         |

- ##### FullScreenOpt

  | 参数名      | 类型                  | 必填 | 默认值             | 说明                                |
  | ----------- | --------------------- | ---- | ------------------ | ----------------------------------- |
  | className   | String                | 否   | ol-full-screen     | CSS类名                             |
  | label       | String                | 否   | \u2922             | 按钮的文本                          |
  | labelActive | String \| HTMLElement | 否   | \u00d7             | 激活状态下文本                      |
  | tipLabel    | String                | 否   | Toggle full-screen | 提示的文本                          |
  | target      | String \| HTMLElement | 否   |                    | 非当前地图窗口，另指定的dom展示节点 |
  | source      |                       | 否   |                    | 要全屏显示的元素，默认显示全部元素  |

- ##### MousePositionOpt

  | 参数名           | 类型                                                         | 必填 | 默认值            | 说明                                                         |
  | ---------------- | ------------------------------------------------------------ | ---- | ----------------- | ------------------------------------------------------------ |
  | className        | String                                                       | 否   | ol-mouse-position | CSS类名                                                      |
  | coordinateFormat | [ol/coordinate~CoordinateFormat](http://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~CoordinateFormat) | 否   |                   | 坐标格式化,参考：[ol/coordinate~CoordinateFormat](http://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~CoordinateFormat) |
  | projection       | String                                                       | 否   |                   | 坐标系，参考：[ol/proj~ProjectionLike](http://openlayers.org/en/latest/apidoc/module-ol_proj.html#~ProjectionLike) |
  | target           | Element \| String                                            | 否   |                   | 非当前地图窗口，另指定的dom展示节点                          |
  | undefinedHTML    | String                                                       | 否   | `0&#160;`         | 当鼠标不在地图内显示空字符串                                 |

- ##### OverviewMapOpt

  | 参数名        | 类型                  | 必填 | 默认值         | 说明                                               |
  | ------------- | --------------------- | ---- | -------------- | -------------------------------------------------- |
  | className     | String                | 否   | ol-overviewmap | CSS类名                                            |
  | collapsed     | boolean               | 否   | true           | 是否默认折叠                                       |
  | collapseLabel | String \| HTMLElement | 否   | «              | 折叠时按钮标签                                     |
  | collapsible   | boolean               | 否   | true           | 控件是否可以折叠                                   |
  | label         | String \| HTMLElement | 否   | »              | 展开时按钮标签                                     |
  | layers        | Array<ol/layer>       | 否   |                | 鹰眼中要展示的图层                                 |
  | target        | String \| HTMLElement | 否   |                | 非当前地图窗口，另指定dom展示                      |
  | tipLabel      | String                | 否   | Overview map   | 提示标签                                           |
  | view          | ol/view               | 否   |                | 鹰眼图中的视图，如果未提供，默认采用3857坐标系视图 |

- ##### RotateOpt

  | 参数名    | 类型                  | 必填 | 默认值         | 说明                          |
  | --------- | --------------------- | ---- | -------------- | ----------------------------- |
  | className | String                | 否   | ol-rotate      | CSS类名                       |
  | label     | String \| HTMLElement | 否   | ⇧              | 显示的标签文本                |
  | tipLabel  | String                | 否   | Reset rotation | 提示标签                      |
  | duration  | Number                | 否   | 250            | 动画持续时间，以毫秒为单位    |
  | autoHide  | boolean               | 否   | true           | 旋转为0时隐藏控件             |
  | target    | String \| HTMLElement | 否   |                | 非当前地图窗口，另指定dom展示 |

- ##### ScaleLineOpt

  | 参数名    | 类型                  | 必填 | 默认值        | 说明                                                         |
  | --------- | --------------------- | ---- | ------------- | ------------------------------------------------------------ |
  | className | String                | 否   | ol-scale-line | CSS类名                                                      |
  | minWidth  | Number                | 否   | 64            | 最小宽度（像素）                                             |
  | units     | String                | 否   |               | 比例尺单位。详细见：[ol/control/ScaleLine~Units](http://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine.html#.Units) |
  | target    | HTMLElement \| String | 否   |               | 非当前地图窗口，另指定dom展示                                |

- ##### ZoomOpt

  | 参数名          | 类型                  | 必填 | 默认值   | 说明                              |
  | --------------- | --------------------- | ---- | -------- | --------------------------------- |
  | className       | String                | 否   | ol-zoom  | CSS类名                           |
  | duration        | Number                | 否   | 250      | 动画持续时间，以毫秒为单位        |
  | zoomInLabel     | String \| HTMLElement | 否   | +        | 放大按钮的文本                    |
  | zoomOutLabel    | String \| HTMLElement | 否   | -        | 缩小按钮的文本                    |
  | zoomInTipLabel  | String                | 否   | Zoom in  | 放大按钮的提示文本                |
  | zoomOutTipLabel | String                | 否   | Zoom out | 缩小按钮的提示文本                |
  | delta           | Number                | 否   | 1        | 每次点击按钮zoom都会放大/缩小的量 |
  | target          | String \| HTMLElement | 否   |          | 非当前地图窗口，另指定dom展示     |

- ##### ZoomSliderOpt

  | 参数名    | 类型   | 必填 | 默认值        | 说明                       |
  | --------- | ------ | ---- | ------------- | -------------------------- |
  | className | String | 否   | ol-zoomslider | CSS类名                    |
  | duration  | Number | 否   | 200           | 动画持续时间，以毫秒为单位 |


#### 方法

| 方法                                    | 返回值 | 说明         |
| --------------------------------------- | ------ | ------------ |
| setFControl(opt:ControlOpt)             |        | 添加单个控件 |
| setFControls(opts:Array<ControlOpt>)    |        | 添加多个控件 |
| removeFControl(control:String)          |        | 删除单个控件 |
| removeFControls(controls:Array<String>) |        | 删除多个控件 |



#### 示例



### 三、图层

#### 参数

- #####LayerOpt

  | 参数名          | 类型                                                         | 必填 | 默认值                   | 说明                                                         |
  | --------------- | ------------------------------------------------------------ | ---- | ------------------------ | ------------------------------------------------------------ |
  | layerType       |                                                              | 是   |                          | 图层类别：<br>tile<br>image<br>vector                        |
  | style           | StyleOpt \| String                                           | 否   |                          | 图层参数，当sourceType为`vector`时用StyleOpt类型<br>当sourceType为`wmts`时用String类型 |
  | opacity         | Number                                                       | 否   | 1                        | 透明度，仅layerType为`vector`生效                            |
  | extent          | Array                                                        | 否   | [minx, miny, maxx, maxy] | 图层渲染的边界，仅layerType为`vector`生效                    |
  | zIndex          | Number                                                       | 否   | 0                        | 图层渲染层级，仅layerType为`vector`生效                      |
  | renderMode      | String                                                       | 否   | vector                   | 渲染模式。仅layerType为`vector`生效<br>vector:渲染为矢量<br>image:渲染为图像 |
  | sourceType      | String                                                       | 是   |                          | 数据源:<br>osm<br>xyz<br>wms<br>wmts<br>vector               |
  | url             | String                                                       | 否   |                          | 服务地址                                                     |
  | tileUrlFunction | Function                                                     | 否   |                          | 仅当url为空且 sourceType为`xyz`,`wms`生效                    |
  | maxZoom         | Number                                                       | 否   |                          | 最大层级 仅当sourceType为`xyz`生效                           |
  | minZoom         | Number                                                       | 否   |                          | 最小层级 仅当sourceType为`xyz`生效                           |
  | projection      | String                                                       | 否   |                          | 坐标系 仅当sourceType为`wmts`，`wms`,`xyz`生效               |
  | params          | String                                                       | 否   |                          | 参数 仅当sourceType为`wms`生效                               |
  | serverType      | String                                                       | 否   |                          | 服务类型 仅当sourceType为`wms`生效                           |
  | layer           | String                                                       | 否   |                          | 图层名称 仅当sourceType为`wmts`生效                          |
  | version         | String                                                       | 否   | 1.0.0                    | 服务版本 仅当sourceType为`wmts`生效                          |
  | format          | String                                                       | 否   | image/jpeg               | 图片类型 仅当sourceType为`wmts`生效                          |
  | loader          | [ol/featureloader~FeatureLoader](http://openlayers.org/en/latest/apidoc/module-ol_featureloader.html#~FeatureLoader) | 否   |                          | 用于从远程源加载函数，仅当url为空且 sourceType为`vector`生效 |
  | useSpatialIndex | boolean                                                      | 否   | true                     | RTree用作空间索引                                            |

- SourceOpt

#### 方法

| 方法                                  | 返回值 | 说明             |
| ------------------------------------- | ------ | ---------------- |
| addFLayer(name:String,layer:ol/layer) |        | 向地图中添加图层 |
| removeFLayer(name:String)             |        | 从地图中删除图层 |
| setFLayer(opt:LayerOpt)               |        | 初始化一个图层   |



#### 示例



###四、样式

#### 参数

- ##### StyleOpt

  | 参数名    | 类型      | 必填 | 默认值 | 说明     |
  | --------- | --------- | ---- | ------ | -------- |
  | styleName | String    | 是   |        | 样式名称 |
  | fill      | FillOpt   | 否   |        | 填充样式 |
  | stroke    | StrokeOpt | 否   |        | 线条样式 |
  | text      | TextOpt   | 否   |        | 文本样式 |
  | img       | ImgOpt    | 否   |        | 图片样式 |

- ##### FillOpt

  | 参数名 | 类型   | 必填 | 默认值 | 说明     |
  | ------ | ------ | ---- | ------ | -------- |
  | color  | String | 否   | #000   | 填充颜色 |

- ##### StrokeOpt

  | 参数名         | 类型           | 必填 | 默认值 | 说明                                |
  | -------------- | -------------- | ---- | ------ | ----------------------------------- |
  | color          | String         | 否   | #000   | 线颜色                              |
  | width          | Number         | 否   | 2      | 线宽                                |
  | lineCap        | String         | 否   | round  | 线帽:`butt`, `round`, or `square`   |
  | lineJoin       | String         | 否   | round  | 线连接:`bevel`, `round`, or `miter` |
  | lineDash       | Array.<Number> | 否   |        | 线划线图案                          |
  | lineDashOffset | Number         | 否   | 0      | 线破折号偏移                        |

- ##### TextOpt

  | 参数名  | 类型   | 必填 | 默认值          | 说明           |
  | ------- | ------ | ---- | --------------- | -------------- |
  | text    | String | 是   |                 | 内容           |
  | offsetX | Number | 否   | 0               | 水平文本偏移量 |
  | offsetY | Number | 否   | 0               | 垂直文本偏移量 |
  | font    | String | 否   | 10px sans-serif | 字体样式       |

- ##### ImgOpt

  | 参数名    | 类型          | 必填 | 默认值 | 说明     |
  | --------- | ------------- | ---- | ------ | -------- |
  | type      | String        | 是   |        | 类型     |
  | src       | String        | 是   |        | 图片url  |
  | offset    | Array<Number> | 否   | [0,0]  | 偏移量   |
  | opacity   | Number        | 否   | 1      | 透明度   |
  | size      | Array<Number> | 是   |        | 图片大小 |
  | radius    | Number        |      |        | 圆半径   |
  | fillcolor | String        | 否   |        | 填充颜色 |


#### 方法

​	

| 方法                                  | 返回值   | 说明                |
| ------------------------------------- | -------- | ------------------- |
| setFStyle(opt:StyleOpt)               |          | 初始化样式          |
| setFStyleFunction(feature:ol/Feature) | ol/Style | 通过Feature获取样式 |
| getFStyle(opt:String \| ol/Style)     | ol/Style | 获取样式            |



#### 示例



### 五、交互

#### 参数

- ##### InteractionOpt

  | 参数     | 类型               | 必填 | 默认值 | 说明                                                         |
  | -------- | ------------------ | ---- | ------ | ------------------------------------------------------------ |
  | type     | String             | 是   |        | 交互类型<br>draw:绘制交互<br>modify:修改交互                 |
  | drawType | String             | 否   |        | 当`type` 为`draw`时，此项必填。<br>point:绘制点<br>line:绘制线<br>polygon:绘制多边形<br>circle:绘制圆形<br>rect:绘制矩形 |
  | layer    | String \| ol/layer | 是   |        | 图层                                                         |
  | style    | ol/style           | 否   |        | 样式                                                         |
  | callback | Function           | 否   |        | 回调函数，返回一个Object,属性如下：<br>{<br>feature:ol/feature 绘制出来的feature<br>coordinate:String feature的坐标串<br>} |

- ##### MeasureOpt

  | 参数                   | 类型        | 必填 | 默认值        | 说明                                                         |
  | ---------------------- | ----------- | ---- | ------------- | ------------------------------------------------------------ |
  | type                   | String      | 是   |               | 测量类型<br>area:测量面积<br>length:测量长度                 |
  | style                  | String      | 否   |               | 绘制出的样式                                                 |
  | source                 | ol/source   | 是   |               | 图层数据源                                                   |
  | measureElement         | HTMLElement | 是   |               | 绘制结束显示的dom                                            |
  | measureTooltipOffset   | Array       | 否   | [0, -15]      | 绘制结束dom的偏移量                                          |
  | measureTooltipPosition | String      | 否   | bottom-center | 绘制结束dom定位                                              |
  | helpElement            | HTMLElement | 是   |               | 帮助信息dom                                                  |
  | helpTooltipOffset      | Array       | 否   | [0, -15]      | 帮助信息dom的偏移量                                          |
  | helpTooltipPosition    | String      | 否   | center-left   | 帮助信息dom的定位                                            |
  | changeCallback         | Function    | 否   |               | 绘制过程中的回调函数，返回绘制过程中测量的长度或面积         |
  | callback               | Function    | 否   |               | 绘制结束的回调函数，返回一个Object,属性如下：<br>{<br>output:String 测量的面积或长度<br>feature:ol/feature 绘制结束的feature<br>} |

- ##### ContextMenuOpt

  | 参数        | 类型        | 必填 | 默认值      | 说明                               |
  | ----------- | ----------- | ---- | ----------- | ---------------------------------- |
  | element     | HTMLElement | 是   |             | 右键菜单dom                        |
  | offset      | Array       | 否   | [0, -15]    | dom偏移量                          |
  | positioning | String      | 否   | center-left | dom位置                            |
  | callback    | Function    | 否   |             | 回调函数，返回右键菜单是否创建成功 |

#### 方法

​	

| 方法                                             | 返回值         | 说明               |
| ------------------------------------------------ | -------------- | ------------------ |
| setFInteraction(opt : InteractionOpt)            | ol/interaction | 初始化交互         |
| removeFInteraction(interaction : ol/interaction) |                | 删除交互           |
| openMeasureTool(opt : MeasureOpt)                |                | 开启测量工具       |
| closeMeasureTool()                               |                | 关闭测量工具       |
| setFContextMenu(opt : ContextMenuOpt)            | ContextMenuRes | 自定义右键菜单     |
| closeFContextMenu(keys : ContextMenuRes)         |                | 关闭自定义右键菜单 |



#### 示例



### 六、事件

#### 参数

- ##### FeatureOpt

  | 参数     | 类型     | 必填 | 默认值 | 说明                                                         |
  | -------- | -------- | ---- | ------ | ------------------------------------------------------------ |
  | type     | String   | 是   |        | 事件类型<br>singleclick:单击事件<br>pointermove:鼠标经过事件<br> |
  | multi    | Boolean  | 否   | false  | 是否可以返回多个                                             |
  | callback | Function | 否   |        | 回调函数，返回一个Object，属性如下：<br>{<br>features: ol/feature 响应事件的所有feature,<br>all:Object 响应事件返回的数据<br>} |

- ##### MapOpt

  | 参数     | 类型     | 必填 | 默认值 | 说明                                                         |
  | -------- | -------- | ---- | ------ | ------------------------------------------------------------ |
  | type     | String   | 是   |        | 事件类型                                                     |
  | callback | Function | 否   |        | 回调函数，返回一个Object，属性如下：<br>{<br>coordinate: 响应事件的坐标点,<br>pixel:响应事件的像素坐标<br>type:事件类型<br>all:Object 响应事件返回的数据
} |


#### 方法

| 方法                                    | 返回值     | 说明            |
| --------------------------------------- | ---------- | --------------- |
| setFFeatureEvent(opt : FeatureOpt)      | FeatureRes | 添加feature事件 |
| removeFFeatureEvent(event : FeatureRes) |            | 删除feature事件 |
| setFMapEvent(opt : MapOpt)              | MapRes     | 添加Map事件     |
| removeFMapEvent(event : MapRes)         |            | 删除Map事件     |



#### 示例



### 七、覆盖物

#### 参数

#### 方法

#### 示例

### 八、可视化

