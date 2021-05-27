# Uniswap v3 LP explorer

There was a lack of LP by LP breakdown from info.uniswap.org and pulling the information ended up
being slightly difficult. I figured I'd publish my efforts.

Currently deployed at [v3lps.blt.fi](https://v3lps.blt.fi/#/) [WOOFY/ETH pool example](https://v3lps.blt.fi/#/0x11a38dbd302a30e52c54bb348d8fe662307ff24c).

## Steps to pull the LP info

The only input into the system is the address of a deployed pool From here:

1. From the pool address we ask for all Mint events for all time, this gets us some info but no NFT tokenIds yet
2. Pull all the blockHashes from all of those events
3. For every blockHash get the transfer event from the global v3 NFTPositionManager
4. combine all data from step 1 and step 3 keying off the blockHash
5. We now have the state of all positions at time of minting and can display something
6. Lazy load the current positions given all known NFT tokenIds via `NFTPositionManager.positions(tokenId)`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
