import { useEffect, useMemo, useState } from 'react'
import JSBI from 'jsbi'
import { Pool, Position } from '@uniswap/v3-sdk'
import { NFTTransferData, useNFTTransfers } from './useNFTTransfers'
import { usePool } from './usePool'
import { MintData, usePoolMints } from './usePoolMints'
import { useCurrentNFTPositions } from './useCurrentNFTPositions'

type PoolPosition = {
  mint: MintData
  transfer: NFTTransferData
  uniPosition: Position
}

export type UsePoolPositionsResult = {
  loading: boolean
  pool?: Pool
  results: PoolPosition[]
}

// returns null on errors
export function usePoolPositions(address: string | undefined): UsePoolPositionsResult {
  const poolMints = usePoolMints(address)
  const poolResults = usePool(address)

  const [blockHashes, setBlockHashes] = useState<string[]>([])
  const [tokenIds, setTokenIds] = useState<string[]>([])

  useEffect(() => {
    setBlockHashes(poolMints.results.map((mint) => mint.blockHash))
  }, [poolMints])

  const NFTTransfers = useNFTTransfers(blockHashes)

  useEffect(() => {
    setTokenIds(NFTTransfers.results.map((transfer) => transfer.tokenId.toString()))
  }, [NFTTransfers])

  const currentPositions = useCurrentNFTPositions(tokenIds)

  return useMemo(() => {
    if (
      poolMints.loading ||
      NFTTransfers.loading ||
      poolResults.loading ||
      !poolResults.pool ||
      (poolMints.results.length > 0 && NFTTransfers.results.length === 0)
    ) {
      return { loading: true, results: [] }
    }

    // join arrays of collected event data on transactionHash key.
    // this could be done with a Map for efficiency but, meh,
    // the arrays are tiny and this is easier to read.

    const results: PoolPosition[] = []

    for (let i = 0; i < poolMints.results.length; i++) {
      const poolMint = poolMints.results[i]
      const NFTTransfer = NFTTransfers.results.find(
        (NFTTransfer) => poolMint.transactionHash === NFTTransfer.transactionHash
      )

      if (NFTTransfer) {
        const position = currentPositions.results[NFTTransfer.tokenId]

        let uniPosition: Position
        if (position) {
          uniPosition = new Position({
            pool: poolResults.pool,
            liquidity: position.liquidity.toString(),
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
          })
        } else {
          uniPosition = new Position({
            pool: poolResults.pool,
            liquidity: poolMint.amount.toString(),
            tickLower: poolMint.tickLower,
            tickUpper: poolMint.tickUpper,
          })
        }

        if (JSBI.notEqual(uniPosition.liquidity, JSBI.BigInt(0))) {
          results.push({
            transfer: NFTTransfer,
            mint: poolMint,
            uniPosition,
          })
        }
      }
    }

    return { loading: false, pool: poolResults.pool, results }
  }, [poolMints, NFTTransfers, poolResults, currentPositions])
}
