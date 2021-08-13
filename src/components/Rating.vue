<template>
    <div>
        <font-awesome-icon icon="square" class="mr-1" :class="highlight(1)" />
        <font-awesome-icon icon="square" class="mr-1" :class="highlight(2)" />
        <font-awesome-icon icon="square" class="mr-1" :class="highlight(3)" />
        <font-awesome-icon icon="square" class="mr-1" :class="highlight(4)" />
        <font-awesome-icon icon="square" class="mr-1" :class="highlight(5)" />
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquare, faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSquare, faSquareFull);

export default {
    components: { FontAwesomeIcon },
    props: {
        value: {
            type: Number,
            required: true,
        },
    },
    computed: {
        highlight() {
            return (id) => {
                let textClass = 'text-light';
                if (this.value >= 50) textClass = 'text-danger';
                if (this.value >= 70) textClass = 'text-warning';
                if (this.value >= 85) textClass = 'text-success';

                switch (id) {
                    case 1:
                        return this.value >= 50 ? textClass : 'text-light';
                    case 2:
                        return this.value >= 60 ? textClass : 'text-light';
                    case 3:
                        return this.value >= 70 ? textClass : 'text-light';
                    case 4:
                        return this.value >= 80 ? textClass : 'text-light';
                    case 5:
                        return this.value >= 90 ? textClass : 'text-light';
                    default:
                        return 'text-light';
                }
            };
        },
    },
};
</script>
