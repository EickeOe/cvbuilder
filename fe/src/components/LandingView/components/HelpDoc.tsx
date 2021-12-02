
import { Row, Col, Tabs, List, Empty } from 'antd';

const { TabPane } = Tabs;

import className from '../index.module.less'

import { Link } from 'react-router-dom'

interface props {
    docList: Array<any>,
}

export default function LandingHelpDoc({ docList }: props) {
    return (
        <div className={`${className['all-product']} shadow`}>
            <div className="text-lg mb-4 extrabold">
                帮助文档
            </div>
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="新手帮助文档" key="1">
                        <Row>
                            <Col span={12}>
                                {
                                    docList && docList.length ? docList.map((item, index) => {
                                        return (
                                            index % 2 === 0 ?
                                                <a key={item.id} target="_blank" href={item.url}>
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            title={item.name}
                                                            description={'创建人：' + item.createBy}
                                                        />
                                                    </List.Item>
                                                </a> : ''
                                        )
                                    }) : (
                                        <Empty description={'暂无产品和服务'} />
                                    )
                                }
                            </Col>
                            <Col span={12}>
                                {
                                    docList && docList.length ? docList.map((item, index) => {
                                        return (
                                            index % 2 !== 0 ?
                                                <a key={item.id} target="_blank" href={item.url}>
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            title={item.name}
                                                            description={'创建人：' + item.createBy}
                                                        />
                                                    </List.Item>
                                                </a> : ''
                                        )
                                    }) : (
                                        <Empty description={'暂无产品和服务'} />
                                    )
                                }
                            </Col>
                        </Row>

                    </TabPane>
                    {/* <TabPane tab="最佳实践" key="2">
                        <Row>
                            <Col span={12}>
                                {
                                    Form.helpLists.map((item, index) => {
                                        return (
                                            index % 2 !== 0 ?
                                                <List.Item key={index}>
                                                    <List.Item.Meta
                                                        title={<a target="_blank" href={item.url}>{item.title}</a>}
                                                        description={'欢迎使用' + item.title + '，如有疑问请及时联系管理员'}
                                                    />
                                                </List.Item> : ''
                                        )
                                    })
                                }
                            </Col>
                            <Col span={12}>
                                {
                                    Form.helpLists.map((item, index) => {
                                        return (
                                            index % 2 === 0 ?
                                                <List.Item key={index}>
                                                    <List.Item.Meta
                                                        title={<a target="_blank" href={item.url}>{item.title}</a>}
                                                        description={'欢迎使用' + item.title + '，如有疑问请及时联系管理员'}
                                                    />
                                                </List.Item> : ''
                                        )
                                    })
                                }
                            </Col>
                        </Row>
                    </TabPane> */}
                </Tabs>
            </div>
        </div>
    )
}