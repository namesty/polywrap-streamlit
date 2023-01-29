import React from "react"
import { Streamlit } from "streamlit-component-lib"
import { useRenderData } from "streamlit-component-lib-react-hooks"
import { usePolywrapClient } from "./hooks/usePolywrapClient"
import { WrapError } from "@polywrap/client-js"

type PolywrapData = {
  data: unknown
  error: WrapError | null
  loading: boolean
}

const Polywrap: React.VFC = () => {
  const client = usePolywrapClient()
  const { args } = useRenderData()

  return (
    <button disabled={!client} onClick={async () => {
      Streamlit.setComponentValue({
        data: null,
        error: null,
        loading: true,
      } as PolywrapData)

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
        } as PolywrapData)
      } else {
        Streamlit.setComponentValue({
          data: null,
          error: result.error,
          loading: false,
        } as PolywrapData)
      }
    }}>Invoke</button>
  )
}

export default Polywrap