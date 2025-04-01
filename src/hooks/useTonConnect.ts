import {
  CHAIN,
  TonConnectUI,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useContext, useCallback } from "react";
import { TonClientContext } from "../providers/TonClientProvider";

export const useTonConnect = (): {
  sender: Sender;
  connected: boolean;
  walletAddress: Address | null;
  walletType: string | null;
  userAddress: string | null
  network: CHAIN | null;
  tonConnectUI: TonConnectUI;
  tonClient: TonClient | undefined;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  waitForConnection: (timeout?: number) => Promise<boolean>;
} => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { tonClient } = useContext(TonClientContext);
  const userAddress = useTonAddress();

  const walletAddress = wallet?.account?.address ? Address.parse(wallet.account.address) : undefined;

  // Promise that resolves when wallet is connected
  const waitForConnection = useCallback(async (timeout = 60000): Promise<boolean> => {
    if (wallet?.account?.address) {
      return true; // Already connected
    }

    return new Promise((resolve) => {
      const checkInterval = 500; // Check every 500ms
      let elapsed = 0;
      
      // Store current connection state to detect changes
      const initialConnectionState = !!wallet?.account?.address;
      
      const intervalId = setInterval(() => {
        elapsed += checkInterval;
        
        // Check if wallet connection state has changed
        const currentConnectionState = !!wallet?.account?.address;
        
        if (currentConnectionState && !initialConnectionState) {
          clearInterval(intervalId);
          resolve(true);
        }
        
        // Timeout after specified duration
        if (elapsed >= timeout) {
          clearInterval(intervalId);
          resolve(false);
        }
      }, checkInterval);
    });
  }, [wallet]);

  // Enhanced connectWallet function that returns a promise
  const connectWallet = useCallback(async (): Promise<boolean> => {
    if (wallet?.account?.address) {
      return true; // Already connected
    }
    
    tonConnectUI.openModal();
    return waitForConnection();
  }, [tonConnectUI, waitForConnection, wallet]);

  const disconnectWallet = useCallback(() => {
    if (wallet) {
      tonConnectUI.disconnect();
    }
  }, [tonConnectUI, wallet]);

  return {
    sender: {
      send: async (args: SenderArguments) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc()?.toString("base64"),
            },
          ],
          validUntil: Date.now() + 60 * 1000, // 60 seconds for user to approve 
        });
      },
      address: walletAddress,
    },

    connected: !!wallet?.account?.address,
    walletAddress: walletAddress ?? null,
    walletType: wallet?.device.appName ?? null,
    network: wallet?.account?.chain ?? null,
    userAddress: userAddress,
    tonConnectUI,
    tonClient,
    connectWallet,
    disconnectWallet,
    waitForConnection
  };
};