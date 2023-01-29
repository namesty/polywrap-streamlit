import React from "react"
import ReactDOM from "react-dom"
import { StreamlitProvider } from "streamlit-component-lib-react-hooks"
import Polywrap from "./Polywrap"

ReactDOM.render(
  <React.StrictMode>
    <StreamlitProvider>
      <Polywrap />
    </StreamlitProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
