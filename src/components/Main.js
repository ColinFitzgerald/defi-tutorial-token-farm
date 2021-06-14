// Import external libraries.
import React, {Component} from 'react'

// Import project resources.
import dai from "../dai.png"


/******************************************************************************
 * @title The main application window (UI) for our token farm application
 * @author Colin E. Fitzgerald
 * @notice This component provides a main UI to our TokenFarm DeFi contract.
 *****************************************************************************/
class Main extends Component {

    /**************************************************************************
     * @notice App's main render function!
     *************************************************************************/
    render() {
        return (
            // @todo Yikes! The nesting...
            <div id="content" className="mit-3">

                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Staking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
                            <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4">
                    <div className="card-body">

                        <form className="mb-3" onSubmit={(event) => {
                            // Make sure we don't submit a POST and reload the form.
                            event.preventDefault()

                            let amount
                            amount = this.input.value.toString()
                            amount = window.web3.utils.toWei(amount, 'Ether')
                            this.props.stakeTokens(amount)
                        }}>
                            <div>
                                <label className="float-left"><b>Stake Tokens</b></label>
                                <span className="float-right text-muted">
                                    Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}
                                </span>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    type="text"
                                    ref={(input) => { this.input = input }}
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <img src={dai} height='32' alt=""/>
                                        &nbsp;&nbsp;&nbsp; mDAI
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
                        </form>
                        <button
                            type="submit"
                            className="btn btn-link btn-block btn-sm"
                            onClick={(event) => {
                                event.preventDefault()
                                this.props.unstakeTokens()
                            }}>
                            UN-STAKE...
                        </button>
                    </div>
                </div>
            </div>
        );
    } // render()
} // Main

export default Main;

// End of file.
