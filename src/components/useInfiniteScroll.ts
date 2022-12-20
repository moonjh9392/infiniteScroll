import { useEffect, useState, useCallback } from 'react';
import { throttle } from 'lodash';

type OptionType = {
  onScrollEnd?: () => void;
};

type ReturnType = {
  isEnd: boolean;
};

const useInfiniteScroll = ({ onScrollEnd }: OptionType): ReturnType => {
  console.log('useinfi');
  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const [isEnd, setIsEnd] = useState(false);

  const handleScroll = throttle(async () => {
    console.log('handleScroll');
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // console.log(scrollHeight, scrollTop, clientHeight);

    if (scrollTop + clientHeight >= scrollHeight) {
      setIsEnd(true);
      lockScroll();
      if (onScrollEnd) await onScrollEnd();
      await unlockScroll();
      await setIsEnd(false);
    }
  }, 300);

  useEffect(() => {
    console.log('mount');
    window.addEventListener('scroll', handleScroll);
    // console.log(window);
    return () => {
      console.log('cleanup');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isEnd };
};

export default useInfiniteScroll;
