import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { TypedEvent } from '../types/v3/commons'
import { useV3NFTPositionManagerContract } from './useContract'

export type NFTTransferData = {
  tokenId: number
  transactionHash: string
  blockNumber: number
}

type useNFTTransferResult = {
  loading: boolean
  results: NFTTransferData[]
}

type TransferEvent = TypedEvent<[string, string, BigNumber] & { from: string; to: string; tokenId: BigNumber }>

// returns null on errors
export function useNFTTransfers(blockHashes: string[]): useNFTTransferResult {
  const contract = useV3NFTPositionManagerContract()

  const [mintResults, setMintResults] = useState<useNFTTransferResult>({ loading: false, results: [] })

  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      if (!contract || blockHashes.length === 0) return
      !didCancel && setMintResults({ loading: true, results: [] })

      const promises: Promise<TransferEvent[]>[] = []

      const transferFilter = contract.filters.Transfer(null, null, null)

      for (let i = 0; i < blockHashes.length; i++) {
        const blockHash = blockHashes[i]
        promises.push(contract.queryFilter(transferFilter, blockHash))
      }

      try {
        const transferEvents = await Promise.all(promises)

        const datas: NFTTransferData[] = []

        for (let i = 0; i < transferEvents.length; i++) {
          for (let j = 0; j < transferEvents[i].length; j++) {
            const transferEvent = transferEvents[i][j]

            datas.push({
              transactionHash: transferEvent.transactionHash,
              tokenId: transferEvent.args.tokenId.toNumber(),
              blockNumber: transferEvent.blockNumber,
            })
          }
        }

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
  }, [contract, blockHashes])

  return mintResults
}
