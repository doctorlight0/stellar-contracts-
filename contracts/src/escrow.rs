

use soroban_sdk::{
    contract,
    contractimpl,
    contracttype,
    token,
    Address,
    Env,
};

#[derive(Clone)]
#[contracttype]
pub struct Escrow {
    pub sender: Address,
    pub receiver: Address,
    pub token: Address,
    pub amount: i128,
    pub deadline: u64,
    pub released: bool,
}

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Escrow(u64),
    NextId,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Creates an escrow and immediately transfers the tokens
    /// from the sender into this contract.
    pub fn create(
        env: Env,
        sender: Address,
        receiver: Address,
        token_address: Address,
        amount: i128,
        deadline: u64,
    ) -> u64 {
        sender.require_auth();

        assert!(amount > 0, "amount must be greater than zero");

        assert!(
            deadline > env.ledger().timestamp(),
            "deadline must be in the future"
        );

        let id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextId)
            .unwrap_or(0);

        let next_id = id + 1;

        let token_client = token::Client::new(&env, &token_address);

        token_client.transfer(
            &sender,
            &env.current_contract_address(),
            &amount,
        );

        let escrow = Escrow {
            sender,
            receiver,
            token: token_address,
            amount,
            deadline,
            released: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Escrow(id), &escrow);

        env.storage()
            .instance()
            .set(&DataKey::NextId, &next_id);

        id
    }

    /// Releases the escrowed tokens to the receiver.
    pub fn release(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);

        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        escrow.receiver.require_auth();

        assert!(!escrow.released, "escrow already completed");

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.receiver,
            &escrow.amount,
        );

        escrow.released = true;

        env.storage()
            .persistent()
            .set(&key, &escrow);
    }

    /// Refunds the sender after the escrow deadline has passed.
    pub fn refund(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);

        let escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("escrow not found");

        escrow.sender.require_auth();

        assert!(!escrow.released, "escrow already completed");

        assert!(
            env.ledger().timestamp() >= escrow.deadline,
            "escrow deadline has not passed"
        );

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.sender,
            &escrow.amount,
        );

        env.storage().persistent().remove(&key);
    }

    /// Returns the details of an escrow.
    pub fn get_escrow(env: Env, escrow_id: u64) -> Escrow {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .expect("escrow not found")
    }
}
