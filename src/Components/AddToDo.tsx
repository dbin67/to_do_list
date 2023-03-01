import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Form = styled.form`
	background-color: white;
	width: 50%;
	margin: auto;
	padding: 20px;
	border-radius: 30px;
`;

const Bar = styled.input`
	font-size: 20px;
	border: none;
	outline: none;
	width: 100%;
`;

interface IForm {
	toDo: string;
}

function AddToDo() {
	const setToDos = useSetRecoilState(toDoState);
	const { register, setValue, handleSubmit } = useForm<IForm>();

	const onValid = ({ toDo }: IForm) => {
		const newToDo = {
			id: Date.now(),
			text: toDo,
		};
		setToDos((allBoards) => {
			return {
				...allBoards,
				"To Do": [newToDo, ...allBoards["To Do"]],
			};
		});
		setValue("toDo", "");
	};
	return (
		<>
			<Form onSubmit={handleSubmit(onValid)}>
				<Bar
					{...register("toDo", { required: true })}
					type="text"
					placeholder={"Add to do!"}
				/>
			</Form>
		</>
	);
}
export default AddToDo;
