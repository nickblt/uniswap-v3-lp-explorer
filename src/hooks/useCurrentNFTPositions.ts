import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useV3NFTPositionManagerContract } from './useContract'

export type PositionResponse = [
  BigNumber,
  string,
  string,
  string,
  number,
  number,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  nonce: BigNumber
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}

type useNFTTokensResult = {
  loading: boolean
  results: Record<string, PositionResponse>
}

// returns null on errors
export function useCurrentNFTPositions(tokenIds: string[]): useNFTTokensResult {
  const contract = useV3NFTPositionManagerContract()

  const [positionResults, setPositionResults] = useState<useNFTTokensResult>({ loading: false, results: {} })

  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      if (!contract || tokenIds.length === 0) return

      !didCancel && setPositionResults({ loading: true, results: {} })

      const promises: Promise<PositionResponse>[] = []

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]
        promises.push(contract.positions(tokenId))
      }

      try {
        const map: Record<string, PositionResponse> = {}
        const results = await Promise.all(promises)

        results.forEach((p, i) => (map[tokenIds[i]] = p))

        !didCancel && setPositionResults({ loading: false, results: map })
      } catch (error) {
        // Do something with error?
        console.log(error)
        setPositionResults({ loading: false, results: {} })
      }
    }
    fetchData()
    return () => {
      didCancel = true
    }
  }, [contract, tokenIds])

  return positionResults
}
