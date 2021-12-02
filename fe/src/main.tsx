import ReactDOM from 'react-dom'
import App from './App'
import zhCN from 'antd/lib/locale/zh_CN'
import AppRoute from './router'
import { RecoilRoot } from 'recoil'
import { ConfigProvider } from 'antd'
import './utils/patchHistoryMethod'

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </ConfigProvider>,
  document.getElementById('cloudRoot')
)
