// Import external libraries.
import React, {Component} from 'react'
import Web3 from "web3";
import Navbar from './Navbar'
import './App.css'

// Import project libraries.
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'


/******************************************************************************
 * @title A simple token farm web application
 * @author Colin E. Fitzgerald
 * @notice This web app provides a front end to our TokenFarm DeFi contract.
 *****************************************************************************/
class App extends Component {

    // The apps constructor.  Here we create and initialize our state data
    // structure with 'empty' values.
    constructor(props) {
        super(props)

        this.state = {
            account: '0x0',
            daiToken: {},
            dappToken: {},
            tokenFarm: {},
            daiTokenBalance: '0',
            dappTokenBalance: '0',
            stakingBalance: '0',
            loading: true
        } // this.state
    } // constructor()


    /**************************************************************************
     * @notice Boilerplate code to connect app to Ethereum/Metamask.
     *************************************************************************/
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected.  Please consider trying MetaMask!')
        }
    } // loadWeb3()


    /**************************************************************************
     * @notice This function will allow an investor to stake Dai coins.
     *************************************************************************/
    async loadBlockChainData() {
        const web3 = window.web3

        // Grab the client's wallet account from the browser context.
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })

        // Grab the ethereum network Id so we can get the token and app contracts next.
        const networkId = await web3.eth.net.getId()

        // Grab the DaiToken contract and the investor's Dai balance.
        const daiTokenData = DaiToken.networks[networkId]
        if (daiTokenData) {
            const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
            this.setState({ daiToken })

            let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
            this.setState({ daiTokenBalance: daiTokenBalance.toString() })
        } else {
            window.alert('The DaiToken contract is not deployed to the detected network.')
        }

        // Grab the DappToken contract and the investor's Dapp balance.
        const dappTokenData = DappToken.networks[networkId]
        if (dappTokenData) {
            const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
            this.setState({ dappToken })

            let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
            this.setState({ dappTokenBalance: dappTokenBalance.toString() })
        } else {
            window.alert('The DappToken contract is not deployed to the detected network.')
        }

        // Grab the TokenFarm contract and the investor's staking balance.
        const tokenFarmData = TokenFarm.networks[networkId]
        if (tokenFarmData) {
            const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
            this.setState({ tokenFarm })

            let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
            this.setState({ stakingBalance: stakingBalance.toString() })
        } else {
            window.alert('The TokenFarm contract is not deployed to the detected network.')
        }

        this.setState({ loading: false })
    } // loadBlockChainData()


    /**************************************************************************
     * @notice Called by the browser before the app is rendered.  We call all
     * @notice our setup functions here.
     *************************************************************************/
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    } // componentWillMount()


    /**************************************************************************
     * @notice App's main render function!
     *************************************************************************/
    render() {
        return (
            // @todo Yikes! The nesting...
            <div>
                <Navbar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}}>
                            <div className="content mr-auto ml-auto">
                                <a
                                    href="http://www.dappuniversity.com/bootcamp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                </a>
                                <h1>Hello, World!</h1>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    } // render()
} // App

export default App;

// End of file.
