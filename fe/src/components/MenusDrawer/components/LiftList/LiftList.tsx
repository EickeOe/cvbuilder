import { updateRecent } from '@/apis/landing'
import Icon from '@/components/Icon/Icon'
import { CloseOutlined, DragOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import className from './index.module.less'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface Props {
  close(e: any): void
  onUnStarred(..._: any): void
  starredProductList: MicroApp[]
  onChangeStarredProductList(list: MicroApp[]): void
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export default function LeftList({ close, onUnStarred, starredProductList, onChangeStarredProductList }: Props) {
  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination) {
          return
        }
        const items = reorder(starredProductList, result.source.index, result.destination.index)
        onChangeStarredProductList(items.map((item, index) => ({ ...item, index })))
      }}
    >
      <div className={`${className.left}`}>
        <Droppable droppableId="droppable">
          {(provided, dropSnapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {starredProductList.map((item, index) => (
                <Draggable key={item.key} draggableId={item.key} index={index}>
                  {(provided, snapshot) => (
                    <Link
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      to={item.path}
                      onClick={(e) => {
                        updateRecent({ recentView: item.key })
                        close(e)
                      }}
                      className={`${className.item} ${
                        snapshot.isDragging ? className.dragging : dropSnapshot.isDraggingOver ? className.noDrag : ''
                      }`}
                      style={provided.draggableProps.style}
                    >
                      <div className="flex items-center gap-4 leading-none flex-1" style={{ height: '100%' }}>
                        <Icon type={item.icon ?? 'AppstoreOutlined'} />
                        <span className={className.label}>{item.label}</span>
                      </div>
                      <div className={`${className.action} flex items-center gap-1 leading-none`}>
                        <CloseOutlined alt="取消收藏" onClick={onUnStarred.bind(null, item)} />
                        <DragOutlined alt="拖拽调整顺序" {...provided.dragHandleProps} />
                      </div>
                    </Link>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}
