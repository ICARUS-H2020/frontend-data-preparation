<template>
    <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faInfoCircle);

export default {
    name: 'Tooltip',
    components: { FontAwesomeIcon },
};
</script>
