/* eslint-disable default-case */
import { Ability } from '@casl/ability';

export const ability = new Ability();

export const abilityPlugin = (store) => {
    // General rules are defined in store, so we load them before subscribing the plugin
    ability.update(store.state.query);

    return store.subscribe((mutation) => {
        switch (mutation.type) {
            case 'setUser':
                if (typeof mutation.payload.query !== 'undefined') {
                    // If user object has rules, load them
                    ability.update(mutation.payload.query);
                } else if (store.getters.isAdmin) {
                    // If user is administrator, allow user management
                    ability.update([
                        { actions: 'read', subject: 'all' },
                        { actions: ['create', 'edit', 'delete'], subject: 'User' },
                    ]);
                } else {
                    // All users has read access to everything
                    ability.update([{ actions: 'read', subject: 'all' }]);
                }
                break;
            case 'clearUser':
                // Remove all abilities on logout
                ability.update([]);
                break;
        }
    });
};
