import { useCallback, useEffect, useRef } from 'react';

// [코드 11] IntersectionObserver custom hook
export type IntersectHandler = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;

export const useIntersect = (onIntersect: IntersectHandler, options?: IntersectionObserverInit) => {
  console.log('useIntersect');
  const ref = useRef<HTMLDivElement>(null);
  const callback = useCallback(
    //entries : IntersectionObserverEntry 인스턴스의 배열
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        //isIntersecting : 대상 요소가 교차 관찰자의 루트와 교차하는 경우
        //여기서는 대상 요소가 target 컴포넌트와 교차하는 경우 onIntersect함수 호출
        //onIntersect => 값에따라 데이터 들고옴
        if (entry.isIntersecting) onIntersect(entry, observer);
      });
    },
    [onIntersect]
  );

  useEffect(() => {
    //ref = UserPage2에 맨밑의 target 컴포넌트
    if (!ref.current) return;
    //observer 선언
    const observer = new IntersectionObserver(callback, options);
    //target 컴포넌트에 관찰자 등록
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options, callback]);

  return ref;
};
