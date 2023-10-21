import React, { useEffect } from 'react';
import Alerts, { AlertMessage, AlertTypes } from '../build/types/index';

type AlertsComponentProps = {
  messages: AlertMessage[];
  fadeTime: number;
  types: AlertTypes;
  removeAlert: (id: number) => void;
};
const AlertsComponent = ({ messages, fadeTime, types, removeAlert }: AlertsComponentProps) => {
  const currentTime = Date.now();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        translate: '-50%',
        width: '100%',
        maxWidth: '500px',
        opacity: '0.8',
      }}
    >
      <style>
        {`
          @keyframes alertFade {
            to {
              opacity: 0;
            }
          }
        `}
      </style>
      {messages.map((message) => {
        const timeLeft = Math.max(message.remove - currentTime, 0);
        const opacity = timeLeft > 0 ? Math.max(fadeTime / timeLeft, 1) : 0;
        const delay = Math.max(timeLeft - fadeTime, 0);
        const duration = Math.min(timeLeft, fadeTime);

        return (
          <div
            key={message.id}
            style={{
              color: types[message.type].text,
              display: 'flex',
              position: 'relative',
              flexDirection: 'column',
              width: '100%',
              padding: '0.5rem',
              border: '1px solid grey',
              borderRadius: '0.75rem',
              animation: 'alertFade',
              opacity: `${opacity}`,
              animationDelay: `${delay}ms`,
              animationDuration: `${duration}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: types[message.type].bg,
                opacity: `0.8`,
                zIndex: '-1',
              }}
            ></div>
            <h3>
              {message.title}
              {message.id}
            </h3>
            <p>{message.text}</p>
            <button
              style={{
                all: 'unset',
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                translate: '0 -50%',
                color: types[message.type].text,
                cursor: 'pointer',
              }}
              onClick={() => removeAlert(message.id)}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default () => {
  const alerts = Alerts();

  const removeAlert = (id: number) => {
    alerts.remove(id);
  };

  useEffect(() => {
    alerts.push('Title', 'Test message');
    alerts.push('Title', 'Test message');
    alerts.push('Title', 'Test message');
  }, []);

  return (
    <AlertsComponent
      messages={alerts.messages}
      fadeTime={alerts.fadeTime}
      types={alerts.types}
      removeAlert={removeAlert}
    />
  );
};
