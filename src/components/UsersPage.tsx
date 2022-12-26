import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';
import { PaginationResponse, User } from '../mocks/handlers';
import Loading from './common/Loading';
import { throttle } from 'lodash';

// [코드 3] Scroll event를 이용한 무한스크롤 예시

//Card 컴포넌트의 heigth 사이즈
const CARD_SIZE = 50;

const PAGE_SIZE = visualViewport && 10 * Math.ceil(visualViewport.width / CARD_SIZE);

function UsersPage() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  const fetchUsers = useCallback(async () => {
    const { data } = await axios.get<PaginationResponse<User>>('/users', {
      params: { page, size: PAGE_SIZE },
    });
    setUsers(users.concat(data.contents));
    setPage(data.pageNumber + 1);
    setNextPage(!data.isLastPage);
    setFetching(false);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      console.log('handleScroll');
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop >= offsetHeight) {
        setFetching(true);
      }
    };

    setFetching(true);
    window.addEventListener('scroll', throttle(handleScroll, 500));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isFetching && hasNextPage) fetchUsers();
    else if (!hasNextPage) setFetching(false);
  }, [isFetching]);

  return (
    <Container>
      {users.map((user) => (
        <Card key={user.id}>{user.name}</Card>
      ))}
      {isFetching && <Loading />}
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid black;
`;
const Card = styled.div`
  height: 50px;
  border: 1px solid black;
`;

export default UsersPage;
