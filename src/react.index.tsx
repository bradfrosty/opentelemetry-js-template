// for react entrypoints

import React, { useState } from 'react';
import { render } from 'react-dom';

import './index.css';

function App() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return (
    <div>
      <h1>Hello React TS esbuild</h1>
      <button onClick={increment}>Click me {count}</button>
    </div>
  );
}

render(<App />, document.body);
