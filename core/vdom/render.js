import { events } from './diff';

const setNativeValue = new Set(['string', 'number']);

const renderElem = ({tagName, attrs, children}) => {
    // create the element
    //   e.g. <div></div>
    const $el = document.createElement(tagName);

    // add all attributs as specified in vNode.attrs
    //   e.g. <div id="app"></div>
    for (const [k, v] of Object.entries(attrs)) {
        if (typeof v == 'function' && k.startsWith('on')) {
            $el[events]     = $el[events] || {};
            const eventType = k.slice(2).toLowerCase();
            $el.removeEventListener(eventType, $el[events][eventType]);
            $el[events][eventType] = v;
            $el.addEventListener(eventType, $el[events][eventType]);
        } else {
            $el.setAttribute(k, v);
        }
    }

    // append all children as specified in vNode.children
    //   e.g. <div id="app"><img></div>
    for (const child of children) {
        child && $el.appendChild(render(child));
    }

    return $el;
};

const render = vNode => {
    if (setNativeValue.has(typeof vNode)) {
        return document.createTextNode(vNode);
    }

    // we assume everything else to be a virtual element
    return renderElem(vNode);
};

export default render;
