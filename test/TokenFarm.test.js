const DappToken = artifacts.require("DappToken")
const DaiToken  = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
} // tokens


contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        // Load Contracts
        daiToken  = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all DAP tokens to Farm.
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send tokens to investor.
        await daiToken.transfer(investor, tokens('100'), { from: owner })
    })

    // Write tests here..
    describe('Mock Dai Deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token Deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async () => {
        it('rewards investors for staking Dai tokens.', async () => {
            let result

            // Check investor balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Dai balance correct BEFORE staking.')

            // Stake some Dai tokens
            await daiToken.approve(tokenFarm.address, tokens('56'), { from: investor })
            await tokenFarm.stakeTokens(tokens('56'), { from: investor })

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('44'), 'investor Dai balance correct after staking.')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('56'), 'token farm Dai balance correct after staking.')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('56'), 'investor staked Dai balance correct after staking.')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status is correct after staking.')

            await tokenFarm.issueTokens({ from: owner })

            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('56'), 'investor Dapp token balance correct after issuing.')

            await tokenFarm.issueTokens({ from: investor }).should.be.rejected


        })
    })
})

// End of file.
