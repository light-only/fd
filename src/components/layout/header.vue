<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i :class="[collapse ? 'el-icon-s-unfold' :  'el-icon-s-fold']"></i>
        </div>

        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" @command="handleCommand">
                    <span class="el-dropdown-link">
                        欢迎您，{{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-dialog title="修改密码" :visible.sync="dialogVisible" :destroy-on-close="true" width="45%"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :rules="rules" ref="ruleForm" :model="tableData" label-width="80px">
                <el-form-item label="原始密码" prop="oldPass">
                    <el-input v-model="tableData.oldPass" type="password" placeholder="请输入原始密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input v-model="tableData.newPass" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop='testNewPass'>
                    <el-input v-model="tableData.testNewPass" type="password" placeholder="请确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
                    <el-button @click="cancle">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import LOGIN from '../../api/login'
    import Utils from '../../util/util.js';

    export default {
        data() {
            return {
                dialogVisible: false,
                tableData: {
                    oldPass: '',
                    newPass: '',
                    testNewPass: ''
                },
                rules: {
                    oldPass: [{
                        required: true,
                        message: '请输入原始密码',
                        trigger: 'blur'
                    }, ],
                    newPass: [{
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur'
                    }],
                    testNewPass: [{
                        required: true,
                        message: '请确认新密码',
                        trigger: 'blur'
                    }]
                }
            };
        },
        created() {},
        computed: {
            username() {
                let username = sessionStorage.getItem("ms_username");
                return username ? username : '';
            },
            collapse: {
                get() {
                    return this.$store.state.layout.collapse
                },
                set(val) {
                    this.$store.state.layout.collapse = val
                }
            }
        },
        watch: {},
        methods: {

            loginOut() {
                let account= sessionStorage.getItem('ms_username');
                let params = {
                    account: account,
                }
                sessionStorage.clear();
                this.$router.push("/login");
                // LOGIN.loginOut(params).then(res => {
                //     if (res.code == 200) {
                //         this.$message({
                //             type: "success",
                //             message: res.message,
                //             duration: 1500
                //         });
                //         sessionStorage.clear();
                //         this.$router.push("/login");
                //         // window.location.reload()
                //     } else {
                //         this.$message({
                //             type: "error",
                //             message: res.message,
                //             duration: 1500
                //         });
                //     }
                // });
            },

            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == "loginout") {
                    this.loginOut()
                } else {
                    this.dialogVisible = true
                }
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.$store.state.layout.collapse;
                this.$store.dispatch('layout/ChangeCollapse', this.collapse)
            },
            // 修改密码
            onSubmit(formName) {
                let vm = this;
                this.userid = sessionStorage.getItem('userId');
                let reg = /^(?![^a-zA-Z]+$)(?!\\\\D+$).{8,16}$/;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!(reg.test(vm.tableData.newPass))) {
                            vm.$message({
                                message: '必须包含字母、数字8-16位',
                                type: 'warning'
                            });
                            return false
                        } else {
                            if (vm.tableData.newPass == vm.tableData.testNewPass) {
                                let params = {
                                    userId: this.userid,
                                    oldPassword: Utils.encrypt(this.tableData.oldPass),
                                    newPassword: Utils.encrypt(this.tableData.newPass),
                                }
                                LOGIN.updatePwd(params).then(res => {
                                    if (res.code == 200) {
                                        vm.$message({
                                            message: '修改成功,请重新登录',
                                            type: 'success',
                                            duration: 2000,
                                            onClose: () => {
                                                vm.dialogVisible = false
                                                vm.$router.push("/login");
                                            }
                                        });
                                    } else {
                                        vm.$message({
                                            type: "error",
                                            message: res.message,
                                            duration: 1500
                                        });
                                    }
                                })
                            } else {
                                vm.$message({
                                    message: '密码输入不一致',
                                    type: 'error'
                                });
                            }
                        }
                    } else {
                        return false
                    }
                })
            },
            cancle() {
                this.dialogVisible = false;
                this.$refs['ruleForm'].resetFields();
            }
        },
        mounted() {
            if (document.body.clientWidth < 1350) {
                this.$store.dispatch('layout/ChangeCollapse', true)
            }
        }
    };

</script>
<style scoped>
    .header {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        min-width: 1100px;
        height: 70px;
        font-size: 22px;
        color: #fff;
        background-color: #fff
    }

    .collapse-btn {
        cursor: pointer;
        flex: 0 0 20px;
        margin-left: 18px;
        font-size: 26px;
        color:#606060
    }

    .collapse-btn:hover {
        background: #fff;
    }

    .header-right {
        flex: 1;
        padding-right: 50px;
    }

    .header-user-con {
        display: flex;
        justify-content: flex-end;
        height: 70px;
        align-items: center;
    }

    .user-name {
        margin-left: 10px;
    }

    .el-dropdown-link {
        color: #606060;
        cursor: pointer;
        font-size: 0.625rem;
        padding-left: 8px;
        padding-top: 3px;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }

    .on {
        color: #606060;
        transition: all 0.5s;
    }

    .out {
        color: #606060;
        transform: rotate(-90deg);
        transition: all 0.5s;
    }

</style>
