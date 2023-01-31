import React, { useEffect, useState } from "react"
import { Streamlit } from "streamlit-component-lib"
import { useRenderData } from "streamlit-component-lib-react-hooks"
import { ClientConfigBuilder, PolywrapClient, WrapError } from "@polywrap/client-js"
import { ethereumPlugin, Connections, Connection } from "@namesty/ethereum-plugin-js"

type PolywrapData = {
  data: unknown
  error: WrapError | null
  loading: boolean
}

const invoke = async (args: { uri: string, method: string, args: Record<string, unknown> }) => {
  const ethereum = (window as any).ethereum;

  if (ethereum) {
    await ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    throw Error('Please install Metamask.');
  }

  const configToUse = new ClientConfigBuilder().addDefaults().addPackage({
    uri: "ens/ethereum.polywrap.eth",
    package: ethereumPlugin({
      connections: new Connections({
        networks: {
          mainnet: new Connection({
            provider:
              ethereum,
          }),
        },
        defaultNetwork: "mainnet"
      }),
    }),
  })
    .addRedirect("ens/uniswapv3.polywrap.eth", "ipfs/QmZ5A7WHithKkWakKGLUi1vGdNgmy6AZMJEexkfWP5Pmmm")
    .addRedirect("ens/thegraph.polywrap.eth", "ipfs/QmdD9m3r1yYE4VrfamHMnFmVj9LUWzq6n1QPRSDRTTY5Bw")
    .build()

  const client = new PolywrapClient(configToUse)

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
}

const Polywrap: React.VFC = () => {
  const { args } = useRenderData()
  const [start] = useState<boolean>(args.start);

  useEffect(() => {
    if (!start) return
    (async () => {
      invoke(args)
    })()
  }, [start])

  return (
    <></>
  )
}

export default Polywrap