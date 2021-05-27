import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { ethers } from 'ethers'

import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import PoolIcon from '@material-ui/icons/Pool'

const TopCard = styled(Card)`
  margin-top: 20px;
`

const GrowGrid = styled(Grid)`
  flex-grow: 1;
`

function App() {
  const [poolAddress, setPoolAddress] = useState<string>('')
  const [formValid, setValid] = useState<boolean>(true)
  const [redirect, go] = useState<boolean>(false)

  const handlePoolAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPoolAddress(event.target.value)
    setValid(ethers.utils.isAddress(event.target.value))
  }

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formValid) go(true)
  }

  if (redirect) {
    return <Redirect to={`/${poolAddress}`} />
  }

  return (
    <>
      <Grid item md={3}></Grid>

      <Grid item md={6} xs={12}>
        <TopCard>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Get pool LP details
            </Typography>

            <form onSubmit={handleOnSubmit}>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <PoolIcon />
                </Grid>
                <GrowGrid item>
                  <TextField
                    error={!formValid}
                    value={poolAddress}
                    onChange={handlePoolAddressChange}
                    id="input-with-icon-grid"
                    fullWidth
                    label="Pool address"
                  />
                </GrowGrid>
                <Grid item>
                  <Button disabled={!formValid} color="primary" type="submit" variant="outlined">
                    Go
                  </Button>
                </Grid>
              </Grid>
            </form>
            <br />
            <Typography>
              Find pool addresses at{' '}
              <Link href="https://info.uniswap.org/#/pools" target="_blank" rel="noreferer">
                info.uniswap.org
              </Link>
              <br />
              Note, this is unoptimized (read: slow) for really large pools (100+ LPs)
            </Typography>
          </CardContent>
        </TopCard>
      </Grid>
    </>
  )
}

export default App
