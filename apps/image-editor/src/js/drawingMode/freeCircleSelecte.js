import DrawingMode from '@/interface/drawingMode';
import { drawingModes, componentNames as components } from '@/consts';

/**
 * FreeDrawingMode class
 * @class
 * @ignore
 */
class FreeCircleSelecteMode extends DrawingMode {
  constructor() {
    super(drawingModes.FREE_CIRCLE_SELECTE);
  }

  /**
   * start this drawing mode
   * @param {Graphics} graphics - Graphics instance
   * @param {{width: ?number, color: ?string}} [options] - Brush width & color
   * @override
   */
  start(graphics, options) {
    const freeDrawing = graphics.getComponent(components.FREE_CIRCLE_SELECTE);
    freeDrawing.start(options);
  }

  /**
   * stop this drawing mode
   * @param {Graphics} graphics - Graphics instance
   * @override
   */
  end(graphics) {
    const freeDrawing = graphics.getComponent(components.FREE_CIRCLE_SELECTE);
    freeDrawing.end();
  }
}

export default FreeCircleSelecteMode;
