/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeImages - svg icon generator
 * @returns {string}
 */
export default ({ locale, makeImages, srcs }) => `
    <div class="tui-image-editor-submenu-images">
        ${makeImages(srcs)}
        <li>
            <div class="tie-icon-color" title="${locale.localize('Color')}"></div>
        </li>
    </div>
`;
