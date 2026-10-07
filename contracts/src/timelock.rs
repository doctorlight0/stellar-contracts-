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
pub struct Lock {
    pub owner: Address,
    pub token: Address,
    pub amount: i128,
    pub unlock_time: u64,
    pub unlocked: bool,
}

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Lock(u64),
    NextId,
}

#[contract]
pub struct TimelockContract;

#[contractimpl]
impl TimelockContract {
    pub fn create_lock(
        env: Env,
        owner: Address,
        token_address: Address,
        amount: i128,
        unlock_time: u64,
    ) -> u64 {
        owner.require_auth();

        assert!(amount > 0, "amount must be greater than zero");

        assert!(
            unlock_time > env.ledger().timestamp(),
            "unlock time must be in the future"
        );

        let id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextId)
            .unwrap_or(0);

        let next_id = id + 1;

        let token_client = token::Client::new(&env, &token_address);

        token_client.transfer(
            &owner,
            &env.current_contract_address(),
            &amount,
        );

        let lock = Lock {
            owner,
            token: token_address,
            amount,
            unlock_time,
            unlocked: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Lock(id), &lock);

        env.storage()
            .instance()
            .set(&DataKey::NextId, &next_id);

        id
    }

    pub fn unlock(env: Env, lock_id: u64) {
        let key = DataKey::Lock(lock_id);

        let mut lock: Lock = env
            .storage()
            .persistent()
            .get(&key)
            .expect("lock not found");

        lock.owner.require_auth();

        assert!(!lock.unlocked, "lock already unlocked");

        assert!(
            env.ledger().timestamp() >= lock.unlock_time,
            "unlock time has not been reached"
        );

        let token_client = token::Client::new(&env, &lock.token);

        token_client.transfer(
            &env.current_contract_address(),
            &lock.owner,
            &lock.amount,
        );

        lock.unlocked = true;

        env.storage()
            .persistent()
            .set(&key, &lock);
    }

    pub fn get_lock(
        env: Env,
        lock_id: u64,
    ) -> Lock {
        env.storage()
            .persistent()
            .get(&DataKey::Lock(lock_id))
            .expect("lock not found")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, Ledger},
        token,
        Address,
        Env,
    };

    fn setup() -> (
        Env,
        Address,
        Address,
    ) {
        let env = Env::default();

        env.mock_all_auths();

        let owner = Address::generate(&env);

        let admin = Address::generate(&env);
        let token_address =
            env.register_stellar_asset_contract_v2(admin.clone());

        let token_client =
            token::StellarAssetClient::new(
                &env,
                &token_address.address(),
            );

        token_client.mint(&owner, &1_000);

        (
            env,
            owner,
            token_address.address(),
        )
    }

    #[test]
    fn test_create_lock() {
        let (
            env,
            owner,
            token,
        ) = setup();

        let contract_id =
            env.register(TimelockContract, ());

        let client =
            TimelockContractClient::new(
                &env,
                &contract_id,
            );

        let unlock_time =
            env.ledger().timestamp() + 1_000;

        let lock_id = client.create_lock(
            &owner,
            &token,
            &500,
            &unlock_time,
        );

        assert_eq!(lock_id, 0);

        let lock = client.get_lock(&lock_id);

        assert_eq!(lock.owner, owner);
        assert_eq!(lock.token, token);
        assert_eq!(lock.amount, 500);
        assert_eq!(lock.unlock_time, unlock_time);
        assert!(!lock.unlocked);
    }

    #[test]
    fn test_cannot_unlock_early() {
        let (
            env,
            owner,
            token,
        ) = setup();

        let contract_id =
            env.register(TimelockContract, ());

        let client =
            TimelockContractClient::new(
                &env,
                &contract_id,
            );

        let unlock_time =
            env.ledger().timestamp() + 1_000;

        let lock_id = client.create_lock(
            &owner,
            &token,
            &500,
            &unlock_time,
        );

        let result = client.try_unlock(&lock_id);

        assert!(result.is_err());

        let lock = client.get_lock(&lock_id);

        assert!(!lock.unlocked);
    }

    #[test]
    fn test_unlock_after_time() {
        let (
            env,
            owner,
            token,
        ) = setup();

        let contract_id =
            env.register(TimelockContract, ());

        let client =
            TimelockContractClient::new(
                &env,
                &contract_id,
            );

        let unlock_time =
            env.ledger().timestamp() + 1_000;

        let lock_id = client.create_lock(
            &owner,
            &token,
            &500,
            &unlock_time,
        );

        env.ledger().set_timestamp(unlock_time);

        client.unlock(&lock_id);

        let lock = client.get_lock(&lock_id);

        assert!(lock.unlocked);

        let token_client =
            token::Client::new(&env, &token);

        assert_eq!(
            token_client.balance(&owner),
            1_000
        );
    }

    #[test]
    fn test_cannot_unlock_twice() {
        let (
            env,
            owner,
            token,
        ) = setup();

        let contract_id =
            env.register(TimelockContract, ());

        let client =
            TimelockContractClient::new(
                &env,
                &contract_id,
            );

        let unlock_time =
            env.ledger().timestamp() + 1_000;

        let lock_id = client.create_lock(
            &owner,
            &token,
            &500,
            &unlock_time,
        );

        env.ledger().set_timestamp(unlock_time);

        client.unlock(&lock_id);

        let result = client.try_unlock(&lock_id);

        assert!(result.is_err());
    }
}
