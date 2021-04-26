/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IFundLimitsOracleContract
  extends Truffle.Contract<IFundLimitsOracleInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IFundLimitsOracleInstance>;
}

type AllEvents = never;

export interface IFundLimitsOracleInstance extends Truffle.ContractInstance {
  /**
   * Set new limit for a token. It's used while seller tries to create a voucher. The limit is determined by a voucher set. Voucher price * quantity, seller deposit * quantity, buyer deposit * qty must be below the limit.
   * @param _newLimit New limit which will be set. It must comply to the decimals of the token, so the limit is set in the correct decimals.
   * @param _tokenAddress Address of the token which will be updated.
   */
  setTokenLimit: {
    (
      _tokenAddress: string,
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _tokenAddress: string,
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _tokenAddress: string,
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _tokenAddress: string,
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Get the maximum allowed token limit for the specified Token.
   * @param _tokenAddress Address of the token which will be update.
   */
  getTokenLimit(
    _tokenAddress: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Set new limit for ETH. It's used while seller tries to create a voucher. The limit is determined by a voucher set. Voucher price * quantity, seller deposit * quantity, buyer deposit * qty must be below the limit.
   * @param _newLimit New limit which will be set.
   */
  setETHLimit: {
    (
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _newLimit: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Get the maximum allowed ETH limit to set as price of voucher, buyer deposit or seller deposit.
   */
  getETHLimit(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  methods: {
    /**
     * Set new limit for a token. It's used while seller tries to create a voucher. The limit is determined by a voucher set. Voucher price * quantity, seller deposit * quantity, buyer deposit * qty must be below the limit.
     * @param _newLimit New limit which will be set. It must comply to the decimals of the token, so the limit is set in the correct decimals.
     * @param _tokenAddress Address of the token which will be updated.
     */
    setTokenLimit: {
      (
        _tokenAddress: string,
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _tokenAddress: string,
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _tokenAddress: string,
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _tokenAddress: string,
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Get the maximum allowed token limit for the specified Token.
     * @param _tokenAddress Address of the token which will be update.
     */
    getTokenLimit(
      _tokenAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Set new limit for ETH. It's used while seller tries to create a voucher. The limit is determined by a voucher set. Voucher price * quantity, seller deposit * quantity, buyer deposit * qty must be below the limit.
     * @param _newLimit New limit which will be set.
     */
    setETHLimit: {
      (
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _newLimit: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Get the maximum allowed ETH limit to set as price of voucher, buyer deposit or seller deposit.
     */
    getETHLimit(txDetails?: Truffle.TransactionDetails): Promise<BN>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
