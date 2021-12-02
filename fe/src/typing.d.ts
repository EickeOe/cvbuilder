declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.ico";
declare module "*.svg";
declare module "*.png";
interface ImportMetaEnv {
  VITE_APP_SSO_URL: string;
  VITE_APP_ENV: "local" | "dev" | "test" | "pre" | "prod";
  VITE_APP_BASE_URL: string;
  VITE_DOMAIN_URL: string;
  VITE_APP_DOMAIN_PREFIX: string;
  // 更多环境变量...
}

interface Window {
  DuMonitor: any;
}

type MicroApp = {
  index: number;
  icon: string;
  disabled: boolean;
  main: {
    [key: string]: string;
  };
  path: string;
  label: string;
  key: string;
  starred: boolean;
  classification: string;
  isBaseSubProduct?: boolean;
  devOptions: {
    main: string;
    port: string;
    buildMode: "cjs" | "esm";
    key: string;
    microAppOptions?: {
      shadowDOM: false;
      inline: false;
      disableSandbox: false;
    };
  };
  menus: {
    children: {
      name: string;
      path: string;
    }[];
    sub: {
      name: string;
      slotPath: string;
      path: string;
      redirect: string;
      icon: string;
      children: [];
    }[];
  };
};
declare module "@micro-zoe/micro-app/polyfill/jsx-custom-event";
declare module "monaco-editor/esm/vs/language/json/json.worker?worker";
declare module "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
declare module "monaco-editor/esm/vs/editor/editor.worker?worker";
declare module "monaco-editor/esm/vs/language/css/css.worker?worker";
declare module "monaco-editor/esm/vs/language/html/html.worker?worker";
