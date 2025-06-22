// components/CodeEditor.tsx
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript'; // or prism-python, prism-cpp etc.
import 'prismjs/themes/prism-tomorrow.css'; // dark theme

// Optional: Style for line numbers
import './editor.css'; // We'll define below

export default function CodeEditor({code,setCode}: {code: string, setCode: React.Dispatch<React.SetStateAction<string>>}) {
  // const [code, setCode] = useState('// write your code here\n');

  return (
    <div className="editor-wrapper min-h-[400px] m-1 ">
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={(code) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
        padding={10}
        textareaClassName="editor-textarea"
        className="editor min-h-1/2 min-w-full text-white"
      />
    </div>
  );
}
