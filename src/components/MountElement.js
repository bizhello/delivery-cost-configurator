export class MountElement {
    constructor(li, ul) {
        this.li = li;
        this.ul = ul
    }

    mount() {
        this.ul.append(this.li);
    }
}