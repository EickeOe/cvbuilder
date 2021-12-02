import XDrawer from "@/components/XDrawer/Drawer";
import { createFuncModal } from "@gcer/react-air";

interface Props {
  data?: {
    product?: any;
  };
  visible: boolean;
  onOk?(): void;
  close(): void;
}
export default function AuthModal({ visible, close }: Props) {
  return (
    <XDrawer
      width={800}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        ></div>
      }
      title="权限管理"
      placement="right"
      onClose={close}
      visible={visible}
    >
      {/* <div className={styles.formWrap}>
    <XFormRender ref={formRef} options={formJson as any} />
  </div> */}
    </XDrawer>
  );
}
export const authModal = createFuncModal(AuthModal);
