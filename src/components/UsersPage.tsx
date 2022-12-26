import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import { PaginationResponse, User } from '../mocks/handlers';
import Loading from './common/Loading';
import { throttle } from 'lodash';

// [코드 3] Scroll event를 이용한 무한스크롤 예시

//Card 컴포넌트의 heigth 사이즈
export const CARD_SIZE = 50;
//visualViewport : 뷰포트 사이즈
//PAGE_SIZE : 데이터가 몇개씩 보일지 정하는 변수
export const PAGE_SIZE = Math.ceil(visualViewport!.width / CARD_SIZE);

function UsersPage() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  const fetchUsers = useCallback(async () => {
    const { data } = await axios.get<PaginationResponse<User>>('/users', {
      params: { page, size: PAGE_SIZE },
    });
    //user data 추가
    setUsers(users.concat(data.contents));
    // 페이지 추가
    setPage(data.pageNumber + 1);
    // 마지막 페이지 인지 확인
    setNextPage(!data.isLastPage);
    //isFetching : false 초기화
    setFetching(false);
  }, [page]);

  //1. useEffect로 스크롤 이벤트 생성
  useEffect(() => {
    const handleScroll = () => {
      console.log('handleScroll');

      //scrollTop : 스크롤 위치 px 반환
      //offsetHeight : 요소의 높이
      const { scrollTop, offsetHeight } = document.documentElement;
      //innerHeight : 뷰포트 높이
      // 바닥감지
      if (window.innerHeight + scrollTop >= offsetHeight) {
        //바닥일 경우 isFetching 값을 true 로 바꿔 데이터를 들고온다
        setFetching(true);
      }
    };
    //처음 페이지 왔을때 데이터 get 하기 위해 isFetching : true로 바꿈
    setFetching(true);
    window.addEventListener('scroll', throttle(handleScroll, 500));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //2. 1번에서 isFetching 값이 바뀌면서 아래의 메서드 실행
  useEffect(() => {
    //isFetching : ture , hasNextPage : true 이면 fetchUsers 실행
    if (isFetching && hasNextPage) fetchUsers();
    else if (!hasNextPage) setFetching(false);
  }, [isFetching]);

  return (
    <Container>
      {users.map((user) => (
        <Card key={user.id} size={CARD_SIZE}>
          {user.name}
        </Card>
      ))}
      {isFetching && <Loading />}
    </Container>
  );
}

export const Container = styled.div`
  border: 1px solid black;
`;
export const Card = styled.div<{ size?: number }>`
  height: ${(props) => (props.size ? props.size + `px` : `50px`)};
  border: 1px solid black;
`;

export default UsersPage;
