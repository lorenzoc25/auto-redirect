import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import './index.css';

const Popup = () => {
 return (
    <div className="w-96">
    <h1 className="underline">Auto Redirect</h1>
   </div>
 )
};

ReactDOM.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  document.getElementById("root")
);
