import React, { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
import Web3 from "web3";
import FundraiserCard from "./FundraiserCard";

const Home = () => {
  const [funds, setFunds] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserFactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserFactoryContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(instance);
      setAccounts(accounts);
      const funds = await instance.methods.fundraisers(10, 0).call();
      setFunds(funds);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  const displayFundraisers = () => {
    console.log(funds);
    return funds.map((fundraiser) => {
      const hideCard =
      fundraiser === "0x3B223D1b80C372125fde5B646D51613c771107D0" ||
      fundraiser === "0x2050299604Ac766272f9E41bED682cceDC64AF7C" ||
      fundraiser === "0x8906770A7027F7bEb0fC01ce9856F74Ca3E2c6D5";
      return  <div className="col-md-6 col-lg-6 col-xl-6 my-3" key={fundraiser} style={{display: hideCard?"none": ""}}>
      <FundraiserCard fundraiser={fundraiser} />
    </div>;
    });
  };

  return <div className="main-container container"><div className="row">{displayFundraisers()}</div>
  </div>;
};

export default Home;
