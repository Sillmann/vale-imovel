// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ValeImovel is ERC20 {
  
    address public owner;
    IERC20 public linkToken;
    uint256 public constant PRICE = 1 * 10 ** 18; // 1 LINK com 18 casas decimais

    // Endereço fixo do LINK na Sepolia Testnet
    address constant LINK_ADDRESS_SEPOLIA = 0x779877A7B0D9E8603169DdbD7836e478b4624789;

    event ImovelComprado(address indexed comprador, address indexed destinatario, uint256 valorPago);

    // Definindo a struct para armazenar as compras
    struct Compra {
      address comprador;
      uint256 amount;
      string  item;
      uint256 datacompra;
    }

    // Mapeamento de endereço das compras
    mapping(address => Compra[]) private compras;

    // Lista de todos os endereços que efetuaram compras
    address[] private compradores;

    // Variável para bloquear a reentrância
    bool private locked;
    
    constructor() ERC20("ValeImovel", "VAI") {
        owner = msg.sender;
        linkToken = IERC20(LINK_ADDRESS_SEPOLIA);
        _mint(owner, 10 * 10 ** decimals()); // Cria 10 VAI com 18 decimais
    }

    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function comprarImovel(address _to) external nonReentrant {
        require(balanceOf(owner) >= 1 * 10 ** decimals(), "Saldo insuficiente do owner");

        // Verifica se o usuário aprovou o contrato para gastar 1 LINK
        uint256 allowance = linkToken.allowance(msg.sender, address(this));
        require(allowance >= PRICE, "Aprovacao insuficiente para LINK. Aprove 1 LINK.");

        // Verifica o saldo de LINK do usuário
        uint256 linkBalance = linkToken.balanceOf(msg.sender);
        require(linkBalance >= PRICE, "Saldo insuficiente de LINK");


        // Atualiza o estado (efetua o processo de compra) antes de interagir com contratos externos
        Compra memory newCompra = Compra({
          comprador: msg.sender,
          amount: 1 * 10 ** decimals(),
          item: 'VAI',
          datacompra: block.timestamp 
        });

        compras[msg.sender].push(newCompra);

        // Adiciona o endereço à lista de compradores se for a primeira compra
        if (compras[msg.sender].length == 1) {
          compradores.push(msg.sender);
        }

        // Realiza a transferência de 1 LINK do usuário para o owner
        require(linkToken.transferFrom(msg.sender, owner, PRICE), "Transferencia de LINK falhou");

        // Transfere 1 VAI do owner para o comprador
        _transfer(owner, _to, 1 * 10 ** decimals());

        // Emite evento de log
        emit ImovelComprado(msg.sender, _to, PRICE);
    }    

    // Função para obter todas as compras de um endereço específico
    function getCompras(address _address) public view returns (Compra[] memory) {
      return compras[_address];
    }

    // Função para listar todos os endereços que efetuaram compras
    function getAllCompradores() public view returns (address[] memory) {
      return compradores;
    }

  }
