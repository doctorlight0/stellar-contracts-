export const contracts = {
  escrow: {
    name: "Escrow",
    category: "Payments",
    description:
      "A reusable Soroban escrow contract for securely holding tokens until the receiver releases the funds or the sender claims a refund after the deadline.",
    longDescription:
      "Escrow allows a sender to lock tokens in the contract for a specific receiver. The receiver can release the funds when the agreement is fulfilled, while the sender can reclaim the funds after the escrow deadline has passed.",
    tags: ["Rust", "Soroban", "XLM", "Payments"],
    status: "Verified",
    tests: 4,
    version: "v1.0.0",
    source: "contracts/escrow",
    network: "Stellar Testnet",
    contractId:
      "CBAY3OIB74BOCSYMPYJLC44DOUH6K3KSPNIOP2ELYVVU5NDRBK55FS4L",
    functions: ["create", "release", "refund", "get_escrow"],
  },

  vesting: {
    name: "Vesting",
    category: "Token Management",
    description:
      "A reusable Soroban vesting contract that releases tokens according to a predefined schedule.",
    longDescription:
      "Vesting allows tokens to become available gradually over time instead of being released immediately. It can be used for contributor allocations, grants, or other scheduled distributions.",
    tags: ["Rust", "Soroban", "Token Management"],
    status: "Verified",
    tests: 4,
    version: "v1.0.0",
    source: "contracts/vesting",
    network: "Stellar Testnet",
    contractId:
      "CBAY3OIB74BOCSYMPYJLC44DOUH6K3KSPNIOP2ELYVVU5NDRBK55FS4L",
    functions: ["create_schedule", "claim", "get_schedule"],
  },

  timelock: {
    name: "Timelock",
    category: "Security",
    description:
      "A reusable Soroban timelock contract that prevents tokens from being accessed before a configured unlock time.",
    longDescription:
      "Timelock locks tokens inside the contract until a specified time is reached. The owner can then unlock and retrieve the tokens after the configured unlock time.",
    tags: ["Rust", "Soroban", "Security"],
    status: "Verified",
    tests: 4,
    version: "v1.0.0",
    source: "contracts/timelock",
    network: "Stellar Testnet",
    contractId:
      "CBAY3OIB74BOCSYMPYJLC44DOUH6K3KSPNIOP2ELYVVU5NDRBK55FS4L",
    functions: ["create_lock", "unlock", "get_lock"],
  },
};