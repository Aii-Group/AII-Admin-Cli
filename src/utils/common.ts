export function importImg(file: string, name: string) {
    return new URL(`/src/assets/${file}/${name}`, import.meta.url).href
}
