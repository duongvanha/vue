import * as React                     from './core/vdom'
import { diff, mount, render }        from './core/vdom'
import { Dep, popTarget, pushTarget } from './core/observer';

export default class Vue {
    constructor(opts = {}) {
        this.$options         = opts;
        this.$updateComponent = this.$updateComponent.bind(this);
        this.$computed        = {
            total: () => {
                return this.price + this.quantity
            },
        };
        this.$initData();
        this.$initComputed();

    }

    data() {
        return {
            count   : 1,
            price   : 2,
            quantity: 3,
        }
    }

    render() {
        return <div id="app" dataCount={this.count}>
            <img src="https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif" alt={1}/>
            <p id={this.count}>hello</p>
            price: {this.price} quantity: {this.quantity} total: {this.total}
        </div>
    }

    $updateComponent() {
        if (!this.$options.el) {
            return
        }
        const newDoms    = this.render();
        const patch      = diff(this.$doms, newDoms);
        this.$options.el = patch(this.$options.el);

        this.$doms = newDoms
    }

    $initComputed() {
        this.$walk(this.$computed, (key, val) => {
            const target = () => {
                this[key] = val();
                this.$updateComponent();
            };
            pushTarget(target);
            target();

            this.$walk(this.$options.data, (key, val) => val);
            popTarget();
        });

    }

    $walk(data, cb) {
        Object.keys(data).forEach(key => cb && cb(key, data[key]))
    }

    $mount(el) {
        if (typeof el === 'string') {
            el = document.querySelector(el)
        }

        const newDoms = this.render();

        this.$options.el = mount(render(newDoms), el);

        this.$doms = newDoms;

        setInterval(() => {
            this.price = this.price + 1
            // console.log(this.price);
            // console.log(this.total);
        }, 1000)

    }

    $initData() {
        const data = this.$options.data = this.data();
        this.$reactiveData(data);
    }


    $reactiveData(data) {
        pushTarget(this.$updateComponent);
        this.$walk(data, (key, val) => {
            const dep = new Dep(data, key, val);

            const attributes = {
                get() {
                    dep.depend();
                    return val
                },
                set(newVal) {
                    setTimeout(dep.notify.bind(dep), 0);
                    val = newVal;
                },
            };

            Object.defineProperty(data, key, attributes);
            Object.defineProperty(this, key, attributes);
        });

        this.$walk(data, (key, val) => val);
        popTarget()
    }


}

