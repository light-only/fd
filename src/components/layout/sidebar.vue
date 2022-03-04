<template>
    <div class="sidebar">
        <div v-show="!collapse" class="project-name">管理平台</div>
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse"
            background-color="#060F46" text-color="#ffffff" active-text-color="#ffffff"
            unique-opened router>
            <template v-for="item in items">
                <template v-if="item.children.length!=0">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.meta.icon"></i>
                            <span slot="title" style="padding-left: 11px;">{{ item.meta.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-menu-item :index="subItem.path" :key="subItem.path"
                                style="padding-left: 64px;">
                                <template slot="title">
                                    <i :class="subItem.meta.icon"></i>
                                    <span slot="title">{{ subItem.meta.title }}</span>
                                </template>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path">
                        <i :class="item.meta.icon"></i>
                        <span slot="title" style="padding-left: 11px;">{{ item.meta.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>

</template>

<script>
    export default {
        data() {
            return {};
        },
        computed: {
            onRoutes: {
                get() {
                    let pathArr = this.$route.path
                    return pathArr;
                },
                set(val) {

                }
            },
            //true为折叠，false为展开
            collapse() {
                return this.$store.state.layout.collapse;
            },
            items() {
                let leftMenu = this.$store.state.layout.leftMenu;
                return this.$store.state.layout.leftMenu;
            }
        },
        created() {
            let allMenu = JSON.parse(sessionStorage.getItem("sideMenu"));
            this.$store.dispatch('layout/ChangeLeftMenu', allMenu)
        },
        mounted() {},
        methods: {}
    };

</script>

<style scoped>
    .project-name {
        height: 2.5rem;
        font-size: 18px;
        color: #ffffff;
        text-align: center;
        line-height: 2.5rem;
        letter-spacing: 3px;
    }

    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 0px;
        bottom: 0;
        width: 250px;
        overflow-y: scroll;
    }

    .sidebar >>>.el-menu {
        border-right: 1px solid #002140;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar /deep/ .el-menu-item i {
        color: #ffffff;
    }

    .sidebar /deep/ .el-menu-item.is-active {
        background-color: #1492FF !important;
    }

</style>
