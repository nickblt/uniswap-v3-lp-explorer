import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Header from './components/Header'
import { useWeb3Activate } from './hooks/useWeb3Activate'
import Pool from './Pool'
import Home from './Home'
import { shortAddress } from './utils'

import './App.css'

const Root = styled.div`
  flex-grow: 1;
`

const TopCard = styled(Card)`
  margin-top: 20px;
`

function App() {
  const { error, errorMessage, account, activate, active, disabled } = useWeb3Activate()

  return (
    <Router>
      <Root>
        <Header />
        <Container>
          <Grid container spacing={3}>
            {!!error && (
              <Grid item xs={12}>
                <TopCard>
                  <CardContent>
                    <Typography gutterBottom color="error" variant="h5" component="h2">
                      Error
                    </Typography>
                    <Typography variant="subtitle1" color="error">
                      {errorMessage}
                    </Typography>
                  </CardContent>
                </TopCard>
              </Grid>
            )}
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/:address">
                {active && <Pool />}
                {!active && (
                  <>
                    <Grid item md={3}></Grid>

                    <Grid item md={6} xs={12}>
                      <TopCard>
                        <CardContent>
                          <Typography gutterBottom color="primary" variant="h5" component="h2">
                            Connect
                          </Typography>
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
                        </CardContent>
                      </TopCard>
                    </Grid>
                  </>
                )}
              </Route>
            </Switch>
          </Grid>
        </Container>
      </Root>
    </Router>
  )
}

export default App
