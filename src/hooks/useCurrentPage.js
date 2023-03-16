import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { setItem } from 'wappsto-redux/actions/items';
import { currentPage } from '../util/params';

const useCurrentPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    dispatch(setItem(currentPage, route.ame));
    const unsubscribe = navigation.addListener('didFocus', () => {
      dispatch(setItem(currentPage, route.name));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCurrentPage;
