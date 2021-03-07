import axios from 'axios';
import config from '../config.json';

export async function getBigMapKeys( id: number, size: number) {
  const uri = `${config.bcd.api}/v1/bigmap/${config.network}/${id}/keys?size=${size}`;
  const response = await axios.get(uri);
  return response.data;
}

export async function getContract(address: string) {
  const uri = `${config.bcd.api}/v1/contract/${config.network}/${address}`;
  const response = await axios.get(uri);
  return response.data;
}

export async function getContractStorage(address: string) {
  const uri = `${config.bcd.api}/v1/contract/${config.network}/${address}/storage`;
  const response = await axios.get(uri);
  return response.data;
}

export async function getContractOperations(
  address: string,
  since?: Date
) {
  const from = since ? `?from=${since.getTime()}` : '';
  const uri = `${config.bcd.api}/v1/contract/${config.network}/${address}/operations${from}`;
  const response = await axios.get(uri);
  return response.data;
}

export async function getWalletContracts(address: string) {
  const uri = `${config.bcd.api}/v1/search?q=${address}&i=contract&n=${config.network}&g=0&s=0`;
  const response = await axios.get(uri);
  return response.data;
}

export async function getAccountMetadata( address: string) {
  const uri = `${config.bcd.api}/v1/account/${config.network}/${address}/metadata`;
  const response = await axios.get(uri);
  return response.data;
}

export class BetterCallDev {


  getBigMapKeys(id: number) {
    return getBigMapKeys(id);
  }

  getContract(address: string) {
    return getContract(address);
  }

  getContractStorage(address: string) {
    return getContractStorage( address);
  }

  getContractOperations(address: string, since?: Date) {
    return getContractOperations( address, since);
  }

  getWalletContracts(address: string) {
    return getWalletContracts( address);
  }

  getAccountMetadata(address: string) {
    return getAccountMetadata( address);
  }
}
