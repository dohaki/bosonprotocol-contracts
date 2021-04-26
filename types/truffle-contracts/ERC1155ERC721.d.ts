/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface ERC1155ERC721Contract
  extends Truffle.Contract<ERC1155ERC721Instance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<ERC1155ERC721Instance>;
}

export interface Approval {
  name: "Approval";
  args: {
    _owner: string;
    _approved: string;
    _tokenId: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface ApprovalForAll {
  name: "ApprovalForAll";
  args: {
    _owner: string;
    _operator: string;
    _approved: boolean;
    0: string;
    1: string;
    2: boolean;
  };
}

export interface LogBosonRouterSet {
  name: "LogBosonRouterSet";
  args: {
    _newBosonRouter: string;
    _triggeredBy: string;
    0: string;
    1: string;
  };
}

export interface LogVoucherKernelSet {
  name: "LogVoucherKernelSet";
  args: {
    _newVoucherKernel: string;
    _triggeredBy: string;
    0: string;
    1: string;
  };
}

export interface Transfer {
  name: "Transfer";
  args: {
    _from: string;
    _to: string;
    _tokenId: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface TransferBatch {
  name: "TransferBatch";
  args: {
    _operator: string;
    _from: string;
    _to: string;
    _ids: BN[];
    _values: BN[];
    0: string;
    1: string;
    2: string;
    3: BN[];
    4: BN[];
  };
}

export interface TransferSingle {
  name: "TransferSingle";
  args: {
    _operator: string;
    _from: string;
    _to: string;
    _id: BN;
    _value: BN;
    0: string;
    1: string;
    2: string;
    3: BN;
    4: BN;
  };
}

export interface URI {
  name: "URI";
  args: {
    _value: string;
    _id: BN;
    0: string;
    1: BN;
  };
}

type AllEvents =
  | Approval
  | ApprovalForAll
  | LogBosonRouterSet
  | LogVoucherKernelSet
  | Transfer
  | TransferBatch
  | TransferSingle
  | URI;

export interface ERC1155ERC721Instance extends Truffle.ContractInstance {
  bosonRouterAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  voucherKernelAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * ERC-721
   * Transfers the ownership of a given token ID to another address. Usage of this method is discouraged, use `safeTransferFrom` whenever possible. Requires the msg.sender to be the owner, approved, or operator.
   * @param _from current owner of the token
   * @param _to address to receive the ownership of the given token ID
   * @param _tokenId uint256 ID of the token to be transferred
   */
  transferFrom: {
    (
      _from: string,
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _from: string,
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _from: string,
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _from: string,
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-721
   * Approves another address to transfer the given token ID The zero address indicates there is no approved address. There can only be one approved address per token at a given time. Can only be called by the token owner or an approved operator.
   * @param _to address to be approved for the given token ID
   * @param _tokenId uint256 ID of the token to be approved
   */
  approve: {
    (
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _to: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-721
   * Gets the approved address for a token ID, or zero if no address set Reverts if the token ID does not exist.
   * @param _tokenId uint256 ID of the token to query the approval of
   */
  getApproved(
    _tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * ERC-1155
   * Transfers amount of _tokenId from-to addresses with safety call. If _to is a smart contract, will call onERC1155BatchReceived
   * @param _data Additional data forwarded to onERC1155BatchReceived if _to is a contract
   * @param _from Source address
   * @param _to Destination address
   * @param _tokenIds array of token IDs
   * @param _values array of transfer amounts
   */
  safeBatchTransferFrom: {
    (
      _from: string,
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _from: string,
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _from: string,
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _from: string,
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-721
   * Gets the owner of the specified token ID.
   * @param _tokenId uint256 ID of the token to query the owner of
   */
  ownerOf(
    _tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * ERC-1155
   * Get the balance of account-token pairs.
   * @param _accounts The addresses of the token holders
   * @param _tokenIds IDs of the tokens
   */
  balanceOfBatch(
    _accounts: string[],
    _tokenIds: (number | BN | string)[],
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN[]>;

  /**
   * ERC-1155 & ERC-721
   * Approves or unapproves the operator. will revert if the caller attempts to approve itself as it is redundant
   * @param _approve flag to set or unset
   * @param _operator to (un)approve
   */
  setApprovalForAll: {
    (
      _operator: string,
      _approve: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _operator: string,
      _approve: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _operator: string,
      _approve: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _operator: string,
      _approve: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-1155 & ERC-721
   * Gets approval status of an operator for a given account.
   * @param _account token holder
   * @param _operator operator to check
   */
  isApprovedForAll(
    _account: string,
    _operator: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Returns true if this contract implements the interface defined by _interfaceId_. This function call must use less than 30 000 gas. ATM not enforced.
   */
  supportsInterface(
    _interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * ERC-1155
   * Batch minting of tokens Currently no restrictions as to who is allowed to mint - so, it is public.
   * @param _data Additional data forwarded to onERC1155BatchReceived if _to is a contract
   * @param _to The address that will own the minted token
   * @param _tokenIds IDs of the tokens to be minted
   * @param _values Amounts of the tokens to be minted
   */
  mintBatch: {
    (
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _to: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      _data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-1155
   * Burn an amount of tokens with the given ID
   * @param _account Account which owns the token
   * @param _tokenId ID of the token
   * @param _value Amount of the token
   */
  burn: {
    (
      _account: string,
      _tokenId: number | BN | string,
      _value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _account: string,
      _tokenId: number | BN | string,
      _value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _account: string,
      _tokenId: number | BN | string,
      _value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _account: string,
      _tokenId: number | BN | string,
      _value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-1155
   * Batch burn an amounts of tokens
   * @param _account Account which owns the token
   * @param _tokenIds IDs of the tokens
   * @param _values Amounts of the tokens
   */
  burnBatch: {
    (
      _account: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _account: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _account: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _account: string,
      _tokenIds: (number | BN | string)[],
      _values: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Setting the URL prefix for tokens metadata
   * @param _newBase New prefix to be used
   */
  _setMetadataBase: {
    (_newBase: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _newBase: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _newBase: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _newBase: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Setting the URL route for ERC1155 tokens metadata
   * @param _newRoute New route to be used
   */
  _set1155Route: {
    (_newRoute: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _newRoute: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _newRoute: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _newRoute: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Setting the URL route for ERC721 tokens metadata
   * @param _newRoute New route to be used
   */
  _set721Route: {
    (_newRoute: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      _newRoute: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _newRoute: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _newRoute: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * ERC-1155 URIs are defined in RFC 3986. The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".
   * A distinct Uniform Resource Identifier (URI) for a given token.
   * @param _tokenId The ID of the token
   */
  uri(
    _tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * ERC-721
   * A descriptive name for a collection of NFTs in this contract
   */
  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * ERC-721
   * An abbreviated name for NFTs in this contract
   */
  symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * ERC-721 Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC 3986. The URI may point to a JSON file that conforms to the "ERC721 Metadata JSON Schema".
   * A distinct Uniform Resource Identifier (URI) for a given asset.
   * @param _tokenId ID of the token
   */
  tokenURI(
    _tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Set the address of the VoucherKernel contract
   * @param _voucherKernelAddress The address of the Voucher Kernel contract
   */
  setVoucherKernelAddress: {
    (
      _voucherKernelAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _voucherKernelAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _voucherKernelAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _voucherKernelAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Set the address of the Boson Router contract
   * @param _bosonRouterAddress The Boson Router  contract
   */
  setBosonRouterAddress: {
    (
      _bosonRouterAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _bosonRouterAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _bosonRouterAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _bosonRouterAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    bosonRouterAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    voucherKernelAddress(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * ERC-721
     * Transfers the ownership of a given token ID to another address. Usage of this method is discouraged, use `safeTransferFrom` whenever possible. Requires the msg.sender to be the owner, approved, or operator.
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
     */
    transferFrom: {
      (
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-721
     * Approves another address to transfer the given token ID The zero address indicates there is no approved address. There can only be one approved address per token at a given time. Can only be called by the token owner or an approved operator.
     * @param _to address to be approved for the given token ID
     * @param _tokenId uint256 ID of the token to be approved
     */
    approve: {
      (
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-721
     * Gets the approved address for a token ID, or zero if no address set Reverts if the token ID does not exist.
     * @param _tokenId uint256 ID of the token to query the approval of
     */
    getApproved(
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * ERC-1155
     * Transfers amount of _tokenId from-to addresses with safety call. If _to is a smart contract, will call onERC1155BatchReceived
     * @param _data Additional data forwarded to onERC1155BatchReceived if _to is a contract
     * @param _from Source address
     * @param _to Destination address
     * @param _tokenIds array of token IDs
     * @param _values array of transfer amounts
     */
    safeBatchTransferFrom: {
      (
        _from: string,
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _from: string,
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _from: string,
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _from: string,
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-721
     * Gets the owner of the specified token ID.
     * @param _tokenId uint256 ID of the token to query the owner of
     */
    ownerOf(
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * ERC-1155
     * Get the balance of account-token pairs.
     * @param _accounts The addresses of the token holders
     * @param _tokenIds IDs of the tokens
     */
    balanceOfBatch(
      _accounts: string[],
      _tokenIds: (number | BN | string)[],
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN[]>;

    /**
     * ERC-1155 & ERC-721
     * Approves or unapproves the operator. will revert if the caller attempts to approve itself as it is redundant
     * @param _approve flag to set or unset
     * @param _operator to (un)approve
     */
    setApprovalForAll: {
      (
        _operator: string,
        _approve: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _operator: string,
        _approve: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _operator: string,
        _approve: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _operator: string,
        _approve: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155 & ERC-721
     * Gets approval status of an operator for a given account.
     * @param _account token holder
     * @param _operator operator to check
     */
    isApprovedForAll(
      _account: string,
      _operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Returns true if this contract implements the interface defined by _interfaceId_. This function call must use less than 30 000 gas. ATM not enforced.
     */
    supportsInterface(
      _interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * ERC-1155
     * Batch minting of tokens Currently no restrictions as to who is allowed to mint - so, it is public.
     * @param _data Additional data forwarded to onERC1155BatchReceived if _to is a contract
     * @param _to The address that will own the minted token
     * @param _tokenIds IDs of the tokens to be minted
     * @param _values Amounts of the tokens to be minted
     */
    mintBatch: {
      (
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _to: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155
     * Burn an amount of tokens with the given ID
     * @param _account Account which owns the token
     * @param _tokenId ID of the token
     * @param _value Amount of the token
     */
    burn: {
      (
        _account: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _account: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _account: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _account: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155
     * Batch burn an amounts of tokens
     * @param _account Account which owns the token
     * @param _tokenIds IDs of the tokens
     * @param _values Amounts of the tokens
     */
    burnBatch: {
      (
        _account: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _account: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _account: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _account: string,
        _tokenIds: (number | BN | string)[],
        _values: (number | BN | string)[],
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Setting the URL prefix for tokens metadata
     * @param _newBase New prefix to be used
     */
    _setMetadataBase: {
      (_newBase: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _newBase: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _newBase: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _newBase: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Setting the URL route for ERC1155 tokens metadata
     * @param _newRoute New route to be used
     */
    _set1155Route: {
      (_newRoute: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _newRoute: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _newRoute: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _newRoute: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Setting the URL route for ERC721 tokens metadata
     * @param _newRoute New route to be used
     */
    _set721Route: {
      (_newRoute: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        _newRoute: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _newRoute: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _newRoute: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155 URIs are defined in RFC 3986. The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".
     * A distinct Uniform Resource Identifier (URI) for a given token.
     * @param _tokenId The ID of the token
     */
    uri(
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * ERC-721
     * A descriptive name for a collection of NFTs in this contract
     */
    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * ERC-721
     * An abbreviated name for NFTs in this contract
     */
    symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * ERC-721 Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC 3986. The URI may point to a JSON file that conforms to the "ERC721 Metadata JSON Schema".
     * A distinct Uniform Resource Identifier (URI) for a given asset.
     * @param _tokenId ID of the token
     */
    tokenURI(
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Set the address of the VoucherKernel contract
     * @param _voucherKernelAddress The address of the Voucher Kernel contract
     */
    setVoucherKernelAddress: {
      (
        _voucherKernelAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _voucherKernelAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _voucherKernelAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _voucherKernelAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Set the address of the Boson Router contract
     * @param _bosonRouterAddress The Boson Router  contract
     */
    setBosonRouterAddress: {
      (
        _bosonRouterAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _bosonRouterAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _bosonRouterAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _bosonRouterAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-721
     * Safely transfers the ownership of a given token ID to another address If the target address is a contract, it must implement `onERC721Received`, which is called upon a safe transfer, and return the magic value `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise, the transfer is reverted. Requires the msg.sender to be the owner, approved, or operator
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
     */
    "safeTransferFrom(address,address,uint256)": {
      (
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-721
     * Safely transfers the ownership of a given token ID to another address If the target address is a contract, it must implement `onERC721Received` Requires the msg.sender to be the owner, approved, or operator
     * @param _data bytes data to send along with a safe transfer check
     * @param _from current owner of the token
     * @param _to address to receive the ownership of the given token ID
     * @param _tokenId uint256 ID of the token to be transferred
     */
    "safeTransferFrom(address,address,uint256,bytes)": {
      (
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155
     * Transfers amount of _tokenId from-to addresses with safety call. If _to is a smart contract, will call onERC1155Received
     * @param _data Additional data forwarded to onERC1155Received if _to is a contract
     * @param _from Source address
     * @param _to Destination address
     * @param _tokenId ID of the token
     * @param _value Transfer amount
     */
    "safeTransferFrom(address,address,uint256,uint256,bytes)": {
      (
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _from: string,
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155
     * Get the balance of tokens of an account
     * @param _account The address of the token holder
     * @param _tokenId ID of the token
     */
    "balanceOf(address,uint256)"(
      _account: string,
      _tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * ERC-721
     * Count all NFTs assigned to an owner
     * @param _owner An address for whom to query the balance
     */
    "balanceOf(address)"(
      _owner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * ERC-721
     * Function to mint tokens.
     * @param to The address that will receive the minted tokens.
     * @param tokenId The token id to mint.
     */
    "mint(address,uint256)": {
      (
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        to: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * ERC-1155
     * Mint an amount of a desired token Currently no restrictions as to who is allowed to mint - so, it is public.
     * @param _data Additional data forwarded to onERC1155BatchReceived if _to is a contract
     * @param _to owner of the minted token
     * @param _tokenId ID of the token to be minted
     * @param _value Amount of the token to be minted
     */
    "mint(address,uint256,uint256,bytes)": {
      (
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _to: string,
        _tokenId: number | BN | string,
        _value: number | BN | string,
        _data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
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
