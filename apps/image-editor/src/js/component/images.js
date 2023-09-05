import { fabric } from 'fabric';
import forEach from 'tui-code-snippet/collection/forEach';
import Component from '@/interface/component';
import { eventNames as events, componentNames } from '@/consts';

const pathMap = {
  arrow: 'M 0 90 H 105 V 120 L 160 60 L 105 0 V 30 H 0 Z',
  cancel:
    'M 0 30 L 30 60 L 0 90 L 30 120 L 60 90 L 90 120 L 120 90 ' +
    'L 90 60 L 120 30 L 90 0 L 60 30 L 30 0 Z',
};

/**
 * Images
 * @class Images
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class Images extends Component {
  constructor(graphics) {
    super(componentNames.IMAGES, graphics);

    /**
     * Default icon color
     * @type {string}
     */
    this._oColor = '#000000';

    /**
     * Path value of each icon type
     * @type {Object}
     */
    this._pathMap = pathMap;

    /**
     * Type of the drawing icon
     * @type {string}
     * @private
     */
    this._type = null;

    /**
     * Color of the drawing icon
     * @type {string}
     * @private
     */
    this._iconColor = null;

    /**
     * Event handler list
     * @type {Object}
     * @private
     */
    this._handlers = {
      mousemove: this._onFabricMouseMove.bind(this),
      mouseup: this._onFabricMouseUp.bind(this),
    };
  }

  /**
   * Set states of the current drawing shape
   * @ignore
   * @param {string} type - Icon type ('arrow', 'cancel', custom icon name)
   * @param {string} iconColor - Icon foreground color
   */
  setStates(type, iconColor) {
    this._type = type;
    this._iconColor = iconColor;
  }

  /**
   * Start to draw the icon on canvas
   * @ignore
   */
  start() {
    const canvas = this.getCanvas();
    canvas.selection = false;
    canvas.on('mouse:down', this._handlers.mousedown);
  }

  /**
   * End to draw the icon on canvas
   * @ignore
   */
  end() {
    const canvas = this.getCanvas();

    canvas.selection = true;
    canvas.off({
      'mouse:down': this._handlers.mousedown,
    });
  }

  /**
   * Register icon paths
   * @param {{key: string, value: string}} pathInfos - Path infos
   */
  registerPaths(pathInfos) {
    forEach(
      pathInfos,
      (path, type) => {
        this._pathMap[type] = path;
      },
      this
    );
  }

  /**
   * Set icon object color
   * @param {string} color - Color to set
   * @param {fabric.Path}[obj] - Current activated path object
   */
  setColor(color, obj) {
    console.log(obj);
    this._oColor = color;
    this.getCanvas().setBackgroundColor('red', function () {});
  }

  /**
   * Get icon color
   * @param {fabric.Path}[obj] - Current activated path object
   * @returns {string} color
   */
  getColor(obj) {
    return obj.fill;
  }

  /**
   * Create icon object
   * @param {string} path - Path value to create icon
   * @returns {fabric.Path} Path object
   */
  _createIcon(path) {
    return new fabric.Path(path);
  }

  /**
   * MouseDown event handler on canvas
   * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
   * @private
   */

  /**
   * MouseMove event handler on canvas
   * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
   * @private
   */
  _onFabricMouseMove(fEvent) {
    const canvas = this.getCanvas();

    if (!this._icon) {
      return;
    }
    const moveOriginPointer = canvas.getPointer(fEvent.e);

    const scaleX = (moveOriginPointer.x - this._startPoint.x) / this._icon.width;
    const scaleY = (moveOriginPointer.y - this._startPoint.y) / this._icon.height;

    this._icon.set({
      scaleX: Math.abs(scaleX * 2),
      scaleY: Math.abs(scaleY * 2),
    });

    this._icon.setCoords();
    canvas.renderAll();
  }

  /**
   * MouseUp event handler on canvas
   * @private
   */
  _onFabricMouseUp() {
    const canvas = this.getCanvas();
    console.log('Images _onFabricMouseUp');
    this.fire(events.OBJECT_ADDED, this.graphics.createObjectProperties(this._icon));

    this._icon = null;

    canvas.off('mouse:down', this._handlers.mousedown);
    canvas.off('mouse:move', this._handlers.mousemove);
    canvas.off('mouse:up', this._handlers.mouseup);
  }
}

export default Images;
