/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeImages - svg icon generator
 * @returns {string}
 */
export default ({ locale, makeImages, srcs, makeSvgIcon }) => `
    <div class="tui-image-editor-submenu-images">
        ${makeImages(srcs)}
        <ul class="tui-image-editor-submenu-item">
            <li>
                <div class="tie-images-color" title="${locale.localize('Color')}"></div>
            </li>
            <li class="tui-image-editor-partition only-left-right">
                <div></div>
            </li>
            <li>
                <div class="tie-icon-color" title="${locale.localize('Color')}"></div>
            </li>
            <li class="tie-crop-button action">
            <div class="tui-image-editor-button apply">
                ${makeSvgIcon(['normal', 'active'], 'mask-load', true)}
                <input type="file" class="tui-image-editor-load-btn" />
                <label>
                    更换背景图片
                </label>
            </div>
        </li>
        </ul>
    </div>
`;
