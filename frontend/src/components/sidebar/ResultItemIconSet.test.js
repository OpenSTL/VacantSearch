import React from 'react';
import { shallow } from 'enzyme';
import ResultItemIconSet from './ResultItemIconSet';

it('renders single seedling for "Vacant Lot"', () => {
  const resultItem = {
    lot_type: 'Vacant Lot',
  };
  const wrapper = shallow(<ResultItemIconSet resultItem={resultItem} />);
  expect(wrapper).toContainMatchingElements(1, 'i');
  expect(wrapper).toContainExactlyOneMatchingElement('i.fa.fa-seedling');
});
it('renders building and question mark for "Possible Vacant Building"', () => {
  const resultItem = {
    lot_type: 'Possible Vacant Building',
  };
  const wrapper = shallow(<ResultItemIconSet resultItem={resultItem} />);
  expect(wrapper).toContainMatchingElements(2, 'i');
  expect(wrapper).toContainExactlyOneMatchingElement('i.fa.fa-building');
  expect(wrapper).toContainExactlyOneMatchingElement('i.fa.fa-question');
});

