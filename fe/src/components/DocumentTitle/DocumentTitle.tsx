import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

interface Props {
  metaMap: { [key: string]: any };
}

export default function DocumentTitle({ metaMap }: Props) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname) {
      const [, meta] = Object.entries(metaMap).find(([path]) => {
        return matchPath(pathname, {
          path,
          exact: true,
        });
      }) ?? [, {}];

      document.title = meta.title ?? "CV Builder";
    }
  }, [pathname]);
  return <></>;
}
