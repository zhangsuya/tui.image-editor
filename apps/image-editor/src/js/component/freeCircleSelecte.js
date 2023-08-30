import { fabric } from 'fabric';
import Component from '@/interface/component';
import { eventNames, componentNames } from '@/consts';
/**
 * FreeDrawing
 * @class FreeDrawing
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class FreeCircleSelecte extends Component {
  constructor(graphics) {
    super(componentNames.FREE_CIRCLE_SELECTE, graphics);

    /**
     * Brush width
     * @type {number}
     */
    this.width = 1;

    /**
     * fabric.Color instance for brush color
     * @type {fabric.Color}
     */
    this.oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');
    /**
     * Listeners
     * @type {object.<string, function>}
     * @private
     */
    this._listeners = {
      beforePathCreated: this._onBeforePathCreated.bind(this),
      pathCreated: this._onPathCreated.bind(this),
    };
  }

  /**
   * Start free drawing mode
   * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
   */
  start(setting) {
    const canvas = this.getCanvas();

    canvas.on({
      'before:path:created': this._listeners.beforePathCreated,
      'path:created': this._listeners.pathCreated,
    });
    canvas.isDrawingMode = true;
    this.setBrush(setting);
  }

  /**
   * Set brush
   * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
   */
  setBrush(setting) {
    const brush = this.getCanvas().freeDrawingBrush;

    setting = setting || {};
    this.width = setting.width || this.width;
    if (setting.color) {
      this.oColor = new fabric.Color(setting.color);
    }
    brush.width = this.width;
    brush.color = this.oColor.toRgba();
  }

  /**
   * End free drawing mode
   */
  end() {
    const canvas = this.getCanvas();

    canvas.isDrawingMode = false;
  }

  _onBeforePathCreated(path) {
    console.log('FreeCircleSelecte end');
    // const canvasEl = this.getCanvas().getSelectionElement();
    // const context = canvasEl.getContext('2d');
    // // context.fillStyle = 'black';
    // context.fillStyle = 'white';
    // context.fill();
    // this.fire(eventNames.FREE_ADDING_LINE, path);
    // const link = document.createElement('a');
    // link.href = canvasEl.toDataURL();
    // const ext = 'png';
    // link.download = `eraser_example.${ext}`;
    // link.click();
    // console.log('FreeCircleSelecte click');

    const newCanvasEle = fabric.util.createCanvasElement();
    const myCanvas = this.getCanvas().getSelectionElement();

    const newCnavs = new fabric.Canvas(newCanvasEle);
    newCanvasEle.width = myCanvas.width;
    newCanvasEle.height = myCanvas.height;
    newCanvasEle.style.backgroundColor = 'black';
    const newCanvasContext = newCanvasEle.getContext('2d');
    newCanvasContext.fillStyle = 'black';
    newCanvasContext.fillRect(0, 0, newCanvasEle.width, newCanvasEle.height);
    newCanvasContext.fillStyle = 'white';
    newCanvasContext.fill();
    const realPath = path.path;
    newCnavs.add(realPath);
    newCnavs.requestRenderAll();
    realPath.setCoords();
    const link = document.createElement('a');
    link.href = myCanvas.toDataURL();
    const ext = 'png';
    link.download = `eraser_example.${ext}`;
    link.click();
  }

  _onPathCreated(path) {
    console.log('FreeCircleSelecte end');
    const canvasEl = this.getCanvas().getSelectionElement();
    const context = canvasEl.getContext('2d');
    // context.fillStyle = 'black';
    context.fillStyle = 'black';
    context.fill();
    this.fire(eventNames.FREE_ADDING_LINE, path);
    const link = document.createElement('a');
    link.href = canvasEl.toDataURL();
    const ext = 'png';
    link.download = `eraser_example.${ext}`;
    link.click();
    console.log('FreeCircleSelecte click');
  }
}

export default FreeCircleSelecte;
