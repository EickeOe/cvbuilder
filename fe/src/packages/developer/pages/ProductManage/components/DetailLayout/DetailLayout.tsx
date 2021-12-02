import { currentManageProductState } from "@/packages/developer/recoil";
import { useSearchParamsValue } from "@gcer/react-air";
import { FC, useEffect } from "react";
import { fetchProductListApi } from "@/packages/developer/apis";
import { useRecoilState } from "recoil";

const DetailLayout: FC<any> = ({ children }) => {
  const { key } = useSearchParamsValue();
  const [currentManageProduct, setCurrentManageProductState] = useRecoilState(
    currentManageProductState
  );
  useEffect(() => {
    if (!currentManageProduct || currentManageProduct.key !== key) {
      setCurrentManageProductState;

      fetchProductListApi({
        pageNum: 1,
        pageSize: 1,
        appCode: key,
      })
        .then((res: any) => {
          return res.data[0];
        })
        .then(setCurrentManageProductState);
    }
  }, [key]);
  return <>{children}</>;
};
export default DetailLayout;
