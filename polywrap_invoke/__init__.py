import os
import streamlit.components.v1 as components
import time
import math
from textwrap import dedent
import streamlit as st

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
      deposits(where: {{ account: "{address}" }}) {{
        id
        hash
        timestamp
        account
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

def polywrap_invoke(uri, method, props=None, args=None):
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

    component_value = _component_func(uri=uri, method=method, props=props, args=args, default={'loading': False, 'data': None, 'error': None})
    return component_value

if not _RELEASE:
    if 'network' not in st.session_state:
      st.session_state['network'] = None
    
    st.session_state['network'] = st.selectbox('Selected Network', ('Mainnet', 'Goerli'))

    st.title("Read the address from the signer")
    signer_address = polywrap_invoke(
      "ens/ethereum.polywrap.eth",
      "getSignerAddress",
      {
        'text': "Address",
      },
      {
        'chainId': 0 if st.session_state['network'] == 'Mainnet' else 3,
      }
    )

    if signer_address['data']:
        st.subheader(signer_address['data'])

    st.markdown('---------------')

    ### Open a position given an address

    st.title("Open positions given an address")

    positions_address = st.text_input('Address. Ex 0xc36442b4a4522e871399cd717abdd847ab11fe88')

    positions = polywrap_invoke(
        "ens/thegraph.polywrap.eth",
        "querySubgraph",
        {
          'text': "Open positions",
        },
        {
        'url': "https://api.thegraph.com/subgraphs/name/steegecs/uniswap-v3-ethereum-test1",
        'query': make_deposits_query("0xc36442b4a4522e871399cd717abdd847ab11fe88")
        }
    )

    if positions['data']:
        st.subheader(positions['data'])

    ### Add liquidity to a pool

    st.markdown('---------------')

    st.title("Add liquidity to a pool")

    pool_address = st.text_input('Pool address. Ex 0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8')
    amount = st.text_input('Amount. Ex 20000000')
    
    add_liquidity_tx = polywrap_invoke(
        "ens/uniswapv3.polywrap.eth",
        "mintPosition",
        {
          'text': "Add liquidity"
        },
        {
          'poolAddress': pool_address,
          'amount0': amount,
          'chainId': 0 if st.session_state['network'] == 'Mainnet' else 3,
          'deadline': str(math.floor(time.time() / 1000) + 600),
        }
    )

    st.write(add_liquidity_tx)

    if add_liquidity_tx['loading']:
        st.write('Adding liquidity to ', pool_address, '...')
    if add_liquidity_tx['data']:
        st.subheader(add_liquidity_tx['data'])