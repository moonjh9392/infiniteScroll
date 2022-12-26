import { useMemo } from 'react';
import styled from 'styled-components';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { useIntersect } from '../hooks/useIntersect';
import Loading from './common/Loading';
//1번 방법에서 export 하여 들고옴
import { Card, CARD_SIZE, Container, PAGE_SIZE } from './UsersPage';

// [코드 13] IntersectionObserver 적용한 최종 예시
export function UsersPage2() {
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
        <Card key={user.id} size={CARD_SIZE}>
          {user.name}
        </Card>
      ))}
      {isFetching && <Loading />}
      <Target ref={ref} />
    </Container>
  );
}
const Target = styled.div`
  height: 1px;
`;
