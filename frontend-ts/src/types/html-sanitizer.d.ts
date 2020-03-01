declare module 'html-sanitizer' {
    export function load (html: string): {clean: (cb: (text: string) => string) => string}
}
