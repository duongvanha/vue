import * as React                     from './core/vdom'
import { diff, mount, render }        from './core/vdom'
import { Dep, popTarget, pushTarget } from './core/observer';

export default class Vue {
    constructor(opts = {}) {
        this.$options         = opts;
        this.$updateComponent = this.$updateComponent.bind(this);
        this.changeImage      = this.changeImage.bind(this);
        this.$computed        = {
            total: () => {
                return this.price * this.quantity
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
            image   : 1,
            images  : [
                'http://giphygifs.s3.amazonaws.com/media/d6ZTWNjgdmUrS/giphy.gif',
                'https://media.giphy.com/media/26gsoiMSwKSYfGb96/giphy.gif',
                'https://media.giphy.com/media/3oriNN5kkARo7ZAhuE/giphy.gif',
                'https://media.giphy.com/media/9PnFM8Mc4uPy6kt1km/giphy.gif',
                'https://media.giphy.com/media/l5DSvPDptQv4i6Gt3c/giphy.gif',
                'https://media.giphy.com/media/3ov9k78PCKPx9IoBs4/giphy.gif',
                'http://giphygifs.s3.amazonaws.com/media/SQDhiHr5amWas/giphy.gif',
            ],
        }
    }

    render() {
        return <div id="app" dataCount={this.count}>
            <img src={this.images[this.image]} alt={this.image} onClick={this.changeImage}/>
            <p id={this.count}>hello</p>
            price: {this.price} quantity: {this.quantity} total: {this.total}
        </div>
    }

    changeImage() {
        this.image = Math.round(Math.random() * (6))
    }

    $updateComponent() {
        if (!this.$options.el) {
            return
        }
        const newDoms    = this.render();
        console.log(newDoms);
        const patch      = diff(this.$doms, newDoms);
        this.$options.el = patch(this.$options.el);

        this.$doms = newDoms
    }

    $initComputed() {
        this.$walk(this.$computed, (key, val) => {
            const target = () => {
                console.log('update');
                this[key] = val();
                this.$updateComponent();
            };
            pushTarget(target);
            target();

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

        // setInterval(() => {
        //     this.price = this.price + 1
        //     // console.log(this.price);
        //     // console.log(this.total);
        // }, 1000)

    }

    $initData() {
        const data = this.$options.data = this.data();
        this.$reactiveData(data);
    }


    $reactiveData(data) {
        pushTarget(this.$updateComponent);
        this.$walk(data, (key, val) => {
            const dep = new Dep();

            const attributes = {
                get() {
                    console.log('get');
                    dep.depend();
                    return val
                },
                set(newVal) {
                    console.log('set');
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

