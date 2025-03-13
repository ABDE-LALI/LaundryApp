import Keyboard from 'react-simple-keyboard';
import { useState } from 'react';

const VirtualKeyboard = () => {
  const [input, setInput] = useState('');
  const [layout, setLayout] = useState('default');

  const onChange = (inputValue) => setInput(inputValue);
  const onKeyPress = (button) => {
    if (button === '{shift}' || button === '{lock}') setLayout(layout === 'default' ? 'shift' : 'default');
  };

  return (
    <div className="keyboard">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here with keyboard"
        className="p-2 border rounded"
      />
      <Keyboard
        layoutName={layout}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="mt-2"
      />
    </div>
  );
};

export default VirtualKeyboard;