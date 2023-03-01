import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import AddToDo from "./Components/AddToDo";
import { useRef } from "react";

const Wrapper = styled.div`
	display: flex;
	width: 100vw;
	margin: 0 auto;
	justify-content: center;
	align-items: center;
	height: 60vh;
`;

const Boards = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	gap: 20px;
`;

const Add = styled(FontAwesomeIcon)`
	padding: 20px;
	color: grey;
	background-color: #fafafa;
	border-radius: 100%;
	cursor: pointer;
`;

const Trash = styled(FontAwesomeIcon)`
	padding: 25px;
	font-size: 25px;
	width: 300px;
	color: grey;
	background-color: #fafafa;
	border-radius: 10px;
	display: flex;
	justify-content: center;
	position: fixed;
`;

const InputBar = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: 40px;
`;

const Title = styled.h1`
	text-align: center;
	font-size: 40px;
	margin-top: 40px;
	font-weight: 400;
`;

const Modal = styled.div`
	width: 300px;
	height: 120px;
	padding: 30px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const CategoryNameInput = styled.input`
	border-bottom: 1px 1px solid;
	border-top: none;
	border-left: none;
	border-right: none;
	outline: none;
`;

const TrashArea = styled.div`
	background-color: "#dfe6e9";
	flex-grow: 1;
	padding: 20px;
`;

const TrashDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: relative;
`;

const ConfirmBtn = styled.button`
	background-color: transparent;
	outline: none;
	border: none;
	margin-left: 15px;
	&:hover {
		color: #aaaaaa;
	}
`;

function App() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	const AddCategotyDialog = useRef<HTMLDialogElement>(null);
	const CategoryName = useRef<HTMLInputElement>(null);
	const onDragEnd = (info: DropResult) => {
		const { destination, source } = info;
		if (!destination) return;
		if (destination?.droppableId === "trash") {
			// delete to do
			setToDos((allBoards) => {
				const boardCopy = [...allBoards[source.droppableId]];
				boardCopy.splice(source.index, 1);
				return {
					...allBoards,
					[source.droppableId]: boardCopy,
				};
			});
		}
		if (destination?.droppableId === source.droppableId) {
			// same board movement.
			setToDos((allBoards) => {
				const boardCopy = [...allBoards[source.droppableId]];
				const taskObj = boardCopy[source.index];
				boardCopy.splice(source.index, 1);
				boardCopy.splice(destination?.index, 0, taskObj);
				return {
					...allBoards,
					[source.droppableId]: boardCopy,
				};
			});
		}
		if (destination.droppableId !== source.droppableId) {
			// cross board movement
			setToDos((allBoards) => {
				const sourceBoard = [...allBoards[source.droppableId]];
				const taskObj = sourceBoard[source.index];
				const destinationBoard = [...allBoards[destination.droppableId]];
				sourceBoard.splice(source.index, 1);
				destinationBoard.splice(destination?.index, 0, taskObj);
				return {
					...allBoards,
					[source.droppableId]: sourceBoard,
					[destination.droppableId]: destinationBoard,
				};
			});
		}
	};
	const onClickAddCategoryBtn = () => {
		AddCategotyDialog.current?.showModal();
	};

	const onSubmit = () => {
		if (CategoryName.current?.value) {
			setToDos((allBoards) => {
				return {
					...allBoards,
					[CategoryName.current!.value]: [],
				};
			});
			CategoryName.current.value = "";
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Title>To Do List</Title>
			<InputBar>
				<AddToDo></AddToDo>
			</InputBar>
			<Wrapper>
				<Boards>
					{Object.keys(toDos).map((boardId) => (
						<Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
					))}
					<Add onClick={onClickAddCategoryBtn} icon={solid("plus")} />
					<dialog ref={AddCategotyDialog}>
						<Modal>
							Add New Category
							<form method="dialog" onSubmit={onSubmit}>
								<CategoryNameInput type="text" ref={CategoryName} />
								<ConfirmBtn value="confirm">Confirm</ConfirmBtn>
							</form>
						</Modal>
					</dialog>
				</Boards>
			</Wrapper>
			<TrashDiv>
				<Trash icon={solid("trash")} />
				<Droppable droppableId="trash">
					{(magic, info) => (
						<TrashArea ref={magic.innerRef} {...magic.droppableProps}>
							{magic.placeholder}
						</TrashArea>
					)}
				</Droppable>
			</TrashDiv>
		</DragDropContext>
	);
}

export default App;
