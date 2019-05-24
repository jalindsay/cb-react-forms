import React, { Component } from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addItem } from '../../../actions/previewItemsActions';

// type, spec and collect are the paramters to the DragSource HOC
const type = props => {
  return 'items'
}

const spec = {
  beginDrag(props) {
    console.log('Dragging: ' + props.data.key)
    return {
      item: props.data.key
    };
  },
  endDrag(props, monitor, component) {
    if(!monitor.didDrop()) return; // return if not dropped in the Preview component
    props.addItem(props.data.key);
    console.log('Dropping: ' + props.data.key);
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class ToolbarItem extends Component {
  render() {
    const { isDragging, connectDragSource, data, addItem } = this.props;

    const opacity = isDragging ? 0.5 : 1;
    const backgroundColor = isDragging ? 'lightgray' : 'white';
    
    return connectDragSource(
      <li style={{cursor: 'pointer', opacity, backgroundColor }} className="list-group-item mb-1">
        <i className={classNames(data.icon, 'mr-3')}/>
        {data.name}
      </li>
    )
  }
}

export default compose(
  connect(state => ({ previewItems: state.previewItems }), { addItem }),
  DragSource(type, spec, collect)
)(ToolbarItem);