<template>
    <div class="real-height">
        <div class="main-wrapper">
            <div class="main-content">
                <vTitle></vTitle>
                <el-form ref="form" :model="searchForm">
                    <div class="search-container">
                        <el-form ref="form1" :inline="true" :model="searchForm">
                            <el-form-item label="房屋标题">
                                <el-input v-model="searchForm.name" placeholder="请输入房屋标题"
                                          class="handle-input"></el-input>
                            </el-form-item>

                            <el-form-item label="所在社区">
                                <el-select v-model="searchForm.community" :disabled="disableSelect"
                                           class="handle-input">
                                    <el-option v-for="(item,index) in communitys" :label="item.dictValue"
                                               :key="item.dictKey"
                                               :value="item.dictKey"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="房屋租金">
                                <el-select v-model="searchForm.priceType"
                                           class="handle-input">
                                    <el-option v-for="(item,index) in priceTypes" :label="item.dictValue"
                                               :key="item.dictKey"
                                               :value="item.dictKey"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
                                <el-button icon="el-icon-refresh-left" @click="onReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-form>

                <div class="action-button">
                    <el-button type="success" icon="el-icon-circle-plus-outline" @click="onAdd">新增</el-button>
                </div>

                <div class="table-container">
                    <el-table :data="tableData" border min-height="656" style="width: 100%;font-size: 14px;">
                        <el-table-column type="index" align="center" min-width="2%">
                            <template slot-scope="scope">
                                <span>{{scope.$index + (currentPage - 1) * pageSize + 1}}</span></template>
                        </el-table-column>
                        <el-table-column prop="name" label="房屋标题"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="communityValue" label="所在社区"></el-table-column>
                        <el-table-column prop="specifications" label="户型"></el-table-column>
                        <el-table-column prop="price" label="租金">
                            <template slot-scope="scope">
                                <span v-if="scope.row.price===-101">面议</span>
                                <span v-else>{{scope.row.price}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="floorSpace" label="面积"></el-table-column>
                        <el-table-column prop="contacts" label="联系人"></el-table-column>
                        <el-table-column prop="mobile" label="联系电话"></el-table-column>
                        <el-table-column prop="address" label="详细地址"></el-table-column>
                        <el-table-column prop="logo" label="房屋主图">
                            <template slot-scope="scope">
                                <img :src="scope.row.logo" style="width:60px;height:60px"/>
                            </template>
                        </el-table-column>
                        <!--                        <el-table-column prop="introduce" label="房屋概况" show-overflow-tooltip>-->
                        <!--                            <template slot-scope="scope">-->
                        <!--                                <span>{{removeHTMLTag(scope.row.introduce)}}</span>-->
                        <!--                            </template>-->
                        <!--                        </el-table-column>-->

                        <el-table-column label="操作" :resizable="false">
                            <template slot-scope="scope">
                                <el-button @click="onUpdate(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button @click="onDelete(scope.row.id)" type="text" size="small">删除</el-button>
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

            <el-dialog :title="title" :visible.sync="dialogVisible" top="3%" width="50%"
                       :close-on-click-modal="false" :close-on-press-escape="false" @close="dialogClose">
                <div style="width: 95%;" class="my-dialog">
                    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="120px">
                        <el-form-item label="房屋标题" prop="name">
                            <el-input v-model="form.name" placeholder="请输入房屋标题"></el-input>
                        </el-form-item>
                        <el-form-item label="所在社区" prop="community">
                            <el-select v-model="form.community" :disabled="disableSelect" style="width: 100%;"
                                       class="handle-input">
                                <el-option v-for="(item,index) in communitys" :label="item.dictValue"
                                           :key="item.dictKey"
                                           :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="户型" prop="specifications">
                            <el-input v-model="form.specifications" placeholder="请输入户型 如三室一厅一卫"></el-input>
                        </el-form-item>
                        <el-form-item label="面积" prop="floorSpace">
                            <el-input v-model="form.floorSpace" placeholder="请输入面积">
                                <template slot="append">平方米</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="租金">
                            <el-input type="number" :disabled="disabledText" v-model="form.price"
                                      placeholder="请输入租金或单价">
                                <el-radio-group slot="append" v-model="form.radio" @change="radioChange">
                                    <el-radio :label="0">输入租金(元/月)</el-radio>
                                    <el-radio :label="1">面议</el-radio>
                                </el-radio-group>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="详细地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
                        </el-form-item>

                        <el-form-item label="联系人" prop="contacts">
                            <el-input v-model="form.contacts" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="mobile">
                            <el-input v-model="form.mobile" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                        <el-form-item label="房屋介绍" prop="introduce">
                            <editor ref="editor" v-if="dialogVisible" v-bind:content="form.introduce"></editor>
                        </el-form-item>

                        <el-form-item label="房屋主图" prop="imgUrl">
                            <div style="display: flex;flex-direction: column">
                                <el-upload ref="upload" class="avatar-uploader" :action="uploadUrl"
                                           :show-file-list="false" :on-success="handleAvatarSuccess"
                                           accept=".jpg,.jpeg,.png,.PNG,.gif,.bmp,.JPG,.JPEG">
                                    <img v-if="form.image" :src="form.imgUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <div>图片大小不超过1M，支持jpg、bmp、png、jpeg格式 建议最小尺寸 :220*160px ，或同等比例图片</div>
                            </div>

                        </el-form-item>

                        <el-form-item label="详情图片">
                            <div style="display: flex;flex-direction: column">
                                <el-upload ref="upload1" class="avatar-uploader" :action="uploadUrl"
                                           :on-success="handleSuccess"
                                           list-type="picture-card"
                                           :on-remove="handleRemove"
                                           multiple
                                           :limit="5"
                                           :on-exceed="handleExceed"
                                           accept=".jpg,.jpeg,.png,.PNG,.gif,.bmp,.JPG,.JPEG"
                                           :file-list="fileList">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div>图片大小不超过1M，支持jpg、bmp、png、jpeg格式 建议最小尺寸 :750*360px ，或同等比例图片</div>
                            </div>

                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('ruleForm')">保存</el-button>
                            <el-button @click="cancleSubmit">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
            <el-dialog title="详情" :visible.sync="dialogVisibleDetail" @close="dialogCloseDetail" top="6%" width="55%"
                       :close-on-click-modal="false" :close-on-press-escape="false">
                <div style="width: 90%;" class="my-dialog">
                    <el-form label-width="120px">
                        <el-form-item label="房屋标题">
                            {{detail.name}}
                        </el-form-item>
                        <el-form-item label="所在社区">
                            {{detail.communityValue}}
                        </el-form-item>
                        <el-form-item label="户型">
                            {{detail.specifications}}
                        </el-form-item>
                        <el-form-item label="面积">
                            {{detail.floorSpace}}
                        </el-form-item>

                        <el-form-item label="租金">
                            <div>
                                <span v-if="detail.price===-101">面议</span>
                                <span v-else>{{detail.price}}</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            {{detail.address}}
                        </el-form-item>

                        <el-form-item label="联系人">
                            {{detail.contacts}}
                        </el-form-item>
                        <el-form-item label="联系电话">
                            {{detail.mobile}}
                        </el-form-item>
                        <el-form-item label="房屋介绍">
                            <div class="fullText" v-html="detail.introduce">
                            </div>
                        </el-form-item>

                        <el-form-item label="列表图片">
                            <el-image
                                style="width:70px;height:70px"
                                :src="detail.logo">
                            </el-image>
                        </el-form-item>
                        <el-form-item label="详情图片">
                            <div style="display: flex;flex-wrap:wrap;">
                                <div style="flex:0 0 33%" v-for="(item,index) in detail.imgArrays" :key="index">
                                    <el-image :src="item" v-if="item!=''"
                                              style="width:70px;height:70px"/>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="修改时间">
                            {{detail.updatedAt}}
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import vTitle from '../layout/title'
    import editor from '../common/wangEditorBase'

    import DataBaseFzzl from '../../api/FzzlData'
    import baseData from '../../assets/js/baseData'
    import BaseData from '../../api/baseData'

    export default {
        data() {
            // 自定义验证手机号
            var checkPhone = (rule, value, callback) => {
                console.log(typeof value, "\\\\/");
                const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
                if (!Number.isInteger(+value)) {
                    callback(new Error("请输入数字值"));
                } else {
                    if (phoneReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error("电话号码格式不正确"));
                    }
                }
            };
            return {
                dialogVisibleDetail: false,
                detail: {},
                disabledText: false,
                disableSelect: false,
                communitys: [],
                priceTypes:[],
                fileList: [],
                editor: null,
                uploadUrl: baseData.uploadUrl,
                dialogVisible: false,
                title: '',//dialog标题
                id: '',//某一条数据的id
                pageSize: 15, //默认每页10条
                pageTotal: 0,
                currentPage: 1, //当前页
                pageNum: 1, //要跳转到的页面
                searchForm: {
                    name: '',
                    community: sessionStorage.getItem("community"),
                    priceType:''
                },
                form: {
                    community: sessionStorage.getItem("community"),
                    name: '',
                    specifications: '',
                    address: '',
                    price: '',
                    floorSpace: '',
                    contacts: '',
                    mobile: '',
                    introduce: '',
                    logo: '',
                    image: '',
                    imgUrl: '',
                    file: [],
                    fileNames: [],
                    fileList: [],
                    radio: 0,
                },
                tableData: [],
                rules: {
                    name: [{required: true, message: '请输入房屋标题', trigger: 'blur'}],
                    community: [{required: true, message: '请选择所在社区', trigger: 'blur'}],
                    specifications: [{required: true, message: '请输入户型', trigger: 'blur'}],
                    address: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
                    // price: [{required: true, message: '请输入租金或单价', trigger: 'blur'}],
                    floorSpace: [{required: true, message: '请输入面积', trigger: 'blur'}],
                    contacts: [{required: true, message: '请输入联系人', trigger: 'blur'}],
                    mobile: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
                    introduce: [{required: true, message: '请输入房屋介绍', trigger: 'blur'}],
                    imgUrl: [{required: true, message: '请上传图片'}],
                },
            }
        },
        components: {
            vTitle, editor
        },
        mounted() {
            // this.getList();
            // this.getMsTypeList()
            // this.getPriceTypeList()
        },
        methods: {

            dialogCloseDetail() {
                this.dialogVisibleDetail = false
                this.detail={}
            },
            onDetail(obj) {
                this.dialogVisibleDetail = true
                DataBaseFzzl.getFzzlDetail(obj.id).then(res => {
                    if (res.code == 200) {
                        this.detail = res.data
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },

            radioChange() {
                if (this.form.radio === 0) {
                    this.form.price = ''
                    this.disabledText = false
                } else if (this.form.radio === 1) {
                    this.form.price = ''
                    this.disabledText = true
                }
            },

            handleExceed(files, fileList) {
                this.$message({
                    type: "warning",
                    message: '最多上传 5 张图片',
                    duration: 1500
                });
            },

            //移除HTML标签代码
            removeHTMLTag(str) {
                str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
                str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
                str = str.replace(/ /ig, '');//去掉
                str = str.replace(/&nbsp;/ig, '')
                return str;
            },

            //获取社区种类字典信息
            getMsTypeList() {
                let params = {
                    type: baseData.typeList[5],
                }
                BaseData.getTypeList(params).then(res => {
                    if (res.code == 200) {
                        this.communitys = res.data;
                        if (sessionStorage.getItem("community")) {
                            this.disableSelect = true
                            this.searchForm.community = sessionStorage.getItem("community")
                            this.form.community = sessionStorage.getItem("community")
                        } else {
                            this.disableSelect = false
                        }

                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },

            //获取价格种类字典信息
            getPriceTypeList() {
                let params = {
                    type: baseData.typeList[9],
                }
                BaseData.getTypeList(params).then(res => {
                    if (res.code == 200) {
                        this.priceTypes = res.data;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },

            handleSuccess(res, file) {
                this.form.file = [...this.form.file, res.data.fileUrl]
                this.form.fileNames = [...this.form.fileNames, res.data.fileName]
            },

            handleRemove(file, fileList) {
                if (fileList.length == 0) {
                    this.form.file.length = 0
                    this.form.fileNames.length = 0
                    this.form.fileList.length = 0
                } else {
                    var arr = []
                    var arr2 = []
                    if (this.id) {
                        for (let i of fileList) {
                            arr.push(i.url)
                            arr2.push(i.name)
                        }
                    } else {
                        for (let i of fileList) {
                            debugger
                            arr.push(i.response.data.fileUrl)
                            arr2.push(i.response.data.fileName)
                        }
                    }
                    this.form.file = arr
                    this.form.fileNames = arr2
                }
            },

            getDetail(id) {
                let vm = this
                DataBaseFzzl.getFzzlDetail(id).then(res => {
                    if (res.code == 200) {
                        vm.form = {
                            community: res.data.community,
                            specifications: res.data.specifications,
                            price: '',
                            floorSpace: res.data.floorSpace,
                            contacts: res.data.contacts,
                            mobile: res.data.mobile,
                            introduce: res.data.introduce,
                            name: res.data.name,
                            address: res.data.address,
                            logo: res.data.logo,
                            image: res.data.logo,
                            imgUrl: res.data.logo,
                            imgArrays: res.data.imgArrays,
                            file: [],
                            fileNames: [],
                            fileList: [],
                            radio: 0,

                        }

                        if (res.data.price == '-101') {
                            vm.form.radio = 1
                            vm.disabledText = true
                        } else {
                            vm.form.radio = 0
                            vm.form.price = res.data.price
                            vm.disabledText = false
                        }
                        this.dialogVisible = true;
                        if (res.data.imgArrays.length != 0) {
                            var arr = res.data.imgArrays
                            vm.form.fileList = arr
                            var arr2 = []
                            for (let i in arr) {
                                let obj = {
                                    name: '',
                                    url: arr[i]
                                }
                                arr2.push(obj)
                                vm.fileList.push(obj)
                            }
                            vm.form.file = arr
                        }
                    } else {
                        vm.$message({
                            type: "error",
                            message: res.message,
                            duration: 1500
                        });
                    }
                });
            },

            //获取表格数据
            getList() {
                let params = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    name: this.searchForm.name,
                    community: this.searchForm.community,
                    priceType:this.searchForm.priceType
                }

                DataBaseFzzl.getFzzlList(params).then(res => {
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
            //搜索
            onSearch() {
                this.pageNum = 1;
                this.getList();
            },
            //重置
            onReset() {
                this.pageNum = 1;
                this.searchForm = {
                    name: '',
                    community: sessionStorage.getItem("community"),
                    priceType:''
                }
                this.getList();
            },
            //点击新增按钮事件
            onAdd() {
                this.title = '新增';
                this.dialogVisible = true;
                this.id = '';
                this.form = {
                    community: sessionStorage.getItem("community"),
                    name: '',
                    specifications: '',
                    address: '',
                    price: '',
                    floorSpace: '',
                    contacts: '',
                    mobile: '',
                    introduce: '',
                    logo: '',
                    image: '',
                    imgUrl: '',
                    file: [],
                    fileNames: [],
                    fileList: [],
                    radio: 0,
                }
                this.disabledText = false
            },
            //点击编辑按钮事件
            onUpdate(row) {
                this.title = '编辑';
                this.id = row.id;
                this.form = {
                    community: sessionStorage.getItem("community"),
                    name: '',
                    specifications: '',
                    address: '',
                    price: '',
                    floorSpace: '',
                    contacts: '',
                    mobile: '',
                    introduce: '',
                    logo: '',
                    image: '',
                    imgUrl: '',
                    file: [],
                    fileNames: [],
                    fileList: [],
                    radio: 0,
                }
                this.fileList = []
                this.getDetail(this.id)
            },
            // 删除
            onDelete(row) {
                let vm = this
                this.$confirm('确定要删除这条数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DataBaseFzzl.deletFzzl(row).then(res => {
                        if (res.code == 200) {
                            vm.$message({
                                type: 'success',
                                message: '删除成功',
                                duration: 1000,
                                onClose: function () {
                                    vm.getList();
                                }
                            });
                        } else {
                            this.$message({
                                type: "error",
                                message: res.message,
                                duration: 1500
                            });
                        }
                    });
                });
            },

            //模态框dialog提交事件
            onSubmit(ruleForm) {
                let vm = this
                this.form.introduce = this.$refs.editor.getContent()
                if (vm.form.radio === 0) {
                    if (!vm.form.price) {
                        this.$message({
                            type: "error",
                            message: '请输入租金',
                            duration: 1500
                        });
                        return
                    }
                }
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        if (vm.id) {
                            vm.form.id = vm.id
                            let params = {
                                id: vm.form.id,
                                community: vm.form.community,
                                logo: vm.form.image,
                                name: vm.form.name,
                                specifications: vm.form.specifications,
                                address: vm.form.address,
                                imgArrays: vm.form.file,
                                price: vm.form.radio === 0 ? vm.form.price : '-101',
                                floorSpace: vm.form.floorSpace,
                                contacts: vm.form.contacts,
                                mobile: vm.form.mobile,
                                introduce: vm.form.introduce,
                            }

                            DataBaseFzzl.changeFzzl(params).then(res => {
                                if (res.code == 200) {
                                    vm.$message({
                                        type: 'success',
                                        message: '提交成功',
                                        duration: 1000,
                                        onClose: function () {
                                            vm.dialogVisible = false;
                                            vm.getList()

                                        }
                                    });
                                    vm.$refs.upload.clearFiles()
                                    vm.$refs.upload1.clearFiles()
                                    vm.$refs.editor.clearContent()
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: res.message,
                                        duration: 1500
                                    });
                                }
                            });
                        } else {
                            let params = {
                                community: vm.form.community,
                                logo: vm.form.image,
                                name: vm.form.name,
                                specifications: vm.form.specifications,
                                address: vm.form.address,
                                imgArrays: vm.form.file,
                                price: vm.form.radio === 0 ? vm.form.price : '-101',
                                floorSpace: vm.form.floorSpace,
                                contacts: vm.form.contacts,
                                mobile: vm.form.mobile,
                                introduce: vm.form.introduce,
                            }
                            DataBaseFzzl.addFzzl(params).then(res => {
                                if (res.code == 200) {
                                    vm.$message({
                                        type: 'success',
                                        message: '提交成功',
                                        duration: 1000,
                                        onClose: function () {
                                            vm.dialogVisible = false;
                                            vm.getList()
                                        }
                                    });
                                    vm.$refs.upload.clearFiles()
                                    vm.$refs.upload1.clearFiles()
                                    vm.$refs.editor.clearContent()
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: res.message,
                                        duration: 1500
                                    });
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },

            handleAvatarSuccess(res, file) {
                this.form.imgUrl = URL.createObjectURL(file.raw);
                this.form.image = res.data.fileUrl;
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                let flag = true;
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    flag = false;
                    this.$message.error('列表图片只能是 JPG 或 PNG 格式！');
                }
                if (!isLt2M) {
                    this.$message.error('列表图片大小不能超过 2MB！');
                }
                return flag && isLt2M;
            },

            dialogClose() {
                this.$refs['ruleForm'].resetFields();
                this.$refs.upload1.clearFiles()
                this.$refs.editor.clearContent()
            },
            //模态框dialog取消事件
            cancleSubmit() {
                this.$refs['ruleForm'].resetFields();
                this.dialogVisible = false;
                this.$refs.upload1.clearFiles()
                this.$refs.editor.clearContent()
            },
            //处理跳页
            handlePageNumChange(val) {
                this.pageNum = val;
                this.getList();
            },
            //处理每页多少条改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            }

        }
    }
</script>

<style scoped>

    .main-content {
        padding-bottom: 0.5rem;
    }

    .main-content /deep/ .el-tabs__nav-wrap::after {
        height: 1px;
    }

    .news-page {
        background-color: #fff;
        height: auto;
        min-height: 100%;
        margin: 0 10px;
        padding: 0 20px;
    }

    .footer {
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        padding-left: 30px;
        margin-top: -90px;
        height: 90px;
        clear: both;
    }

    .action-button {
        margin: 10px 0;
    }

    .search-container {
        font-size: 14px;
        padding: 15px 0;
    }

    .handle-input {
        width: 170px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 146px;
        height: 146px;
        line-height: 146px;
        text-align: center;
    }

    .avatar {
        width: 146px;
        height: 146px;
        display: block;
    }

    .avatar-uploader >>> .el-upload--text {
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        box-sizing: border-box;
        width: 146px;
        height: 146px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .quill-editor >>> .ql-container {
        height: 215px;
        min-height: unset;
    }


    .content-div {
        margin: 30px auto;
        width: 1280px;
        overflow: hidden;
    }

    .xq-title {
        font-size: 48px;
        color: #333333;
        line-height: 64px;
        margin-top: 30px;
        text-align: center;
    }

    .xq-time {
        margin-top: 8px;
        height: 32px;
        line-height: 32px;
    }

    .xq-time span {
        font-size: 16px;
        color: #666666;
    }


    .xq-content {
        font-family: SourceHanSansCN-Light;
        font-size: 18px;
        color: #333333;
        line-height: 36px;
    }

    .xq-content p {
        text-indent: 2em;
    }

    .my-dialog .ql-editor {
        padding: 0;
        position: relative;
        bottom: 15px;
    }

    .fullText >>> img {
        width: 100% !important;
    }

</style>
