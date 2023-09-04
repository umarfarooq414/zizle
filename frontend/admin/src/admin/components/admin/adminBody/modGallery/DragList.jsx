import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { faTrash } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { deleteCategories, sortCategories } from '../../../../../store/slices/userAuth/actions';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 8 * 1.5,
  borderRadius: `5px`,
  margin: `0 0 8px 0`,
  background: isDragging ? '#9ae3f5' : 'white',
  color: isDragging ? 'white' : 'black',

  ...draggableStyle,
});

export const DragList = ({ categories, getCategories }) => {
  const [dragItems, setItems] = useState([]);
  const dispatch = useDispatch();

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    dispatch(
      sortCategories({
        currentPosition: dragItems[result.source.index].position,
        targetPosition: dragItems[result.destination.index].position,
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          getCategories();
        }
      });
    const items = reorder(dragItems, result.source.index, result.destination.index);
    setItems(items);
  };

  useEffect(() => {
    setItems(
      categories.map((category) => {
        return { id: 'item-' + category.id, content: category.name, position: category.position };
      }),
    );
  }, [categories]);

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategories(id.split('-')[1]))
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          getCategories();
        }
      });
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {dragItems?.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    {item.content}
                    <span style={{ float: 'right' }} onClick={() => handleDeleteCategory(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
