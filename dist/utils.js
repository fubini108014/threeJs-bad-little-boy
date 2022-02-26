export const up = "w";
export const down = "s";
export const left = "a";
export const right = "d";
export const SHIFT = "shift";
export const DIRECTIONS = [up, left, down, right];

export class KeyDisplay {
    map = new Map();

    constructor() {
        const w = htmlToElements("<div>&#8593;</div>");
        const a = htmlToElements("<div>&#8592;</div>");

        const s = htmlToElements("<div>&#8595;</div>");
        const d = htmlToElements("<div>&#8594;</div>");
        //const shift = document.createElement("div")
        w.className = "aClassUp keyBoardClass";
        a.className = "aClassLeft keyBoardClass";
        s.className = "aClassDown keyBoardClass";
        d.className = "aClassRight keyBoardClass";

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

function htmlToElements(html) {
    var template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
