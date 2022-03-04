<template>
    <div class="real-height">
        <div class="main-wrapper">
            <div class="main-content">
                <vTitle></vTitle>

                <div class="search-container">
                    <el-form ref="form" :inline="true" :model="searchForm">
                        <el-form-item label="角色名称：" style="margin-right:30px">
                            <el-select v-model="searchForm.roleName" placeholder="角色名称">
                                <el-option v-for="item in rolesData" :key="item.roleName"
                                           :label="item.roleName" :value="item.roleName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
                            <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="search-container" style="margin-top:2px">
                    <el-button type="primary" icon="el-icon-plus" @click="onAdd">添加角色</el-button>
                </div>

                <div class="table-container">
                    <el-table :data="tableData" border min-height="656" style="width: 100%;font-size: 14px;">
                        <el-table-column type="index" :resizable="false" label="序号" align="center" width="70">
                            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pageSize + 1}} </span></template>
                        </el-table-column>
                        <el-table-column prop="roleName" :resizable="false" label="角色名" min-width="20%"></el-table-column>
                        <el-table-column prop="roleDesc" :resizable="false" :show-overflow-tooltip="true" label="描述" min-width="30%"></el-table-column>
                        <el-table-column prop="createdAt" :resizable="false" label="创建时间" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="操作" :resizable="false" min-width="10%">
                            <template slot-scope="scope">
                                <el-button @click="onUpdate(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button @click="onDelete(scope.row.id)" type="text" size="small"
                                           style="color:#F04E4E">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="text-align: right;margin: 1rem 0;">
                    <el-pagination background @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"
                                   :current-page="currentPage" @current-change="handlePageNumChange" :page-sizes="[15, 30, 50, 100]"
                                   :page-size="pageSize" :total="pageTotal">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 弹框 -->
        <el-dialog @close="dialogClose" :title="dialogTitle" :destroy-on-close="true" :visible.sync="dialogVisible"
                   width="50%" top="3%" :close-on-click-modal="false" :close-on-press-escape="false">
            <div style="height: 16rem;overflow: auto;padding-right: 20px;">
                <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model.trim="dialogForm.roleName" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input placeholder="请输入角色描述" v-model.trim="dialogForm.roleDesc">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="权限选择">
                        <el-tree :data="treeData" show-checkbox default-expand-all node-key="id" ref="tree"
                                 highlight-current :props="defaultProps"></el-tree>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-check" @click="saveClick('dialogForm')">保存</el-button>
                <el-button icon="el-icon-close" @click="dialogClose()">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vTitle from '../layout/title'
    import DataBaseRole from '../../api/roleData'

    export default {
        data() {
            return {
                pageSize: 15, //默认每页10条
                pageTotal: 0,
                currentPage: 1, //当前页
                pageNum: 1, //要跳转到的页面
                id: '', //编辑时存放roleId
                dialogTitle: '',
                dialogVisible: false,
                searchForm: {
                    roleName: ''
                },
                tableData: [],
                treeData: [],
                dialogForm: {
                    roleName: '',
                    roleDesc: ''
                },
                defaultProps: {
                    id: 'id',
                    label: 'menuName',
                    children: 'child'
                },
                rules: {
                    roleName: [{
                        max: 20,
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }],
                    roleDesc: [{
                        max: 255,
                        required: true,
                        message: '请输入角色描述',
                        trigger: 'blur'
                    }]
                },
                rolesData: []
            }
        },
        components: {
            vTitle
        },
        created() {
            // this.getRoleAll();
            // this.getRoleList();
            // this.getPerTree();
        },
        methods: {
            //获取所有角色
            getRoleAll() {
                DataBaseRole.getRoleAll().then(res => {
                    if (res.code == 200) {
                        this.rolesData = res.data;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },
            //分页获取所有角色
            getRoleList() {
                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    roleName: this.searchForm.roleName
                }
                DataBaseRole.getRoleList(params).then(res => {
                    if (res.code == 200) {
                        this.tableData = res.data.list;
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
            //获取权限树
            getPerTree() {
                DataBaseRole.permTree().then(res => {
                    if (res.code == 200) {
                        this.treeData = res.data;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                })
            },
            //搜索
            onSearch() {
                this.pageNum = 1;
                this.getRoleList();
            },
            //重置搜索框
            onReset() {
                this.pageNum = 1;
                this.searchForm.roleName = '';
                this.getRoleList();
            },
            onAdd() {
                this.dialogTitle = '新增角色';
                this.dialogVisible = true;
                this.id = '';
            },
            //编辑
            onUpdate(data) {
                this.dialogTitle = '编辑角色';
                this.dialogVisible = true;
                this.id = data.id;
                this.dialogForm = {
                    roleName: data.roleName,
                    roleDesc: data.roleDesc
                }
                let params = {
                    roleId: this.id
                }
                DataBaseRole.permById(params).then(res => {
                    if (res.code == 200) {
                        this.$refs.tree.setCheckedKeys(res.data.menuIds);
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                })
            },
            //删除
            onDelete(id) {
                this.$confirm('此操作将永久删除该项目, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DataBaseRole.deletRoleFromId(id).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: "success",
                                message: res.message,
                                duration: 1500
                            });
                            this.getRoleList();
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
            //新增或编辑
            saveClick(ruleForm) {
                let vm = this;
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        let roleCode = this.$refs.tree.getCheckedKeys();
                        if (roleCode.length == 0) {
                            this.$message({
                                type: "error",
                                message: '请选择权限',
                                duration: 1500
                            });
                        } else {
                            if (this.id == '') {
                                let params = {
                                    roleName: this.dialogForm.roleName,
                                    roleDesc: this.dialogForm.roleDesc,
                                    menuIds: roleCode.map(String)
                                }
                                DataBaseRole.addRole(params).then(res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '提交成功！',
                                            duration: 1000,
                                            onClose: function () {
                                                vm.dialogVisible = false;
                                                vm.getRoleList()
                                            }
                                        });
                                    } else {
                                        this.$message({
                                            type: "error",
                                            message: res.message,
                                            duration: 1500
                                        });
                                    }
                                })
                            } else {
                                let params = {
                                    id: this.id,
                                    roleName: this.dialogForm.roleName,
                                    roleDesc: this.dialogForm.roleDesc,
                                    menuIds: roleCode.map(String)
                                }
                                DataBaseRole.updateRole(params).then(res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: '提交成功！',
                                            duration: 1000,
                                            onClose: function () {
                                                vm.dialogVisible = false;
                                                vm.getRoleList()
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
                            }
                        }
                    } else {
                        return false;
                    }
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
                })
                this.dialogVisible = false;
            },
            //处理跳页
            handlePageNumChange(val) {
                this.pageNum = val;
                this.getRoleList();
            },
            //处理每页多少条改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.getRoleList();
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

</style>>
