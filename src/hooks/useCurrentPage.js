import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContext } from 'react-navigation';
import { setItem } from 'wappsto-redux/actions/items';
import { currentPage } from '../util/params';

const useCurrentPage = () => {
  const dispatch = useDispatch();
  const navigation = useContext(NavigationContext);

  useEffect(() => {
    dispatch(setItem(currentPage, navigation.state.routeName));
    const didFocus = navigation.addListener('didFocus', () => {
      dispatch(setItem(currentPage, navigation.state.routeName));
    });
    return () => {
      didFocus.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useCurrentPage;
