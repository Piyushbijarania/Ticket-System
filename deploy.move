script {
    use aptos_ticket_system::ticket_system;

    fun main(account: &signer) {
        // Initialize the ticket system
        ticket_system::initialize(account);
    }
} 