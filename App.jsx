import * as React              from './core/vdom'
import { diff, mount, render } from './core/vdom'
import { Dep }                 from './core/observer';

export default class Vue {
    constructor(opts = {}) {
        this.$options = opts;
        this.$initData();
        this.$initComputed();
        this.$updateComponent = this.$updateComponent.bind(this)
    }

    data() {
        return {
            count: 1,
        }
    }

    render() {
        // return React.createElement('div', {
        //     attrs   : {
        //         id       : 'app',
        //         dataCount: this.count,
        //     },
        //     children: [
        //         React.createElement('img', {
        //             attrs: {
        //                 src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif',
        //             },
        //         }),
        //         React. createElement('div', {
        //             children: ['The current count is: ', String(this.count)],
        //         }),
        //         'The current count is: ',
        //         String(this.count),
        //     ],
        // })
        return React.createElement("div", {
            id: "app",
            dataCount: this.count
        }, React.createElement("img", {
            src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif"
        }), "The current count is:", this.count)
    }

    $updateComponent() {
        const newDoms    = this.render();
        const patch      = diff(this.$doms, newDoms);
        this.$options.el = patch(this.$options.el);

        this.$doms = newDoms
    }

    $initComputed() {
    }

    $mount(el) {
        if (typeof el === 'string') {
            el = document.querySelector(el)
        }

        const newDoms = this.render();

        console.log(newDoms);

        this.$options.el = mount(render(newDoms), el)

        this.$doms = newDoms

        setInterval(() => {
            this.count = this.count + 1
        }, 100)

    }

    $initData() {
        const data = this.data();
        Object.assign(this, data)
        Object.keys(data).forEach(key => {
            let internalValue = data[key];

            const dep = new Dep();
            this[key] = data[key]

            Object.defineProperty(this, key, {
                get() {
                    dep.depend(this.$updateComponent);
                    return internalValue
                },
                set(newVal) {
                    dep.notify();
                    internalValue = newVal;
                },
            })
        })
    }

}

