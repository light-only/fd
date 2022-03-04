<template>
    <div class="real-height">
        <div class="main-wrapper">
            <div class="main-content">
                <vTitle></vTitle>

                <div class="search-container">
                    <el-form ref="form" :inline="true" :model="searchForm">
                        <el-form-item label="账号：" style="margin-right:30px">
                            <el-input v-model.trim="searchForm.username" placeholder="账号"></el-input>
                        </el-form-item>
                        <!--                        <el-form-item label="角色名称：" style="margin-right:30px">-->
                        <!--                            <el-select v-model="searchForm.role" placeholder="角色名称">-->
                        <!--                                <el-option v-for="item in rolesData" :key="item.id"-->
                        <!--                                           :label="item.roleName" :value="item.id">-->
                        <!--                                </el-option>-->
                        <!--                            </el-select>-->
                        <!--                        </el-form-item>-->
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
                            <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="search-container" style="margin-top:2px">
                    <el-button type="primary" icon="el-icon-plus" @click="onAdd">添加账号</el-button>
                </div>

                <div class="table-container">
                    <el-table :data="accountList" border min-height="656" style="width: 100%;font-size: 14px;">
                        <el-table-column type="index" :resizable="false" label="序号" align="center" width="70">
                            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="username" :resizable="false" label="账号"
                                         min-width="15%"></el-table-column>
                        <el-table-column prop="isAdmin" :resizable="false" label="角色"
                                         min-width="10%">
                            <template slot-scope="scope">
                                <span style="color: #67C23A" v-if="scope.row.isAdmin===0">管理员</span>
                                <span v-else style="color: #67C23A">社区管理员</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="communityValue" :resizable="false" label="管理社区"
                                         min-width="10%">
                            <template slot-scope="scope">
                                <span v-if="scope.row.communityValue==''">全部社区</span>
                                <span v-else>{{scope.row.communityValue}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountDesc" :resizable="false" :show-overflow-tooltip="true" label="描述"
                                         min-width="20%"></el-table-column>


                        <el-table-column prop="updatedAt" :resizable="false" label="修改时间"
                                         min-width="15%"></el-table-column>
                        <el-table-column label="操作" :resizable="false" min-width="15%">
                            <template slot-scope="scope">
                                <el-button @click="onUpdate(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button v-if="scope.row.username!=='admin'" @click="onDelete(scope.row.id)"
                                           type="text" size="small"
                                           style="color:#F04E4E">删除
                                </el-button>
                                <el-button @click="onResetPwd(scope.row.id)" type="text" size="small">重置密码</el-button>
                                <el-button @click="onDetail(scope.row)" type="text" size="small">详情</el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="text-align: right;margin: 1rem 0;">
                    <el-pagination background @size-change="handleSizeChange"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :current-page="currentPage" @current-change="handlePageNumChange"
                                   :page-sizes="[15, 30, 50, 100]"
                                   :page-size="pageSize" :total="pageTotal">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 新增弹框 -->
        <el-dialog @close="dialogClose" :title="dialogTitle" :destroy-on-close="true" :visible.sync="dialogVisible"
                   width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px">
                <el-form-item v-if="id==''" label="账号" prop="username">
                    <el-input v-model.trim="dialogForm.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item v-else label="账号" prop="username">
                    <el-input :disabled="true" v-model="dialogForm.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item v-if="id==''" label="密码" prop="password">
                    <el-input v-model="dialogForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item v-if="id==''" label="确认密码" prop="repwd">
                    <el-input v-model="dialogForm.repwd" type="password" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-radio-group v-model="dialogForm.isAdmin">
                        <el-radio :label="0">管理员</el-radio>
                        <el-radio :label="1">社区管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="管理社区" prop="community" v-if="dialogForm.isAdmin===1">
                    <el-select v-model="dialogForm.community" style="width: 100%;" class="handle-input">
                        <el-option v-for="(item,index) in communitys" :label="item.dictValue"
                                   :key="item.dictKey"
                                   :value="item.dictKey"></el-option>
                    </el-select>
                </el-form-item>
                <!--                <el-form-item label="角色" prop="roleId" v-if="id!=''&&dialogForm.username=='admin'">-->
                <!--                    <el-select v-model="dialogForm.roleId" disabled placeholder="请选择角色" style="width:100%">-->
                <!--                        <el-option v-for="item in rolesData" :key="item.id" :label="item.roleName"-->
                <!--                                   :value="item.id">-->
                <!--                        </el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->

                <!--                <el-form-item label="角色" prop="roleId" v-else>-->
                <!--                    <el-select v-model="dialogForm.roleId" placeholder="请选择角色" style="width:100%">-->
                <!--                        <el-option v-for="item in rolesData" :key="item.id" :label="item.roleName"-->
                <!--                                   :value="item.id">-->
                <!--                        </el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->

                <el-form-item label="描述" prop="desc">
                    <el-input placeholder="请输入描述" v-model.trim="dialogForm.accountDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-check" @click="saveClick('dialogForm')">保存</el-button>
                <el-button icon="el-icon-close" @click="dialogClose()">取消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="详情" :visible.sync="dialogVisibleDetail" @close="dialogCloseDetail" top="6%" width="55%"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <div style="width: 90%;" class="my-dialog">
                <el-form label-width="120px">
                    <el-form-item label="账号">
                        {{detail.username}}
                    </el-form-item>
                    <el-form-item label="角色">
                        <template slot-scope="scope">
                            <div>
                            <span v-if="detail.isAdmin===1">
                                系统管理员
                            </span>
                                <span v-else>
                                社区管理员
                            </span>
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item label="管理社区">
                        <div>
                            <span v-if="detail.communityValue">
                                detail.communityValue
                            </span>
                            <span v-else>
                                全部社区
                            </span>
                        </div>
                        {{detail.communityValue}}
                    </el-form-item>
                    <el-form-item label="描述">
                        {{detail.accountDesc}}
                    </el-form-item>
                    <el-form-item label="修改时间">
                        {{detail.updatedAt}}
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import vTitle from '../layout/title'
    import DataBaseAccount from '../../api/accountData'
    import DataBaseRole from '../../api/roleData'
    import Utils from '../../util/util.js';
    import baseData from '../../assets/js/baseData'
    import BaseData from '../../api/baseData'

    export default {
        data() {
            return {
                dialogVisibleDetail: false,
                detail: {},
                communitys: [],
                pageSize: 15, //默认每页10条
                pageTotal: 0,
                currentPage: 1, //当前页
                pageNum: 1, //要跳转到的页面
                id: '',
                dialogTitle: '',
                dialogVisible: false,
                accountList: [],
                // rolesData: [],
                updateOrignData: [],
                searchForm: {
                    username: '',
                    // role: ''
                },
                dialogForm: {
                    nickname: '',
                    is_del: '',
                    username: '',
                    password: '',
                    repwd: '',
                    accountDesc: '',
                    // roleId: '',
                    isAdmin: 1,
                    community: '',
                },
                rules: {
                    username: [{
                        max: 20,
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }],
                    repwd: [{
                        required: true,
                        message: '请再次确认密码',
                        trigger: 'blur'
                    }],
                    // roleId: [{
                    //     trigger: 'change',
                    //     required: true,
                    //     message: '请选择角色'
                    // }],
                    accountDesc: [{
                        max: 255,
                        required: true,
                        message: '请输入描述',
                        trigger: 'blur'
                    }],
                    community: [{
                        trigger: 'change',
                        required: true,
                        message: '请选择社区'
                    }],
                }
            }
        },
        components: {
            vTitle
        },
        created() {
            // this.getAccountList()
            // this.getRoleList(),
            // this.getMsTypeList()
        },
        computed: {},
        watch: {},
        methods: {
            dialogCloseDetail() {
                this.dialogVisibleDetail = false
                this.detail = {}
            },

            getPassWorld() {
                debugger
                return Utils.decrypt(this.detail.password)
            },
            onDetail(obj) {
                this.dialogVisibleDetail = true
                this.detail = obj
            },
            //获取社区种类字典信息
            getMsTypeList() {
                let params = {
                    type: baseData.typeList[5],
                }
                BaseData.getTypeList(params).then(res => {
                    if (res.code == 200) {
                        this.communitys = res.data;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },
            //获取列表
            getAccountList() {
                let params = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    username: this.searchForm.username,
                    // roleId: this.searchForm.role
                }

                DataBaseAccount.getAccountList(params).then(res => {
                    if (res.code == 200) {
                        this.accountList = res.data.list;
                        this.currentPage = res.data.pageNum;
                        this.pageTotal = parseInt(res.data.total);
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },
            //搜索
            onSearch() {
                this.pageNum = 1;
                this.getAccountList()
            },
            //重置搜索框
            onReset() {
                this.pageNum = 1;
                // this.searchForm.role = '';
                this.searchForm.username = '';
                this.getAccountList()
            },
            //添加账号弹框
            onAdd() {
                this.dialogTitle = '新增账号';
                this.dialogVisible = true;
                this.id = ''
            },
            //编辑
            onUpdate(data) {
                this.dialogTitle = '编辑账号';
                this.dialogVisible = true;
                this.updateOrignData = JSON.parse(JSON.stringify(data))
                this.dialogForm = {
                    username: data.username,
                    accountDesc: data.accountDesc,
                    // roleId: data.roleId,
                    isAdmin: data.isAdmin,
                    community: data.community
                }
                this.id = data.id
            },
            //新增或编辑
            saveClick(ruleForm) {
                let vm = this
                if (this.dialogForm.isAdmin === 0) {
                    this.dialogForm.community = ''
                }
                if (this.id === '') {
                    var reg = /^(?![^a-zA-Z]+$)(?!\\\\D+$).{8,16}$/
                    if (this.dialogForm.password != this.dialogForm.repwd) {
                        this.$message({
                            type: "error",
                            message: '两次密码输入不一致',
                            duration: 1500
                        });
                        return
                    }
                    this.$refs[ruleForm].validate((valid) => {
                        if (valid) {
                            let params = {
                                roleId: this.dialogForm.roleId,
                                // nickname:this.dialogForm.nickname,
                                username: this.dialogForm.username,
                                password: Utils.encrypt(this.dialogForm.password),
                                accountDesc: this.dialogForm.accountDesc,
                                isAdmin: this.dialogForm.isAdmin,
                                community: this.dialogForm.community
                            }
                            DataBaseAccount.creatAccount(params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: "success",
                                        message: res.message,
                                        duration: 1500
                                    });
                                    this.dialogClose()
                                    this.getAccountList()
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: res.message,
                                        duration: 1500
                                    });
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    this.$refs[ruleForm].validate((valid) => {
                        if (valid) {
                            let params = {
                                id: this.id,
                                // roleId: this.dialogForm.roleId,
                                accountDesc: this.dialogForm.accountDesc,
                                isAdmin: this.dialogForm.isAdmin,
                                community: this.dialogForm.community
                            }
                            DataBaseAccount.updataAccount(params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: "success",
                                        message: res.message,
                                        duration: 1500
                                    });
                                    this.dialogClose()
                                    this.getAccountList()
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: res.message,
                                        duration: 1500
                                    });
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                }

            },
            // //获取所有角色
            // getRoleList() {
            //     DataBaseRole.getRoleAll().then(res => {
            //         if (res.code == 200) {
            //             this.rolesData = res.data;
            //         } else {
            //             this.$message({
            //                 type: "error",
            //                 message: res.message,
            //                 duration: 1500
            //             });
            //         }
            //     });
            // },
            //删除
            onDelete(userId) {
                this.$confirm('此操作将永久删除该项目, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DataBaseAccount.deletAccountFromId(userId).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: "success",
                                message: res.message,
                                duration: 1500
                            });
                            this.getAccountList()
                        } else {
                            this.$message({
                                type: "error",
                                message: res.message,
                                duration: 1500
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //重置密码
            onResetPwd(userId) {
                this.$confirm('此操作将重置密码为123456, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DataBaseAccount.resetAccount(userId).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: "success",
                                message: res.message,
                                duration: 1500
                            });
                            this.getAccountList()
                        } else {
                            this.$message({
                                type: "error",
                                message: res.message,
                                duration: 1500
                            });
                        }
                    });
                }).catch(() => {
                });
            },
            //关闭弹框
            dialogClose() {
                this.$nextTick(() => {
                    this.$refs['dialogForm'].resetFields();
                    for (let key in this.dialogForm) {
                        if (this.dialogForm.hasOwnProperty(key)) {
                            this.dialogForm[key] = ''
                        }
                    }
                    this.dialogForm.isAdmin = 1
                })
                this.dialogVisible = false
            },
            //处理跳页
            handlePageNumChange(val) {
                this.pageNum = val;
                this.getAccountList();
            },
            //处理每页多少条改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.getAccountList();
            }
        }
    }

</script>

<style scoped>
    .search-container {
        font-size: 14px;
        margin-top: 20px
    }

    .table-container {
        margin-top: 20px;
    }

    .main-content /deep/ .el-tabs__nav-wrap::after {
        height: 1px;
    }
</style>>
