/**
 * Core type definitions and interfaces for ts-ascii-engine
 * @module types/interfaces
 */
/**
 * Predefined character sets for ASCII rendering
 */
export var CharsetPreset;
(function (CharsetPreset) {
    /** High-density block characters: ██▓▒░  */
    CharsetPreset["BLOCK"] = "BLOCK";
    /** Standard ASCII density ramp: @%#*+=-:. */
    CharsetPreset["STANDARD"] = "STANDARD";
    /** Minimal 3-character set: @+. */
    CharsetPreset["MINIMAL"] = "MINIMAL";
    /** Extended detail set with more gradations */
    CharsetPreset["EXTENDED"] = "EXTENDED";
    /** Custom user-provided charset */
    CharsetPreset["CUSTOM"] = "CUSTOM";
})(CharsetPreset || (CharsetPreset = {}));
/**
 * Character set mappings (ordered from darkest to lightest)
 */
export const CHARSET_MAP = {
    [CharsetPreset.BLOCK]: '██▓▒░ ',
    [CharsetPreset.STANDARD]: '@%#*+=-:. ',
    [CharsetPreset.MINIMAL]: '@+. ',
    [CharsetPreset.EXTENDED]: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. '
};
//# sourceMappingURL=interfaces.js.map