<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">管理平台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <div style="text-align: center;color: #1492FF;font-size: 0.625rem;font-weight: bold;margin-bottom: 0.94rem;">登录</div>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" show-password v-model="ruleForm.password">
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">忘记密码请联系管理员</p>
            </el-form>
        </div>
        <div class="copy-right">
            <div style="margin-bottom: 5px;color: white">河南云数聚网络科技有限公司&nbsp;&nbsp;&nbsp;技术支持</div>
            <div style="color: white">Copyright © 2021 Hncdcenter Co.,Ltd, All Rights Reserved.</div>
        </div>
    </div>
</template>

<script>
    import LOGIN from '../../api/login'
    import allBaseData from '../../assets/js/baseData'
    import Utils from '../../util/util.js';

    export default {
        data() {
            return {
                ruleForm: {
                    username: "",
                    password: ""
                },
                rules: {
                    username: [{
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }],
                    password: [{
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }]
                }
            };
        },
        created() {
            this.keyupSubmit();
        },
        //登陆是否成功判断
        methods: {
            clearNullArr(arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (!arr[i] || arr[i] == '' || arr[i] === undefined) {
                        arr.splice(i, 1);
                        len--;
                        i--;
                    }
                }
                return arr;
            },
            keyupSubmit() {
                document.onkeydown = e => {
                    let _key = window.event.keyCode;
                    if (_key === 13) {
                        this.submitForm("ruleForm");
                    }
                };
            },
            submitForm(formName) {
                let vm = this
                vm.$refs[formName].validate(valid => {
                    if (valid) {
                        let params = {
                            username: vm.ruleForm.username,
                            password: Utils.encrypt(vm.ruleForm.password),
                            // type:'admin'
                        };

                        vm.$message.success('登录成功');
                        // sessionStorage.setItem("token", res.data.token);
                        sessionStorage.setItem("ms_username", this.ruleForm.username);
                        // sessionStorage.setItem("userId", res.data.userId);
                        sessionStorage.setItem("role", this.ruleForm.username);
                        sessionStorage.setItem("theme", 'white');
                        let allMenu = allBaseData.allMenuData;
                        sessionStorage.setItem("sideMenu", JSON.stringify(allMenu));
                        if (allMenu[0].children.length == 0) {
                            vm.$router.push(allMenu[0].path);
                        } else {
                            vm.$router.push(allMenu[0].children[0].path);
                        }

                        // LOGIN.login(params).then(res => {
                        //     if (res.code === 200) {
                        //         // 接口返回的权限码
                        //         if (res.data.menuCodes.length > 0) {
                        //             vm.$message.success('登录成功');
                        //             sessionStorage.setItem("token", res.data.token);
                        //             sessionStorage.setItem("ms_username", vm.ruleForm.username);
                        //             sessionStorage.setItem("userId", res.data.userId);
                        //             sessionStorage.setItem("role", vm.ruleForm.username);
                        //             sessionStorage.setItem('community',res.data.community)
                        //             sessionStorage.setItem("theme", 'white');
                        //             let perms = res.data.menuCodes;
                        //             let arr = JSON.stringify(allBaseData.allMenuData)
                        //             let allMenu = JSON.parse(arr)
                        //
                        //             let tempMenu = allBaseData.allMenuData
                        //             let tempPerms = allBaseData.allPermsData
                        //
                        //             //去除拷贝数组allMenu中children内容
                        //             for (let i = 0; i < allMenu.length; i++) {
                        //                 allMenu[i].children.length = 0
                        //             }
                        //             for (let j = 0; j < perms.length; j++) {
                        //                 if (tempPerms.one.indexOf(perms[j]) > -1) {
                        //                     allMenu[0].children.push(tempMenu[0].children[tempPerms.one.indexOf(perms[j])])
                        //                 } else if (tempPerms.nine.indexOf(perms[j]) > -1) {
                        //                     allMenu[8].children.push(tempMenu[8].children[tempPerms.nine.indexOf(perms[j])])
                        //                 }else if (tempPerms.ten.indexOf(perms[j]) > -1) {
                        //                     allMenu[9].children.push(tempMenu[9].children[tempPerms.ten.indexOf(perms[j])])
                        //                 }
                        //             }
                        //
                        //             if (allMenu[0].children.length == 0) {
                        //                 allMenu[0] = ''
                        //             }
                        //             if (allMenu[8].children.length == 0) {
                        //                 allMenu[8] = ''
                        //             }
                        //             if (allMenu[9].children.length == 0) {
                        //                 allMenu[9] = ''
                        //             }
                        //             if (perms.indexOf('zykjc') < 0) {
                        //                 allMenu[1] = ''
                        //             }
                        //             if (perms.indexOf('lzhxm') < 0) {
                        //                 allMenu[2] = ''
                        //             }
                        //             if (perms.indexOf('jrfw') < 0) {
                        //                 allMenu[3] = ''
                        //             }
                        //             if (perms.indexOf('lyxxgl') < 0) {
                        //                 allMenu[4] = ''
                        //             }
                        //             if (perms.indexOf('fzzlgl') < 0) {
                        //                 allMenu[5] = ''
                        //             }
                        //             if (perms.indexOf('zcdtgl') < 0) {
                        //                 allMenu[6] = ''
                        //             }
                        //             if (perms.indexOf('cjwtgl') < 0) {
                        //                 allMenu[7] = ''
                        //             }
                        //             // if (perms.indexOf('zcyhgl') < 0) {
                        //             //     allMenu[7] = ''
                        //             // }
                        //
                        //             vm.clearNullArr(allMenu)
                        //             sessionStorage.setItem("sideMenu", JSON.stringify(allMenu));
                        //             if (allMenu[0].children.length == 0) {
                        //                 vm.$router.push(allMenu[0].path);
                        //             } else {
                        //                 vm.$router.push(allMenu[0].children[0].path);
                        //             }
                        //         } else {
                        //             vm.$message({
                        //                 type: "error",
                        //                 message: '很抱歉，您没有该系统的访问权限',
                        //                 duration: 1500
                        //             });
                        //         }
                        //     } else {
                        //         vm.$message.error(res.message);
                        //     }
                        // })
                    } else {
                        return false;
                    }
                });
            }
        },
        beforeDestroy() {
            document.onkeydown = function (e) {
                var key = window.event.keyCode
                if (key === 13) {
                }
            }
        }
    };

</script>

<style lang="scss" scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 600px;
        background-image: url(../../assets/img/bg.png);
        background-size: 100% 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 1.3rem;
        color: #fff;
        letter-spacing: 5px;
        margin-bottom: 0.56rem;
    }

    .ms-login {
        position: absolute;
        left: 80%;
        top: 50%;
        width: 16rem;
        margin: -8rem 0 0 -12rem;
        overflow: hidden;
    }

    .ms-content {
        margin-top: 1rem;
        background: #ffffff;
        padding: 1.3rem 2rem;
        box-shadow: 1px 1px 2px 0 rgba(222,222,222,0.50);
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 1.25rem;
        margin-bottom: 0.5rem;
    }

    .login-tips {
        font-size: 0.44rem;
        color: #999999;
        text-align: center;
    }

    .copy-right {
        color: #999999;
        font-size: 0.44rem;
        text-align: center;
        position: absolute;
        bottom: 1.9rem;
        left: 0;
        right: 0;
    }

</style>
