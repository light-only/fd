<template>
    <div id="wangeditor">
        <div ref="editorElem"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import baseData from '../../assets/js/baseData'

    import E from "wangeditor"
    export default {
        data() {
            return {
                editorContent: this.content,
                editor:null
            }
        },
        props:{
            content:{
                type:String,
                required:false
            }
        },
        components: {

        },
        mounted() {
            // this.editorContent =this.content
            this.editor = new E(this.$refs.editorElem)
            this.editor.config.showLinkImg = false;
            this.editor.config.uploadImgShowBase64 = false;
            this.editor.config.showFullScreen = false;
            this.editor.config.uploadImgServer = baseData.editorUploadUrl
            this.editor.config.uploadFileName = 'file' // formdata中的name属性
            this.editor.config.onchange = (html) => {
                this.editorContent = html
            };

            this.editor.config.uploadImgMaxLength = 1// 一次最多上传 5 个图片

            this.editor.config.menus = [
                'head',
                'bold',
                'fontSize',
                'fontName',
                'italic',
                'underline',
                'strikeThrough',
                'indent',
                'lineHeight',
                'foreColor',
                'backColor',
                'link',
                'list',
                'justify',
                'quote',
                // 'emoticon',
                'image',
                'video',
                'table',
                'code',
                'splitLine',
                'undo',
                'redo',
            ]

            this.editor.config.uploadImgHooks = {
                // 上传图片之前
                // before: function(xhr) {
                //     console.log(xhr)
                //
                //     // 可阻止图片上传
                //     return {
                //         prevent: true,
                //         msg: '需要提示给用户的错误信息'
                //     }
                // },
                // 图片上传并返回了结果，图片插入已成功
                success: function(xhr) {
                    console.log('success', xhr)
                },
                // 图片上传并返回了结果，但图片插入时出错了
                fail: function(xhr, editor, resData) {
                    console.log('fail', resData)
                },
                // 上传图片出错，一般为 http 请求的错误
                error: function(xhr, editor, resData) {
                    console.log('error', xhr, resData)
                },
                // 上传图片超时
                timeout: function(xhr) {
                    console.log('timeout')
                },
                // 图片上传并返回了结果，想要自己把图片插入到编辑器中
                // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                customInsert: function(insertImgFn, result) {
                    // result 即服务端返回的接口
                    console.log('customInsert', result)

                    // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                    insertImgFn(result.data[0])
                }
            }

            // this.editor.config.linkCheck = function(text, link) {
            //     if (link != "") {
            //         var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            //         if (!reg.test(link)) {
            //             return '请输入正确的网址(例如 http://baidu.com)'
            //         }else{
            //             return true
            //         }
            //     }
            // }
            this.editor.create()
            this.editor.txt.html(this.content);
        },
        methods: {
            getContent: function () {
                return  this.editorContent;
            },

            clearContent: function(){
                this.editor.txt.html('');
            }

        }
    }
</script>

<style scoped>


</style>
