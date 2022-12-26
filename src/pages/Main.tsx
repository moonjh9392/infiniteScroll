import { useSelector, useDispatch } from 'react-redux';

import { down, init, up, selectValue } from '../slices/counterSlice';
import styled from 'styled-components';
import Todo from '../components/Todo';
import UsersPage from '../components/UsersPage';
import { UsersPage2 } from '../components/UsersPage2';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient();
const MainStyle = styled.div`
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
      {/* 스크롤 이벤트  */}
      {/* <UsersPage /> */}
      {/* 옵저버 */}
      <QueryClientProvider client={queryClient}>
        <UsersPage2 />
      </QueryClientProvider>
    </MainStyle>
  );
};

export default Main;
