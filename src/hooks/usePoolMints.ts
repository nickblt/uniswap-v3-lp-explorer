import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useV3Pool } from './useContract'

export type MintData = {
  tokenId?: number
  tickLower: number
  tickUpper: number
  amount: BigNumber
  transactionHash: string
  blockNumber: number
  blockHash: string
}

type UsePoolMintsResult = {
  loading: boolean
  results: MintData[]
}

// returns null on errors
export function usePoolMints(address: string | undefined): UsePoolMintsResult {
  const contract = useV3Pool(address)

  const [mintResults, setMintResults] = useState<UsePoolMintsResult>({ loading: false, results: [] })

  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      if (!address || !contract) return
      !didCancel && setMintResults({ loading: true, results: [] })

      try {
        const mintFilter = contract.filters.Mint(null, null, null, null, null, null, null)

        const mints = await contract.queryFilter(mintFilter)
        const datas: MintData[] = mints.map((mint) => {
          return {
            tickLower: mint.args.tickLower,
            tickUpper: mint.args.tickUpper,
            amount: mint.args.amount,
            transactionHash: mint.transactionHash,
            blockNumber: mint.blockNumber,
            blockHash: mint.blockHash,
          }
        })
        !didCancel && setMintResults({ loading: false, results: datas })
      } catch (error) {
        // Do something with error?
        console.log(error)
        setMintResults({ loading: false, results: [] })
      }
    }
    fetchData()
    return () => {
      didCancel = true
    }
  }, [address, contract])

  return mintResults
}
