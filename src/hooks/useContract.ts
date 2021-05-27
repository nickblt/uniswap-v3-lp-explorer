import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { abi as V3PoolABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { abi as NFTPositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { UniswapV3Pool, NonfungiblePositionManager } from '../types/v3'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../constants'

// returns null on errors
export function useContract(address: string | undefined, ABI: any): Contract | null {
  const { library } = useWeb3React<Web3Provider>()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return new Contract(address, ABI, library)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library])
}

export function useV3Pool(address: string | undefined): UniswapV3Pool | null {
  return useContract(address, V3PoolABI) as UniswapV3Pool | null
}

export function useV3NFTPositionManagerContract(): NonfungiblePositionManager | null {
  return useContract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, NFTPositionManagerABI) as NonfungiblePositionManager | null
}
