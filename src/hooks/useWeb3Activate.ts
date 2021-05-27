import { useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'

import { injected } from '../web3/connectors'
import { useEagerConnect, useInactiveListener } from '../hooks'

function getErrorMessage(error: Error | undefined) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

// returns null on errors
export function useWeb3Activate() {
  const { account, activate: _activate, active, error } = useWeb3React<Web3Provider>()

  const [activating, setActivating] = useState<boolean>(false)

  const activate = () => {
    setActivating(true)
    _activate(injected).finally(() => setActivating(false))
  }

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager || !!activating)

  const disabled = !triedEager || activating || active

  const errorMessage = !!error ? getErrorMessage(error) : null

  return { account, activate, activating, active, error, errorMessage, disabled }
}
