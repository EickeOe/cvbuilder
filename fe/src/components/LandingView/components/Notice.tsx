import { Row, Col, Tabs, List, Button, Empty } from 'antd';

const { TabPane } = Tabs;

import className from '../index.module.less'
interface props {
    bulletinList: Array<any>,
}

export default function LandingNotic({ bulletinList }: props) {
    const marginNull = {
        marginTop: 0 + 'px'
    }
    return (
        <div className={`${className['all-product']}  shadow`} style={marginNull}>
            <div className="text-lg mb-4 extrabold">
                公告
            </div>
            <Row>
                {
                    bulletinList && bulletinList.length ? bulletinList.map((item,index) => {
                        return (
                            <Col key={item.id} span={24}>
                                <a target="_blank" href="" className={className['landing-notice']}>
                                    {item.name}
                                </a>
                            </Col>
                        )
                    }) : <Empty description={'暂无公告'} />
                }

            </Row>
        </div>
    )
}