
import React, { useCallback, useState } from 'react'
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
    NetworkType,
    BeaconEvent,
    defaultEventCallbacks
} from "@airgap/beacon-sdk";
import config from '../config.json';

export enum BeaconConnection {
    NONE = "",
    LISTENING = "Listening to P2P channel",
    CONNECTED = "Channel connected",
    PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
    PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
}


// create the context

const AppContext = React.createContext<any>(undefined)

// create the context provider, we are using use state to ensure that
// we get reactive values from the context...
export const AppProvider: React.FC = ({ children }) => {
    // the reactive values

    const [Tezos, setTezos] = useState<TezosToolkit>(
        new TezosToolkit("https://edonet.smartpy.io/")
    );
    const [contract, setContract] = useState<any>(undefined);
    const [publicToken, setPublicToken] = useState<string | null>("");
    const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
    const [wallet, setWallet] = useState<any>(null);
    const [userAddress, setUserAddress] = useState<string>("");
    const [userBalance, setUserBalance] = useState<number>(0);
    const [storage, setStorage] = useState<number>(0);
    const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
    const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("transfer");

    const [buyingSeed, setBuyingSeed] = useState<boolean>(false);
    const [loadingDecrement, setLoadingDecrement] = useState<boolean>(false);

    // * contract
    // https://better-call.dev/edo2net/KT1C1ESWEedUGdSPvWsaKJQNhkUJUHuXBVQU
    const contractAddress: string = config.contract;

    // 
    const buySeed = useCallback(async () => {
        setBuyingSeed(true);
        try {
            //   ! 10000000 hardcoded
            const op = await contract.methods.buy(1).send({ amount: 10000000, mutez: true });
            await op.confirmation();
            // const newStorage: any = await contract.storage();
            // if (newStorage) setStorage(newStorage.toNumber());
            // setUserBalance((await Tezos.tz.getBalance(userAddress)).toNumber());
            setBuyingSeed(false);
            return true;
        } catch (error) {
            console.log(error);
        } finally {
            setBuyingSeed(false);
        }
    }, [contract]);

    const decrement = async (): Promise<void> => {
        setLoadingDecrement(true);
        try {
            const op = await contract.methods.decrement(1).send();
            await op.confirmation();
            const newStorage: any = await contract.storage();
            if (newStorage) setStorage(newStorage.toNumber());
            setUserBalance((await Tezos.tz.getBalance(userAddress)).toNumber());
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingDecrement(false);
        }
    };




    const setup = async (userAddress: string): Promise<void> => {
        setUserAddress(userAddress);
        // updates balance
        const balance = await Tezos.tz.getBalance(userAddress);
        setUserBalance(balance.toNumber());
        // creates contract instance
        const contract = await Tezos.wallet.at(contractAddress);
        // const storage: any = await contract.storage();
        setContract(contract);
        // setStorage(storage?.toNumber());
    };

    const connectWallet = async (): Promise<void> => {
        setConnectingWallet(true);
        try {
            const wallet = new BeaconWallet({
                name: "Taquito Boilerplate",
                preferredNetwork: NetworkType.EDONET,
                disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
                eventHandlers: {
                    // To keep the pairing alert, we have to add the following default event handlers back
                    [BeaconEvent.PAIR_INIT]: {
                        handler: defaultEventCallbacks.PAIR_INIT
                    },
                    [BeaconEvent.PAIR_SUCCESS]: {
                        handler: data => setPublicToken(data.publicKey)
                    }
                }
            });
            Tezos.setWalletProvider(wallet);
            await wallet.requestPermissions({
                network: {
                    type: NetworkType.EDONET,
                    rpcUrl: "https://edonet.smartpy.io"
                }
            });
            setWallet(wallet);
            // gets user's address
            const userAddress = await wallet.getPKH();
            await setup(userAddress);
            setBeaconConnection(true);
        } catch (error) {
            console.log(error);
            setConnectingWallet(false);
        }
    };

    const getWallet = () => {
        if (wallet === null) {
            const newWallet = new BeaconWallet({
                name: 'OpenSystem dApp',
                preferredNetwork: NetworkType.EDONET,
                eventHandlers: {
                    // To keep the pairing alert, we have to add the following default event handlers back
                    [BeaconEvent.PAIR_INIT]: {
                        handler: defaultEventCallbacks.PAIR_INIT
                    },
                    [BeaconEvent.PAIR_SUCCESS]: {
                        handler: data => setPublicToken(data.publicKey)
                    }
                }
            });

            return newWallet;
        }

        return wallet;
    }

    const initWallet = async (
        forceConnect: boolean
    ): Promise<boolean> => {
        const wallet = getWallet();

        const activeAccount = await wallet.client.getActiveAccount();

        if (!activeAccount) {
            if (forceConnect) {
                await wallet.requestPermissions({
                    network: {
                        type: NetworkType.EDONET,
                        rpcUrl: "https://edonet.smartpy.io"
                    }
                });
            } else {
                return false;
            }
        }

        return true;
    }

    const reconnectWallet = async () => {
        const connected = await initWallet(false);
        if (connected) {
            const wallet = getWallet();
            Tezos.setWalletProvider(wallet);
            setWallet(wallet);
            const userAddress = await wallet.getPKH();
            await setup(userAddress);
        } else {
            return connectWallet()
            // return { ...system, walletReconnectAttempted: true };
        }
    }

    const disconnectWallet = async (): Promise<void> => {
        //window.localStorage.clear();
        setUserAddress("");
        setUserBalance(0);
        setWallet(null);
        const tezosTK = new TezosToolkit("https://edonet.smartpy.io");
        setTezos(tezosTK);
        setBeaconConnection(false);
        setPublicToken(null);
        console.log("disconnecting wallet");
        if (wallet) {
            await wallet.client.removeAllAccounts();
            await wallet.client.removeAllPeers();
            await wallet.client.destroy();
        }
    };



    let v = {
        reconnectWallet,
        disconnectWallet,
        connectWallet,
        buySeed,
        userAddress,
        wallet
    }

    return <AppContext.Provider value={v}>{children}</AppContext.Provider>
}

export const useApp = () => React.useContext(AppContext)
