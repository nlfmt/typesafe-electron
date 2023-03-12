import React from "react";
import "./App.less";

import { TitleBar } from "@/components";

function App() {
    return (
        <>
            <TitleBar />
            <div id="app">
                <h1>Typesafety for Electron!</h1>
                <p>
                    To get started, edit <code>electron/API.ts</code> to define
                    an IPC function, then register a handler for it in&nbsp;
                    <code>electron/main.ts</code>.
                    <br />
                    You can then call your IPC function from the renderer
                    process using <code>api.&lt;functionName&gt;()</code>.
                </p>
            </div>
        </>
    );
}

export default App;
