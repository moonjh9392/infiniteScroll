import axios from 'axios';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { PaginationResponse, User } from '../mocks/handlers';

interface PaginationParams {
  size: number | null;
}

// [코드 12] React Query를 이용한 유저 목록 API 호출 함수
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const useFetchUsers = ({ size }: PaginationParams) => {
  console.log('useFetchUsers');
  return useInfiniteQuery(
    userKeys.lists(),
    ({ pageParam = 0 }: QueryFunctionContext) => {
      return axios.get<PaginationResponse<User>>('/users', {
        params: { page: pageParam, size },
      });
    },
    {
      getNextPageParam: ({ data: { isLastPage, pageNumber } }) => (isLastPage ? undefined : pageNumber + 1),
    }
  );
};
