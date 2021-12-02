import { createFromIconfontCN } from '@ant-design/icons'
import * as AIcon from '@ant-design/icons'

const CIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2181098_6ex0b0z63h8.js'
})

function Icon({ type = '', ...props }: { type?: string }) {
  if (type) {
    if (/^icon-/.test(type)) {
      return <CIcon type={type} {...props} />
    } else if ((AIcon as any)[type]) {
      const AC = (AIcon as any)[type]
      return <AC {...props} />
    }
  }
  return <></>
}

export default Icon
