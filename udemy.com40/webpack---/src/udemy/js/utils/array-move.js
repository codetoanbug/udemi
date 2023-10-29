export default function arrayMove(array, previousIndex, newIndex) {
    array = array.slice(0);
    if (newIndex >= array.length) {
        let k = newIndex - array.length;
        while (k-- + 1) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
    return array;
}
