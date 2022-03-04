<template>
    <div class="title">
        {{title}}
    </div>
</template>
<script>
    export default {
        data() {
            return {
                title: ''
            };
        },
        props: [],
        components: {},
        computed: {
            listenTitle() {
                return this.$store.state.layout.title
            }
        },
        watch: {
            listenTitle(newVal, oldVal) {
                this.title = newVal
            }
        },
        beforeCreate() {},
        created() {
            this.title = this.$store.state.layout.title
        },
        mounted() {},
        methods: {}
    }

</script>
<style scoped>
    .title {
        font-size: 20px;
        font-weight: 600;
        padding-top: 20px;
        padding-bottom: 10px;
    }
</style>
