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
    this.width = 3;

    this.renderCanvas = false;

    /**
     * fabric.Color instance for brush color
     * @type {fabric.Color}
     */
    this.oColor = new fabric.Color('rgba(0, 114, 189, 255)');
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
    // console.log('FreeCircleSelecte setBrush');
    // console.log(setting);

    this.width = setting.width || this.width;
    if (setting.color) {
      this.oColor = new fabric.Color(setting.color);
    }
    if (setting.renderCanvas) {
      this.renderCanvas = setting.renderCanvas;
    }
    brush.width = this.width;
    brush.color = this.oColor.toRgba();
    brush.strokeDashArray = [15, 15];
  }

  /**
   * End free drawing mode
   */
  end() {
    const canvas = this.getCanvas();

    canvas.isDrawingMode = false;
  }

  _onBeforePathCreated(path) {
    // console.log('FreeCircleSelecte end');
    console.log(path);
  }

  _onPathCreated(path) {
    console.log('FreeCircleSelecte end');
    path.path.fill = 'white';
    this.getCanvas().renderTop();
    const canvasEl = this.getCanvas().getSelectionElement();

    const context = canvasEl.getContext('2d');
    // context.fillStyle = 'black';
    context.fillStyle = 'white';
    context.fill();
    /* 先复制出来一份 */
    const newCanvasEle = document.createElement('canvas');
    newCanvasEle.width = canvasEl.width;
    newCanvasEle.height = canvasEl.height;
    const newCanvasContext = newCanvasEle.getContext('2d');
    newCanvasContext.fillStyle = 'black';
    newCanvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height); // redraw the saved chart back to the main canvas
    newCanvasContext.drawImage(canvasEl, 0, 0);

    // const params = this.graphics.createObjectProperties(path.path);
    this.fire(eventNames.FREE_ADDING_LINE, newCanvasEle.toDataURL());
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
