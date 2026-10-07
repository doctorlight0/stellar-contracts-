
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
pub struct VestingSchedule {
    pub beneficiary: Address,
    pub token: Address,
    pub amount: i128,
    pub start_time: u64,
    pub end_time: u64,
    pub claimed: i128,
}

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Schedule(u64),
    NextId,
}

#[contract]
pub struct VestingContract;

#[contractimpl]
impl VestingContract {
    pub fn create_schedule(
        env: Env,
        creator: Address,
        beneficiary: Address,
        token_address: Address,
        amount: i128,
        start_time: u64,
        end_time: u64,
    ) -> u64 {
        creator.require_auth();

        assert!(amount > 0, "amount must be greater than zero");

        assert!(
            end_time > start_time,
            "end time must be after start time"
        );

        let id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextId)
            .unwrap_or(0);

        let next_id = id + 1;

        let token_client = token::Client::new(&env, &token_address);

        token_client.transfer(
            &creator,
            &env.current_contract_address(),
            &amount,
        );

        let schedule = VestingSchedule {
            beneficiary,
            token: token_address,
            amount,
            start_time,
            end_time,
            claimed: 0,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Schedule(id), &schedule);

        env.storage()
            .instance()
            .set(&DataKey::NextId, &next_id);

        id
    }

    pub fn claim(env: Env, schedule_id: u64) -> i128 {
        let key = DataKey::Schedule(schedule_id);

        let mut schedule: VestingSchedule = env
            .storage()
            .persistent()
            .get(&key)
            .expect("schedule not found");

        schedule.beneficiary.require_auth();

        let now = env.ledger().timestamp();

        assert!(
            now >= schedule.start_time,
            "vesting has not started"
        );

        let vested = if now >= schedule.end_time {
            schedule.amount
        } else {
            let elapsed = now - schedule.start_time;
            let duration = schedule.end_time - schedule.start_time;

            schedule.amount * elapsed as i128 / duration as i128
        };

        let claimable = vested - schedule.claimed;

        assert!(claimable > 0, "nothing available to claim");

        let token_client = token::Client::new(&env, &schedule.token);

        token_client.transfer(
            &env.current_contract_address(),
            &schedule.beneficiary,
            &claimable,
        );

        schedule.claimed += claimable;

        env.storage()
            .persistent()
            .set(&key, &schedule);

        claimable
    }

    pub fn get_schedule(
        env: Env,
        schedule_id: u64,
    ) -> VestingSchedule {
        env.storage()
            .persistent()
            .get(&DataKey::Schedule(schedule_id))
            .expect("schedule not found")
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
        Address,
    ) {
        let env = Env::default();

        env.mock_all_auths();

        let creator = Address::generate(&env);
        let beneficiary = Address::generate(&env);

        let admin = Address::generate(&env);
        let token_address =
            env.register_stellar_asset_contract_v2(admin.clone());

        let token_client =
            token::StellarAssetClient::new(
                &env,
                &token_address.address(),
            );

        token_client.mint(&creator, &1_000);

        (
            env,
            creator,
            beneficiary,
            token_address.address(),
        )
    }

    #[test]
    fn test_create_schedule() {
        let (
            env,
            creator,
            beneficiary,
            token,
        ) = setup();

        let contract_id = env.register(VestingContract, ());

        let client =
            VestingContractClient::new(&env, &contract_id);

        let start = env.ledger().timestamp() + 100;
        let end = start + 1_000;

        let schedule_id = client.create_schedule(
            &creator,
            &beneficiary,
            &token,
            &500,
            &start,
            &end,
        );

        assert_eq!(schedule_id, 0);

        let schedule = client.get_schedule(&schedule_id);

        assert_eq!(schedule.beneficiary, beneficiary);
        assert_eq!(schedule.token, token);
        assert_eq!(schedule.amount, 500);
        assert_eq!(schedule.start_time, start);
        assert_eq!(schedule.end_time, end);
        assert_eq!(schedule.claimed, 0);
    }

    #[test]
    fn test_claim_after_vesting_starts() {
        let (
            env,
            creator,
            beneficiary,
            token,
        ) = setup();

        let contract_id = env.register(VestingContract, ());

        let client =
            VestingContractClient::new(&env, &contract_id);

        let token_client =
            token::Client::new(&env, &token);

        let start = env.ledger().timestamp() + 100;
        let end = start + 1_000;

        let schedule_id = client.create_schedule(
            &creator,
            &beneficiary,
            &token,
            &500,
            &start,
            &end,
        );

        env.ledger().set_timestamp(start + 500);

        let claimed = client.claim(&schedule_id);

        assert_eq!(claimed, 250);
        assert_eq!(
            token_client.balance(&beneficiary),
            250
        );

        let schedule = client.get_schedule(&schedule_id);

        assert_eq!(schedule.claimed, 250);
    }

    #[test]
    fn test_cannot_claim_before_start() {
        let (
            env,
            creator,
            beneficiary,
            token,
        ) = setup();

        let contract_id = env.register(VestingContract, ());

        let client =
            VestingContractClient::new(&env, &contract_id);

        let start = env.ledger().timestamp() + 100;
        let end = start + 1_000;

        let schedule_id = client.create_schedule(
            &creator,
            &beneficiary,
            &token,
            &500,
            &start,
            &end,
        );

        let result = client.try_claim(&schedule_id);

        assert!(result.is_err());
    }

    #[test]
    fn test_full_vesting() {
        let (
            env,
            creator,
            beneficiary,
            token,
        ) = setup();

        let contract_id = env.register(VestingContract, ());

        let client =
            VestingContractClient::new(&env, &contract_id);

        let token_client =
            token::Client::new(&env, &token);

        let start = env.ledger().timestamp() + 100;
        let end = start + 1_000;

        let schedule_id = client.create_schedule(
            &creator,
            &beneficiary,
            &token,
            &500,
            &start,
            &end,
        );

        env.ledger().set_timestamp(end);

        let claimed = client.claim(&schedule_id);

        assert_eq!(claimed, 500);
        assert_eq!(
            token_client.balance(&beneficiary),
            500
        );

        let schedule = client.get_schedule(&schedule_id);

        assert_eq!(schedule.claimed, 500);
    }
}
