import React, { useState, useRef } from "react";
import Input from 'rc-input';
import ReactDOM from "react-dom";
import './index.css';

const Popup = () => {
  const [currentRule, setCurrentRule] = useState<string[]>([]);
  const [inputRule, setInputRule] = useState<string>("");
  const willMount = useRef(true);
  if (willMount.current) {
    chrome.runtime.sendMessage({ type: "getCurrentRule" }, response => {
      console.log(response);
      setCurrentRule(response);
    });
  }
  willMount.current = false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputRule(e.target.value);
  }

  const onClick = () => {
    chrome.runtime.sendMessage({ type: "addNewSite", site: inputRule }, response => {
      console.log(response);
      setCurrentRule(response);
    });
    setInputRule("");
  }
    

 return (
    <div className="w-60 h-72">
      <h1 className="text-center mt-3 text-xl">Auto Redirect</h1>
      <h2 className="mx-2">Current Rules:</h2>
    <div className="flex flex-col items-center mt-1 bg-slate-200 rounded mx-2">
    <ul>
      {currentRule.map(rule => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
    <div className="fixed bottom-6 rounded shadow-md">
    <Input 
      placeholder="New rule"
      className="input p-2 rounded-l"
      value={inputRule}
      onChange={handleChange}
    />
    <button 
      className=" bg-cyan-700 text-white p-2 rounded-r"
      onClick={onClick}
    >
      Add
    </button>
    </div>
    </div>
   </div>
 )
};

ReactDOM.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  document.getElementById("root")
);
