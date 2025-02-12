// CodeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CodeContext = createContext();

export const useCode = () => useContext(CodeContext);

export const CodeProvider = ({ children }) => {
  const savedCode = localStorage.getItem('code');
  const [code, setCode] = useState(savedCode || "// Write your code here");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    localStorage.setItem('code', code);
  }, [code]);

  return (
    <CodeContext.Provider value={{ code, setCode, stdin, setStdin, output, setOutput }}>
      {children}
    </CodeContext.Provider>
  );
};
