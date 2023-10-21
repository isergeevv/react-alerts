import { useEffect, useRef, useState } from 'react';

export interface AlertMessage {
  id: number;
  title: string;
  text: string;
  type: string;
  remove: number;
}

export interface AlertType {
  bg: string;
  text: string;
}

export type AlertTypes = Record<string, AlertType>;

export interface AlertOptions {
  time: number;
  fadeTime: number;
  alertTypes: AlertTypes;
}

const getOptions = (opt: Partial<AlertOptions>): AlertOptions => ({
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

export default (props: Partial<AlertOptions> = {}) => {
  const [messages, setMessages] = useState<AlertMessage[]>([]);

  const idCounter = useRef(0);
  const timeout = useRef<NodeJS.Timeout>();

  const options = getOptions(props);
  const defaultAlertType = Object.keys(options.alertTypes)[0];
  if (!defaultAlertType) {
    throw new Error('[Alerts] Missing alert types.');
  }

  const push = (title: string, text: string, type = defaultAlertType) => {
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

  const remove = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  useEffect(() => {
    if (messages.length) {
      const time = Date.now();
      for (let i = 0; i < messages.length; i++) {
        const id = messages[i].id;
        if (messages[i].remove < time) remove(id);

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
