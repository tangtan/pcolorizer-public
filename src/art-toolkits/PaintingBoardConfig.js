export const PaintingBoardToolTypeEnum = {
    StateStorage: "StateStorage",
    Pencil: "Pencil",
    ColorPicker: "ColorPicker",
    ColorPalette: "ColorPalette",
}

/**
 * The types of the tools in PaintingBoard
 * @typedef {Object} PaintingBoardToolTypeEnum
 * @property {string} StateStorage
 * @property {string} Pencil
 * @property {string} ColorPicker
 * @property {string} ColorPalette
 * @readonly
 * @enum {string}
 */


/** 
 * Defaultly supported tools in PaintingBoard
 * @type {Array<string>}
 * @constant 
 */
export const defaultPBToolTypes = [
    PaintingBoardToolTypeEnum.StateStorage,
    PaintingBoardToolTypeEnum.Pencil,
    PaintingBoardToolTypeEnum.ColorPalette,
]

/**
 * Defaultly supported width of the tool navigator
 * @type {number}
 * @constant
 */
export const defaultPBToolNavigatorWidth = 80;

/**
 * @type {boolean}
 * @constant
 */
export const defaultHasBottomPannel = true;

/**
 * @type {number}
 * @constant
 */
export const defaultPBPaintingNavigatorHeight = 28;