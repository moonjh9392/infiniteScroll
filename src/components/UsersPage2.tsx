import { useMemo } from 'react';
import styled from 'styled-components';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useIntersect } from '../hooks/useIntersect';
import Loading from './common/Loading';

// [코드 13] IntersectionObserver 적용한 최종 예시
export function UsersPage2() {
  const CARD_SIZE = 50;

  const PAGE_SIZE = visualViewport && 10 * Math.ceil(visualViewport.width / CARD_SIZE);
  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchUsers({
    size: PAGE_SIZE,
  });

  const users = useMemo(() => (data ? data.pages.flatMap(({ data }) => data.contents) : []), [data]);

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <Container>
      {users.map((user) => (
        <Card key={user.id}>{user.name}</Card>
      ))}
      {isFetching && <Loading />}
      <Target ref={ref} />
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
const Target = styled.div`
  height: 1px;
`;
