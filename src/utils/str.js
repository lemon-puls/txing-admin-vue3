export function camelToSnake(str) {
    // 使用正则表达式匹配所有连续的大写字母，并在它们前面添加下划线，然后将整个字符串转换为小写
    return str.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
}
