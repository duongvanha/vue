export class Dep {

    constructor() {
        this.dependencies = new Set()
    }

    depend(target) {
        return typeof target === 'function' && this.dependencies.add(target)
    }


    notify() {
        this.dependencies.forEach(callback => callback())
    }

}
