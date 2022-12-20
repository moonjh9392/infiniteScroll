import axios from 'axios';
import { useRef, useState } from 'react';
import Loading from './common/Loading';
import useInfiniteScroll from './useInfiniteScroll';

export const Scroll = () => {
  console.log('scroll');
  const idx = useRef<number>(0);
  const [list, setList] = useState<object[]>([]);
  console.log(list);

  const fetchList = async () => {
    console.log('fetch');
    const addList = await axios.get(`http://localhost:3001/data${idx.current}`);
    console.log(list, addList.data);
    await setList([...list, addList.data]);
    idx.current++;
  };
  const { isEnd } = useInfiniteScroll({ onScrollEnd: fetchList });
  return (
    <div>
      {list.map((item, idx) => (
        <div key={idx}>
          <br />
          {item.toString()}
        </div>
      ))}
      {isEnd && <Loading />}
    </div>
  );
};
