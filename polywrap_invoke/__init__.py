import os
import streamlit.components.v1 as components
import time
import math
from textwrap import dedent

_RELEASE = False

if not _RELEASE:
    _component_func = components.declare_component(
        "polywrap_invoke",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "ui/build")
    _component_func = components.declare_component("polywrap_invoke", path=build_dir)

def make_deposits_query(address: str):
  return dedent(
    f"""
    query {{
      deposits(where: {{ from: "{address}" }}) {{
        id
        hash
        timestamp
        from
        to
        blockNumber
        inputTokens {{
          name
        }}
        amountUSD
      }}
    }}
    """
  )

def polywrap_invoke(uri, method, start=False, args=None):
    """Create a new instance of "polywrap_invoke".
    Parameters
    ----------
    uri: str
    method: str
    args: dict or None
    Returns
    -------
    str
    """

    component_value = _component_func(uri=uri, method=method, start=start, args=args, default={'loading': False, 'data': None, 'error': None})
    return component_value

if not _RELEASE:
    import streamlit as st

    positions = polywrap_invoke(
      "ens/thegraph.polywrap.eth",
      "querySubgraph",
      False,
      {
        'url': "https://api.thegraph.com/subgraphs/name/steegecs/uniswap-v3-ethereum-test1",
        'query': make_deposits_query("0xc36442b4a4522e871399cd717abdd847ab11fe88")
      }
    )

    st.subheader(positions)

    address = polywrap_invoke(
      "ens/ethereum.polywrap.eth",
      "getSignerAddress",
      True,
      {}
    )

    st.subheader(address)

    mint_position_tx = polywrap_invoke(
      "ens/uniswapv3.polywrap.eth",
      "mintPosition",
      True,
      {
        'poolAddress': "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
        'amount0': "20000000",
        'chainId': 0,
        'deadline': str(math.floor(time.time() / 1000) + 600),
      }
    )

    st.subheader(mint_position_tx)
