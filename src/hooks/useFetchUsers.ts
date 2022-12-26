import axios from 'axios';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { PaginationResponse, User } from '../mocks/handlers';

interface PaginationParams {
  size: number | null;
}

// [코드 12] React Query를 이용한 유저 목록 API 호출 함수
//고유 키값 만드는데 사용됨 detail 왜있는지 모름 kakao꺼 긁어왔음
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const useFetchUsers = ({ size }: PaginationParams) => {
  console.log('useFetchUsers');
  //useInfiniteQuery : 'react-query' 에서 무한스크롤을 사용하기위해 만든 메서드
  //useInfiniteQuery(queryKey,queryFn,...)
  //queryKey :  useQuery마다 부여되는 고유 Key, React Query가 query 캐싱을 관리할 수 있도록 도와줍니다.
  //queryFn : query Function으로 promise 처리가 이루어지는 함수
  return useInfiniteQuery(
    //queryKey
    //['users','list']
    userKeys.lists(),
    //queryFn
    //pageParam : useInfiniteQuery가 현재 어떤 페이지에 있는지를 확인할 수 있는 파라미터 값
    ({ pageParam = 0 }: QueryFunctionContext) => {
      //data get
      return axios.get<PaginationResponse<User>>('/users', {
        params: { page: pageParam, size },
      });
    },
    {
      //getNextPageParam과 fetchNextPage은 공통적으로 다음 페이지에 있는 데이터를 조회해올 때 사용됩니다.
      //getNextPageParam : 다음 api를 요청할 때 사용될 pageParam값을 정할 수 있습니다.
      //getNextPageParam : undefined가 아닌 다른값을 반환 할 경우 hasNextPage : true
      //마지막 페이지가 아닐경우 pageParam += 1
      //fetchNextPage : 다음 페이지의 데이터를 호출할 때 사용 useInfiniteQuery의 return에 포함됨
      //fetchNextPage를 이용해 호출된 데이터는 배열의 가장 우측에 새롭게 담겨 전달됨
      getNextPageParam: ({ data: { isLastPage, pageNumber } }) => (isLastPage ? undefined : pageNumber + 1),
    }
  );
};
