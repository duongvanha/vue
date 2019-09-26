export class Dep {

    constructor() {
        this.dependencies = new Set();
    }

    depend() {
        return typeof Dep.target === 'function' && this.dependencies.add(Dep.target)
    }


    notify() {
        this.dependencies.forEach(cb => cb())
    }

}


Dep.target = null;

export function pushTarget(target) {
    Dep.target = target
}

export function popTarget() {
    Dep.target = null
}
