import {myConsole} from "@/mixins/myConsole";

interface EnvironmentInterface {
    readonly VUE_APP_BADHAN_API_BASE_URL: string,
    readonly VUE_APP_FRONTEND_BASE: string,
    readonly NODE_ENV: string,
    readonly VUE_APP_DATAINPUT_URL: string,
    readonly VUE_APP_ADMIN_CONSOLE_URL: string,
    readonly VUE_APP_ENVIRONMENT: string,
}

export const environmentObject: EnvironmentInterface = {
    VUE_APP_BADHAN_API_BASE_URL: process.env.VUE_APP_BADHAN_API_BASE_URL,
    VUE_APP_FRONTEND_BASE: process.env.VUE_APP_FRONTEND_BASE,
    NODE_ENV: process.env.NODE_ENV,
    VUE_APP_DATAINPUT_URL: process.env.VUE_APP_DATAINPUT_URL,
    VUE_APP_ADMIN_CONSOLE_URL: process.env.VUE_APP_ADMIN_CONSOLE_URL,
    VUE_APP_ENVIRONMENT: process.env.VUE_APP_ENVIRONMENT,
}

Object.entries(environmentObject).forEach(([key, value]:[string,string], _index:number):void => {
    if (value === undefined) {
        myConsole.log(key, 'is not defined in config. App will not behave correctly')
    }
});

interface EnvironmentServiceInterface {
    isEnvironmentProduction: () => boolean
    isEnvironmentDevelopment: () => boolean
    isEnvironmentTesting: () => boolean
    getEnvironmentName: () => string
    getAPIBaseURL: () => string
    getFrontendBaseURL: () => string
    getDataInputAPIBaseURL: () => string
    getAdminFrontendBaseURL: () => string
}
export const environmentService: EnvironmentServiceInterface = {
    isEnvironmentProduction: ():boolean => {
        return environmentObject.VUE_APP_ENVIRONMENT === 'production'
    },
    isEnvironmentDevelopment: (): boolean => {
        return environmentObject.VUE_APP_ENVIRONMENT === 'development'
    },
    isEnvironmentTesting: (): boolean => {
        return environmentObject.VUE_APP_ENVIRONMENT === 'testing'
    },
    getEnvironmentName: (): string => {
        return environmentObject.VUE_APP_ENVIRONMENT
    },
    getAPIBaseURL: (): string => {
        return environmentObject.VUE_APP_BADHAN_API_BASE_URL
    },
    getDataInputAPIBaseURL: (): string => {
        return environmentObject.VUE_APP_DATAINPUT_URL
    },
    getFrontendBaseURL: (): string => {
        return environmentObject.VUE_APP_FRONTEND_BASE
    },
    getAdminFrontendBaseURL: (): string => {
        return environmentObject.VUE_APP_ADMIN_CONSOLE_URL
    }
}
