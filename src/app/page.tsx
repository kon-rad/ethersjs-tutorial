import WalletCard from "./components/WalletCard";

export default function Home() {
  return (
    <div className="m-8 flex flex-center justify-center align-center flex-col">
      <h1 className="text-4xl text-center mb-6">Ethers.js Introduction</h1>
      <WalletCard />
    </div>
  );
}
