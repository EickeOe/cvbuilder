import { useBoolean } from "@/hooks/useBoolean";
import { CloseOutlined } from "@ant-design/icons";
import { createFuncModal } from "@gcer/react-air";
import { useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import HelpDocs from "../HelpDocs/HelpDocs";
import styles from "./index.module.less";

interface Props {
  visible: boolean;
  close: (e: any) => void;
}

export default function HelpDocsModal({ visible, close }: Props) {
  return (
    <div
      className={styles.HelpDocsModalWrap}
      style={{
        visibility: visible ? "visible" : "hidden",
        zIndex: visible ? 99999 : 0,
      }}
    >
      <Draggable
        defaultPosition={{ x: window.innerWidth - 500, y: 100 }}
        handle={`.${styles.title}`}
      >
        <div
          className={styles.HelpDocsModal}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className={styles.header}>
            <div className={styles.title}>帮助文档</div>
            <div className={styles.close} onClick={close}>
              <CloseOutlined />
            </div>
          </div>
          <div style={{ overflow: "auto" }}>{visible && <HelpDocs />}</div>
        </div>
      </Draggable>
    </div>
  );
}

export const helpDocsModal = createFuncModal(HelpDocsModal);
