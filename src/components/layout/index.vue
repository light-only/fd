<template>
    <div class="wrapper">
        <vSidebar></vSidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <vHead></vHead>
            <!-- <vBreadCrumb></vBreadCrumb> -->
            <div class="content">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './header';
    import vSidebar from "./sidebar";
    import vBreadCrumb from './breadcrumb';
    export default {
        data() {
            return {
                sideBarMenu: [],
                allNav: []
            }
        },
        components: {
            vHead,
            vSidebar,
            vBreadCrumb
        },
        computed: {
            collapse() {
                return this.$store.state.layout.collapse; //需要监听的数据
            }
        },
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
            this.sideBarMenu = sessionStorage.getItem("sideMenu");
            let arr = this.$route.matched;
            for (let i of arr) {
                if (i.meta.title != undefined) {
                    this.allNav.push(i.meta.title)
                }
            }
            this.$store.dispatch('layout/ChangeTitle', this.allNav[this.allNav.length - 1])
        }
    }

</script>
