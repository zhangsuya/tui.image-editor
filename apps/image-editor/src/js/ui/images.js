import Colorpicker from '@/ui/tools/colorpicker';
import Submenu from '@/ui/submenuBase';
import templateHtml from '@/ui/template/submenu/images';
import { isSupportFileApi, assignmentForDestroy } from '@/util';
import { eventNames, selectorNames } from '@/consts';

/**
 * Images ui class
 * @class
 * @ignore
 */
class Images extends Submenu {
  constructor(
    subMenuElement,
    { locale, makeSvgIcon, makeImages, srcs, menuBarPosition, usageStatistics }
  ) {
    super(subMenuElement, {
      locale,
      name: 'images',
      makeSvgIcon,
      makeImages,
      srcs,
      menuBarPosition,
      templateHtml,
      usageStatistics,
    });
    this.srcs = srcs;
    this.iconType = null;
    this._iconMap = {};

    this._els = {
      apply: this.selector('.tie-images-button .apply'),
      cancel: this.selector('.tie-images-button .cancel'),
      registerIconButton: this.selector('.tie-icon-image-file'),
      addImageButton: this.selectorAll('.tui-image-editor-submenu-images-item'),
      loadImageButton: this.selector('.tui-image-editor-load-btn'),
      drawColorPicker: new Colorpicker(this.selector('.tie-images-color'), {
        defaultColor: '#ffffff',
        toggleDirection: this.toggleDirection,
        usageStatistics: this.usageStatistics,
      }),
      iconColorpicker: new Colorpicker(this.selector('.tie-icon-color'), {
        defaultColor: '#ffffff',
        toggleDirection: this.toggleDirection,
        usageStatistics: this.usageStatistics,
      }),
    };
    // console.log('this._els.addImageButton');
    // console.log(this._els.addImageButton);

    this.type = null;
    this.color = this._els.drawColorPicker.color;

    this.colorPickerInputBox = this._els.iconColorpicker.colorpickerElement.querySelector(
      selectorNames.COLOR_PICKER_INPUT_BOX
    );
    const addImage = this._addImageHandler.bind(this);
    for (let i = 0; i < this._els.addImageButton.length; i = i + 1) {
      const imageButton = this._els.addImageButton[i];
      imageButton.addEventListener('click', addImage);
    }
    this._els.drawColorPicker.on('change', this._changeDrawColor.bind(this));
  }

  /**
   * Destroys the instance.
   */
  destroy() {
    this._removeEvent();
    this._els.iconColorpicker.destroy();

    assignmentForDestroy(this);
  }

  changeStartMode() {
    // this.actions.modeChange('images');
  }

  /**
   * Change drawing color
   * @param {string} color - select drawing color
   * @private
   */
  _changeDrawColor(color) {
    this.color = color || 'transparent';
    console.log(this.color);
    console.log(this.actions);

    this.actions.changeColor(this.color);
  }

  /**
   * Add event for icon
   * @param {Object} actions - actions for icon
   *   @param {Function} actions.registerCustomIcon - register icon
   *   @param {Function} actions.addImage - add icon
   *   @param {Function} actions.changeColor - change icon color
   */
  addEvent(actions) {
    console.log('image addEvent');
    console.log(this._els.apply);
    const apply = this._applyEventHandler.bind(this);
    const cancel = this._cancelEventHandler.bind(this);
    const registerIcon = this._registerIconHandler.bind(this);
    const addImage = this._addImageHandler.bind(this);
    const loadImage = this._loadImageHandler.bind(this);

    this.eventHandler = {
      apply,
      cancel,
      registerIcon,
      addImage,
      loadImage,
    };

    this.actions = actions;
    this._els.apply.addEventListener('click', apply);
    this._els.cancel.addEventListener('click', cancel);
    this._els.iconColorpicker.on('change', this._changeColorHandler.bind(this));
    this._els.registerIconButton.addEventListener('change', registerIcon);
    this._els.loadImageButton.addEventListener('change', loadImage);
    this._els.cancel.classList.add('active');
    // this._els.addImageButton((imageButton) => {
    //   imageButton.addEventListener('click', addImage);
    // });
    // this._els.addImageButton.addEventListener('click', addImage);

    this.colorPickerInputBox.addEventListener(
      eventNames.FOCUS,
      this._onStartEditingInputBox.bind(this)
    );
    this.colorPickerInputBox.addEventListener(
      eventNames.BLUR,
      this._onStopEditingInputBox.bind(this)
    );
  }

  /**
   * Remove event
   * @private
   */
  _removeEvent() {
    this._els.iconColorpicker.off();
    // this._els.apply.removeEventListener('click', this.eventHandler.apply);
    // this._els.cancel.removeEventListener('click', this.eventHandler.cancel);
    this._els.registerIconButton.removeEventListener('change', this.eventHandler.registerIcon);
    // eslint-disable-next-line array-callback-return
    // this._els.addImageButton.map((imageButton) => {
    //   imageButton.removeEventListener('click', this.eventHandler.addImage);
    // });
    this.colorPickerInputBox.removeEventListener(
      eventNames.FOCUS,
      this._onStartEditingInputBox.bind(this)
    );
    this.colorPickerInputBox.removeEventListener(
      eventNames.BLUR,
      this._onStopEditingInputBox.bind(this)
    );
  }

  /**
   * Clear icon type
   */
  clearIconType() {
    this.iconType = null;
  }

  /**
   * Set icon picker color
   * @param {string} iconColor - rgb color string
   */
  setIconPickerColor(iconColor) {
    this._els.iconColorpicker.color = iconColor;
  }

  /**
   * Returns the menu to its default state.
   */
  changeStandbyMode() {
    // this.clearIconType();
    // this.actions.canceladdImage();
  }

  /**
   * Change apply button status
   * @param {Boolean} enableStatus - apply button status
   */
  changeApplyButtonStatus(enableStatus) {
    if (enableStatus) {
      this._els.apply.classList.add('active');
    } else {
      this._els.apply.classList.remove('active');
    }
  }

  _applyEventHandler() {
    this.actions.mix();
    this._els.apply.classList.remove('active');
  }

  _cancelEventHandler() {
    console.log('cancel');
    this.actions.cancel();
    this._els.apply.classList.remove('active');
  }

  /**
   * Change icon color
   * @param {string} color - color for change
   * @private
   */
  _changeColorHandler(color) {
    color = color || 'transparent';
    this.actions.changeColor(color);
  }

  /**
   * Change icon color
   * @param {object} event - add button event object
   * @private
   */
  _addImageHandler(event) {
    const index = event.target.getAttribute('id');
    console.log('index');
    console.log(index);
    const src = this.srcs[index];
    src.onclick(index);
    // if (button) {
    //   const iconType = button.getAttribute('data-icontype');
    //   const iconColor = this._els.iconColorpicker.color;
    //   this.actions.discardSelection();
    //   this.actions.changeSelectableAll(false);
    //   this._els.addImageButton.classList.remove(this.iconType);
    //   this._els.addImageButton.classList.add(iconType);

    //   if (this.iconType === iconType) {
    //     this.changeStandbyMode();
    //   } else {
    //     this.actions.addImage(iconType, iconColor);
    //     this.iconType = iconType;
    //   }
    // }
  }

  _loadImageHandler(event) {
    this.actions.load(event.target.files[0]);
  }

  /**
   * register icon
   * @param {object} event - file change event object
   * @private
   */
  _registerIconHandler(event) {
    let imgUrl;

    if (!isSupportFileApi) {
      alert('This browser does not support file-api');
    }

    const [file] = event.target.files;

    if (file) {
      imgUrl = URL.createObjectURL(file);
      this.actions.registerCustomIcon(imgUrl, file);
    }
  }
}

export default Images;
