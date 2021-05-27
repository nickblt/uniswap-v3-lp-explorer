import React from 'react'
import styled from 'styled-components'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Chip from '@material-ui/core/Chip'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Error from '@material-ui/icons/Error'
import { UsePoolPositionsResult } from '../hooks/usePoolPositions'
import { shortAddress } from '../utils'

const WideTable = styled(Table)`
  min-width: 750;
`

export default function LPTable(props: { positions: UsePoolPositionsResult }) {
  return (
    <TableContainer component={Paper}>
      <WideTable aria-label="LPs">
        <TableHead>
          <TableRow>
            <TableCell>NFT ID</TableCell>
            <TableCell align="right">Raw Liquidity</TableCell>
            <TableCell align="right">Min price</TableCell>
            <TableCell align="right">Max price</TableCell>
            <TableCell align="right">Mint TX</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.positions.results.map((position) => {
            let inRange = false
            if (props.positions.pool) {
              inRange =
                props.positions.pool.token0Price.greaterThan(position.uniPosition.token0PriceLower) &&
                props.positions.pool.token0Price.lessThan(position.uniPosition.token0PriceUpper)
            }
            return (
              <TableRow key={position.mint.transactionHash}>
                <TableCell component="th" scope="row">
                  <Link
                    href={`https://app.uniswap.org/#/pool/${position.transfer.tokenId}`}
                    target="_blank"
                    rel="noreferer"
                    color="inherit"
                  >
                    {position.transfer.tokenId}
                  </Link>{' '}
                  {inRange ? (
                    <Chip variant="outlined" size="small" color="primary" label="in range" icon={<CheckCircle />} />
                  ) : (
                    <Chip variant="outlined" size="small" color="secondary" label="out of range" icon={<Error />} />
                  )}
                </TableCell>
                <TableCell align="right">{position.uniPosition.liquidity.toString()}</TableCell>
                <TableCell align="right">{position.uniPosition.token0PriceLower.toSignificant(6)}</TableCell>
                <TableCell align="right">{position.uniPosition.token0PriceUpper.toSignificant(6)}</TableCell>
                <TableCell align="right">
                  <Box fontFamily="Monospace">
                    <Link
                      href={`https://etherscan.io/tx/${position.mint.transactionHash}`}
                      target="_blank"
                      rel="noreferer"
                      color="inherit"
                    >
                      {shortAddress(position.mint.transactionHash)}
                    </Link>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </WideTable>
    </TableContainer>
  )
}
