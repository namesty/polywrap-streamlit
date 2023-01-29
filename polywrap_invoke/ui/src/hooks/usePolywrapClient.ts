import { ethereumPlugin, Connections, Connection } from "@namesty/ethereum-plugin-js";
import { ClientConfig, ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient } from "@polywrap/client-js";
import { useEffect, useState } from "react";

export const usePolywrapClient = (config?: ClientConfig) => {
  const ethereum = useMetamaskProvider();
  const [client, setClient] = useState<PolywrapClient>();

  useEffect(() => {
    if (!ethereum) {
      return;
    }

    const configToUse = config ?? new ClientConfigBuilder().addDefaults().addPackage({
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
    setClient(client)

  }, [ethereum, config])

  return client;
}

export const useMetamaskProvider = () => {
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    (async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        throw Error('Please install Metamask.');
      }
      setProvider(ethereum);
    })();

  }, [])

  return provider;
}