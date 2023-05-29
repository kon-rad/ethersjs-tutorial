"use client";

import React, { useState, ReactNode } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    // Right now this is a very complex issue to find the right type because of MetaMask recent upgrade.
    // for this reason use any for now.
    ethereum?: any;
  }
}

const SEND_TO_ADDRESS = "0x306744992015C90dEcb014e0836fC50176dE6Cf7";
const SEND_AMOUNT = "0.0025"; // 0.0025 ETH = ~5 USD in May 2023
const provider = new ethers.BrowserProvider(window.ethereum);

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<ReactNode>();
  const [signer, setSigner] = useState<any>();
  const [defaultAccount, setDefaultAccount] = useState<string | undefined>();
  const [userBalance, setUserBalance] = useState<string | undefined>();

  const handleConnectWallet = () => {
    if (window.ethereum) {
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(await provider.getSigner());
      });
    } else {
      setErrorMessage("Please Install Metamask!!!");
    }
  };

  const accountChangedHandler = async (newAccount: any) => {
    const address = await newAccount.getAddress();
    setDefaultAccount(address);
    const balance = await newAccount.provider.getBalance(address);
    setUserBalance(ethers.formatEther(balance));
    setSigner(newAccount);
  };

  const handleSend = async () => {
    const tx = {
      from: defaultAccount,
      to: SEND_TO_ADDRESS,
      value: ethers.parseEther(SEND_AMOUNT),
    };
    const response = await signer.sendTransaction(tx);
    console.log("response", response);
    setSuccessMessage(
      <div>
        <p className="text-emerald-600">
          Transaction sent successfully!!! View it{" "}
          <a
            target="_blank"
            href={`https://mumbai.polygonscan.com/tx/${response.hash}`}
          >
            here
          </a>
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-xl bg-gray-900 p-8">
      <button
        onClick={handleConnectWallet}
        className="mb-4 px-4 py-2 text-white bg-gray-600 rounded-xl"
      >
        {defaultAccount ? "Connected!" : "Connect"}
      </button>
      <p className="text-xl mb-4">Address: {defaultAccount}</p>
      <p className="text-xl mb-4">Wallet Amount: {userBalance}</p>
      <h3 className="color-white text-2xl mb-4">buy me coffee with ETH</h3>
      <p className="text-xl mb-4 color-white">Send me 0.0025 ETH</p>
      <p className="text-xl mb-4 color-white">
        Send to my address: {SEND_TO_ADDRESS}
      </p>
      <button
        className="mb-4 px-6 py-2 text-white bg-gray-600 rounded-xl"
        onClick={handleSend}
      >
        send
      </button>
      <p className="text-red-700 my-2">{errorMessage}</p>
      {successMessage}
    </div>
  );
};
export default WalletCard;
