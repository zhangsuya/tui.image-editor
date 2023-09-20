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
    console.log('FreeCircleSelecte setBrush');
    console.log(setting);

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
    // if (!self.renderCanvas) {
    //   return;
    // }
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
    realPath.stroke = 'black';
    // realPath.strokeWidth = 2;
    // realPath.strokeDashArray = [5, 5];
    newCnavs.add(realPath);
    // eslint-disable-next-line no-undef
    // this._animateDashedLine(realPath);
    newCnavs.requestRenderAll();
    const link = document.createElement('a');
    link.href = newCanvasEle.toDataURL();
    const ext = 'png';
    link.download = `eraser_example.${ext}`;
    link.click();
    // realPath.setCoords();
    // realPath.animate('strokeDashOffset', '-=3', {
    //   duration: 100,
    //   onchange: this.getCanvas().renderAll.bind(this.getCanvas()),
    //   repeat: true,
    // });
  }

  _onPathCreated(path) {
    console.log(path.path);
    // strokeDashArray: [5, 5]

    // if (!self.renderCanvas) {
    //   return;
    // }
    console.log('FreeCircleSelecte end');
    path.path.fill = 'white';
    this.getCanvas().renderTop();
    const canvasEl = this.getCanvas().getSelectionElement();

    /* 先复制出来一份 */
    const newCanvasEle = document.createElement('canvas');
    newCanvasEle.width = canvasEl.width;
    newCanvasEle.height = canvasEl.height;
    const newCanvasContext = newCanvasEle.getContext('2d');
    newCanvasContext.drawImage(canvasEl, 0, 0);
    /* 填充白色  这里可能也需要一个canvas中转下*/

    // newCanvasContext.fillStyle = 'white';
    // newCanvasContext.fill();
    // newCanvasContext.drawImage(firstCanvas, 0, 0);

    // const secondCanvas = document.createElement('canvas');
    // const cctx = secondCanvas.getContext('2d');
    // secondCanvas.width = canvasEl.width;
    // secondCanvas.height = canvasEl.height;
    // cctx.drawImage(canvasEl, 0, 0);

    // newCanvasContext.fillStyle = 'black';
    // newCanvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
    // // redraw the saved chart back to the main canvas
    // newCanvasContext.drawImage(secondCanvas, 0, 0);
    // 真正的填充

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

    // 把填充后的canvasEl复制出来
    const firstCanvas = document.createElement('canvas');
    const firstcctx = firstCanvas.getContext('2d');
    firstCanvas.width = canvasEl.width;
    firstCanvas.height = canvasEl.height;
    firstcctx.drawImage(canvasEl, 0, 0);
    // 把原来的canvasEl复制出来
    // context.globalAlpha = 0;
    // context.fillStyle = 'rgba(255, 255, 255, 0)';
    // context.fillRect(0, 0, canvasEl.width, canvasEl.height);
    // context.drawImage(newCanvasEle, 0, 0);

    const params = this.graphics.createObjectProperties(path.path);
    this.fire(eventNames.FREE_ADDING_LINE, params);
    // const link = document.createElement('a');
    // link.href = firstCanvas.toDataURL();
    // const ext = 'png';
    // link.download = `eraser_example.${ext}`;
    // link.click();

    // const link2 = document.createElement('a');
    // link2.href = newCanvasEle.toDataURL();
    // link2.download = `eraser_example.${ext}`;
    // link2.click();
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
