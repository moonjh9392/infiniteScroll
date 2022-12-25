import { useSelector, useDispatch } from 'react-redux';

import { down, init, up, selectValue } from '../slices/counterSlice';
import styled from 'styled-components';
import Todo from '../components/Todo';
import UsersPage from '../components/UsersPage';

const MainStyle = styled.div`
  overflow-y: auto;
  margin-top: 300px;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px black;
`;

const Main = () => {
  const dispach = useDispatch();
  const count = useSelector(selectValue);
  const addNumber = () => {
    dispach(up(1));
  };
  const minusNumber = () => {
    dispach(down(1));
  };
  const initNumber = () => {
    dispach(init());
  };
  return (
    <MainStyle>
      <Todo />
      <UsersPage />
    </MainStyle>
  );
};

export default Main;
