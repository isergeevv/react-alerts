'use strict';

var react = require('react');

const getOptions = (opt) => ({
    time: opt?.time ?? 10000,
    fadeTime: opt?.fadeTime ?? 1000,
    alertTypes: opt?.alertTypes ?? {
        normal: {
            bg: 'lightblue',
            text: 'black',
        },
        success: {
            bg: 'green',
            text: 'white',
        },
        warn: {
            bg: 'yellow',
            text: 'black',
        },
        danger: {
            bg: 'red',
            text: 'white',
        },
    },
});
var index = (props = {}) => {
    const [messages, setMessages] = react.useState([]);
    const idCounter = react.useRef(0);
    const timeout = react.useRef();
    const options = getOptions(props);
    const defaultAlertType = Object.keys(options.alertTypes)[0];
    if (!defaultAlertType) {
        throw new Error('[Alerts] Missing alert types.');
    }
    const push = (title, text, type = defaultAlertType) => {
        setMessages((prev) => [
            ...prev,
            {
                id: ++idCounter.current,
                title: title,
                text: text,
                type: type,
                remove: Date.now() + options.time,
            },
        ]);
    };
    const remove = (id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };
    react.useEffect(() => {
        if (messages.length) {
            const time = Date.now();
            for (let i = 0; i < messages.length; i++) {
                const id = messages[i].id;
                if (messages[i].remove < time)
                    remove(id);
                timeout.current = setTimeout(() => {
                    remove(id);
                }, messages[i].remove - time);
                break;
            }
        }
        return () => {
            clearTimeout(timeout.current);
        };
    }, [messages]);
    return {
        push,
        remove,
        types: options.alertTypes,
        duration: options.time,
        fadeTime: options.fadeTime,
        messages,
    };
};

module.exports = index;
