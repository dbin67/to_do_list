import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useRecoilState, useSetRecoilState } from "recoil";

const Wrapper = styled.div`
	width: 300px;
	padding-top: 10px;
	background-color: ${(props) => props.theme.boardColor};
	border-radius: 5px;
	min-height: 300px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const Title = styled.h2`
	text-align: center;
	font-weight: 600;
	margin-bottom: 10px;
	font-size: 21px;
	position: relative;
`;

interface IAreaProps {
	isDraggingFromThis: boolean;
	isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
	background-color: ${(props) =>
		props.isDraggingOver
			? "#dfe6e9"
			: props.isDraggingFromThis
			? "#b2bec3"
			: "transparent"};
	flex-grow: 1;
	transition: background-color 0.3s ease-in-out;
	padding: 20px;
`;

interface IBoardProps {
	toDos: ITodo[];
	boardId: string;
}

const X = styled(FontAwesomeIcon)`
	position: absolute;
	font-size: 12px;
	right: 10px;
	padding: 7px;
	cursor: pointer;
`;

function Board({ toDos, boardId }: IBoardProps) {
	const setToDos = useSetRecoilState(toDoState);

	const DeleteCatrgory = (boardId: string) => {
		setToDos((allBoards) => {
			// delete category
			const boardCopy = { ...allBoards };
			delete boardCopy[boardId];
			return boardCopy;
		});
	};

	return (
		<Wrapper>
			<Title>
				{boardId}
				{boardId === "To Do" ? (
					<></>
				) : (
					<X icon={solid("x")} onClick={() => DeleteCatrgory(boardId)} />
				)}
			</Title>
			<Droppable droppableId={boardId}>
				{(magic, info) => (
					<Area
						isDraggingOver={info.isDraggingOver}
						isDraggingFromThis={Boolean(info.draggingFromThisWith)}
						ref={magic.innerRef}
						{...magic.droppableProps}
					>
						{toDos.map((toDo, index) => (
							<DragabbleCard
								key={toDo.id}
								index={index}
								toDoId={toDo.id}
								toDoText={toDo.text}
							/>
						))}
						{magic.placeholder}
					</Area>
				)}
			</Droppable>
		</Wrapper>
	);
}
export default Board;
