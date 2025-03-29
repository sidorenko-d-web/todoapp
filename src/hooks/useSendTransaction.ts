import { CHAIN } from "@tonconnect/ui-react";
import { useCallback } from "react";
import { toNano} from "@ton/core";

import { JettonMaster } from "@ton/ton";
import { JettonWallet } from "../utils/JettonWallet";

import { useTonConnect } from "./useTonConnect";
import { TESTNET_USDT_MASTER_ADDRESS, TESTNET_RECEIVER_ADDRESS, MAINNET_RECEIVER_ADDRESS, MAINNET_USDT_MASTER_ADDRESS } from "../constants/addresses";
import { calculateUsdtAmount } from "../helpers";



export const useSendTransaction = ():
{
  sendTON: (amount: number) => void;
  sendUSDT: (amount: number, orderId: string) => Promise<string | undefined>;
} => {

  const {
    sender,
    tonClient,
    network,
    walletAddress,
    tonConnectUI
  } = useTonConnect()

  const jettonMasterAddress = network === CHAIN.TESTNET ? TESTNET_USDT_MASTER_ADDRESS: MAINNET_USDT_MASTER_ADDRESS
  const receiverAddress = network === CHAIN.TESTNET ? TESTNET_RECEIVER_ADDRESS: MAINNET_RECEIVER_ADDRESS

  const sendTON = async (amount: number) => {
    if (!tonClient || !walletAddress) return 

    try {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      const transaction = {
        validUntil: Date.now() + 60 * 1000, // 60 seconds to verify transaction
        messages: [
          {
            address: receiverAddress.toString(),
            amount: toNano(amount).toString(),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const sendUSDT = useCallback(async (amount: number, orderId: string): Promise<string | undefined> => {
    try {
      if (!tonClient || !walletAddress) return;

      console.warn("Ton client:", tonClient.parameters)

      const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
      const usersUsdtAddress = await jettonMaster.getWalletAddress(walletAddress);

      const jettonWallet = tonClient.open(JettonWallet.createFromAddress(usersUsdtAddress));
      
      await jettonWallet.sendTransfer(sender, {
        fwdAmount: 1n,
        comment: orderId,
        jettonAmount: calculateUsdtAmount(amount * 100),
        toAddress: receiverAddress,
        value: toNano('0.038'),
      });
    } catch (error) {
      console.log('Error during transaction check:', error);
    }
  }, [tonClient, walletAddress, sender]);

  return {
    sendTON,
    sendUSDT,
  };
}
