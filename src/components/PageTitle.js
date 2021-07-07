import { useTranslation, CapitalizeFirst } from '../translations';

const PageTitle = ({ title }) => {
  const { t } = useTranslation();
  return CapitalizeFirst(t(title));
}

export default PageTitle;
