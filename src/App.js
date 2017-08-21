import React, { Component } from 'react'
import Splitter from '../build/contracts/Splitter.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      //storageValue: 0,
      web3: null,
      alice: {},
      bob: {},
      carol: {},
    }
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  updateBalances() {
    this.state.web3.eth.getBalance(this.state.alice.address, (err, aliceBalance) => {
      this.state.web3.eth.getBalance(this.state.bob.address, (err, bobBalance) => {
        this.state.web3.eth.getBalance(this.state.carol.address, (err, carolBalance) => {
          this.setState({
            alice: {
              ...this.state.alice,
              balance: aliceBalance
            },
            bob: {
              ...this.state.bob,
              balance: bobBalance,
            },
            carol: {
              ...this.state.carol,
              balance: carolBalance
            }
          })
        })
      })
    })
  }

  onSend(e) {
    this.state.contract.split({value: Number(this.state.amount), from: this.state.alice.address}).then((res) => {
      this.updateBalances();
    }).catch((e) => console.log(e));
  }

  onAmountChange(e) {
    this.setState({
      amount: e.target.value,
    })
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const splitter = contract(Splitter)
    splitter.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({
        alice: {
          address: accounts[0],
        },
        bob: {
          address: accounts[1],
        },
        carol: {
          address: accounts[2]
        }
      });
      splitter.new([accounts[1], accounts[2]], {from: accounts[0], gas: 1000000}).then(instance => {
        this.setState({
          contract: instance,
        });
        this.updateBalances();
      });
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <p>Alice: {this.state.alice.balance ? this.state.alice.balance.toString() : 0} </p>
              <p>{this.state.alice.address}</p>
              <p>Bob: {this.state.bob.balance ? this.state.bob.balance.toString() : 0} </p>
              <p>{this.state.bob.address}</p>
              <p>Carol: {this.state.carol.balance ? this.state.carol.balance.toString() : 0} </p>
              <p>{this.state.carol.address}</p>
              <input type="number" onChange={this.onAmountChange}/>
              <button onClick={this.onSend}>Send</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
