// Polygon test contract ABI
export const SOURCE_TOKEN_ABI = [
  "function mint(address)", // mint new tokens
  "function safeTransferFrom(address,address,uint256)", // used for burning
  "function burn(uint256)" // this doesn't exist on the test contract but may exist on other contracts
]