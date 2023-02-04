import React from "react"
import { Streamlit } from "streamlit-component-lib"
import { useRenderData } from "streamlit-component-lib-react-hooks"
import { PolywrapClient } from "@polywrap/client-js"

import StreamlitButton from "./components/StreamlitButton/StreamlitButton"
import { getPolywrapClientConfig } from "./config/polywrapClient"

const invoke = async (args: { uri: string, method: string, args: Record<string, unknown> }) => {
  const config = await getPolywrapClientConfig(args.args.chainId as number ?? 0);
  const client = new PolywrapClient(config)

  Streamlit.setComponentValue({
    data: null,
    error: null,
    loading: true,
  })

  const result = await client!.invoke({
    uri: args.uri,
    method: args.method,
    args: args.args,
  });

  if (result.ok) {
    Streamlit.setComponentValue({
      data: result.value,
      error: null,
      loading: false,
    })
  } else {
    Streamlit.setComponentValue({
      data: null,
      error: result.error?.message,
      loading: false,
    })
  }
}

const Polywrap = () => {
  const { args } = useRenderData()

  return (
    <StreamlitButton onClick={() => { invoke(args); }}>
      {args.props.text}
    </StreamlitButton>
  )
}

export default Polywrap