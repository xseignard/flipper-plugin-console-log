import React, { useEffect } from 'react';
import traverse from 'traverse';

const METRO_PORT = 8081;
const METRO_HOST = 'localhost';
const METRO_LOGS = `ws://${METRO_HOST}:${METRO_PORT}/events`;

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function devicePlugin() {
  return {};
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const ws = new WebSocket(METRO_LOGS);

  useEffect(() => {
    ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      try {
        const data = [...message.data];
        traverse(data).forEach(function (item: string) {
          try {
            const parsed = JSON.parse(item);
            // @ts-ignore
            this.update(parsed);
          } catch (e) {}
        });
        if (data[1] === '!==') {
          // @ts-ignore
          data.forEach(d => console[message.level](d));
        // @ts-ignore
        } else console[message.level](...data);
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <h1>Open the dev tools</h1>
    </div>
  );
}
