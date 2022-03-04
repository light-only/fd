<template>
    <div class="tags">
        <el-breadcrumb>
            <el-breadcrumb-item v-for="(item,index) in allNav" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                allNav: []
            };
        },
        methods: {},
        computed: {},
        watch: {
            $route(newValue, oldValue) {
                this.allNav = []
                for (let i of newValue.matched) {
                    if (i.meta.title != undefined) {
                        this.allNav.push(i.meta.title)
                    }
                }
                this.$store.dispatch('layout/ChangeTitle', this.allNav[this.allNav.length - 1])
            }
        },
        created() {
            let arr = this.$route.matched;
            for (let i of arr) {
                if (i.meta.title != undefined) {
                    this.allNav.push(i.meta.title)
                }
            }
            this.$store.dispatch('layout/ChangeTitle', this.allNav[this.allNav.length - 1])
        }
    };

</script>


<style scoped>
    .tags {
        position: relative;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 40px;
        padding-left: 24px;
        overflow: hidden;
        background: #F0F2F5;
        /* border-bottom: 1px solid #ddd;
  box-shadow: 0 5px 10px #ddd; */
    }

</style>
