import React, { useCallback, useEffect, useRef, useState } from 'react'
import { isEmpty } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as ContainerBoostrap, Row, Col, Form, Button } from 'react-bootstrap'


import '../BoardContent/BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { initialData } from 'actions/initializeData'
import { applyDrag } from 'utilities/drapDrop'


function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState([false])
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const newColumnInputRef = useRef(null)
  const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      boardFromDB.columns.sort(function (a, b) {
        return boardFromDB.columnOrder.indexOf(a.id) - boardFromDB.columnOrder.indexOf(b.id)
      })

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }

  }, [])
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()

    }
  }, [openNewColumnForm])

  if (isEmpty(board)) {
    return <div className='not-found' style={{ 'padding': '10px', 'color': 'white' }}>Board not found</div>
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult)
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board}
    newBoard.columnOrder = newColumns.map( c => c.id)
    newBoard.columns = newColumns
    setColumns(newColumns)

  }
  const onCardDrop = ( columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]

      let currentColumn = newColumns.find( c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)
      setColumns(newColumns)

      console.log(dropResult)
    }
  }
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }
    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map( c => c.id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  return (
    <div className='board-content'>
      <Container
        orientation='horizontal'
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector='.column-drag-handle'
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}

      </Container>
      <ContainerBoostrap className='trello-container'>
        {openNewColumnForm && 
        <Row>
          <Col className='add-new-column' onClick={toggleOpenNewColumnForm}>
            <i className='fa fa-plus icon'> Add another column</i>
          </Col>
        </Row>
        } 
        {!openNewColumnForm && 
        <Row>
          <Col className='enter-new-column'>
            <Form.Control 
              size='sm'
              type='text'
              placeholder='Enter column title'
              className='input-enter-new-column'
              ref={newColumnInputRef}
              value={newColumnTitle}
              onChange={onNewColumnTitleChange}
              onKeyDown={ e => (e.key === 'Enter') && addNewColumn()}
            >
            </Form.Control>
            <Button variant='success' size='sm' onClick={addNewColumn}> Add column</Button>
            <span className='cancel-new-column'>
              <i className='fa fa-trash icon' onClick={toggleOpenNewColumnForm}> </i>
            </span>
          </Col>
        </Row>
        }
      </ContainerBoostrap>
    </div>

  )
}

export default BoardContent
