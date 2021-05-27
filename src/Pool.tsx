import React from 'react'
import { ethers } from 'ethers'
import { useParams, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'
import LPChart, { ChartType } from './components/LPChart'
import LPTable from './components/LPTable'

import { usePoolPositions } from './hooks/usePoolPositions'
import './App.css'

const RootGrid = styled(Grid)`
  margin-top: 20px;
`

const ChartContainer = styled.div`
  height: 400px;
`

export type PoolParams = {
  address: string
}

function App() {
  const { address } = useParams<PoolParams>()

  const validAddress = ethers.utils.isAddress(address)

  const positions = usePoolPositions(validAddress ? address : undefined)

  if (!validAddress) {
    return <Redirect to="/" />
  }

  return (
    <RootGrid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Pool details
            </Typography>
            {positions.loading && <LinearProgress />}
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <dl>
                  <Typography component="dt" variant="h6">
                    Address
                  </Typography>
                  <Typography component="dd" color="primary" variant="body2">
                    <Link href={`https://info.uniswap.org/#/pools/${address}`} target="_blank" rel="noreferer">
                      {address}
                    </Link>
                  </Typography>
                  <Typography component="dt" variant="h6">
                    Current tick
                  </Typography>
                  <Typography component="dd" color="primary" variant="body2">
                    {positions.pool?.token0Price.toSignificant(5, { groupSeparator: ',' })}
                  </Typography>
                </dl>
              </Grid>
              <Grid item xs={6}>
                <Typography component="dt" variant="h6">
                  Tokens
                </Typography>
                <Typography component="dd" color="primary" variant="body2">
                  {positions.pool?.token0.symbol}/{positions.pool?.token1.symbol}
                </Typography>
                <Typography component="dt" variant="h6">
                  Fee
                </Typography>
                <Typography component="dd" color="primary" variant="body2">
                  {!!positions.pool && positions.pool.fee / 10000}%
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom color="primary" variant="h5" component="h2">
              In range LPs % swap fees at current price
            </Typography>
            <ChartContainer>
              <LPChart positions={positions} chartType={ChartType.FEE} onlyInRange />
            </ChartContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom color="primary" variant="h5" component="h2">
              In range LPs % total value locked
            </Typography>
            <ChartContainer>
              <LPChart positions={positions} chartType={ChartType.TVL} onlyInRange />
            </ChartContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom color="secondary" variant="h5" component="h2">
              All LPs % {positions.pool?.token0.symbol} locked
            </Typography>
            <ChartContainer>
              <LPChart positions={positions} chartType={ChartType.AMOUNT0} onlyInRange={false} />
            </ChartContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography gutterBottom color="secondary" variant="h5" component="h2">
              All LPs % {positions.pool?.token1.symbol} locked
            </Typography>
            <ChartContainer>
              <LPChart positions={positions} chartType={ChartType.AMOUNT1} onlyInRange={false} />
            </ChartContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <LPTable positions={positions}></LPTable>
      </Grid>
    </RootGrid>
  )
}

export default App
