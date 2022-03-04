const allMenuData = [
    {
        meta: {
            icon: "font_family icon-zufang",
            title: "通用表单"
        },
        index: "fzzlgl",
        path: "/fzzlgl",
        children: []
    },
    {
        meta: {
            icon: "font_family icon-xtsz",
            title: "系统设置"
        },
        index: "4",
        path: "",
        children: [{
            index: "account",
            path: "/account",
            meta: {
                icon: "font_family icon-zhgl",
                title: "账号管理"
            }
        },
            {
                index: "role",
                path: "/role",
                meta: {
                    icon: "font_family icon-jsgl",
                    title: "角色管理"
                }
            }
        ]
    },
];

const allPermsData = {
    one: ["fzzlgl"],
    two: ["account", "role"],
}

const uploadUrl = '/fdURL/community/upload/'   //上传图片

const editorUploadUrl = '/fdURL/community/upload/editor/'   //富文本上传图片

const imageUrl ='/fdURL/community/'

export default {allMenuData, allPermsData,uploadUrl,imageUrl,editorUploadUrl}
