import { useEffect, useState } from 'react'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import ERC20ABI from '../abis/erc20.json'
import { useContract, useV3Pool } from './useContract'
import { BigNumber } from 'ethers'
import { Erc20 } from '../abis/types/Erc20'

type Slot0 = [BigNumber, number, number, number, number, number, boolean] & {
  sqrtPriceX96: BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}
type UsePoolResult = {
  loading: boolean
  pool?: Pool
}

// returns null on errors
export function usePool(address: string | undefined): UsePoolResult {
  const poolContract = useV3Pool(address)

  // so much boilerplate
  const [token0address, setToken0Address] = useState<string | undefined>()
  const [token1address, setToken1Address] = useState<string | undefined>()
  const [slot0, setSlot0] = useState<Slot0 | undefined>()
  const [liquidity, setLiquidity] = useState<BigNumber | undefined>()
  const [fee, setFee] = useState<number | undefined>()
  const [pool, setPool] = useState<UsePoolResult>({ loading: false })

  const token0Contract = useContract(token0address, ERC20ABI) as Erc20
  const token1Contract = useContract(token1address, ERC20ABI) as Erc20

  // if contract changes load all the details... slowly
  // maybe some day multicall this? meh.
  useEffect(() => {
    let didCancel = false
    if (!poolContract) return
    !didCancel && setPool({ loading: true })
    const getDetails = async () => {
      setToken0Address(await poolContract.token0())
      setToken1Address(await poolContract.token1())
      setSlot0(await poolContract.slot0())
      setLiquidity(await poolContract.liquidity())
      setFee(await poolContract.fee())
    }
    getDetails()
    return () => {
      didCancel = true
    }
  }, [poolContract])

  // once all the pool data has loaded/changed bring in the data
  // for each token and create the pool object
  useEffect(() => {
    let didCancel = false
    const buildPool = async () => {
      if (
        token0Contract === null ||
        token0address === undefined ||
        token1Contract === null ||
        token1address === undefined ||
        slot0 === undefined ||
        liquidity === undefined ||
        fee === undefined
      ) {
        return
      }

      try {
        const token0Name = await token0Contract.name()
        const token0Symbol = await token0Contract.symbol()
        const token0Decimals = await token0Contract.decimals()

        const token1Name = await token1Contract.name()
        const token1Symbol = await token1Contract.symbol()
        const token1Decimals = await token1Contract.decimals()

        const token0 = new Token(1, token0address, token0Decimals, token0Symbol, token0Name)
        const token1 = new Token(1, token1address, token1Decimals, token1Symbol, token1Name)

        // I hate the state of javascript BigInts right now. BugNumber vs BigInt vs JSBI vs fuck you.
        // convert with a string intermediary because why not? who cares?
        const newPool = new Pool(token0, token1, fee, slot0.sqrtPriceX96.toString(), liquidity.toString(), slot0.tick)

        !didCancel && setPool({ loading: false, pool: newPool })
      } catch (error) {
        // Do something with error?
        console.log(error)
        setPool({ loading: false })
      }
    }
    buildPool()
    return () => {
      didCancel = true
    }
  }, [slot0, liquidity, fee, token0address, token0Contract, token1address, token1Contract])

  return pool
}
