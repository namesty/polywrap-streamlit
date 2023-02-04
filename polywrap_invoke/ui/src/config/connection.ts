import { providers } from "ethers"

export const getWalletProvider = async (chainId: number) => {
  const patchedChainId = chainId === 0 ? 1 : 5
  await (window as any).ethereum.request({
    method: "eth_requestAccounts",
  })

  let provider = new providers.Web3Provider((window as any).ethereum)
  const network = await provider.getNetwork()

  if (patchedChainId !== network.chainId) {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${patchedChainId}` }],
    })

    provider = new providers.Web3Provider((window as any).ethereum)
  }

  return provider;
}