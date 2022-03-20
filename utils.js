export const up = "w";
export const down = "s";
export const left = "a";
export const right = "d";
export const SHIFT = "shift";
export const DIRECTIONS = [up, left, down, right];
export let isMoblieDevice = false;
if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
) {
    isMoblieDevice = true;
}

export class KeyDisplay {
    map = new Map();

    constructor() {
        const w = htmlToElements("<div>W</div>");
        const a = htmlToElements("<div>A</div>");

        const s = htmlToElements("<div>S</div>");
        const d = htmlToElements("<div>D</div>");
        //const shift = document.createElement("div")

        w.className = `aClassUp  ${
            isMoblieDevice ? "keyBoardHidden" : "keyBoardClass"
        }`;
        a.className = `aClassLeft  ${
            isMoblieDevice ? "keyBoardHidden" : "keyBoardClass"
        }`;
        s.className = `aClassDown  ${
            isMoblieDevice ? "keyBoardHidden" : "keyBoardClass"
        }`;
        d.className = `aClassRight  ${
            isMoblieDevice ? "keyBoardHidden" : "keyBoardClass"
        }`;

        this.map.set(up, w);
        this.map.set(left, a);
        this.map.set(down, s);
        this.map.set(right, d);
        //this.map.set(SHIFT, shift)

        this.map.forEach((v, _) => {
            document.body.append(v);
        });
    }

    down(key) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.opacity = "1";
            this.map.get(key.toLowerCase()).style.background = "#ffffff5e";
        }
    }

    up(key) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.opacity = "0.5";
            this.map.get(key.toLowerCase()).style.background = "none";
        }
    }
}

export function htmlToElements(html) {
    var template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
