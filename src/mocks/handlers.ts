import { rest } from 'msw';

// [코드 1] 무한스크롤 응답 인터페이스
export interface PaginationResponse<T> {
  contents: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  isLastPage: boolean;
  isFirstPage: boolean;
}

export interface User {
  id: number;
  name: string;
}

const todos = ['먹기', '자기', '놀기'];

// [코드 2] MSW 유저 목록 모킹 API
//데이터 생성
const users = Array.from(Array(256).keys()).map(
  (id): User => ({
    id,
    name: `denis${id}`,
  })
);

export const handlers = [
  // 할일 목록
  rest.get('/todos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(todos));
  }),

  // 할일 추가
  rest.post('/todos', (req, res, ctx) => {
    // todos.push(data)
    req.text().then((data) => todos.push(data));
    return res(ctx.status(201));
  }),

  //무한스크롤
  rest.get('/users', async (req, res, ctx) => {
    const { searchParams } = req.url;
    const size = Number(searchParams.get('size'));
    const page = Number(searchParams.get('page'));

    const totalCount = users.length;
    const totalPages = Math.round(totalCount / size);

    return res(
      ctx.status(200),
      ctx.json<PaginationResponse<User>>({
        contents: users.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page,
        isFirstPage: page === 0,
      }),
      ctx.delay(500)
    );
  }),
];
