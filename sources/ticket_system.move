module aptos_ticket_system::ticket_system {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};

    /// Errors
    const EINVALID_TICKET_PRICE: u64 = 1;
    const EINVALID_TICKET_QUANTITY: u64 = 2;
    const EINSUFFICIENT_BALANCE: u64 = 3;
    const ETICKET_NOT_FOUND: u64 = 4;
    const EEVENT_NOT_FOUND: u64 = 5;
    const EEVENT_ALREADY_EXISTS: u64 = 6;
    const EINVALID_EVENT_DATE: u64 = 7;
    const EINVALID_EVENT_CAPACITY: u64 = 8;

    /// Structs
    struct Event has store, drop, copy {
        id: u64,
        name: String,
        description: String,
        date: u64,
        venue: String,
        capacity: u64,
        price: u64,
        tickets_sold: u64,
        organizer: address,
    }

    struct Ticket has store, drop, copy {
        id: u64,
        event_id: u64,
        owner: address,
        purchase_date: u64,
    }

    /// Events
    struct EventCreatedEvent has drop, store {
        event_id: u64,
        name: String,
        organizer: address,
    }

    struct TicketPurchasedEvent has drop, store {
        ticket_id: u64,
        event_id: u64,
        buyer: address,
        price: u64,
    }

    /// Storage
    struct TicketSystem has key {
        events: vector<Event>,
        tickets: vector<Ticket>,
        next_event_id: u64,
        next_ticket_id: u64,
        event_created_event: EventHandle<EventCreatedEvent>,
        ticket_purchased_event: EventHandle<TicketPurchasedEvent>,
    }

    /// Functions
    public entry fun initialize(account: &signer) {
        move_to(account, TicketSystem {
            events: vector::empty(),
            tickets: vector::empty(),
            next_event_id: 1,
            next_ticket_id: 1,
            event_created_event: account::new_event_handle<EventCreatedEvent>(account),
            ticket_purchased_event: account::new_event_handle<TicketPurchasedEvent>(account),
        });
    }

    public fun create_event(
        account: &signer,
        name: String,
        description: String,
        date: u64,
        venue: String,
        capacity: u64,
        price: u64,
    ) acquires TicketSystem {
        assert!(price > 0, EINVALID_TICKET_PRICE);
        assert!(capacity > 0, EINVALID_EVENT_CAPACITY);
        assert!(date > timestamp::now_seconds(), EINVALID_EVENT_DATE);

        let ticket_system = borrow_global_mut<TicketSystem>(@aptos_ticket_system);
        let event_id = ticket_system.next_event_id;
        ticket_system.next_event_id = ticket_system.next_event_id + 1;

        let event = Event {
            id: event_id,
            name,
            description,
            date,
            venue,
            capacity,
            price,
            tickets_sold: 0,
            organizer: signer::address_of(account),
        };

        vector::push_back(&mut ticket_system.events, event);

        event::emit_event(
            &mut ticket_system.event_created_event,
            EventCreatedEvent {
                event_id,
                name,
                organizer: signer::address_of(account),
            },
        );
    }

    public fun purchase_ticket(account: &signer, event_id: u64) acquires TicketSystem {
        let ticket_system = borrow_global_mut<TicketSystem>(@aptos_ticket_system);
        let event = vector::borrow_mut(&mut ticket_system.events, event_id - 1);
        assert!(event.tickets_sold < event.capacity, EINVALID_TICKET_QUANTITY);

        // Create new ticket
        let ticket_id = ticket_system.next_ticket_id;
        ticket_system.next_ticket_id = ticket_system.next_ticket_id + 1;

        let ticket = Ticket {
            id: ticket_id,
            event_id,
            owner: signer::address_of(account),
            purchase_date: timestamp::now_seconds(),
        };

        // Transfer payment
        let recipient = event.organizer;
        coin::transfer<AptosCoin>(account, recipient, event.price);

        // Update event and add ticket
        event.tickets_sold = event.tickets_sold + 1;
        vector::push_back(&mut ticket_system.tickets, ticket);

        // Emit ticket purchased event
        event::emit_event(
            &mut ticket_system.ticket_purchased_event,
            TicketPurchasedEvent {
                ticket_id,
                event_id,
                buyer: signer::address_of(account),
                price: event.price,
            },
        );
    }

    public fun get_events(): (vector<Event>) acquires TicketSystem {
        let ticket_system = borrow_global<TicketSystem>(@aptos_ticket_system);
        let events_copy = vector::empty<Event>();
        let i = 0;
        let len = vector::length(&ticket_system.events);
        while (i < len) {
            let event = *vector::borrow(&ticket_system.events, i);
            vector::push_back(&mut events_copy, event);
            i = i + 1;
        };
        (events_copy)
    }

    public fun get_tickets_by_event(event_id: u64): vector<Ticket> acquires TicketSystem {
        let ticket_system = borrow_global<TicketSystem>(@aptos_ticket_system);
        let tickets = vector::empty();
        let i = 0;
        while (i < vector::length(&ticket_system.tickets)) {
            let ticket = vector::borrow(&ticket_system.tickets, i);
            if (ticket.event_id == event_id) {
                vector::push_back(&mut tickets, *ticket);
            };
            i = i + 1;
        };
        tickets
    }
}