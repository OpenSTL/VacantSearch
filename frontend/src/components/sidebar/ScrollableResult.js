import { SCROLL_TO_LOT } from '../../constants/action-types';
import { scrollToWhen } from 'react-redux-scroll';

const isResultSelected = (action, props) => (
  action.type === SCROLL_TO_LOT && props.id === action.payload
);

const ScrollableResult = scrollToWhen({
  pattern: isResultSelected,
  excludeProps: ['id'],
})('div');

export default ScrollableResult;
