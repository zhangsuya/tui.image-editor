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

    // const secondCanvas = document.createElement('canvas');
    // const cctx = secondCanvas.getContext('2d');
    // secondCanvas.width = myCanvas.width;
    // secondCanvas.height = myCanvas.height;

    newCanvasContext.fillStyle = 'white';
    newCanvasContext.fill();
    const realPath = path.path;
    realPath.stroke = 'red';
    realPath.strokeWidth = 2;
    realPath.strokeDashArray = [5, 5];
    newCnavs.add(realPath);
    // eslint-disable-next-line no-undef
    this._animateDashedLine(realPath);
    newCnavs.requestRenderAll();
    realPath.setCoords();
    realPath.animate('strokeDashOffset', '-=3', {
      duration: 100,
      onchange: this.getCanvas().renderAll.bind(this.getCanvas()),
      repeat: true,
    });
  }

  _onPathCreated(path) {
    console.log('FreeCircleSelecte end');
    const canvasEl = this.getCanvas().getSelectionElement();
    const context = canvasEl.getContext('2d');
    // context.fillStyle = 'black';
    context.fillStyle = 'white';
    context.fill();
    const secondCanvas = document.createElement('canvas');
    const cctx = secondCanvas.getContext('2d');
    secondCanvas.width = canvasEl.width;
    secondCanvas.height = canvasEl.height;
    cctx.drawImage(canvasEl, 0, 0);

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvasEl.width, canvasEl.height);
    // redraw the saved chart back to the main canvas
    context.drawImage(secondCanvas, 0, 0);
    console.log(path.path);
    const params = this.graphics.createObjectProperties(path.path);
    this.fire(eventNames.FREE_ADDING_LINE, params);
  }

  // 定义动画函数
  _animateDashedLine(path) {
    const offset = 0;
    const speed = 1;
    // 启动动画
    // eslint-disable-next-line no-undef
    this._animate(offset, speed, path);
  }

  _animate(offset, speed, path) {
    offset += speed;
    console.log('FreeCircleSelecte animate');
    console.log(offset);
    path.set({
      strokeDashOffset: -offset,
    });

    this.getCanvas().renderAll();
    setTimeout(() => {
      this._animate(offset, speed, path);
    }, 10);
    // 循环调用动画函数
  }
}

export default FreeCircleSelecte;
