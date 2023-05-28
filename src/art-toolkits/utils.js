/**
 * Check if the value is the member of the enumObject
 * @param {Object} enumObject 
 * @param {string} value 
 * @returns 
 */
export function checkEnumMember(enumObject, value) {
    return Object.values(enumObject).includes(value);
}