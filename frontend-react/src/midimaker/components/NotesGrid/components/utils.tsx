import { range } from "lodash";
export function lightenDarkenColor(col: string, amt: number) {
    var usePound = true;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

const getCsec = (n: number) => `${(n) - (n % 1)}:${(n % 1 * 60) > 0 ? (Math.round(n % 1 * 60) < 10?`0${(Math.round(n % 1 * 60))}`:Math.round(n % 1 * 60) ) : '00'}`
export const formatDuration = (d: number)=> {
  
   return  d < 60 ? `00:${d < 10 ? 0 : ''}${getCsec(d)}` :
            `${Math.floor(d / 60) < 10 ? 0 : ''}${Math.floor(d / 60)}:${d % 60 < 10 ? 0 : ''}${getCsec(d % 60)}`
}

export const generateMarks = (compositionDuration: number, noteDuration: number, step: number) => {
    return range(0, compositionDuration + step, step).filter((n, idx) => 1 / noteDuration >= 4 ? idx : noteDuration === 1 ? (idx % 5) === 0 : (idx % 3) === 0).map((n) => ({
        value: n,
        label: n < 60 ? `00:${n < 10 ? 0 : ''}${step < 1 ? getCsec(n) : n}` :
            `${Math.floor(n / 60) < 10 ? 0 : ''}${Math.floor(n / 60)}:${n % 60 < 10 ? 0 : ''}${getCsec(n % 60)}`
    }))
}