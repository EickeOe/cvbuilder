import { Layout } from "antd";
import { ReactNode, useMemo } from "react";
import className from "./index.module.less";
import BasicSider from "@/components/BasicSider/BasicSider";
import BasicHeader from "@/components/BasicHeader/BasicHeader";
import { matchPath, useHistory, useRouteMatch } from "react-router-dom";
const { Content, Footer } = Layout;

import { useRecoilValue } from "recoil";
import { microAppListState } from "@/recoil";
import useCurrentProduct from "@/hooks/useCurrentProduct";
interface MenuInte {
  id: number;
  backstageId: number;
  menuCode: string;
  menuName: string;
  parentMenuId: number;
  path: string;
  menuSort: number;
  menuLogo: string;
  menuMemo: string;
  enable: true;
  del: false;
  children: MenuInte[];
  checked: boolean;
  [key: string]: any;
}

interface Props {
  children?: ReactNode;
}

const search = (root: any, path: string) => {
  const fn = (node: any, result: any[] = []) => {
    result.push(node.path);
    if (matchPath(path, { path: node.path, exact: true })) {
      return result;
    } else if (node.children?.length > 0) {
      for (let subNode of node.children) {
        const arr: any = fn(subNode, result.slice());
        if (matchPath(path, { path: arr[arr.length - 1], exact: true })) {
          return arr;
        }
      }
    }
    return result;
  };
  return fn(root);
};
interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, "children">[];
}
export default function BasicLayout(props: Props) {
  const { children } = props;

  const {
    location: { pathname },
  } = useHistory();

  const currentProductInfo = useCurrentProduct();

  // const currentProductInfo = useMemo(() => {
  //   return microAppList.find((product) => product.key === currentProductKey) || ({} as any)
  // }, [microAppList, currentProductKey])

  const hasMenus = useMemo(() => {
    if (
      currentProductInfo.menuConfig &&
      currentProductInfo.menuConfig.enabled
    ) {
      return true;
    }
    return false;
  }, [currentProductInfo]);

  // console.log(currentProductInfo, hasMenus)

  const [siderMenus, back, breadcrumbRoutes, selectedKeys] = useMemo(() => {
    const menuInfo: any = currentProductInfo?.menuConfig?.menus;
    const subMenu = menuInfo?.sub?.find?.(
      (sys: any) => !!matchPath(pathname, { exact: false, path: sys.path })
    );
    const menus = subMenu?.children ?? menuInfo?.children ?? [];

    if (subMenu) {
      menus.map((me: any) =>
        me.children?.map((sMe: any) => {
          if (sMe.path === subMenu.slotPath) {
            sMe.children = [...subMenu.children];
          }
        })
      );
    }

    const selectKeys = search(
      menus.find((menu: any) => new RegExp(`^${menu.path}`).test(pathname)) ??
        {},
      pathname
    );
    const breadcrumbRoutes = menus
      .flatMap((me: any) => [me, ...(me.children ?? [])])
      .flatMap((me: any) => [me, ...(me.children ?? [])])
      .flatMap((me: any) => [me, ...(me.children ?? [])])
      .reduce((prev: any[], current: any) => {
        if (!prev.find((p) => p.path === current.path)) {
          prev.push(current);
        }
        return prev;
      }, [])
      .filter((me: any) => {
        return !!selectKeys.find((key: string) => key === me?.path);
      })
      .map((me: any) => ({
        path: me.path,
        breadcrumbName: me.name,
        redirect: me.redirect,
      }));
    return [
      menus,
      {
        show: !!subMenu?.children,
        path: currentProductInfo.path,
      },
      breadcrumbRoutes,
      selectKeys,
    ];
  }, [currentProductInfo, pathname]);

  return (
    <div className={className.basicLayout}>
      <Layout>
        <BasicHeader />
        <Layout>
          {hasMenus && (
            <BasicSider
              product={currentProductInfo}
              back={back}
              siderMenus={siderMenus}
            />
          )}
          <Content>{children}</Content>
        </Layout>
        <Footer style={{ textAlign: "center" }}>Made with ❤ by Ger</Footer>
      </Layout>
    </div>
  );
}
