import {
  CHAIN,
  TonConnectUI,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments } from "@ton/core";
import { TonClient } from "@ton/ton";
import { useContext } from "react";
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
  connectWallet: () => void
  disconnectWallet: () => void
} => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { tonClient } = useContext(TonClientContext);
  const userAddress = useTonAddress()

  const walletAddress = wallet?.account?.address ? Address.parse(wallet.account.address) : undefined;

  const connectWallet = () => {
    if (!wallet) {
      tonConnectUI.openModal()
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      tonConnectUI.disconnect();
    }
  };

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
    connectWallet: connectWallet,
    disconnectWallet: disconnectWallet
  };
};
