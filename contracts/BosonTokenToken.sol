// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity >=0.6.6 <0.7.0;
import "./ERC20WithPermit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BosonTokenDeposit is ERC20WithPermit, AccessControl, Ownable {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(string memory name, string memory symbol)
        ERC20WithPermit(name, symbol)
        public  
    {
        _setupRole(MINTER_ROLE, owner());
        _setupRole(ADMIN_ROLE, owner());
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
    }

    function grantMinterRole(address _to) public onlyOwner {
        grantRole(MINTER_ROLE, _to);
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have minter role to mint");
        _mint(to, amount);
    }
}