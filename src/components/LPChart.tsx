import React, { useEffect, useState } from 'react'
import JSBI from 'jsbi'
import { ResponsivePie } from '@nivo/pie'
import { UsePoolPositionsResult } from '../hooks/usePoolPositions'

export enum ChartType {
  FEE,
  TVL,
  AMOUNT0,
  AMOUNT1,
}

const commonProperties = {
  margin: { top: 30, right: 20, bottom: 30, left: 20 },
}
const maxPresentation = 1 // hide and combine anything under this % of the pool

export default function LPChart(props: {
  positions: UsePoolPositionsResult
  chartType: ChartType
  onlyInRange: boolean
}) {
  const { positions, chartType, onlyInRange } = props
  const [data, setData] = useState<{ id: string; value: number }[]>([])

  useEffect(() => {
    if (positions.loading || !positions.pool || positions.results.length == 0) return
    let totalLiq: JSBI = JSBI.BigInt(0)
    let totalAmount0: JSBI = JSBI.BigInt(0)
    let totalAmount1: JSBI = JSBI.BigInt(0)

    for (let i = 0; i < positions.results.length; i++) {
      const uniPosition = positions.results[i].uniPosition
      const inRange =
        positions.pool.token0Price.greaterThan(uniPosition.token0PriceLower) &&
        positions.pool.token0Price.lessThan(uniPosition.token0PriceUpper)

      if (onlyInRange && !inRange) {
        continue
      }
      totalLiq = JSBI.add(totalLiq, uniPosition.liquidity)
      totalAmount0 = JSBI.add(totalAmount0, uniPosition.amount0.quotient)
      totalAmount1 = JSBI.add(totalAmount1, uniPosition.amount1.quotient)
    }

    let other = 0
    const data: { id: string; value: number }[] = []

    const sortedResults = [...positions.results].sort((a, b) => {
      if (JSBI.lessThan(a.uniPosition.liquidity, b.uniPosition.liquidity)) {
        return 1
      }
      if (JSBI.greaterThan(a.uniPosition.liquidity, b.uniPosition.liquidity)) {
        return -1
      }
      return 0
    })

    for (let i = 0; i < sortedResults.length; i++) {
      const {
        pool: { token0Price },
      } = positions
      const {
        uniPosition: { token0PriceLower, token0PriceUpper, liquidity, amount0, amount1 },
        transfer: { tokenId },
      } = sortedResults[i]

      if (onlyInRange && (token0Price.lessThan(token0PriceLower) || token0Price.greaterThan(token0PriceUpper))) {
        continue
      }

      let percentOwnership: number

      if (chartType === ChartType.FEE) {
        percentOwnership = JSBI.toNumber(JSBI.divide(JSBI.multiply(liquidity, JSBI.BigInt(100)), totalLiq))
      } else if (chartType === ChartType.TVL) {
        const percent0 = JSBI.divide(JSBI.multiply(amount0.quotient, JSBI.BigInt(100)), totalAmount0)
        const percent1 = JSBI.divide(JSBI.multiply(amount1.quotient, JSBI.BigInt(100)), totalAmount1)
        percentOwnership = JSBI.toNumber(JSBI.divide(JSBI.add(percent0, percent1), JSBI.BigInt(2)))
      } else if (chartType === ChartType.AMOUNT0) {
        percentOwnership = JSBI.toNumber(JSBI.divide(JSBI.multiply(amount0.quotient, JSBI.BigInt(100)), totalAmount0))
      } else {
        percentOwnership = JSBI.toNumber(JSBI.divide(JSBI.multiply(amount1.quotient, JSBI.BigInt(100)), totalAmount1))
      }

      if (percentOwnership > maxPresentation) {
        data.push({
          id: tokenId.toString(),
          value: percentOwnership,
        })
      } else {
        other += percentOwnership
      }
    }

    data.push({
      id: 'Other',
      value: other,
    })
    setData(data)
  }, [positions, chartType, onlyInRange])

  return (
    <ResponsivePie
      {...commonProperties}
      data={data}
      innerRadius={0.6}
      padAngle={0.5}
      cornerRadius={5}
      activeOuterRadiusOffset={8}
      animate={true}
      valueFormat={(test) => test + '%'}
      arcLinkLabelsColor={{
        from: 'color',
      }}
      onClick={(node) => {
        if (node.id !== 'Other') {
          window.open(`https://app.uniswap.org/#/pool/${node.id}`, '_blank', 'noopener')
        }
      }}
      arcLinkLabelsThickness={3}
      arcLinkLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 1.2]],
      }}
    />
  )
}
