/**
 * 开发自定义接口地址
 */
export default {
    /**
     * 本地开发环境配置
     */
    developmentEnv: {
        name: 'lawyer pc',
        host: 'http://lawyer.fy13322.local/api/lawyer',
        mobileHost:'http://192.168.10.217:1080'
    },

    /**
     * 服务器开发环境配置
     */
    previewEnv: {
        name: 'lawyer pc',
        host: 'http://10.41.3.38:8090/',
        mobileHost:''
    },

    /**
     * 测试服务器开发环境配置
     */
    fytestEnv: {
        name: 'lawyer pc',
        host: 'http://192.168.10.217:7081/',
        mobileHost:''
    },

    /**
     * 生产环境配置
     */
    productionEnv: {
        name: 'lawyer pc',
        host: 'http://lawyer.fy13322.com/',
        mobileHost:''
    },
 }