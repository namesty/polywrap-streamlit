import { ethereumPlugin, Connections, Connection } from "@namesty/ethereum-plugin-js"
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js"
import { getWalletProvider } from "./connection"

export const getPolywrapClientConfig = async (chainId: number) => {
  const provider = await getWalletProvider(chainId)
  const network = await provider.getNetwork()
  const networkName = network.name === "homestead" ? "mainnet" : network.name

  return new ClientConfigBuilder().addDefaults().addPackage({
    uri: "ens/ethereum.polywrap.eth",
    package: ethereumPlugin({
      connections: new Connections({
        networks: {
          [networkName]: new Connection({
            provider: provider as any,
          }),
        },
        defaultNetwork: networkName,
      }),
    }),
  })
    .addRedirect("ens/uniswapv3.polywrap.eth", "ipfs/QmZ5A7WHithKkWakKGLUi1vGdNgmy6AZMJEexkfWP5Pmmm")
    .addRedirect("ens/thegraph.polywrap.eth", "ipfs/QmdD9m3r1yYE4VrfamHMnFmVj9LUWzq6n1QPRSDRTTY5Bw")
    .build()
}