import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { useWeb3Activate } from '../hooks/useWeb3Activate'
import { shortAddress } from '../utils'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'

const Title = styled(Typography)`
  flex-grow: 1;
  margin-left: 10px;
`
function App() {
  const { account, activate, disabled } = useWeb3Activate()

  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Link href="https://blt.fi" rel="noreferrer" target="_blank">
          <Avatar alt="BLT icon" src="images/bltme.png" />
        </Link>
        <Title variant="h6">Uniswap V3 LP Breakdown</Title>
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => {
            if (!disabled) {
              activate()
            }
          }}
        >
          {account === null || !account ? 'Connect to Wallet' : shortAddress(account)}
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default App
