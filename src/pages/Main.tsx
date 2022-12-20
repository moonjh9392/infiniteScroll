import { useSelector, useDispatch } from 'react-redux';

import { down, init, up, selectValue } from '../slices/counterSlice';
import styled from 'styled-components';
import { Scroll } from '../components/Scroll';

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
      {/* <div>{count}</div>
      <button onClick={addNumber}>+</button>
      <button onClick={minusNumber}>-</button>
      <button onClick={initNumber}>초기화</button> */}
      <br />
      {/* 일반 js 무한스크롤 */}
      {/* <Scroll /> */}
      {/* 옵저버 무한스크롤 */}
    </MainStyle>
  );
};

export default Main;
