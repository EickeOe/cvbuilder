import { Menu } from "antd";
import { useMemo, useRef } from "react";
import { matchPath, useHistory } from "react-router-dom";
import * as Icons from "@ant-design/icons";
import className from "./index.module.less";
import { formatURLSearchParams, getSearchParams } from "@gcer/react-air";

const search = (root: any, pathname: string) => {
  const fn = (node: any, result: any[] = []) => {
    result.push(node);
    if (matchPath(pathname, { path: node.path, exact: true })) {
      return result;
    } else if (node.children?.length > 0) {
      for (let subNode of node.children) {
        const arr: any = fn(subNode, result.slice());
        if (
          matchPath(pathname, { path: arr[arr.length - 1].path, exact: true })
        ) {
          return arr;
        }
      }
    }
    return result;
  };
  return fn(root);
};
interface Props {
  menus: any[];
  defaultOpen?: boolean;
  titleClickDisabled?: boolean;
  menuProps: any;
  onSelectedKeysChange?: any;
  selectedKeys?: string[];
}
export default function NavMenu({
  menus,
  defaultOpen,
  titleClickDisabled,
  menuProps,
  selectedKeys,
}: Props) {
  const {
    push,
    location: { pathname },
  } = useHistory();

  const defaultOpenKeys = useMemo(() => {
    if (defaultOpen) {
      return menus.map((menu) => menu.path);
    }
    return [];
  }, []);

  const menuRenderRef = useRef((menus: any[], deep: number[] = []) => {
    return menus.map((menu, index) => {
      const Icon = (Icons as any)[menu.icon ?? "BuildOutlined"];
      if (menu.children?.length) {
        if (deep.length > 0) {
          if (menu.children.length <= 3) {
            return (
              <Menu.ItemGroup
                key={menu.path ?? `ItemGroup-${index}`}
                title={menu.name}
              >
                {menuRenderRef.current(menu.children, [...deep, index])}
              </Menu.ItemGroup>
            );
          }
        }

        return (
          <Menu.SubMenu
            onTitleClick={
              titleClickDisabled
                ? undefined
                : () => {
                    const path = menu.redirect;

                    const query = getSearchParams(location.search);
                    const node = search(
                      menus.find((menu: any) =>
                        new RegExp(`^${menu.path}`).test(path)
                      ) ?? {},
                      path
                    ).find((node: any) => node.path === path);
                    let params = {};
                    if (
                      node.searchParams &&
                      node.searchParams instanceof Array
                    ) {
                      params = node.searchParams.reduce(
                        (pre: any, cur: any) => {
                          pre[cur] = query[cur];
                          return pre;
                        },
                        {}
                      );
                    }

                    const url = `${path}${
                      Object.keys(params).length > 0
                        ? "?" + formatURLSearchParams(params).toString()
                        : ""
                    }`;
                    history.pushState({}, "", url);

                    // 主动触发一次popstate事件
                    window.dispatchEvent(
                      new PopStateEvent("popstate", { state: null })
                    );
                  }
            }
            icon={<Icon />}
            key={menu.path ?? `SubMenu-${index}`}
            title={menu.name}
          >
            {menuRenderRef.current(menu.children, [...deep, index])}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={menu.path ?? `Item-${index}`}
            icon={<Icon />}
            title={menu.name}
          >
            {menu.name}
          </Menu.Item>
        );
      }
    });
  });

  const Menus = useMemo(() => {
    return menuRenderRef.current(menus);
  }, [menus]);

  const sSelectedKeys: string[] = useMemo(() => {
    if (selectedKeys) {
      return selectedKeys;
    }

    return search(
      menus.find((menu: any) => new RegExp(`^${menu.path}`).test(pathname)) ??
        {},
      pathname
    ).map((node: any) => node.path);
  }, [menus, pathname, selectedKeys]);

  return (
    <Menu
      selectedKeys={sSelectedKeys}
      mode="horizontal"
      defaultOpenKeys={defaultOpenKeys}
      {...menuProps}
      className={className.navMenu}
      onClick={({ key: path }: any) => {
        const query = getSearchParams(location.search);
        const node = search(
          menus.find((menu: any) => new RegExp(`^${menu.path}`).test(path)) ??
            {},
          path
        ).find((node: any) => node.path === path);
        let params = {};
        if (node.searchParams && node.searchParams instanceof Array) {
          params = node.searchParams.reduce((pre: any, cur: any) => {
            pre[cur] = query[cur];
            return pre;
          }, {});
        }

        const url = `${path}${
          Object.keys(params).length > 0
            ? "?" + formatURLSearchParams(params).toString()
            : ""
        }`;
        history.pushState({}, "", url);
      }}
    >
      {Menus}
    </Menu>
  );
}
