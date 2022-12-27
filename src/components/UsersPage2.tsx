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

  //flatMap : 각 엘리먼트에 대해 map 수행 후, 결과를 새로운 배열로 평탄화함
  const users = useMemo(() => (data ? data.pages.flatMap(({ data }) => data.contents) : []), [data]);

  const ref = useIntersect(
    //entry
    async (entry, observer) => {
      //관찰 중단
      observer.unobserve(entry.target);
      //다음페이지가 있고 isFetching : false 이면 데이터 들고옴
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    //options
    //root : 기본값 null = 브라우저 뷰포트
    //rootMargin : root 요소의 마진값. 기본값은 0px.
    //threshold : 0.0 ~ 1.0 사이의 숫자들을 배열로 받는다. 이는 %로 치환되어, 해당 비율만큼 교차된 경우 콜백이 실행된다.
    { root: null, rootMargin: '0px', threshold: 1.0 }
  );

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
